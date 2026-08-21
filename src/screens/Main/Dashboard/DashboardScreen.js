import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import { COLORS, RADIUS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';
import {
  navigateFromTabToStack,
  navigateFromTabToTab,
} from '../../../navigation/navigationHelpers';
import { useModeSwitch } from '../../../hooks/useModeSwitch';
import { useAppMode } from '../../../context/AppModeContext';
import { getMissCategory } from '../../../constants/missCategories';
import {
  LIBRARY_CORE_SECTIONS,
  LIBRARY_PORTAL_SECTIONS,
  MODE_LABELS,
} from '../../../constants/modeSections';
import EuropeanBadge from '../../../components/course/EuropeanBadge';

/**
 * CONTENT INVENTORY — ClayMaster-App-UI `Home.tsx`
 * Header: 1 (title "Library", showMenu, showNotification — no back)
 * Section: "Your Game Right Now" — Resume (active draft) OR primary miss OR Start a round
 * Training Library grid cards: 6+
 * Continue Training → Field Mode Practice Drills tab (PAGE 7.1.1)
 */
const DashboardScreen = ({ navigation }) => {
  const { activeRound, lastPrimaryMiss, setRoundPlaying } = useAppMode();
  const { switchToFieldMode } = useModeSwitch();
  const primary = getMissCategory(lastPrimaryMiss);
  const hasActiveDraft = !!(activeRound?.roundId && !activeRound?.finished);

  /** Resume play without switching APP_MODE to Field — reload stays Library unless Pause. */
  const resumeRound = () => {
    setRoundPlaying(true);
    navigateFromTabToStack(navigation, 'CourseRoundScreen');
  };

  /** Start a new round intentionally enters Field Mode. */
  const startRound = () => {
    switchToFieldMode('CourseHomeScreen');
  };

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title={MODE_LABELS.library}
        showMenu
        showNotification
        showModeIndicator
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={[styles.section, styles.gameSection]}>
          <View style={styles.sectionHeadingRow}>
            <Icon name="sparkles-outline" iconFamily="Ionicons" size={16} color={COLORS.primary} />
            <Typography fFamily="barlowSemiBold600" size={20} lineHeight={26} color={COLORS.textPrimary} mL={8}>
              Your Game Right Now
            </Typography>
          </View>

          {hasActiveDraft ? (
            <TouchableOpacity
              style={styles.resumeCard}
              onPress={resumeRound}
              activeOpacity={0.88}
            >
              <View style={styles.resumeIcon}>
                <Icon name="locate" iconFamily="Ionicons" size={22} color={COLORS.white100} />
              </View>
              <View style={styles.resumeText}>
                <View style={styles.resumeTitleRow}>
                  <Typography
                    fFamily="barlowBold700"
                    size={14}
                    lineHeight={21}
                    color={COLORS.white100}
                    style={{ flexShrink: 1 }}
                    numberOfLines={1}
                  >
                    Resume Round
                  </Typography>
                  {activeRound.european_rotation ? (
                    <EuropeanBadge variant="library" style={styles.resumeEu} />
                  ) : null}
                </View>
                <Typography size={12} lineHeight={17} color="rgba(255,255,255,0.7)" mT={2}>
                  {activeRound.course_name || 'Round'} · Station{' '}
                  {activeRound.currentStation}
                </Typography>
              </View>
              <Icon
                name="chevron-forward"
                iconFamily="Ionicons"
                size={20}
                color="rgba(255,255,255,0.6)"
              />
            </TouchableOpacity>
          ) : primary ? (
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
                Use the digital scorecard to record your 100-target practice round.
              </Typography>
              <TouchableOpacity
                onPress={startRound}
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
          <Typography fFamily="barlowSemiBold600" size={20} lineHeight={26} color={COLORS.textPrimary} mB={4}>
            Core Training
          </Typography>
          <Typography size={12} lineHeight={17} color={COLORS.textSecondary} mB={12}>
            Same order as {MODE_LABELS.field}
          </Typography>
          <View style={styles.grid}>
            {LIBRARY_CORE_SECTIONS.map(s => (
              <TouchableOpacity
                key={s.label}
                style={styles.gridCard}
                onPress={() => {
                  if (s.action === 'tab' && s.tab) {
                    navigateFromTabToTab(navigation, s.tab);
                  } else {
                    navigateFromTabToStack(navigation, s.screen);
                  }
                }}
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

        <View style={styles.section}>
          <Typography fFamily="barlowSemiBold600" size={20} lineHeight={26} color={COLORS.textPrimary} mB={12}>
            Portal
          </Typography>
          <View style={styles.grid}>
            {LIBRARY_PORTAL_SECTIONS.map(s => (
              <TouchableOpacity
                key={s.label}
                style={styles.gridCard}
                onPress={() => {
                  if (s.action === 'tab' && s.tab) {
                    navigateFromTabToTab(navigation, s.tab);
                  } else {
                    navigateFromTabToStack(navigation, s.screen, s.params);
                  }
                }}
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
  /** "Your Game Right Now" — first section under header */
  gameSection: {
    marginTop: 0,
    paddingTop: 0,
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
  resumeCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.textPrimary,
    borderRadius: Sizer.hSize(RADIUS.md),
    padding: Sizer.hSize(SPACING.cardP),
    gap: Sizer.hSize(12),
  },
  resumeIcon: {
    width: Sizer.hSize(44),
    height: Sizer.hSize(44),
    borderRadius: Sizer.hSize(22),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumeText: { flex: 1, minWidth: 0 },
  resumeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resumeEu: {
    marginLeft: Sizer.hSize(8),
  },
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
