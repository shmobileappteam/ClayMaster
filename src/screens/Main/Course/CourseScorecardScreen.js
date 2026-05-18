import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
import CourseHeader from '../../../components/course/CourseHeader';
import Icon from '../../../helpers/Icon';
import { COLORS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';

/**
 * CONTENT INVENTORY — ClayMaster-App-UI `CourseScorecard.tsx`
 * Header: 1 (Scorecard, showBack)
 * Hero summary card: 1 (score, accuracy, date·discipline metadata)
 * Section label: 1 ("Station Breakdown")
 * Station rows: 5 (each: title + hits/total badge + 5 square shot tiles)
 * Shot tiles per station: 5 × 5 = 25
 * Footer action buttons: 2 (Share Score, Download PDF)
 */

const STATIONS = [
  { name: 'Station 1', shots: [true, true, false, true, true] },
  { name: 'Station 2', shots: [true, false, true, true, true] },
  { name: 'Station 3', shots: [true, true, true, false, false] },
  { name: 'Station 4', shots: [true, true, true, true, false] },
  { name: 'Station 5', shots: [false, true, true, true, true] },
];

const totalHit = STATIONS.reduce((acc, s) => acc + s.shots.filter(Boolean).length, 0);
const totalShots = STATIONS.reduce((acc, s) => acc + s.shots.length, 0);
const accuracy = Math.round((totalHit / totalShots) * 100);

const ShotTile = ({ hit }) => (
  <View style={[styles.shotTile, hit ? styles.shotTileHit : styles.shotTileMiss]}>
    <Icon
      name={hit ? 'checkmark' : 'close'}
      iconFamily="Ionicons"
      size={20}
      color={hit ? COLORS.primary : '#F87171'}
    />
  </View>
);

const CourseScorecardScreen = ({ navigation }) => (
  <CourseLayout showTabs={false}>
    <CourseHeader title="Scorecard" showBack onBack={() => navigation.goBack()} />

    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero — bg-cm-orange rounded-xl p-6 */}
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <View>
            <Typography size={14} lineHeight={21} color="rgba(255,255,255,0.8)">
              Round Score
            </Typography>
            <Typography fFamily="barlowBold700" size={44} lineHeight={44} color={COLORS.white100} mT={4}>
              {totalHit}/{totalShots}
            </Typography>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Typography size={14} lineHeight={21} color="rgba(255,255,255,0.8)">
              Accuracy
            </Typography>
            <Typography fFamily="barlowBold700" size={36} lineHeight={40} color={COLORS.white100} mT={4}>
              {accuracy}%
            </Typography>
          </View>
        </View>
        <View style={styles.heroMeta}>
          <Icon name="disc-outline" iconFamily="Ionicons" size={16} color="rgba(255,255,255,0.7)" />
          <Typography size={14} lineHeight={21} color="rgba(255,255,255,0.7)" mL={8}>
            Apr 8, 2026 · Sporting Clays
          </Typography>
        </View>
      </View>

      <Typography
        size={12}
        lineHeight={17}
        color="#999999"
        fFamily="barlowBold700"
        style={styles.sectionLabel}
        mB={12}
      >
        Station Breakdown
      </Typography>

      {STATIONS.map(station => {
        const hits = station.shots.filter(Boolean).length;
        return (
          <View key={station.name} style={styles.stationCard}>
            <View style={styles.stationHeader}>
              <Typography fFamily="barlowBold700" size={14} lineHeight={21} color={COLORS.white100}>
                {station.name}
              </Typography>
              <Typography fFamily="barlowBold700" size={14} lineHeight={21} color={COLORS.primary}>
                {hits}/{station.shots.length}
              </Typography>
            </View>
            <View style={styles.shotRow}>
              {station.shots.map((hit, i) => (
                <ShotTile key={i} hit={hit} />
              ))}
            </View>
          </View>
        );
      })}

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionPrimary} activeOpacity={0.88}>
          <Typography fFamily="barlowBold700" size={14} lineHeight={21} color={COLORS.white100}>
            Share Score
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionSecondary} activeOpacity={0.88}>
          <Typography fFamily="barlowBold700" size={14} lineHeight={21} color={COLORS.white100}>
            Download PDF
          </Typography>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </CourseLayout>
);

export default CourseScorecardScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingVertical: Sizer.vSize(20),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(20),
  },
  sectionLabel: {
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  heroCard: {
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    padding: Sizer.hSize(24),
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Sizer.vSize(12),
  },
  stationCard: {
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
    padding: Sizer.hSize(16),
    marginBottom: Sizer.vSize(8),
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizer.vSize(12),
  },
  shotRow: {
    flexDirection: 'row',
    gap: Sizer.hSize(8),
  },
  // w-11 h-11 rounded-lg — square tiles, not circles
  shotTile: {
    width: Sizer.hSize(44),
    height: Sizer.hSize(44),
    borderRadius: Sizer.hSize(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  shotTileHit: {
    backgroundColor: 'rgba(235, 108, 15, 0.2)',
  },
  shotTileMiss: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Sizer.hSize(12),
    marginTop: Sizer.vSize(8),
  },
  actionPrimary: {
    flex: 1,
    height: Sizer.vSize(56),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionSecondary: {
    flex: 1,
    height: Sizer.vSize(56),
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
