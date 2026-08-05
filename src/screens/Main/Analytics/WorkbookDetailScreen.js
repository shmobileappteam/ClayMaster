import React, { useMemo } from 'react';
import {
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import { Container, Typography, AppLoader } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import Icon from '../../../helpers/Icon';
import { COLORS, GLOBALSTYLE, SHADOWS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useRequireLibraryMode } from '../../../hooks/useRequireLibraryMode';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { getWorkbook, getWorkbooks } from '../../../api/academyService';
import {
  mapWorkbook,
  openRemoteFile,
} from '../../../constants/academy';
import { showMessage } from '../../../utils';

const htmlTagsStyles = {
  body: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Barlow-Regular',
  },
  h3: {
    color: COLORS.textPrimary,
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'Barlow-Bold',
    marginTop: 0,
    marginBottom: 10,
  },
  span: {
    color: COLORS.textPrimary,
  },
  ul: {
    marginTop: 4,
    marginBottom: 8,
    paddingLeft: 8,
  },
  li: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
    fontFamily: 'Barlow-Regular',
  },
  p: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
};

const WorkbookDetailScreen = ({ navigation, route }) => {
  const blocked = useRequireLibraryMode();
  const { width } = useWindowDimensions();
  const contentWidth = width - Sizer.hSize(SPACING.screenPx) * 2 - Sizer.hSize(SPACING.cardP) * 2;
  const routeWorkbookId = route?.params?.workbookId ?? route?.params?.id;

  const listQuery = useCustomQuery({
    queryKey: ['workbooks'],
    queryFn: getWorkbooks,
    enabled: !routeWorkbookId,
  });

  console.log('listQuery', listQuery);

  const listFeaturedId = useMemo(() => {
    const items = (listQuery.data?.items || []).map(mapWorkbook).filter(Boolean);
    const unlocked = items.filter(w => !w.locked);
    return (unlocked[0] || items[0])?.id ?? null;
  }, [listQuery.data?.items]);

  const workbookId = routeWorkbookId || listFeaturedId;

  const detailQuery = useCustomQuery({
    queryKey: ['workbook', workbookId],
    queryFn: () => getWorkbook(workbookId),
    enabled: Boolean(workbookId),
  });

  const workbook = useMemo(() => {
    if (detailQuery.data) {
      return mapWorkbook(detailQuery.data);
    }
    if (!routeWorkbookId && listQuery.data?.items) {
      const items = listQuery.data.items.map(mapWorkbook).filter(Boolean);
      const unlocked = items.filter(w => !w.locked);
      return unlocked[0] || items[0] || null;
    }
    return null;
  }, [detailQuery.data, listQuery.data?.items, routeWorkbookId]);

  const isLoading =
    (!routeWorkbookId && listQuery.isLoading) ||
    (Boolean(workbookId) && detailQuery.isLoading && !workbook);
  const isError = routeWorkbookId
    ? detailQuery.isError
    : listQuery.isError && !workbook;
  const isFetching = listQuery.isFetching || detailQuery.isFetching;

  const refetch = () => {
    if (!routeWorkbookId) listQuery.refetch();
    if (workbookId) detailQuery.refetch();
  };

  if (blocked) {
    return null;
  }

  const ensureWorkbookAccess = wb => {
    if (wb?.locked) {
      showMessage({
        type: 'danger',
        title: 'Locked workbook',
        message: 'Upgrade your plan to access this workbook.',
        duration: 3500,
      });
      return false;
    }
    if (!wb?.fileUrl) {
      showMessage({
        type: 'danger',
        title: 'Unavailable',
        message: 'No file is available for this workbook.',
      });
      return false;
    }
    return true;
  };

  const downloadWorkbook = wb => {
    if (!ensureWorkbookAccess(wb)) return;
    // Same as scorecard / drills Download — open file URL in system handler
    openRemoteFile(wb.fileUrl, Linking, showMessage);
  };

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Workbooks"
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor={COLORS.primary}
          />
        }
      >
        {isLoading ? (
          <AppLoader />
        ) : isError ? (
          <TouchableOpacity onPress={refetch}>
            <Typography color={COLORS.primary} fFamily="barlowSemiBold600">
              Could not load workbook. Tap to retry.
            </Typography>
          </TouchableOpacity>
        ) : !workbook ? (
          <Typography color={COLORS.textSecondary}>No workbooks yet.</Typography>
        ) : (
          <View style={[GLOBALSTYLE.screenCard, styles.overview]}>
            <View style={styles.overviewHeader}>
              <View style={styles.iconCircle}>
                <Icon
                  name="book-outline"
                  iconFamily="Ionicons"
                  size={28}
                  color={COLORS.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Typography
                  fFamily="barlowBold700"
                  size={22}
                  color={COLORS.textPrimary}
                >
                  {workbook.title}
                </Typography>
                <Typography size={13} color={COLORS.textSecondary} mT={4}>
                  {[
                    workbook.fileType || 'PDF',
                    workbook.locked ? 'Locked' : 'Available',
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </Typography>
              </View>
            </View>

            {workbook.descriptionHtml || workbook.description ? (
              <View style={styles.detailBlock}>
                {workbook.descriptionHtml ? (
                  <RenderHTML
                    contentWidth={contentWidth}
                    source={{ html: workbook.descriptionHtml }}
                    tagsStyles={htmlTagsStyles}
                    systemFonts={['Barlow-Regular', 'Barlow-Bold', 'Barlow-SemiBold']}
                  />
                ) : (
                  <Typography
                    size={14}
                    color={COLORS.textSecondary}
                    lineHeight={22}
                  >
                    {workbook.description}
                  </Typography>
                )}
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.continueBtn}
              activeOpacity={0.88}
              onPress={() => downloadWorkbook(workbook)}
              disabled={workbook.locked}
            >
              <Icon
                name={workbook.locked ? 'lock-closed-outline' : 'download-outline'}
                iconFamily="Ionicons"
                size={18}
                color={COLORS.white100}
              />
              <Typography fFamily="barlowSemiBold600" size={14} color={COLORS.white100} mL={8}>
                {workbook.locked ? 'Locked' : 'Download'}
              </Typography>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </Container>
  );
};

export default WorkbookDetailScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
  },
  overview: { padding: Sizer.hSize(SPACING.cardP), ...SHADOWS.card },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizer.hSize(12),
    marginBottom: Sizer.vSize(16),
  },
  iconCircle: {
    width: Sizer.hSize(56),
    height: Sizer.hSize(56),
    borderRadius: Sizer.hSize(28),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailBlock: {
    marginBottom: Sizer.vSize(20),
    paddingTop: Sizer.vSize(4),
  },
  continueBtn: {
    height: Sizer.vSize(48),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
