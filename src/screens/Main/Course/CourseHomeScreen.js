import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Typography } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
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
 */
const CourseHomeScreen = ({ navigation }) => {
  const { setMode, activeRound, setActiveDraft } = useAppMode();

  const {
    data: roundsRaw,
    isLoading,
    isRefetching,
    refetch,
  } = useCustomQuery({
    queryKey: ['rounds'],
    queryFn: getRounds,
  });

  const rounds = useMemo(() => {
    const list = Array.isArray(roundsRaw)
      ? roundsRaw
      : Array.isArray(roundsRaw?.data)
        ? roundsRaw.data
        : [];
    return sortRoundsForFieldList(list);
  }, [roundsRaw]);

  const hasActiveDraft =
    activeRound?.roundId && !activeRound?.finished;

  const openNewRoundForm = () => {
    setMode('course');
    navigateFromFieldToStack(navigation, 'NewRoundScreen');
  };

  const resumeActive = () => {
    if (!hasActiveDraft) return;
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

        navigateFromFieldToStack(navigation, 'CourseRoundScreen');
      } catch (err) {
        showMessage({
          message:
            err?.response?.data?.message || 'Unable to open this round.',
          bgColor: COLORS.primary,
        });
      }
    },
    [activeRound, navigation, setActiveDraft],
  );

  return (
    <CourseLayout>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={COLORS.primary}
          />
        }
      >
        {hasActiveDraft ? (
          <TouchableOpacity
            style={styles.resumeCard}
            onPress={resumeActive}
            activeOpacity={0.9}
          >
            <View style={{ flex: 1 }}>
              <Typography
                size={11}
                color={COLORS.primary}
                fFamily="barlowBold700"
                style={styles.uppercase}
              >
                Round in progress
              </Typography>
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
          size={11}
          color="#999"
          fFamily="barlowBold700"
          style={[styles.uppercase, { marginBottom: Sizer.vSize(12) }]}
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
          return (
            <TouchableOpacity
              key={String(item.id)}
              style={[styles.roundCard, isActive && styles.roundCardActive]}
              onPress={() => handleRoundPress(item)}
              activeOpacity={0.9}
            >
              <View style={{ flex: 1 }}>
                <Typography fFamily="barlowBold700" size={18} color={COLORS.white100}>
                  {item.course_name || 'Round'}
                </Typography>
                <View style={styles.roundMeta}>
                  <Icon name="time-outline" iconFamily="Ionicons" size={12} color="#666" />
                  <Typography size={11} color="#666" mL={4}>
                    {formatRoundMetaLine(item)}
                  </Typography>
                </View>
              </View>
              <View
                style={[
                  styles.badge,
                  resumable ? styles.badgeResume : styles.badgeDone,
                ]}
              >
                <Typography
                  size={11}
                  fFamily="barlowBold700"
                  color={resumable ? COLORS.primary : COLORS.white100}
                >
                  {resumable ? 'Resume' : 'Completed'}
                </Typography>
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
    marginBottom: Sizer.vSize(10),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
  },
  roundCardActive: {
    borderColor: COLORS.primary,
  },
  roundMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Sizer.vSize(4),
  },
  badge: {
    paddingHorizontal: Sizer.hSize(10),
    paddingVertical: Sizer.vSize(6),
    borderRadius: Sizer.hSize(6),
    marginLeft: Sizer.hSize(8),
  },
  badgeResume: {
    backgroundColor: 'rgba(235, 108, 15, 0.15)',
  },
  badgeDone: {
    backgroundColor: '#2A2A2A',
  },
});
