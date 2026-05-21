import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Container, Typography } from '../../../atomComponents';
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

/** ClayMaster-App-UI `Scorecard.tsx` */
const STATIONS = [
  { name: 'Station 1', shots: [true, true, false, true, true] },
  { name: 'Station 2', shots: [true, false, true, true, true] },
  { name: 'Station 3', shots: [true, true, true, false, false] },
  { name: 'Station 4', shots: [true, true, true, true, false] },
  { name: 'Station 5', shots: [false, true, true, true, true] },
];

const totalHit = STATIONS.reduce(
  (acc, s) => acc + s.shots.filter(Boolean).length,
  0,
);
const totalShots = STATIONS.reduce((acc, s) => acc + s.shots.length, 0);
const accuracy = Math.round((totalHit / totalShots) * 100);

const LibraryScorecardScreen = ({ navigation }) => (
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
            {totalHit}/{totalShots}
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
          Apr 8, 2026 · Sporting Clays
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
        {STATIONS.map(station => {
          const hits = station.shots.filter(Boolean).length;
          return (
            <View key={station.name} style={[GLOBALSTYLE.screenCard, styles.stationCard]}>
              <View style={styles.stationHeader}>
                <Typography fFamily="barlowSemiBold600" size={TYPE.body.size} color={COLORS.textPrimary}>
                  {station.name}
                </Typography>
                <Typography fFamily="barlowSemiBold600" size={TYPE.body.size} color={COLORS.primary}>
                  {hits}/{station.shots.length}
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
        })}
      </View>

      <View style={[GLOBALSTYLE.screenCard, styles.witnessCard]}>
        <Typography size={TYPE.caption.size} color={COLORS.textSecondary}>
          Witnessed by
        </Typography>
        <Typography fFamily="barlowSemiBold600" size={TYPE.body.size} color={COLORS.textPrimary} mT={4}>
          Kevin DeMichiel
        </Typography>
        <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mT={4}>
          Signed digitally · Apr 8, 2026
        </Typography>
      </View>
    </ScrollView>
  </Container>
);

export default LibraryScorecardScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
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
  witnessCard: {
    padding: Sizer.hSize(SPACING.cardP),
    marginTop: Sizer.vSize(SPACING.section),
    ...SHADOWS.card,
  },
});
