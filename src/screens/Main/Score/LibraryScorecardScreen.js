import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Container, Typography, AppLoader } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import Icon from '../../../helpers/Icon';
import {
  COLORS,
  GLOBALSTYLE,
  SHADOWS,
  SPACING,
  TYPE,
} from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { getRound, getRounds } from '../../../api/roundService';
import { getStations } from '../../../api/stationService';
import {
  formatRoundMetaLine,
  isRoundComplete,
  mapRoundToScorecardStations,
  scoreFromShots,
  scoreFromStations,
  sortRoundsForFieldList,
} from '../../../constants/rounds';
import EuropeanBadge from '../../../components/course/EuropeanBadge';

/** Digital scorecard — completed rounds only (live API). */
const LibraryScorecardScreen = ({ navigation, route }) => {
  const roundId = route.params?.roundId;

  const { data: roundsRaw, isLoading: listLoading } = useCustomQuery({
    queryKey: ['rounds'],
    queryFn: getRounds,
    enabled: !roundId,
  });

  const { data: roundDetail, isLoading: detailLoading } = useCustomQuery({
    queryKey: ['round', roundId],
    queryFn: ({ queryKey }) => getRound(queryKey[1]),
    enabled: !!roundId,
  });

  const { data: apiStations, isLoading: stationsLoading } = useCustomQuery({
    queryKey: ['stations', roundId],
    queryFn: ({ queryKey }) => getStations(queryKey[1]),
    enabled: !!roundId,
  });

  const completedRounds = useMemo(() => {
    const list = Array.isArray(roundsRaw)
      ? roundsRaw
      : Array.isArray(roundsRaw?.data)
        ? roundsRaw.data
        : [];
    return sortRoundsForFieldList(list).filter(isRoundComplete);
  }, [roundsRaw]);

  if (!roundId) {
    return (
      <Container isPadding={false} backgroundColor={COLORS.mainBg}>
        <LibraryHeader
          title="Digital Scorecard"
          showBack
          showNotification={false}
          onBack={() => navigation.goBack()}
        />
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {listLoading ? (
            <AppLoader />
          ) : null}
          {!listLoading && !completedRounds.length ? (
            <Typography
              size={14}
              color={COLORS.textSecondary}
              textAlign="center"
              mT={32}
            >
              No completed rounds yet.
            </Typography>
          ) : null}
          {completedRounds.map(item => {
            const isEuropean = !!item.european_rotation;
            return (
              <TouchableOpacity
                key={String(item.id)}
                style={[GLOBALSTYLE.screenCard, styles.listCard]}
                activeOpacity={0.88}
                onPress={() =>
                  navigation.push('LibraryScorecardScreen', { roundId: item.id })
                }
              >
                <View style={styles.listTopRow}>
                  <Typography
                    fFamily="barlowSemiBold600"
                    size={16}
                    color={COLORS.textPrimary}
                    numberOfLines={1}
                    style={styles.listTitle}
                  >
                    {item.course_name || 'Round'}
                  </Typography>
                  {isEuropean ? <EuropeanBadge variant="light" /> : null}
                </View>
                <Typography size={12} color={COLORS.textSecondary} mT={4}>
                  {formatRoundMetaLine(item)}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Container>
    );
  }

  if (detailLoading || stationsLoading || !roundDetail) {
    return (
      <Container isPadding={false} backgroundColor={COLORS.mainBg}>
        <LibraryHeader
          title="Scorecard"
          showBack
          showNotification={false}
          onBack={() => navigation.goBack()}
        />
        <AppLoader />
      </Container>
    );
  }

  const stationsSource =
    Array.isArray(apiStations) && apiStations.length
      ? apiStations
      : Array.isArray(roundDetail?.stations)
        ? roundDetail.stations
        : [];
  const stations = mapRoundToScorecardStations({
    ...roundDetail,
    stations: stationsSource,
  });
  const computed = scoreFromStations(stationsSource);
  const apiStatsUsable =
    typeof roundDetail?.stats?.total === 'number' &&
    roundDetail.stats.total > 0 &&
    typeof roundDetail?.stats?.dead === 'number';
  const totalHit = apiStatsUsable ? roundDetail.stats.dead : computed.hits;
  const totalShots = apiStatsUsable
    ? roundDetail.stats.total
    : computed.taken;
  const accuracy = totalShots
    ? Math.round((totalHit / totalShots) * 100)
    : 0;
  const statsDead = totalHit;
  const statsLost = apiStatsUsable
    ? roundDetail.stats.lost
    : Math.max(0, totalShots - totalHit);
  const statsTotal = totalShots;

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Scorecard"
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summary}>
          <View>
            <Typography size={TYPE.body.size} color={COLORS.white100} style={{ opacity: 0.8 }}>
              Round Score
            </Typography>
            <Typography fFamily="barlowBold700" size={40} color={COLORS.white100} mT={4}>
              {statsDead}/{statsTotal || 0}
            </Typography>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Typography size={TYPE.body.size} color={COLORS.white100} style={{ opacity: 0.8 }}>
              Accuracy
            </Typography>
            <Typography fFamily="barlowBold700" size={TYPE.h1.size} color={COLORS.white100} mT={4}>
              {accuracy}%
            </Typography>
          </View>
        </View>
        <View style={styles.metaRow}>
          <Icon name="locate-outline" iconFamily="Ionicons" size={16} color={COLORS.white100} />
          <Typography size={TYPE.body.size} color={COLORS.white100} mL={8} style={{ opacity: 0.8 }}>
            {roundDetail.course_name}
            {formatRoundMetaLine(roundDetail)
              ? ` · ${formatRoundMetaLine(roundDetail)}`
              : ''}
          </Typography>
        </View>

        <Typography
          fFamily={TYPE.h2.fFamily}
          size={TYPE.h2.size}
          color={COLORS.textPrimary}
          mT={SPACING.section}
          mB={SPACING.component}
        >
          Station Breakdown
        </Typography>

        <View style={styles.stationList}>
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
                <View key={station.name} style={[GLOBALSTYLE.screenCard, styles.stationCard]}>
                  <View style={styles.stationHeader}>
                    <Typography
                      fFamily="barlowSemiBold600"
                      size={TYPE.body.size}
                      color={COLORS.textPrimary}
                    >
                      {station.name}
                    </Typography>
                    <Typography
                      fFamily="barlowSemiBold600"
                      size={TYPE.body.size}
                      color={COLORS.primary}
                    >
                      {hits}/{taken || 0}
                    </Typography>
                  </View>
                  <View style={styles.shotsRow}>
                    {station.shots.map((hit, i) => (
                      <View
                        key={i}
                        style={[styles.shotCell, hit ? styles.shotHit : styles.shotMiss]}
                      >
                        <Icon
                          name={hit ? 'checkmark' : 'close'}
                          iconFamily="Ionicons"
                          size={18}
                          color={hit ? COLORS.primary : COLORS.destructive}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              );
            })
          ) : (
            <Typography size={14} color={COLORS.textSecondary}>
              No station shots recorded for this round.
            </Typography>
          )}
        </View>
      </ScrollView>
    </Container>
  );
};

export default LibraryScorecardScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
  },
  listCard: {
    padding: Sizer.hSize(SPACING.cardP),
    marginBottom: Sizer.vSize(12),
    ...SHADOWS.card,
  },
  listTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listTitle: {
    flex: 1,
    minWidth: 0,
    paddingRight: Sizer.hSize(8),
  },
  summary: {
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    padding: Sizer.hSize(SPACING.cardP),
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...SHADOWS.card,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Sizer.vSize(12),
    paddingHorizontal: Sizer.hSize(4),
  },
  stationList: {
    gap: Sizer.vSize(SPACING.component),
  },
  stationCard: {
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Sizer.vSize(12),
  },
  shotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizer.hSize(8),
  },
  shotCell: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  shotHit: {
    backgroundColor: COLORS.primaryLight,
  },
  shotMiss: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
  },
});
