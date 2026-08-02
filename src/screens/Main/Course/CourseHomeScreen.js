import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Typography } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
import EuropeanBadge from '../../../components/course/EuropeanBadge';
import Icon from '../../../helpers/Icon';
import { COLORS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useAppMode } from '../../../context/AppModeContext';
import { navigateFromFieldToStack } from '../../../navigation/navigationHelpers';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { getRound, getRounds } from '../../../api/roundService';
import { getStations } from '../../../api/stationService';
import {
  buildActiveDraft,
  formatRoundMetaLine,
  hydrateStationsForPlay,
  isRoundComplete,
  isRoundResumable,
  seedStationFromRound,
  sortRoundsForFieldList,
} from '../../../constants/rounds';
import { showMessage } from '../../../utils';

/**
 * Field Mode home — START ROUND → New Round form; Recent from GET /rounds.
 * No pull-to-refresh on the scorecard tab.
 */
const CourseHomeScreen = ({ navigation }) => {
  const { setMode, activeRound, setActiveDraft, setRoundPlaying } = useAppMode();

  const { data: roundsRaw, isLoading } = useCustomQuery({
    queryKey: ['rounds'],
    queryFn: getRounds,
  });

  const hasActiveDraft =
    !!(activeRound?.roundId && !activeRound?.finished);

  const rounds = useMemo(() => {
    const list = Array.isArray(roundsRaw)
      ? roundsRaw
      : Array.isArray(roundsRaw?.data)
        ? roundsRaw.data
        : [];
    return sortRoundsForFieldList(
      list,
      hasActiveDraft ? activeRound.roundId : null,
    );
  }, [roundsRaw, hasActiveDraft, activeRound?.roundId]);

  const openNewRoundForm = () => {
    setMode('course');
    navigateFromFieldToStack(navigation, 'NewRoundScreen');
  };

  const resumeActive = () => {
    if (!hasActiveDraft) return;
    setRoundPlaying(true);
    navigateFromFieldToStack(navigation, 'CourseRoundScreen');
  };

  const handleRoundPress = useCallback(
    async item => {
      if (isRoundComplete(item)) {
        navigateFromFieldToStack(navigation, 'CompleteRoundScreen', {
          roundId: item.id,
          viewingPast: true,
        });
        return;
      }

      try {
        const sameDraft =
          activeRound?.roundId === item.id &&
          Array.isArray(activeRound.stations) &&
          activeRound.stations.length > 0;

        if (!sameDraft) {
          const detail = await getRound(item.id);
          let apiStations = [];
          try {
            apiStations = await getStations(item.id);
          } catch {
            apiStations = [];
          }
          const stations =
            apiStations.length > 0
              ? hydrateStationsForPlay(
                  apiStations,
                  !!detail?.european_rotation,
                )
              : seedStationFromRound(detail || item);
          setActiveDraft(
            buildActiveDraft({
              round: detail || item,
              stations,
              courseName: (detail || item)?.course_name,
              createdAt: (detail || item)?.created_at,
            }),
          );
        }

        setRoundPlaying(true);
        navigateFromFieldToStack(navigation, 'CourseRoundScreen');
      } catch (err) {
        showMessage({
          message:
            err?.response?.data?.message || 'Unable to open this round.',
          bgColor: COLORS.primary,
        });
      }
    },
    [activeRound, navigation, setActiveDraft, setRoundPlaying],
  );

  return (
    <CourseLayout showModeIndicator>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {hasActiveDraft ? (
          <TouchableOpacity
            style={styles.resumeCard}
            onPress={resumeActive}
            activeOpacity={0.9}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.resumeHeader}>
                <Typography
                  size={11}
                  color={COLORS.primary}
                  fFamily="barlowBold700"
                  style={styles.uppercase}
                >
                  Round in progress
                </Typography>
                {activeRound.european_rotation ? (
                  <EuropeanBadge variant="field" />
                ) : null}
              </View>
              <Typography
                fFamily="barlowBold700"
                size={20}
                color={COLORS.white100}
                mT={4}
              >
                Resume Station {activeRound.currentStation}
              </Typography>
              <Typography size={12} color={COLORS.courseTextMuted} mT={4}>
                {activeRound.course_name}
              </Typography>
            </View>
            <Icon
              name="chevron-forward"
              iconFamily="Ionicons"
              size={28}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          style={styles.startBtn}
          onPress={openNewRoundForm}
          activeOpacity={0.95}
        >
          <Icon name="play" iconFamily="Ionicons" size={40} color={COLORS.white100} />
          <Typography fFamily="barlowBold700" size={24} color={COLORS.white100} mT={8}>
            START ROUND
          </Typography>
          <Typography size={12} color="rgba(255,255,255,0.8)" mT={4}>
            New round form → stations
          </Typography>
        </TouchableOpacity>

        <Typography
          size={12}
          color={COLORS.courseTextMuted}
          fFamily="barlowBold700"
          mB={8}
          style={styles.uppercase}
        >
          Recent Rounds
        </Typography>

        {isLoading && !rounds.length ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 24 }} />
        ) : null}

        {!isLoading && !rounds.length ? (
          <Typography size={14} color={COLORS.courseTextMuted} textAlign="center" mT={16}>
            No rounds yet. Start a round to begin scoring.
          </Typography>
        ) : null}

        {rounds.map(item => {
          const resumable = isRoundResumable(item);
          const isActive = hasActiveDraft && activeRound.roundId === item.id;
          const isEuropean = !!item.european_rotation;
          return (
            <TouchableOpacity
              key={String(item.id)}
              style={[styles.roundCard, isActive && styles.roundCardActive]}
              onPress={() => handleRoundPress(item)}
              activeOpacity={0.9}
            >
              <View style={styles.roundTopRow}>
                <Typography
                  fFamily="barlowBold700"
                  size={18}
                  color={COLORS.white100}
                  numberOfLines={1}
                  style={styles.roundTitle}
                >
                  {item.course_name || 'Round'}
                </Typography>
                {isEuropean ? (
                  <View style={styles.roundTopRight}>
                    <EuropeanBadge variant="field" />
                  </View>
                ) : null}
              </View>
              <View style={styles.roundBottomRow}>
                <View style={styles.roundMeta}>
                  <Icon
                    name="time-outline"
                    iconFamily="Ionicons"
                    size={14}
                    color={COLORS.courseTextMuted}
                  />
                  <Typography size={13} color={COLORS.courseTextMuted} mL={4} style={{ flexShrink: 1 }}>
                    {formatRoundMetaLine(item)}
                  </Typography>
                </View>
                <View
                  style={[
                    styles.badge,
                    resumable ? styles.badgeResume : styles.badgeDone,
                  ]}
                >
                  <Typography
                    size={12}
                    fFamily="barlowBold700"
                    color={resumable ? COLORS.primary : '#4ADE80'}
                  >
                    {resumable ? 'Resume' : 'Completed'}
                  </Typography>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </CourseLayout>
  );
};

export default CourseHomeScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(16),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
  },
  uppercase: { letterSpacing: 1.2, textTransform: 'uppercase' },
  resumeCard: {
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    padding: Sizer.hSize(16),
    marginBottom: Sizer.vSize(16),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  resumeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Sizer.hSize(8),
  },
  startBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(16),
    paddingVertical: Sizer.vSize(28),
    alignItems: 'center',
    marginBottom: Sizer.vSize(28),
  },
  roundCard: {
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    padding: Sizer.hSize(16),
    marginBottom: Sizer.vSize(9),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
  },
  roundCardActive: {
    borderColor: COLORS.primary,
  },
  roundTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roundTitle: {
    flex: 1,
    minWidth: 0,
    paddingRight: Sizer.hSize(8),
  },
  roundTopRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexShrink: 0,
  },
  roundBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Sizer.vSize(6),
  },
  roundMeta: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
    paddingRight: Sizer.hSize(8),
  },
  badge: {
    paddingHorizontal: Sizer.hSize(10),
    paddingVertical: Sizer.vSize(6),
    borderRadius: Sizer.hSize(6),
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },


  badgeResume: {
    backgroundColor: 'rgba(235, 108, 15, 0.15)',
  },
  badgeDone: {
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.35)',
  },
});
