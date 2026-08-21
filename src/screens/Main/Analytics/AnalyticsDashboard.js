import React, { useMemo } from 'react';
import {
  Linking,
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
import {
  navigateFromTabToStack,
  navigateFromTabToTab,
} from '../../../navigation/navigationHelpers';
import { useRequireLibraryMode } from '../../../hooks/useRequireLibraryMode';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { getWorkbooks } from '../../../api/academyService';
import { mapWorkbook, openRemoteFile } from '../../../constants/academy';
import { showMessage } from '../../../utils';

/** ClayMaster-App-UI `Analytics.tsx` — Explore, workbooks, schedule row */
const EXPLORE_ITEMS = [
  {
    label: 'Video Tutorials',
    desc: 'Instructional training videos',
    icon: 'play-circle-outline',
    screen: 'InstructionalVideosScreen',
    params: { catalog: 'tutorial' },
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
    screen: 'VirtualTournamentScreen',
  },
];

const workbookCardTitle = workbook => {
  const title = String(workbook?.title || '').toLowerCase();
  if (title.includes('pro')) return 'Pro Workbook';
  if (title.includes('classic')) return 'Classic Workbook';
  // Fallback for the usual Classic (unlocked) / Pro (locked) pair
  return workbook?.locked ? 'Pro Workbook' : 'Classic Workbook';
};

const WorkbookCard = ({ workbook, onOpen, onDownload, onUpgrade }) => {
  const locked = Boolean(workbook.locked);
  const cardTitle = workbookCardTitle(workbook);

  if (locked) {
    return (
      <View style={[GLOBALSTYLE.screenCard, styles.workbookCard, styles.proWrap]}>
        <TouchableOpacity
          style={styles.lockedOverlay}
          onPress={onUpgrade}
          activeOpacity={0.9}
        >
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
        </TouchableOpacity>
        <View style={styles.workbookHeader}>
          <View style={styles.listIconLg}>
            <Icon
              name="book-outline"
              iconFamily="Ionicons"
              size={22}
              color={COLORS.primary}
            />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Typography
              fFamily={TYPE.h3.fFamily}
              size={TYPE.h3.size}
              color={COLORS.textPrimary}
              numberOfLines={2}
            >
              {cardTitle}
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
    );
  }

  return (
    <View style={[GLOBALSTYLE.screenCard, styles.workbookCard]}>
      <View style={styles.workbookHeader}>
        <View style={styles.listIconLg}>
          <Icon
            name="book-outline"
            iconFamily="Ionicons"
            size={22}
            color={COLORS.primary}
          />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Typography
            fFamily={TYPE.h3.fFamily}
            size={TYPE.h3.size}
            color={COLORS.textPrimary}
            numberOfLines={2}
          >
            {cardTitle}
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
        <TouchableOpacity style={styles.openBtn} onPress={onOpen} activeOpacity={0.88}>
          <Typography
            fFamily="barlowSemiBold600"
            size={TYPE.body.size}
            color={COLORS.white100}
          >
            Open
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={onDownload}
          activeOpacity={0.88}
        >
          <Icon
            name="download-outline"
            iconFamily="Ionicons"
            size={20}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AnalyticsDashboard = ({ navigation }) => {
  const blocked = useRequireLibraryMode();

  const {
    data: workbooksData,
    isLoading: loadingWorkbooks,
    isError: workbooksError,
    refetch: refetchWorkbooks,
  } = useCustomQuery({
    queryKey: ['workbooks'],
    queryFn: getWorkbooks,
  });

  const workbooks = useMemo(
    () => (workbooksData?.items || []).map(mapWorkbook).filter(Boolean),
    [workbooksData?.items],
  );

  if (blocked) {
    return null;
  }

  const go = (screen, params) =>
    navigateFromTabToStack(navigation, screen, params);

  const onExplorePress = item => {
    if (item.tab) {
      navigateFromTabToTab(navigation, item.tab);
      return;
    }
    go(item.screen, item.params);
  };

  const openWorkbook = wb => {
    go('WorkbookDetailScreen', { workbookId: wb.id });
  };

  const downloadWorkbook = wb => {
    if (!wb?.fileUrl) {
      showMessage({
        type: 'danger',
        title: 'Unavailable',
        message: 'No file is available for this workbook.',
      });
      return;
    }
    openRemoteFile(wb.fileUrl, Linking, showMessage);
  };

  const upgradePlan = () => go('SubscriptionScreen');

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader title="Analytics" showModeIndicator />

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

        {/* Workbooks — GET /api/workbooks */}
        {loadingWorkbooks && workbooks.length === 0 ? (
          <View style={styles.workbookLoading}>
            <AppLoader />
          </View>
        ) : workbooksError && workbooks.length === 0 ? (
          <TouchableOpacity
            style={[GLOBALSTYLE.screenCard, styles.workbookCard]}
            onPress={() => refetchWorkbooks()}
            activeOpacity={0.88}
          >
            <Typography color={COLORS.textSecondary} textAlign="center">
              Could not load workbooks. Tap to retry.
            </Typography>
          </TouchableOpacity>
        ) : workbooks.length === 0 ? (
          <View style={[GLOBALSTYLE.screenCard, styles.workbookCard]}>
            <Typography color={COLORS.textSecondary} textAlign="center">
              No workbooks yet.
            </Typography>
          </View>
        ) : (
          workbooks.map(wb => (
            <WorkbookCard
              key={wb.id}
              workbook={wb}
              onOpen={() => openWorkbook(wb)}
              onDownload={() => downloadWorkbook(wb)}
              onUpgrade={upgradePlan}
            />
          ))
        )}

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
  workbookLoading: {
    paddingVertical: Sizer.vSize(24),
    alignItems: 'center',
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
