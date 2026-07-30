import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import Icon from '../../../helpers/Icon';
import { COLORS, GLOBALSTYLE, SHADOWS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useRequireLibraryMode } from '../../../hooks/useRequireLibraryMode';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { getWorkbooks } from '../../../api/academyService';
import { mapWorkbook, openRemoteFile } from '../../../constants/academy';
import { showMessage } from '../../../utils';

const WorkbookDetailScreen = ({ navigation }) => {
  const blocked = useRequireLibraryMode();

  const { data, isLoading, isError, isFetching, refetch } = useCustomQuery({
    queryKey: ['workbooks'],
    queryFn: getWorkbooks,
  });


  console.log('data', data);
  const workbooks = useMemo(
    () => (data?.items || []).map(mapWorkbook).filter(Boolean),
    [data?.items],
  );

  const unlocked = workbooks.filter(w => !w.locked);
  const featured = unlocked[0] || workbooks[0];

  if (blocked) {
    return null;
  }

  const openWorkbook = wb => {
    if (wb.locked || !wb.fileUrl) {
      showMessage({
        type: 'danger',
        title: 'Locked workbook',
        message: 'Upgrade your plan to access this workbook.',
        duration: 3500,
      });
      return;
    }
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
          <ActivityIndicator color={COLORS.primary} />
        ) : isError ? (
          <TouchableOpacity onPress={refetch}>
            <Typography color={COLORS.primary} fFamily="barlowSemiBold600">
              Could not load workbooks. Tap to retry.
            </Typography>
          </TouchableOpacity>
        ) : workbooks.length === 0 ? (
          <Typography color={COLORS.textSecondary}>No workbooks yet.</Typography>
        ) : (
          <>
            {featured ? (
              <View style={[GLOBALSTYLE.screenCard, styles.overview]}>
                <View style={styles.overviewHeader}>
                  <View style={styles.iconCircle}>
                    <Icon
                      name="book-outline"
                      iconFamily="Ionicons"
                      size={24}
                      color={COLORS.primary}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Typography
                      fFamily="barlowSemiBold600"
                      size={20}
                      color={COLORS.textPrimary}
                    >
                      {featured.title}
                    </Typography>
                    <Typography size={12} color={COLORS.textSecondary} mT={2}>
                      {[featured.fileType, featured.locked ? 'Locked' : null]
                        .filter(Boolean)
                        .join(' · ')}
                    </Typography>
                  </View>
                </View>
                {featured.description ? (
                  <Typography
                    size={13}
                    color={COLORS.textSecondary}
                    lineHeight={20}
                    mB={16}
                    numberOfLines={4}
                  >
                    {featured.description}
                  </Typography>
                ) : null}
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.continueBtn}
                    activeOpacity={0.88}
                    onPress={() => openWorkbook(featured)}
                  >
                    <Typography fFamily="barlowSemiBold600" size={14} color={COLORS.white100}>
                      {featured.locked ? 'Locked' : 'Open Workbook'}
                    </Typography>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconBtn}
                    activeOpacity={0.88}
                    onPress={() => openWorkbook(featured)}
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
            ) : null}

            <Typography fFamily="barlowSemiBold600" size={20} color={COLORS.textPrimary} mB={12}>
              All workbooks
            </Typography>
            <View style={[GLOBALSTYLE.screenCard, styles.chapterList]}>
              {workbooks.map((wb, i) => (
                <TouchableOpacity
                  key={wb.id}
                  style={[
                    styles.chapterRow,
                    i < workbooks.length - 1 && styles.chapterBorder,
                  ]}
                  activeOpacity={0.88}
                  onPress={() => openWorkbook(wb)}
                >
                  <Icon
                    name={wb.locked ? 'lock-closed-outline' : 'document-outline'}
                    iconFamily="Ionicons"
                    size={20}
                    color={wb.locked ? COLORS.textSecondary : COLORS.primary}
                  />
                  <View style={{ flex: 1, marginLeft: Sizer.hSize(12) }}>
                    <Typography
                      fFamily="barlowMedium500"
                      size={14}
                      color={COLORS.textPrimary}
                    >
                      {wb.title}
                    </Typography>
                    <Typography size={12} color={COLORS.textSecondary} mT={2}>
                      {[wb.fileType, wb.locked ? 'Upgrade to unlock' : null]
                        .filter(Boolean)
                        .join(' · ')}
                    </Typography>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
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
    gap: Sizer.vSize(SPACING.section),
  },
  overview: { padding: Sizer.hSize(SPACING.cardP), ...SHADOWS.card },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
    marginBottom: Sizer.vSize(16),
  },
  iconCircle: {
    width: Sizer.hSize(48),
    height: Sizer.hSize(48),
    borderRadius: Sizer.hSize(24),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: { flexDirection: 'row', gap: Sizer.hSize(12) },
  continueBtn: {
    flex: 1,
    height: Sizer.vSize(48),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    width: Sizer.hSize(48),
    height: Sizer.vSize(48),
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterList: { padding: 0, overflow: 'hidden' },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizer.hSize(SPACING.cardP),
    paddingVertical: Sizer.vSize(16),
  },
  chapterBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.borderMuted,
  },
});
