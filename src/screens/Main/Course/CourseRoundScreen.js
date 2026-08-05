import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AppState,
  BackHandler,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Typography, AppLoader } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
import StationSetupPanel from '../../../components/course/StationSetupPanel';
import StationProgressStrip from '../../../components/course/StationProgressStrip';
import { ConfirmModal } from '../../../components';
import Icon from '../../../helpers/Icon';
import { COLORS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useAppMode } from '../../../context/AppModeContext';
import { resetToFieldMode } from '../../../navigation/navigationHelpers';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { useCustomMutation } from '../../../query/useCustomMutation';
import { getTraps, postStations } from '../../../api/stationService';
import { queryClient } from '../../../api/api';
import {
  initialStation,
  pairOfTargets,
  validateLastStation,
} from '../../../constants/dummydata';
import {
  buildStationsPayload,
  scoreFromShots,
  scoreFromStations,
} from '../../../constants/rounds';
import { showMessage } from '../../../utils';
import { hapticHit, hapticMiss, hapticUndo } from '../../../utils/haptics';

const SCORING_IDLE_MS = 10000;
const isStationSetupComplete = station => {
  if (!station?.selectedTargetPairs || !station?.pair_type) return false;
  if (!station.traps || station.traps.length !== 2) return false;
  return station.traps.every(
    t => t.presentation && String(t.presentation).trim() !== '',
  );
};

const pairTypeLabel = pairType => {
  if (pairType === 'report_pair') return 'Report Pair';
  if (pairType === 'true_pair') return 'True Pair';
  return pairType || '—';
};

/** Read-only snapshot of a finished previous station — no edits. */
const PastStationReadOnly = ({ station, trapsCatalog = [], onBack }) => {
  const { hits, taken } = scoreFromShots(station?.shots);
  const shots = (station?.shots || []).filter(
    s => s.result === 'dead' || s.result === 'lost',
  );
  const traps = station?.traps || [];
  const presentationLabel = slug => {
    if (!slug) return '—';
    const hit = (trapsCatalog || []).find(t => t.slug === slug);
    return hit?.label || slug;
  };

  return (
    <ScrollView
      style={styles.pastScroll}
      contentContainerStyle={styles.pastScrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Typography
        fFamily="barlowBold700"
        size={22}
        color={COLORS.white100}
        textAlign="center"
        mT={8}
      >
        Station {station?.station_number}
      </Typography>
      <Typography
        fFamily="barlowBold700"
        size={36}
        color={COLORS.primary}
        textAlign="center"
        mT={4}
      >
        {hits}/{taken || 0}
      </Typography>

      <View style={styles.dotsRow}>
        {shots.map((shot, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              shot.result === 'dead' && styles.dotHit,
              shot.result === 'lost' && styles.dotMiss,
            ]}
          />
        ))}
      </View>

      <View style={styles.pastMeta}>
        <PastMetaChip
          label="Pairs"
          value={
            station?.selectedTargetPairs
              ? `${station.selectedTargetPairs}`
              : '—'
          }
        />
        <PastMetaChip label="Type" value={pairTypeLabel(station?.pair_type)} />
        {traps.map(t => (
          <PastMetaChip
            key={t.trap_id}
            label={`Trap ${t.trap_id}`}
            value={presentationLabel(t.presentation)}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.backToCurrentBottom}
        onPress={onBack}
        activeOpacity={0.85}
      >
        <Icon
          name="chevron-back"
          iconFamily="Ionicons"
          size={18}
          color={COLORS.primary}
        />
        <Typography
          fFamily="barlowSemiBold600"
          size={14}
          color={COLORS.primary}
          mL={4}
        >
          Back to current station
        </Typography>
      </TouchableOpacity>
    </ScrollView>
  );
};

const PastMetaChip = ({ label, value }) => (
  <View style={styles.pastChip}>
    <Typography size={10} color={COLORS.courseTextMuted} fFamily="barlowBold700">
      {label}
    </Typography>
    <Typography
      size={14}
      fFamily="barlowSemiBold600"
      color={COLORS.white100}
      textTransform="capitalize"
      mT={4}
    >
      {value}
    </Typography>
  </View>
);

const CourseRoundScreen = ({ navigation }) => {
  const {
    activeRound,
    updateDraftStations,
    clearRound,
    setMode,
    setRoundPlaying,
  } = useAppMode();
  const [leaveVisible, setLeaveVisible] = useState(false);
  const [confirmCompleteVisible, setConfirmCompleteVisible] = useState(false);
  /** Reopen setup steps 1–3 from HIT/MISS (current station only) */
  const [editSetupStep, setEditSetupStep] = useState(null);
  /** View a previous station — read-only; never editable */
  const [viewingPastNumber, setViewingPastNumber] = useState(null);
  /** Pocket protection — blocks HIT/MISS until tap to resume */
  const [scoringLocked, setScoringLocked] = useState(false);
  const idleTimerRef = useRef(null);

  const { data: trapsRaw } = useCustomQuery({
    queryKey: ['traps'],
    queryFn: getTraps,
  });
  const trapsCatalog = Array.isArray(trapsRaw)
    ? trapsRaw
    : Array.isArray(trapsRaw?.data)
      ? trapsRaw.data
      : [];

  const round = activeRound;
  const stations = useMemo(
    () => (Array.isArray(round?.stations) ? round.stations : []),
    [round?.stations],
  );
  const stationIndex = Math.max(0, stations.length - 1);
  const currentStation = stations[stationIndex];
  const stationNumber = currentStation?.station_number ?? 1;

  const setupComplete = isStationSetupComplete(currentStation);
  const shots = currentStation?.shots || [];
  const stationScore = scoreFromShots(shots);
  const filledOnStation = stationScore.taken;
  const isShotOpen = s =>
    !s?.result || s.result === '' || s.result === 'empty';
  const stationFull =
    setupComplete && shots.length > 0 && shots.every(s => !isShotOpen(s));

  // Milestone Field: Score = hits / shots taken (empty slots ignored)
  const roundScore = useMemo(() => scoreFromStations(stations), [stations]);
  const totalHits = roundScore.hits;
  const totalTaken = roundScore.taken;

  const sequence = Array.isArray(round?.station_sequence)
    ? round.station_sequence
    : [];
  const maxStations =
    round?.total_stations || (sequence.length ? sequence.length : 16);
  const isLastPlannedStation =
    sequence.length > 0
      ? stations.length >= sequence.length
      : stations.length >= maxStations;
  const canAddStation =
    !isLastPlannedStation && totalTaken < 100 && stations.length < maxStations;

  const scoringUiActive = viewingPastNumber == null && !!currentStation;

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const scheduleIdleLock = useCallback(() => {
    clearIdleTimer();
    idleTimerRef.current = setTimeout(() => {
      setScoringLocked(true);
    }, SCORING_IDLE_MS);
  }, [clearIdleTimer]);

  const lockScoring = useCallback(() => {
    clearIdleTimer();
    setScoringLocked(true);
  }, [clearIdleTimer]);

  /** Unlock and restart idle timer (HIT/MISS/resume). */
  const bumpActivity = useCallback(() => {
    setScoringLocked(false);
    if (!scoringUiActive) {
      clearIdleTimer();
      return;
    }
    scheduleIdleLock();
  }, [clearIdleTimer, scheduleIdleLock, scoringUiActive]);

  const unlockScoring = useCallback(() => {
    bumpActivity();
  }, [bumpActivity]);

  const toggleScoringLock = useCallback(() => {
    setScoringLocked(prev => {
      if (prev) {
        // Unlock + restart idle countdown
        if (scoringUiActive) {
          clearIdleTimer();
          idleTimerRef.current = setTimeout(() => {
            setScoringLocked(true);
          }, SCORING_IDLE_MS);
        }
        return false;
      }
      clearIdleTimer();
      return true;
    });
  }, [clearIdleTimer, scoringUiActive]);

  useEffect(() => {
    if (!round?.roundId) {
      resetToFieldMode(navigation, 'CourseHomeScreen');
      return;
    }
    // Actively playing — reload should reopen this screen until Pause
    setRoundPlaying(true);
  }, [round?.roundId, navigation, setRoundPlaying]);

  useEffect(() => {
    setEditSetupStep(null);
    setViewingPastNumber(null);
  }, [stationNumber]);

  useEffect(() => {
    if (!scoringUiActive) {
      clearIdleTimer();
      setScoringLocked(false);
      return undefined;
    }
    // Entering scoring UI — unlocked, start idle timer (don't clear a manual lock mid-play via identity churn)
    setScoringLocked(false);
    scheduleIdleLock();
    return () => clearIdleTimer();
  }, [scoringUiActive, stationNumber, clearIdleTimer, scheduleIdleLock]);

  useEffect(() => {
    const onAppState = next => {
      if (next !== 'active' && scoringUiActive) {
        lockScoring();
      }
    };
    const sub = AppState.addEventListener('change', onAppState);
    return () => sub.remove();
  }, [scoringUiActive, lockScoring]);
  const patchCurrentStation = useCallback(
    updater => {
      // Only the current (last) station is ever editable
      if (!round || viewingPastNumber != null) return;
      const next = stations.map((s, i) =>
        i === stationIndex ? updater({ ...s }) : s,
      );
      updateDraftStations(next);
    },
    [round, stations, stationIndex, updateDraftStations, viewingPastNumber],
  );

  const onSelectTargetPairs = n => {
    if (scoringLocked) return;
    bumpActivity();
    const newShots = pairOfTargets[n].map(shot => ({ ...shot }));
    const prior =
      stations
        .slice(0, stationIndex)
        .reduce((acc, st) => acc + (st?.selectedTargetPairs || 0) * 2, 0) || 0;
    if (prior + n * 2 > 100) {
      showMessage({
        message: 'Selecting this many pairs would exceed 100 targets.',
        bgColor: COLORS.primary,
      });
      return;
    }
    patchCurrentStation(st => ({
      ...st,
      selectedTargetPairs: n,
      shots: newShots,
    }));
  };

  const onSelectPairType = pairType => {
    if (scoringLocked) return;
    bumpActivity();
    patchCurrentStation(st => ({ ...st, pair_type: pairType }));
  };

  const onSelectPresentation = (data, trapId, type = 'id') => {
    if (scoringLocked) return;
    bumpActivity();
    patchCurrentStation(st => {
      let traps = [...(st.traps || [])];
      const tid = Number(trapId);

      if (type === 'id') {
        if (!traps.some(t => Number(t.trap_id) === Number(data.trap_id))) {
          traps.push(data);
        }
      } else if (type === 'presentation') {
        const slug = data?.slug || '';
        const exists = traps.some(t => Number(t.trap_id) === tid);
        if (exists) {
          traps = traps.map(t =>
            Number(t.trap_id) === tid ? { ...t, presentation: slug } : t,
          );
        } else {
          traps.push({ trap_id: tid, presentation: slug });
        }
        // Same update: after Trap 1, seed Trap 2 so next pick works without re-tap
        if (tid === 1 && !traps.some(t => Number(t.trap_id) === 2)) {
          traps.push({ trap_id: 2, presentation: '' });
        }
      }

      return { ...st, traps };
    });
  };

  const applyShot = result => {
    if (scoringLocked) return;
    const msg = validateLastStation(currentStation, false);
    if (msg) {
      showMessage({ message: msg, bgColor: COLORS.primary });
      return;
    }
    if (result === 'dead') hapticHit();
    else if (result === 'lost') hapticMiss();
    bumpActivity();
    patchCurrentStation(st => {
      const nextShots = (st.shots || []).map(s => ({ ...s }));
      const idx = nextShots.findIndex(
        s => !s?.result || s.result === '' || s.result === 'empty',
      );
      if (idx !== -1) nextShots[idx] = { ...nextShots[idx], result };
      return { ...st, shots: nextShots };
    });
  };

  const handleUndo = () => {
    if (scoringLocked) return;
    const hasFilled = (currentStation?.shots || []).some(
      s => s?.result && s.result !== '' && s.result !== 'empty',
    );
    if (!hasFilled) return;
    hapticUndo();
    bumpActivity();
    patchCurrentStation(st => {
      const nextShots = (st.shots || []).map(s => ({ ...s }));
      const lastFilled = [...nextShots]
        .reverse()
        .findIndex(s => s?.result && s.result !== '' && s.result !== 'empty');
      if (lastFilled !== -1) {
        const real = nextShots.length - 1 - lastFilled;
        nextShots[real] = { ...nextShots[real], result: 'empty' };
      }
      return { ...st, shots: nextShots };
    });
  };

  const goNextStation = () => {
    if (scoringLocked) return;
    const msg = validateLastStation(currentStation, true);
    if (msg) {
      showMessage({ message: msg, bgColor: COLORS.primary });
      return;
    }
    if (!canAddStation) {
      setConfirmCompleteVisible(true);
      return;
    }
    bumpActivity();
    const nextIndex = stations.length;
    const nextNum = sequence.length > 0 ? sequence[nextIndex] : nextIndex + 1;
    const seeded = {
      ...initialStation,
      station_number: nextNum,
      name: `Station ${nextNum}`,
      traps: [{ trap_id: 1, presentation: '' }],
      shots: [],
      selectedTargetPairs: '',
    };
    updateDraftStations([...stations, seeded]);
  };

  const { mutate: submitStations, isPending } = useCustomMutation({
    mutationFn: postStations,
    onSuccess: async () => {
      const completedRoundId = round.roundId;
      await queryClient.invalidateQueries({ queryKey: ['rounds'] });
      // Replace play screen first — clearing draft before this triggers
      // resetToFieldMode via the empty-round effect and breaks goBack.
      navigation.replace('CompleteRoundScreen', { roundId: completedRoundId });
      clearRound();
    },
    on422Error: error => {
      showMessage({
        message:
          Object.values(error || {})?.[0] || 'Error submitting round.',
        bgColor: COLORS.primary,
      });
    },
  });

  const handleComplete = () => {
    if (scoringLocked) return;
    const msg = validateLastStation(currentStation, true);
    if (msg) {
      showMessage({ message: msg, bgColor: COLORS.primary });
      return;
    }
    if (scoreFromStations(stations).taken !== 100) {
      showMessage({
        message: 'Complete all 100 targets before submitting.',
        bgColor: COLORS.primary,
      });
      return;
    }
    setConfirmCompleteVisible(true);
  };

  const leaveToField = useCallback(() => {
    // Pause: stop auto-resume into play; land on Field home
    setRoundPlaying(false);
    setMode('course');
    resetToFieldMode(navigation, 'CourseHomeScreen');
  }, [navigation, setMode, setRoundPlaying]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (viewingPastNumber != null) {
        setViewingPastNumber(null);
        return true;
      }
      if (editSetupStep != null) {
        setEditSetupStep(null);
        return true;
      }
      setLeaveVisible(true);
      return true;
    });
    return () => sub.remove();
  }, [editSetupStep, viewingPastNumber]);

  if (!round?.roundId || !currentStation) return null;

  const viewingPast =
    viewingPastNumber != null && viewingPastNumber !== stationNumber;
  const pastStation = viewingPast
    ? stations.find(s => s.station_number === viewingPastNumber)
    : null;

  const stationHits = stationScore.hits;
  const revisitingSetup = editSetupStep != null;
  // Derive from shots — same render as last HIT/MISS (no useEffect lag / miss)
  const showStationFeedback =
    !viewingPast && setupComplete && stationFull && !revisitingSetup;
  const showPlay =
    !viewingPast &&
    setupComplete &&
    !stationFull &&
    !revisitingSetup;
  const showSetup = !viewingPast && (!setupComplete || revisitingSetup);

  return (
    <CourseLayout showTabs={false} showModeIndicator={false}>
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Typography
            size={12}
            lineHeight={17}
            color={COLORS.courseTextMuted}
            fFamily="barlowBold700"
            style={styles.uppercase}
          >
            {round.course_name || 'Round'}
          </Typography>
          <Typography
            fFamily="barlowBold700"
            size={14}
            lineHeight={21}
            color={COLORS.white100}
          >
            Station{' '}
            {viewingPast ? viewingPastNumber : stationNumber}
            {maxStations ? ` / ${maxStations}` : ''}
          </Typography>
        </View>
        <View style={styles.topBarScore}>
          <Typography
            size={12}
            lineHeight={17}
            color={COLORS.courseTextMuted}
            fFamily="barlowBold700"
            style={styles.uppercase}
            textAlign="right"
          >
            Score
          </Typography>
          <Typography
            fFamily="barlowBold700"
            size={20}
            lineHeight={26}
            color={COLORS.primary}
            textAlign="right"
          >
            {totalHits}/{totalTaken || 0}
          </Typography>
        </View>
        <View style={styles.topBarActions}>
          <TouchableOpacity
            style={styles.pauseBtn}
            onPress={toggleScoringLock}
            accessibilityLabel={
              scoringLocked ? 'Unlock scoring' : 'Lock scoring'
            }
            hitSlop={12}
          >
            <Icon
              name={scoringLocked ? 'lock-closed' : 'lock-open-outline'}
              iconFamily="Ionicons"
              size={18}
              color={scoringLocked ? COLORS.primary : COLORS.white100}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.pauseBtn}
            onPress={() => setLeaveVisible(true)}
            accessibilityLabel="Pause round"
          >
            <Icon name="pause" iconFamily="Ionicons" size={18} color={COLORS.white100} />
          </TouchableOpacity>
        </View>
      </View>

      <StationProgressStrip
        stations={stations}
        currentStationNumber={stationNumber}
        viewingStationNumber={viewingPastNumber}
        onSelectStation={
          scoringLocked
            ? undefined
            : num => {
                bumpActivity();
                setViewingPastNumber(num);
              }
        }
      />

      {viewingPast && pastStation ? (
        <PastStationReadOnly
          station={pastStation}
          trapsCatalog={trapsCatalog}
          onBack={() => {
            bumpActivity();
            setViewingPastNumber(null);
          }}
        />
      ) : null}

      {showSetup ? (
        <StationSetupPanel
          key={
            editSetupStep != null
              ? `edit-${editSetupStep}-${stationNumber}`
              : `setup-${stationNumber}`
          }
          station={currentStation}
          trapsCatalog={trapsCatalog}
          onSelectTargetPairs={onSelectTargetPairs}
          onSelectPairType={onSelectPairType}
          onSelectPresentation={onSelectPresentation}
          editStep={editSetupStep}
          onContinueScoring={() => {
            if (scoringLocked) return;
            bumpActivity();
            setEditSetupStep(null);
          }}
        />
      ) : null}

      {setupComplete && !revisitingSetup && !viewingPast ? (
        <View style={styles.dotsRow}>
          {shots.map((shot, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                shot.result === 'dead' && styles.dotHit,
                shot.result === 'lost' && styles.dotMiss,
              ]}
            />
          ))}
        </View>
      ) : null}

      {showPlay ? (
        <TouchableOpacity
          style={styles.backToSetupBtn}
          onPress={() => {
            if (scoringLocked) return;
            bumpActivity();
            setEditSetupStep(3);
          }}
          activeOpacity={0.85}
          disabled={scoringLocked}
          accessibilityLabel="Back to traps setup"
        >
          <Icon
            name="chevron-back"
            iconFamily="Ionicons"
            size={18}
            color={COLORS.courseTextMuted}
          />
          <Typography
            fFamily="barlowSemiBold600"
            size={14}
            color={COLORS.courseTextMuted}
            mL={4}
          >
            Back to setup
          </Typography>
        </TouchableOpacity>
      ) : null}

      {!viewingPast && showStationFeedback ? (
        <View style={styles.feedbackWrap}>
          <View style={styles.stationDoneCard}>
            <Typography
              size={12}
              color={COLORS.courseTextMuted}
              fFamily="barlowBold700"
              style={styles.uppercase}
              textAlign="center"
            >
              Station {stationNumber} Done
            </Typography>
            <Typography
              fFamily="barlowBold700"
              size={44}
              lineHeight={44}
              color={COLORS.white100}
              textAlign="center"
              mT={8}
            >
              {stationHits}/{filledOnStation || 0}
            </Typography>
          </View>

          {canAddStation ? (
            <TouchableOpacity
              style={styles.nextStationBtn}
              onPress={goNextStation}
              activeOpacity={0.88}
            >
              <Typography fFamily="barlowBold700" size={20} color={COLORS.white100}>
                Next Station
              </Typography>
              <Icon
                name="chevron-forward"
                iconFamily="Ionicons"
                size={26}
                color={COLORS.white100}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.nextStationBtn}
              onPress={handleComplete}
              activeOpacity={0.88}
              disabled={isPending}
            >
              {isPending ? (
                <AppLoader compact size="small" color={COLORS.white100} />
              ) : (
                <Typography fFamily="barlowBold700" size={20} color={COLORS.white100}>
                  Complete Round
                </Typography>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={handleUndo} style={styles.undoLink}>
            <Typography size={14} color={COLORS.courseTextMuted}>
              Undo last shot
            </Typography>
          </TouchableOpacity>
        </View>
      ) : null}

      {showPlay ? (
        <View style={styles.tapZones}>
          <TouchableOpacity
            style={styles.hitZone}
            onPress={() => applyShot('dead')}
            activeOpacity={0.88}
            disabled={scoringLocked}
          >
            <Icon name="checkmark" iconFamily="Ionicons" size={88} color={COLORS.white100} />
            <Typography
              fFamily="barlowBold700"
              size={40}
              lineHeight={44}
              color={COLORS.white100}
              mT={4}
              style={styles.hitMissLabel}
            >
              HIT
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.missZone}
            onPress={() => applyShot('lost')}
            activeOpacity={0.88}
            disabled={scoringLocked}
          >
            <Icon name="close" iconFamily="Ionicons" size={88} color="#F87171" />
            <Typography
              fFamily="barlowBold700"
              size={40}
              lineHeight={44}
              color="#F87171"
              mT={4}
              style={styles.hitMissLabel}
            >
              MISS
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.undoBar}
            onPress={handleUndo}
            activeOpacity={0.88}
            disabled={scoringLocked}
          >
            <Icon name="arrow-undo" iconFamily="Ionicons" size={22} color={COLORS.white100} />
            <Typography fFamily="barlowSemiBold600" size={16} color={COLORS.white100} mL={8}>
              Undo
            </Typography>
          </TouchableOpacity>
        </View>
      ) : null}

      {scoringLocked && scoringUiActive ? (
        <TouchableOpacity
          style={styles.lockOverlay}
          onPress={unlockScoring}
          activeOpacity={1}
          accessibilityLabel="Tap to resume scoring"
        >
          <View style={styles.lockCard}>
            <Icon
              name="lock-closed"
              iconFamily="Ionicons"
              size={28}
              color={COLORS.primary}
            />
            <Typography
              fFamily="barlowBold700"
              size={18}
              color={COLORS.white100}
              mT={12}
              textAlign="center"
            >
              Scoring locked
            </Typography>
            <Typography
              size={14}
              color={COLORS.courseTextMuted}
              mT={6}
              textAlign="center"
            >
              Tap to resume
            </Typography>
          </View>
        </TouchableOpacity>
      ) : null}

      <ConfirmModal
        variant="field"
        visible={leaveVisible}
        setVisibility={setLeaveVisible}
        title="Leave Round?"
        message="Your progress is saved on this device. You can resume anytime from Field Mode."
        confirmText="Stay"
        cancelText="Leave"
        handleCancel={leaveToField}
      />

      <ConfirmModal
        variant="field"
        visible={confirmCompleteVisible}
        setVisibility={setConfirmCompleteVisible}
        title="Complete Round?"
        message="Submit this round to the server? Local draft will be cleared."
        confirmText="Submit"
        cancelText="Cancel"
        confirmLoading={isPending}
        dismissOnConfirm={false}
        handleComplete={() => {
          submitStations({
            roundId: round.roundId,
            payload: buildStationsPayload(stations),
          });
        }}
      />
    </CourseLayout>
  );
};

export default CourseRoundScreen;

const styles = StyleSheet.create({
  topBar: {
    zIndex: 40,
    elevation: 40,
    backgroundColor: COLORS.courseBg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.courseBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingVertical: Sizer.vSize(12),
  },
  topBarLeft: { flex: 1 },
  topBarScore: { alignItems: 'flex-end', marginRight: Sizer.hSize(12) },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(8),
  },
  uppercase: { letterSpacing: 1.2, textTransform: 'uppercase' },
  pauseBtn: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    borderRadius: Sizer.hSize(20),
    backgroundColor: COLORS.courseSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Sizer.hSize(8),
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingVertical: Sizer.vSize(12),
  },
  dot: {
    flex: 1,
    height: Sizer.vSize(8),
    borderRadius: Sizer.vSize(4),
    backgroundColor: COLORS.courseBorder,
  },
  dotHit: { backgroundColor: COLORS.primary },
  dotMiss: { backgroundColor: '#EF4444' },
  tapZones: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingVertical: Sizer.vSize(12),
    gap: Sizer.vSize(12),
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 30,
    elevation: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Sizer.hSize(24),
  },
  lockCard: {
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(16),
    borderWidth: 1,
    borderColor: COLORS.courseBorder,
    paddingVertical: Sizer.vSize(28),
    paddingHorizontal: Sizer.hSize(32),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    minWidth: Sizer.hSize(220),
  },
  backToSetupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginHorizontal: Sizer.hSize(SPACING.screenPx),
    marginBottom: Sizer.vSize(4),
    paddingVertical: Sizer.vSize(4),
    paddingRight: Sizer.hSize(8),
  },
  hitZone: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  missZone: {
    flex: 1,
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(16),
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hitMissLabel: { letterSpacing: 2 },
  undoBar: {
    height: Sizer.vSize(52),
    borderRadius: Sizer.hSize(12),
    backgroundColor: COLORS.courseBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackWrap: {
    flex: 1,
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingVertical: Sizer.vSize(24),
    gap: Sizer.vSize(20),
  },
  stationDoneCard: {
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    padding: Sizer.hSize(24),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
    alignItems: 'center',
  },
  nextStationBtn: {
    width: '100%',
    height: Sizer.vSize(64),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizer.hSize(8),
  },
  undoLink: { alignItems: 'center', paddingVertical: Sizer.vSize(8) },
  pastScroll: { flex: 1 },
  pastScrollContent: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingBottom: Sizer.vSize(28),
  },
  pastMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizer.hSize(8),
    marginTop: Sizer.vSize(16),
  },
  backToCurrentBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizer.vSize(24),
    paddingVertical: Sizer.vSize(14),
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
  },
  pastChip: {
    minWidth: '45%',
    flexGrow: 1,
    paddingHorizontal: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(12),
    borderRadius: Sizer.hSize(10),
    borderWidth: 1,
    borderColor: COLORS.courseBorder,
    backgroundColor: COLORS.courseSurface,
  },
});
