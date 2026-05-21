import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
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
import {
  navigateFromTabToStack,
  navigateFromTabToTab,
} from '../../../navigation/navigationHelpers';

/** ClayMaster-App-UI `Analytics.tsx` — Explore, workbooks, schedule row */
const EXPLORE_ITEMS = [
  {
    label: 'Video Tutorials',
    desc: 'Instructional training videos',
    icon: 'play-circle-outline',
    screen: 'InstructionalVideosScreen',
  },
  {
    label: 'Workbooks',
    desc: 'Classic & Pro analytics workbooks',
    icon: 'book-outline',
    screen: 'WorkbookDetailScreen',
  },
  {
    label: 'Managed Service',
    desc: 'Personalized coaching analytics',
    icon: 'headset-outline',
    screen: 'ManagedServiceScreen',
  },
  {
    label: 'Tournament Analytics',
    desc: 'Competition stats & rankings',
    icon: 'trophy-outline',
    tab: 'Tournament',
  },
];

const AnalyticsDashboard = ({ navigation }) => {
  const go = screen => navigateFromTabToStack(navigation, screen);

  const onExplorePress = item => {
    if (item.tab) {
      navigateFromTabToTab(navigation, item.tab);
      return;
    }
    go(item.screen);
  };

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader title="Analytics" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Explore */}
        <View style={styles.section}>
          <Typography
            fFamily={TYPE.h2.fFamily}
            size={TYPE.h2.size}
            lineHeight={TYPE.h2.lineHeight}
            color={COLORS.textPrimary}
            mB={SPACING.component}
          >
            Explore
          </Typography>
          <View style={[GLOBALSTYLE.screenCard, styles.listCard]}>
            {EXPLORE_ITEMS.map((item, i) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.listRow, i < EXPLORE_ITEMS.length - 1 && styles.listBorder]}
                onPress={() => onExplorePress(item)}
                activeOpacity={0.88}
              >
                <View style={styles.listIconSm}>
                  <Icon
                    name={item.icon}
                    iconFamily="Ionicons"
                    size={20}
                    color={COLORS.primary}
                  />
                </View>
                <View style={styles.listText}>
                  <Typography
                    fFamily="barlowSemiBold600"
                    size={TYPE.body.size}
                    color={COLORS.textPrimary}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    size={TYPE.caption.size}
                    color={COLORS.textSecondary}
                    mT={2}
                  >
                    {item.desc}
                  </Typography>
                </View>
                <Icon
                  name="chevron-forward"
                  iconFamily="Ionicons"
                  size={18}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Classic Workbook — entire card tappable (web: single button) */}
        <TouchableOpacity
          style={[GLOBALSTYLE.screenCard, styles.workbookCard]}
          onPress={() => go('WorkbookDetailScreen')}
          activeOpacity={0.88}
        >
          <View style={styles.workbookHeader}>
            <View style={styles.listIconLg}>
              <Icon
                name="book-outline"
                iconFamily="Ionicons"
                size={22}
                color={COLORS.primary}
              />
            </View>
            <View>
              <Typography
                fFamily={TYPE.h3.fFamily}
                size={TYPE.h3.size}
                color={COLORS.textPrimary}
              >
                Classic Workbook
              </Typography>
              <Typography
                size={TYPE.caption.size}
                color={COLORS.primary}
                fFamily="barlowMedium500"
                mT={2}
              >
                Unlocked
              </Typography>
            </View>
          </View>
          <View style={styles.workbookActions}>
            <View style={styles.openBtn}>
              <Typography
                fFamily="barlowSemiBold600"
                size={TYPE.body.size}
                color={COLORS.white100}
              >
                Open
              </Typography>
            </View>
            <View style={styles.downloadBtn}>
              <Icon
                name="download-outline"
                iconFamily="Ionicons"
                size={20}
                color={COLORS.textSecondary}
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* Pro Workbook — locked overlay (web: non-interactive card) */}
        <View style={[GLOBALSTYLE.screenCard, styles.workbookCard, styles.proWrap]}>
          <View style={styles.lockedOverlay} pointerEvents="box-none">
            <Icon
              name="lock-closed-outline"
              iconFamily="Ionicons"
              size={28}
              color={COLORS.textSecondary}
            />
            <Typography
              fFamily="barlowMedium500"
              size={TYPE.body.size}
              color={COLORS.textSecondary}
              mT={8}
            >
              Upgrade to Pro
            </Typography>
          </View>
          <View style={styles.workbookHeader}>
            <View style={styles.listIconLg}>
              <Icon
                name="book-outline"
                iconFamily="Ionicons"
                size={22}
                color={COLORS.primary}
              />
            </View>
            <View>
              <Typography
                fFamily={TYPE.h3.fFamily}
                size={TYPE.h3.size}
                color={COLORS.textPrimary}
              >
                Pro Workbook
              </Typography>
              <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mT={2}>
                Locked
              </Typography>
            </View>
          </View>
          <View style={styles.workbookActions}>
            <View style={[styles.openBtn, styles.openBtnMuted]}>
              <Typography
                fFamily="barlowSemiBold600"
                size={TYPE.body.size}
                color={COLORS.textSecondary}
              >
                Open
              </Typography>
            </View>
            <View style={styles.downloadBtn}>
              <Icon
                name="download-outline"
                iconFamily="Ionicons"
                size={20}
                color={COLORS.textSecondary}
              />
            </View>
          </View>
        </View>

        {/* Schedule Analytics Session → web /book-session */}
        <TouchableOpacity
          style={[GLOBALSTYLE.screenCard, styles.scheduleRow]}
          onPress={() => go('AnalyticsScheduleScreen')}
          activeOpacity={0.88}
        >
          <View style={styles.listIconLg}>
            <Icon
              name="calendar-outline"
              iconFamily="Ionicons"
              size={22}
              color={COLORS.primary}
            />
          </View>
          <Typography
            fFamily="barlowSemiBold600"
            size={TYPE.body.size}
            color={COLORS.textPrimary}
            style={{ flex: 1 }}
          >
            Schedule Analytics Session
          </Typography>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
};

export default AnalyticsDashboard;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(100),
    gap: Sizer.vSize(SPACING.section),
  },
  section: {},
  listCard: {
    padding: 0,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizer.hSize(SPACING.cardP),
    paddingVertical: Sizer.vSize(16),
    gap: Sizer.hSize(12),
  },
  listBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.borderMuted,
  },
  /** Web w-10 h-10 */
  listIconSm: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    borderRadius: Sizer.hSize(20),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  /** Web w-11 h-11 */
  listIconLg: {
    width: Sizer.hSize(44),
    height: Sizer.hSize(44),
    borderRadius: Sizer.hSize(22),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listText: { flex: 1, minWidth: 0 },
  workbookCard: {
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
  proWrap: {
    overflow: 'hidden',
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workbookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
    marginBottom: Sizer.vSize(16),
  },
  workbookActions: {
    flexDirection: 'row',
    gap: Sizer.hSize(12),
  },
  /** Web h-10 */
  openBtn: {
    flex: 1,
    height: Sizer.vSize(40),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  openBtnMuted: {
    backgroundColor: '#F5F5F5',
  },
  downloadBtn: {
    width: Sizer.hSize(40),
    height: Sizer.vSize(40),
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Sizer.hSize(SPACING.cardP),
    gap: Sizer.hSize(12),
    ...SHADOWS.card,
  },
});
