import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
import CourseHeader from '../../../components/course/CourseHeader';
import Icon from '../../../helpers/Icon';
import { COLORS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useAppMode } from '../../../context/AppModeContext';
import { MISS_CATEGORIES, getMissCategory } from '../../../constants/missCategories';

/**
 * CONTENT INVENTORY — ClayMaster-App-UI `CourseRoundSummary.tsx`
 * Header: 1 (Round Complete, no back)
 * Hero card: 1 (trophy, Final Score label, fraction, accuracy %)
 * Primary miss card: 0–1
 * Section "Miss Breakdown": 0–1 block with N rows (count + pct + bar each)
 * CTAs: 2 (Fix This Now, Back to Field Home)
 */

const BAR_FILL = {
  '#F87171': '#F87171',
  '#FB923C': '#FB923C',
  '#FACC15': '#FACC15',
  '#60A5FA': '#60A5FA',
  '#C084FC': '#C084FC',
  '#34D399': '#34D399',
};

const CourseRoundSummaryScreen = ({ navigation }) => {
  const { activeRound, lastPrimaryMiss, clearRound, setMode } = useAppMode();
  const primary = getMissCategory(lastPrimaryMiss);

  const round = activeRound;
  const totalShots = round?.stations.reduce((a, s) => a + s.shots.length, 0) ?? 0;
  const totalHits =
    round?.stations.reduce(
      (a, s) => a + s.shots.filter(sh => sh.hit).length,
      0,
    ) ?? 0;
  const accuracy = totalShots ? Math.round((totalHits / totalShots) * 100) : 0;

  const breakdown = useMemo(() => {
    const tally = {};
    round?.stations.forEach(s => {
      s.shots.forEach(sh => {
        if (!sh.hit && sh.missCategory) {
          tally[sh.missCategory] = (tally[sh.missCategory] || 0) + 1;
        }
      });
    });
    const totalMisses = Object.values(tally).reduce((a, b) => a + b, 0);
    return MISS_CATEGORIES.map(c => ({
      cat: c,
      count: tally[c.id] || 0,
      pct: totalMisses ? Math.round(((tally[c.id] || 0) / totalMisses) * 100) : 0,
    }))
      .filter(b => b.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [round]);

  const totalMisses = breakdown.reduce((a, b) => a + b.count, 0);

  const fixThisNow = () => {
    if (!primary) {
      setMode('library');
      navigation.navigate('BottomTabs');
      return;
    }
    setMode('library');
    clearRound();
    navigation.navigate('DrillsScreen');
  };

  const closeAndHome = () => {
    clearRound();
    navigation.navigate('CourseHomeScreen');
  };

  return (
    <CourseLayout showTabs={false}>
      <CourseHeader title="Round Complete" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Icon name="trophy" iconFamily="Ionicons" size={36} color={COLORS.white100} />
          <Typography size={14} lineHeight={21} color="rgba(255,255,255,0.8)" mT={8}>
            Final Score
          </Typography>
          <Typography fFamily="barlowBold700" size={52} lineHeight={52} color={COLORS.white100} mT={4}>
            {totalHits}/{totalShots}
          </Typography>
          <Typography fFamily="barlowBold700" size={20} lineHeight={26} color={COLORS.white100} mT={4}>
            {accuracy}% Accuracy
          </Typography>
        </View>

        {primary ? (
          <View
            style={[
              styles.primaryMissCard,
              {
                backgroundColor: primary.colorBg,
                borderColor: primary.colorBorder,
              },
            ]}
          >
            <Typography
              size={12}
              lineHeight={17}
              color="rgba(255,255,255,0.6)"
              fFamily="barlowBold700"
              style={styles.sectionLabel}
            >
              Primary Miss
            </Typography>
            <Typography fFamily="barlowBold700" size={24} lineHeight={31} color={primary.accent} mT={4}>
              {primary.name}
            </Typography>
            <Typography size={14} lineHeight={21} color="rgba(255,255,255,0.7)" mT={8}>
              Suggested fix: {primary.drillTitle}
            </Typography>
          </View>
        ) : null}

        {totalMisses > 0 ? (
          <View style={styles.breakdownCard}>
            <Typography
              size={12}
              lineHeight={17}
              color="#999999"
              fFamily="barlowBold700"
              style={styles.sectionLabel}
              mB={12}
            >
              Miss Breakdown
            </Typography>
            {breakdown.map(({ cat, count, pct }) => (
              <View key={cat.id} style={styles.breakdownRow}>
                <View style={styles.breakdownHeader}>
                  <View style={styles.breakdownLeft}>
                    <Icon name={cat.icon} iconFamily="Ionicons" size={16} color={cat.accent} />
                    <Typography fFamily="barlowMedium500" size={14} lineHeight={21} color={COLORS.white100} mL={8}>
                      {cat.short}
                    </Typography>
                  </View>
                  <Typography fFamily="barlowMedium500" size={14} lineHeight={21} color="rgba(255,255,255,0.7)">
                    {count} ({pct}%)
                  </Typography>
                </View>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${pct}%`,
                        backgroundColor: BAR_FILL[cat.accent] || COLORS.primary,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        ) : null}

        <TouchableOpacity style={styles.fixBtn} activeOpacity={0.88} onPress={fixThisNow}>
          <Typography fFamily="barlowBold700" size={20} lineHeight={26} color={COLORS.white100}>
            Fix This Now
          </Typography>
          <Icon name="arrow-forward" iconFamily="Ionicons" size={24} color={COLORS.white100} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeBtn} activeOpacity={0.88} onPress={closeAndHome}>
          <Icon name="home-outline" iconFamily="Ionicons" size={18} color={COLORS.white100} />
          <Typography fFamily="barlowMedium500" size={14} lineHeight={21} color={COLORS.white100} mL={8}>
            Back to Field Home
          </Typography>
        </TouchableOpacity>
      </ScrollView>
    </CourseLayout>
  );
};

export default CourseRoundSummaryScreen;

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
    alignItems: 'center',
  },
  primaryMissCard: {
    borderRadius: Sizer.hSize(12),
    borderWidth: 2,
    padding: Sizer.hSize(20),
  },
  breakdownCard: {
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
    padding: Sizer.hSize(20),
    gap: Sizer.vSize(12),
  },
  breakdownRow: {
    marginBottom: Sizer.vSize(4),
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Sizer.vSize(4),
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barTrack: {
    height: Sizer.vSize(8),
    backgroundColor: COLORS.courseBorder,
    borderRadius: Sizer.vSize(4),
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: Sizer.vSize(4),
  },
  fixBtn: {
    width: '100%',
    height: Sizer.vSize(64),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizer.hSize(8),
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
  },
});
