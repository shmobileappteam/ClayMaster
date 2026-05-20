import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
import CourseHeader from '../../../components/course/CourseHeader';
import Icon from '../../../helpers/Icon';
import { COLORS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';

/**
 * CONTENT INVENTORY — ClayMaster-App-UI `CourseProgress.tsx`
 * Header: 1 (title "Progress", no back — root tab)
 * Stat cards: 3 (Average, This Month, Best Score)
 * Section "This Week": 1 chart block + 7 day bars
 * CTA row: 1 ("View All Rounds")
 * Section "30-Day Trend": 1 label + 3 discipline rows
 * Total list/tappable rows in trend + CTA: 4
 */

const WEEKLY_DATA = [
  { day: 'Mon', pct: 72 },
  { day: 'Tue', pct: 80 },
  { day: 'Wed', pct: 0 },
  { day: 'Thu', pct: 85 },
  { day: 'Fri', pct: 78 },
  { day: 'Sat', pct: 88 },
  { day: 'Sun', pct: 0 },
];

const TREND_ROWS = [
  { label: 'Sporting Clays', avg: '80%', trend: '+3%', up: true },
  { label: 'Skeet', avg: '75%', trend: '+7%', up: true },
  { label: 'Trap', avg: '82%', trend: '-1%', up: false },
];

const CourseProgressScreen = ({ navigation }) => (
  <CourseLayout>
    <CourseHeader title="Progress" />

    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.statGrid}>
        <View style={styles.statCard}>
          <Icon name="locate-outline" iconFamily="Ionicons" size={22} color={COLORS.primary} />
          <Typography fFamily="barlowBold700" size={20} lineHeight={26} color={COLORS.white100} mT={4}>
            78%
          </Typography>
          <Typography size={11} lineHeight={15} color="#666666" mT={4}>
            Average
          </Typography>
        </View>
        <View style={styles.statCard}>
          <Icon name="trending-up" iconFamily="Ionicons" size={22} color="#4ADE80" />
          <Typography fFamily="barlowBold700" size={20} lineHeight={26} color="#4ADE80" mT={4}>
            +5%
          </Typography>
          <Typography size={11} lineHeight={15} color="#666666" mT={4}>
            This Month
          </Typography>
        </View>
        <View style={styles.statCard}>
          <Icon name="trophy" iconFamily="Ionicons" size={22} color={COLORS.primary} />
          <Typography fFamily="barlowBold700" size={20} lineHeight={26} color={COLORS.white100} mT={4}>
            92%
          </Typography>
          <Typography size={11} lineHeight={15} color="#666666" mT={4}>
            Best Score
          </Typography>
        </View>
      </View>

      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Typography
            size={12}
            lineHeight={17}
            color="#999999"
            fFamily="barlowBold700"
            style={styles.sectionLabel}
          >
            This Week
          </Typography>
          <Icon name="calendar-outline" iconFamily="Ionicons" size={16} color="#666666" />
        </View>
        <View style={styles.barsRow}>
          {WEEKLY_DATA.map(d => (
            <View key={d.day} style={styles.barCol}>
              <View style={styles.barTrack}>
                {d.pct > 0 ? (
                  <View
                    style={[
                      styles.barFill,
                      { height: (d.pct / 100) * Sizer.vSize(100) },
                    ]}
                  />
                ) : null}
              </View>
              <Typography size={11} lineHeight={15} color="#666666" fFamily="barlowMedium500">
                {d.day}
              </Typography>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.viewAllBtn}
        activeOpacity={0.88}
        onPress={() => navigation.navigate('CourseProgressDetailScreen')}
      >
        <Typography fFamily="barlowSemiBold600" size={14} lineHeight={21} color={COLORS.primary}>
          View All Rounds
        </Typography>
        <Icon name="chevron-forward" iconFamily="Ionicons" size={18} color={COLORS.primary} />
      </TouchableOpacity>

      <View style={styles.trendCard}>
        <Typography
          size={12}
          lineHeight={17}
          color="#999999"
          fFamily="barlowBold700"
          style={styles.sectionLabel}
          mB={12}
        >
          30-Day Trend
        </Typography>
        {TREND_ROWS.map((item, index) => (
          <View
            key={item.label}
            style={[styles.trendRow, index < TREND_ROWS.length - 1 && styles.trendRowBorder]}
          >
            <Typography fFamily="barlowMedium500" size={14} lineHeight={21} color={COLORS.white100}>
              {item.label}
            </Typography>
            <View style={styles.trendRight}>
              <Typography size={14} lineHeight={21} color="#888888">
                {item.avg}
              </Typography>
              <Typography
                fFamily="barlowBold700"
                size={12}
                lineHeight={17}
                color={item.up ? '#4ADE80' : '#F87171'}
                mL={12}
              >
                {item.trend}
              </Typography>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  </CourseLayout>
);

export default CourseProgressScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingVertical: Sizer.vSize(20),
    paddingBottom: Sizer.vSize(100),
    gap: Sizer.vSize(20),
  },
  // grid grid-cols-3 gap-2
  statGrid: {
    flexDirection: 'row',
    gap: Sizer.hSize(8),
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
    padding: Sizer.hSize(16),
    alignItems: 'center',
  },
  chartCard: {
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
    padding: Sizer.hSize(20),
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Sizer.vSize(16),
  },
  sectionLabel: {
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Sizer.hSize(8),
    height: Sizer.vSize(128),
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    gap: Sizer.vSize(4),
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: '100%',
    height: Sizer.vSize(100),
    backgroundColor: COLORS.courseBorder,
    borderRadius: Sizer.hSize(8),
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(8),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  viewAllBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizer.hSize(8),
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
    padding: Sizer.hSize(16),
  },
  trendCard: {
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
    padding: Sizer.hSize(20),
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Sizer.vSize(6),
  },
  trendRowBorder: {
    marginBottom: Sizer.vSize(12),
  },
  trendRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
