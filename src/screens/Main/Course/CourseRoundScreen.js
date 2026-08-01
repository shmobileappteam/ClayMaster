import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BackHandler,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Typography } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
import StationSetupPanel, {
  SetupStepDots,
} from '../../../components/course/StationSetupPanel';
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

const isStationSetupComplete = station => {
  if (!station?.selectedTargetPairs || !station?.pair_type) return false;
  if (!station.traps || station.traps.length !== 2) return false;
  return station.traps.every(
    t => t.presentation && String(t.presentation).trim() !== '',
  );
};

const CourseRoundScreen = ({ navigation }) => {
  const { activeRound, updateDraftStations, clearRound, setMode } =
    useAppMode();
  const [showStationFeedback, setShowStationFeedback] = useState(false);
  const [leaveVisible, setLeaveVisible] = useState(false);
  const [confirmCompleteVisible, setConfirmCompleteVisible] = useState(false);
  /** Reopen setup steps 1–3 from HIT/MISS */
  const [editSetupStep, setEditSetupStep] = useState(null);

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
  const stationFull =
    setupComplete &&
    shots.length > 0 &&
    shots.every(s => s.result !== '' && s.result !== 'empty');

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

  useEffect(() => {
    if (!round?.roundId) {
      resetToFieldMode(navigation, 'CourseHomeScreen');
    }
  }, [round?.roundId, navigation]);

  useEffect(() => {
    if (stationFull && !showStationFeedback) setShowStationFeedback(true);
  }, [stationFull, showStationFeedback]);

  useEffect(() => {
    setShowStationFeedback(false);
    setEditSetupStep(null);
  }, [stationNumber]);

  const patchCurrentStation = useCallback(
    updater => {
      if (!round) return;
      const next = stations.map((s, i) =>
        i === stationIndex ? updater({ ...s }) : s,
      );
      updateDraftStations(next);
    },
    [round, stations, stationIndex, updateDraftStations],
  );

  const onSelectTargetPairs = n => {
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
    patchCurrentStation(st => ({ ...st, pair_type: pairType }));
  };

  const onSelectPresentation = (data, trapId, type = 'id') => {
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
    const msg = validateLastStation(currentStation, false);
    if (msg) {
      showMessage({ message: msg, bgColor: COLORS.primary });
      return;
    }
    patchCurrentStation(st => {
      const nextShots = (st.shots || []).map(s => ({ ...s }));
      const idx = nextShots.findIndex(s => s.result === 'empty');
      if (idx !== -1) nextShots[idx] = { ...nextShots[idx], result };
      return { ...st, shots: nextShots };
    });
  };

  const handleUndo = () => {
    patchCurrentStation(st => {
      const nextShots = (st.shots || []).map(s => ({ ...s }));
      const lastFilled = [...nextShots]
        .reverse()
        .findIndex(s => s.result !== 'empty');
      if (lastFilled !== -1) {
        const real = nextShots.length - 1 - lastFilled;
        nextShots[real] = { ...nextShots[real], result: 'empty' };
      }
      return { ...st, shots: nextShots };
    });
    setShowStationFeedback(false);
  };

  const goNextStation = () => {
    const msg = validateLastStation(currentStation, true);
    if (msg) {
      showMessage({ message: msg, bgColor: COLORS.primary });
      return;
    }
    if (!canAddStation) {
      setConfirmCompleteVisible(true);
      return;
    }
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
    setShowStationFeedback(false);
  };

  const { mutate: submitStations, isPending } = useCustomMutation({
    mutationFn: postStations,
    onSuccess: async () => {
      clearRound();
      await queryClient.invalidateQueries({ queryKey: ['rounds'] });
      navigation.replace('CompleteRoundScreen', { roundId: round.roundId });
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
    setMode('course');
    resetToFieldMode(navigation, 'CourseHomeScreen');
  }, [navigation, setMode]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      setLeaveVisible(true);
      return true;
    });
    return () => sub.remove();
  }, []);

  if (!round?.roundId || !currentStation) return null;

  const stationHits = stationScore.hits;
  const revisitingSetup = editSetupStep != null;
  const showPlay =
    setupComplete && !showStationFeedback && !revisitingSetup;
  const showSetup = !setupComplete || revisitingSetup;

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
            Station {stationNumber}
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
        <TouchableOpacity
          style={styles.pauseBtn}
          onPress={() => setLeaveVisible(true)}
          accessibilityLabel="Pause round"
        >
          <Icon name="pause" iconFamily="Ionicons" size={18} color={COLORS.white100} />
        </TouchableOpacity>
      </View>

      <StationProgressStrip
        stations={stations}
        currentStationNumber={stationNumber}
      />

      {showPlay ? (
        <View style={styles.setupStepsOnPlay}>
          <SetupStepDots
            current={0}
            maxStep={3}
            dimmed
            onSelectStep={n => setEditSetupStep(n)}
          />
        </View>
      ) : null}

      {showSetup ? (
        <StationSetupPanel
          station={currentStation}
          trapsCatalog={trapsCatalog}
          onSelectTargetPairs={onSelectTargetPairs}
          onSelectPairType={onSelectPairType}
          onSelectPresentation={onSelectPresentation}
          editStep={editSetupStep}
          onContinueScoring={() => setEditSetupStep(null)}
        />
      ) : null}

      {setupComplete ? (
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

      {showStationFeedback ? (
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
              <Typography fFamily="barlowBold700" size={20} color={COLORS.white100}>
                Complete Round
              </Typography>
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
          <TouchableOpacity style={styles.undoBar} onPress={handleUndo} activeOpacity={0.88}>
            <Icon name="arrow-undo" iconFamily="Ionicons" size={22} color={COLORS.white100} />
            <Typography fFamily="barlowSemiBold600" size={16} color={COLORS.white100} mL={8}>
              Undo
            </Typography>
          </TouchableOpacity>
        </View>
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
        handleComplete={() => {
          setConfirmCompleteVisible(false);
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
  uppercase: { letterSpacing: 1.2, textTransform: 'uppercase' },
  setupStepsOnPlay: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
  },
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
});
