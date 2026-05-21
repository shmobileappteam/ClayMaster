import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';
import { navigateFromTabToStack } from '../../../navigation/navigationHelpers';
import { useAppMode } from '../../../context/AppModeContext';
import { getMissCategory } from '../../../constants/missCategories';

const CORE_SECTIONS = [
  { label: 'Analytics', desc: 'Trends & insights', icon: 'stats-chart-outline', screen: 'AnalyticsDashboard' },
  { label: 'Instructional Videos', desc: "Kevin & Bill's library", icon: 'play-circle-outline', screen: 'InstructionalVideosScreen' },
  { label: 'Practice Drills', desc: 'Focused exercises', icon: 'locate-outline', screen: 'DrillsScreen' },
  { label: 'On-line Coaching', desc: 'Book a session', icon: 'people-outline', screen: 'CoachingScreen' },
  { label: 'Private Community', desc: 'Connect & share', icon: 'chatbubbles-outline', screen: 'CommunityScreen' },
  { label: 'Monthly Webcasts', desc: 'Live sessions', icon: 'radio-outline', screen: 'WebcastScreen' },
];

const CONTINUE_TRAINING = [
  {
    label: 'Mastering the Tower Shot',
    desc: 'Last watched · 4:12 of 12:30',
    icon: 'play',
    screen: 'VideoDetailScreen',
    iconFilled: true,
  },
  {
    label: 'Late Trigger Correction',
    desc: 'Drill in progress · 2 of 5 steps',
    icon: 'locate-outline',
    screen: 'DrillDetailScreen',
  },
];

/**
 * CONTENT INVENTORY — ClayMaster-App-UI `Home.tsx`
 * Header: 1 (title "Library", showMenu, showNotification — no back)
 * CTAs: 1 course-switch row
 * Section labels: 3 ("Your Game Right Now", "Continue Training", "Training Library")
 * Continue Training rows: 2
 * Training Library grid cards: 6
 * Conditional issue card: 1 (when primary miss exists) OR empty-state card: 1
 */
const DashboardScreen = ({ navigation }) => {
  const { setMode, activeRound, lastPrimaryMiss } = useAppMode();
  const primary = getMissCategory(lastPrimaryMiss);

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader title="Library" showMenu showNotification />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* w-full bg-foreground rounded-lg p-4 flex-row items-center gap-3 */}
        <TouchableOpacity
          style={styles.courseSwitch}
          activeOpacity={0.88}
          onPress={() => {
            setMode('course');
            const target =
              activeRound && !activeRound.finished
                ? 'CourseRoundScreen'
                : 'CourseHomeScreen';
            navigateFromTabToStack(navigation, target);
          }}
        >
          <View style={styles.courseSwitchIcon}>
            <Icon name="locate" iconFamily="Ionicons" size={22} color={COLORS.white100} />
          </View>
          <View style={styles.courseSwitchText}>
            <Typography fFamily="barlowBold700" size={14} lineHeight={21} color={COLORS.white100}>
              {activeRound && !activeRound.finished ? 'Resume Round' : 'On the Course'}
            </Typography>
            <Typography size={12} lineHeight={17} color="rgba(255,255,255,0.7)" mT={2}>
              {activeRound && !activeRound.finished
                ? `Station ${activeRound.currentStation}`
                : 'Switch to Field Mode'}
            </Typography>
          </View>
          <Icon name="chevron-forward" iconFamily="Ionicons" size={20} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>

        <View style={[styles.section, styles.gameSection]}>
          <View style={styles.sectionHeadingRow}>
            <Icon name="sparkles-outline" iconFamily="Ionicons" size={16} color={COLORS.primary} />
            <Typography fFamily="barlowSemiBold600" size={20} lineHeight={26} color={COLORS.textPrimary} mL={8}>
              Your Game Right Now
            </Typography>
          </View>

          {primary ? (
            <View
              style={[
                styles.issueCard,
                {
                  backgroundColor: primary.colorBg,
                  borderColor: primary.colorBorder,
                },
              ]}
            >
              <Typography
                size={12}
                lineHeight={17}
                color={COLORS.textSecondary}
                fFamily="barlowBold700"
                style={styles.uppercase}
              >
                Primary Issue
              </Typography>
              <View style={styles.issueTitleRow}>
                <Icon name={primary.icon} iconFamily="Ionicons" size={22} color={primary.accent} />
                <Typography fFamily="barlowBold700" size={20} lineHeight={26} color={primary.accent} mL={8}>
                  {primary.name}
                </Typography>
              </View>
              <View style={styles.suggestedFixRow}>
                <Typography size={14} lineHeight={21} color={COLORS.textSecondary}>
                  Suggested fix:{' '}
                </Typography>
                <Typography fFamily="barlowSemiBold600" size={14} lineHeight={21} color={COLORS.textPrimary}>
                  {primary.drillTitle}
                </Typography>
              </View>
              {/* flex gap-2 mt-4 — two equal-width buttons in a row (NOT stacked) */}
              <View style={styles.issueActions}>
                <TouchableOpacity
                  style={styles.issuePrimaryBtn}
                  onPress={() => navigateFromTabToStack(navigation, 'DrillsScreen')}
                  activeOpacity={0.88}
                >
                  <Typography fFamily="barlowSemiBold600" size={14} color={COLORS.white100}>
                    Open Drill
                  </Typography>
                  <Icon name="arrow-forward" iconFamily="Ionicons" size={16} color={COLORS.white100} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.issueOutlineBtn}
                  onPress={() => navigateFromTabToStack(navigation, 'InstructionalVideosScreen')}
                  activeOpacity={0.88}
                >
                  <Typography fFamily="barlowSemiBold600" size={14} color={COLORS.primary}>
                    Watch Video
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.issueEmptyCard}>
              <Typography size={14} lineHeight={21} color={COLORS.textSecondary} textAlign="center">
                Log a round in Field Mode to see your personalized fix here.
              </Typography>
              <TouchableOpacity
                onPress={() => {
                  setMode('course');
                  navigateFromTabToStack(navigation, 'CourseHomeScreen');
                }}
                activeOpacity={0.88}
                style={styles.startRoundLink}
              >
                <Typography fFamily="barlowSemiBold600" size={12} color={COLORS.primary}>
                  Start a round →
                </Typography>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Typography fFamily="barlowSemiBold600" size={20} lineHeight={26} color={COLORS.textPrimary} mB={12}>
            Continue Training
          </Typography>
          <View style={styles.continueList}>
            {CONTINUE_TRAINING.map(item => (
              <TouchableOpacity
                key={item.label}
                style={styles.continueRow}
                onPress={() => navigateFromTabToStack(navigation, item.screen)}
                activeOpacity={0.88}
              >
                <View style={styles.continueIcon}>
                  <Icon
                    name={item.icon}
                    iconFamily="Ionicons"
                    size={20}
                    color={COLORS.primary}
                  />
                </View>
                <View style={styles.continueText}>
                  <Typography fFamily="barlowSemiBold600" size={14} lineHeight={21} color={COLORS.textPrimary}>
                    {item.label}
                  </Typography>
                  <Typography size={12} lineHeight={17} color={COLORS.textSecondary} mT={2}>
                    {item.desc}
                  </Typography>
                </View>
                <Icon name="chevron-forward" iconFamily="Ionicons" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Typography fFamily="barlowSemiBold600" size={20} lineHeight={26} color={COLORS.textPrimary} mB={12}>
            Training Library
          </Typography>
          <View style={styles.grid}>
            {CORE_SECTIONS.map(s => (
              <TouchableOpacity
                key={s.label}
                style={styles.gridCard}
                onPress={() => navigateFromTabToStack(navigation, s.screen)}
                activeOpacity={0.88}
              >
                <View style={styles.gridIcon}>
                  <Icon name={s.icon} iconFamily="Ionicons" size={20} color={COLORS.primary} />
                </View>
                <Typography fFamily="barlowSemiBold600" size={14} lineHeight={18} color={COLORS.textPrimary}>
                  {s.label}
                </Typography>
                <Typography size={12} lineHeight={17} color={COLORS.textSecondary} mT={2}>
                  {s.desc}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  // px-screen-px py-4 → paddingHorizontal 16, paddingTop 16; pb for tab bar
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(100),
  },
  section: {
    marginBottom: Sizer.vSize(SPACING.section),
  },
  /** Extra space above "Your Game Right Now" after course switch (web space-y-section) */
  gameSection: {
    marginTop: Sizer.vSize(SPACING.md),
    paddingTop: Sizer.vSize(SPACING.component),
  },
  suggestedFixRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Sizer.vSize(8),
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizer.vSize(SPACING.component),
  },
  // w-full bg-foreground (#1A1A1A) rounded-lg (12) p-4 (16) flex-row gap-3 (12)
  courseSwitch: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.textPrimary,
    borderRadius: Sizer.hSize(RADIUS.md),
    padding: Sizer.hSize(SPACING.cardP),
    gap: Sizer.hSize(12),
  },
  // w-11 h-11 (44) rounded-full bg-cm-orange
  courseSwitchIcon: {
    width: Sizer.hSize(44),
    height: Sizer.hSize(44),
    borderRadius: Sizer.hSize(22),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  courseSwitchText: { flex: 1, minWidth: 0 },
  uppercase: { letterSpacing: 1.5, textTransform: 'uppercase' },
  // rounded-lg border-2 p-card-p (16)
  issueCard: {
    borderRadius: Sizer.hSize(RADIUS.md),
    borderWidth: 2,
    padding: Sizer.hSize(SPACING.cardP),
  },
  issueTitleRow: { flexDirection: 'row', alignItems: 'center', marginTop: Sizer.vSize(4) },
  // flex gap-2 mt-4 — horizontal pair, each flex-1 h-11 (44)
  issueActions: {
    flexDirection: 'row',
    gap: Sizer.hSize(8),
    marginTop: Sizer.vSize(16),
  },
  issuePrimaryBtn: {
    flex: 1,
    height: Sizer.vSize(44),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(RADIUS.md),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizer.hSize(4),
  },
  issueOutlineBtn: {
    flex: 1,
    height: Sizer.vSize(44),
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: Sizer.hSize(RADIUS.md),
    alignItems: 'center',
    justifyContent: 'center',
  },
  // rounded-lg border border-cm-border p-card-p bg-card text-center
  issueEmptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: Sizer.hSize(RADIUS.md),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderMuted,
    padding: Sizer.hSize(SPACING.cardP),
    alignItems: 'center',
  },
  startRoundLink: { marginTop: Sizer.vSize(12) },
  // space-y-component (12) between full-width rows
  continueList: { gap: Sizer.vSize(SPACING.component) },
  // w-full bg-card rounded-lg p-card-p border flex-row gap-3
  continueRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: Sizer.hSize(RADIUS.md),
    padding: Sizer.hSize(SPACING.cardP),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderMuted,
    gap: Sizer.hSize(12),
    ...SHADOWS.card,
  },
  // w-11 h-11 rounded-full bg-cm-orange-light
  continueIcon: {
    width: Sizer.hSize(44),
    height: Sizer.hSize(44),
    borderRadius: Sizer.hSize(22),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: { flex: 1, minWidth: 0 },
  // grid grid-cols-2 gap-component (12)
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizer.hSize(SPACING.component),
  },
  // bg-card rounded-lg p-4 border text-left; ~50% width in 2-col grid
  gridCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: Sizer.hSize(RADIUS.md),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderMuted,
    padding: Sizer.hSize(SPACING.cardP),
  },
  // w-10 h-10 (40) rounded-full bg-cm-orange-light mb-2 (8)
  gridIcon: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    borderRadius: Sizer.hSize(20),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizer.vSize(8),
  },
});
