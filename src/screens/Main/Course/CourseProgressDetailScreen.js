import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
import CourseHeader from '../../../components/course/CourseHeader';
import Icon from '../../../helpers/Icon';
import { COLORS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';

/**
 * CONTENT INVENTORY — ClayMaster-App-UI `CourseProgressDetail.tsx`
 * Header: 1 (All Rounds, showBack)
 * Stat hero cards: 2 (Total Rounds, Avg Accuracy)
 * Section label: 1 ("Round History")
 * Composite list rows: 6 (score, calendar+metadata left | pct + chevron right)
 */

const ROUNDS = [
  { date: 'Apr 8, 2026', discipline: 'Sporting Clays', score: '22/25', pct: 88 },
  { date: 'Apr 5, 2026', discipline: 'Skeet', score: '19/25', pct: 76 },
  { date: 'Apr 1, 2026', discipline: 'Trap', score: '20/25', pct: 80 },
  { date: 'Mar 28, 2026', discipline: 'Sporting Clays', score: '21/25', pct: 84 },
  { date: 'Mar 25, 2026', discipline: '5-Stand', score: '18/25', pct: 72 },
  { date: 'Mar 22, 2026', discipline: 'Trap', score: '23/25', pct: 92 },
];

const avgPct = Math.round(ROUNDS.reduce((a, r) => a + r.pct, 0) / ROUNDS.length);

const pctColor = pct =>
  pct >= 80 ? '#4ADE80' : pct >= 70 ? COLORS.primary : '#F87171';

const CourseProgressDetailScreen = ({ navigation }) => (
  <CourseLayout showTabs={false}>
    <CourseHeader title="All Rounds" showBack onBack={() => navigation.goBack()} />

    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.statGrid}>
        <View style={styles.statCard}>
          <Icon name="radio-button-on" iconFamily="Ionicons" size={22} color={COLORS.primary} />
          <Typography fFamily="barlowBold700" size={20} lineHeight={26} color={COLORS.white100} mT={4}>
            {ROUNDS.length}
          </Typography>
          <Typography size={12} lineHeight={17} color="#666666" mT={4}>
            Total Rounds
          </Typography>
        </View>
        <View style={styles.statCard}>
          <Icon name="trending-up" iconFamily="Ionicons" size={22} color="#4ADE80" />
          <Typography fFamily="barlowBold700" size={20} lineHeight={26} color="#4ADE80" mT={4}>
            {avgPct}%
          </Typography>
          <Typography size={12} lineHeight={17} color="#666666" mT={4}>
            Avg Accuracy
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
        Round History
      </Typography>

      <View style={styles.list}>
        {ROUNDS.map((r, i) => (
          <TouchableOpacity
            key={`${r.date}-${i}`}
            style={styles.row}
            activeOpacity={0.88}
            onPress={() => navigation.navigate('CourseScorecardScreen')}
          >
            <View style={styles.rowLeft}>
              <Typography fFamily="barlowBold700" size={18} lineHeight={25} color={COLORS.white100}>
                {r.score}
              </Typography>
              <View style={styles.rowMeta}>
                <Icon name="calendar-outline" iconFamily="Ionicons" size={12} color="#666666" />
                <Typography size={12} lineHeight={17} color="#666666" mL={4}>
                  {r.date} · {r.discipline}
                </Typography>
              </View>
            </View>
            <View style={styles.rowRight}>
              <Typography fFamily="barlowBold700" size={20} lineHeight={26} color={pctColor(r.pct)}>
                {r.pct}%
              </Typography>
              <Icon name="chevron-forward" iconFamily="Ionicons" size={20} color="#444444" mL={8} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  </CourseLayout>
);

export default CourseProgressDetailScreen;

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
  statGrid: {
    flexDirection: 'row',
    gap: Sizer.hSize(12),
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
  list: { gap: Sizer.vSize(8) },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
    padding: Sizer.hSize(16),
  },
  rowLeft: { flex: 1, minWidth: 0 },
  rowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Sizer.vSize(4),
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
