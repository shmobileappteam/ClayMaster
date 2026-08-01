import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Typography } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
import CourseHeader from '../../../components/course/CourseHeader';
import Icon from '../../../helpers/Icon';
import { COLORS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { getRound } from '../../../api/roundService';
import { getStations } from '../../../api/stationService';
import {
  formatRoundMetaLine,
  mapRoundToScorecardStations,
  scoreFromShots,
  scoreFromStations,
} from '../../../constants/rounds';
import { resetToFieldMode } from '../../../navigation/navigationHelpers';

const SUCCESS_GREEN = COLORS.green;

/**
 * Field Mode round complete / completed detail —
 * Score uses milestone logic: hits / taken (empty ignored).
 */
const CompleteRoundScreen = ({ navigation, route }) => {
  const roundId = route.params?.roundId;
  const viewingPast = !!route.params?.viewingPast;

  const { data: round, isLoading: roundLoading } = useCustomQuery({
    queryKey: ['round', roundId],
    queryFn: ({ queryKey }) => getRound(queryKey[1]),
    enabled: !!roundId,
  });

  const { data: apiStations, isLoading: stationsLoading } = useCustomQuery({
    queryKey: ['stations', roundId],
    queryFn: ({ queryKey }) => getStations(queryKey[1]),
    enabled: !!roundId,
  });

  const stationsSource = useMemo(() => {
    if (Array.isArray(apiStations) && apiStations.length) return apiStations;
    if (Array.isArray(round?.stations) && round.stations.length) {
      return round.stations;
    }
    return [];
  }, [apiStations, round?.stations]);

  const roundForMap = useMemo(
    () => ({ ...(round || {}), stations: stationsSource }),
    [round, stationsSource],
  );

  const stations = useMemo(
    () => mapRoundToScorecardStations(roundForMap),
    [roundForMap],
  );

  // Milestone: prefer computing from taken shots; fall back to API stats if present
  const computed = useMemo(
    () => scoreFromStations(stationsSource),
    [stationsSource],
  );
  const statsDead = round?.stats?.dead;
  const statsLost = round?.stats?.lost;
  const statsTotal = round?.stats?.total;
  const apiStatsUsable =
    typeof statsTotal === 'number' &&
    statsTotal > 0 &&
    typeof statsDead === 'number';

  const totalHit = apiStatsUsable ? statsDead : computed.hits;
  const totalShots = apiStatsUsable
    ? statsTotal
    : computed.taken || (statsTotal ?? 0);
  const accuracy = totalShots
    ? Math.round((totalHit / totalShots) * 100)
    : 0;

  const isLoading = roundLoading || stationsLoading;
  const goHome = () => resetToFieldMode(navigation, 'CourseHomeScreen');

  return (
    <CourseLayout showTabs={false} showModeIndicator={false}>
      <CourseHeader
        title={viewingPast ? 'Scorecard' : 'Round Complete'}
        showBack={viewingPast}
        onBack={() => navigation.goBack()}
      />

      {isLoading || !round ? (
        <View style={styles.loader}>
          <ActivityIndicator color={SUCCESS_GREEN} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroCard}>
            <Icon
              name="trophy"
              iconFamily="Ionicons"
              size={36}
              color={COLORS.white100}
            />
            <Typography
              size={14}
              lineHeight={21}
              color="rgba(255,255,255,0.85)"
              mT={8}
            >
              Final Score
            </Typography>
            <Typography
              fFamily="barlowBold700"
              size={52}
              lineHeight={52}
              color={COLORS.white100}
              mT={4}
            >
              {totalHit}/{totalShots || 0}
            </Typography>
            <Typography
              fFamily="barlowBold700"
              size={20}
              lineHeight={26}
              color={COLORS.white100}
              mT={4}
            >
              {accuracy}% Accuracy
            </Typography>
            {round.course_name ? (
              <Typography
                size={13}
                color="rgba(255,255,255,0.75)"
                mT={10}
                textAlign="center"
              >
                {round.course_name}
                {formatRoundMetaLine(round)
                  ? ` · ${formatRoundMetaLine(round)}`
                  : ''}
              </Typography>
            ) : null}
          </View>

          <View style={styles.statsRow}>
            <StatPill label="Dead" value={apiStatsUsable ? statsDead : totalHit} />
            <StatPill
              label="Lost"
              value={
                apiStatsUsable
                  ? statsLost
                  : Math.max(0, (totalShots || 0) - (totalHit || 0))
              }
            />
            <StatPill label="Targets" value={totalShots || 0} />
          </View>

          <Typography
            size={12}
            lineHeight={17}
            color={COLORS.courseTextMuted}
            fFamily="barlowBold700"
            style={styles.sectionLabel}
            mB={12}
          >
            Station Breakdown
          </Typography>

          {stations.length ? (
            stations.map((station, idx) => {
              const source = stationsSource[idx];
              const { hits, taken } = source?.shots?.length
                ? scoreFromShots(source.shots)
                : {
                    hits: station.shots.filter(Boolean).length,
                    taken: station.shots.length,
                  };
              return (
                <View key={station.name} style={styles.stationCard}>
                  <View style={styles.stationHeader}>
                    <Typography
                      fFamily="barlowBold700"
                      size={14}
                      lineHeight={21}
                      color={COLORS.white100}
                    >
                      {station.name}
                    </Typography>
                    <Typography
                      fFamily="barlowBold700"
                      size={14}
                      lineHeight={21}
                      color={SUCCESS_GREEN}
                    >
                      {hits}/{taken || 0}
                    </Typography>
                  </View>
                  <View style={styles.shotRow}>
                    {station.shots.map((hit, i) => (
                      <View
                        key={i}
                        style={[
                          styles.shotTile,
                          hit ? styles.shotTileHit : styles.shotTileMiss,
                        ]}
                      >
                        <Icon
                          name={hit ? 'checkmark' : 'close'}
                          iconFamily="Ionicons"
                          size={18}
                          color={hit ? SUCCESS_GREEN : '#F87171'}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              );
            })
          ) : (
            <Typography size={14} color={COLORS.courseTextMuted} mB={12}>
              No station shots recorded for this round.
            </Typography>
          )}

          {round.download_url ? (
            <TouchableOpacity
              style={styles.secondaryBtn}
              activeOpacity={0.88}
              onPress={() => Linking.openURL(round.download_url)}
            >
              <Typography
                fFamily="barlowBold700"
                size={14}
                color={COLORS.white100}
              >
                Download File
              </Typography>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={styles.homeBtn}
            activeOpacity={0.88}
            onPress={viewingPast ? () => navigation.goBack() : goHome}
          >
            {!viewingPast ? (
              <Icon
                name="home-outline"
                iconFamily="Ionicons"
                size={18}
                color={COLORS.white100}
              />
            ) : null}
            <Typography
              fFamily="barlowMedium500"
              size={14}
              lineHeight={21}
              color={COLORS.white100}
              mL={viewingPast ? 0 : 8}
            >
              {viewingPast ? 'Close' : 'Back to Field Home'}
            </Typography>
          </TouchableOpacity>
        </ScrollView>
      )}
    </CourseLayout>
  );
};

const StatPill = ({ label, value }) => (
  <View style={styles.statPill}>
    <Typography
      size={10}
      color={COLORS.courseTextMuted}
      fFamily="barlowBold700"
      style={styles.sectionLabel}
    >
      {label}
    </Typography>
    <Typography
      fFamily="barlowBold700"
      size={20}
      color={COLORS.white100}
      mT={4}
    >
      {value ?? '—'}
    </Typography>
  </View>
);

export default CompleteRoundScreen;

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingVertical: Sizer.vSize(20),
    paddingBottom: Sizer.vSize(40),
  },
  sectionLabel: {
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  heroCard: {
    backgroundColor: SUCCESS_GREEN,
    borderRadius: Sizer.hSize(12),
    padding: Sizer.hSize(24),
    alignItems: 'center',
    marginBottom: Sizer.vSize(16),
  },
  statsRow: {
    flexDirection: 'row',
    gap: Sizer.hSize(8),
    marginBottom: Sizer.vSize(20),
  },
  statPill: {
    flex: 1,
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(10),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
    paddingVertical: Sizer.vSize(12),
    paddingHorizontal: Sizer.hSize(10),
    alignItems: 'center',
  },
  stationCard: {
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
    padding: Sizer.hSize(16),
    marginBottom: Sizer.vSize(10),
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizer.vSize(12),
  },
  shotRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizer.hSize(8),
  },
  shotTile: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    borderRadius: Sizer.hSize(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  shotTileHit: {
    backgroundColor: 'rgba(27, 133, 103, 0.25)',
  },
  shotTileMiss: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  secondaryBtn: {
    height: Sizer.vSize(48),
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizer.vSize(8),
    marginBottom: Sizer.vSize(12),
  },
  homeBtn: {
    width: '100%',
    height: Sizer.vSize(48),
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizer.vSize(4),
  },
});
