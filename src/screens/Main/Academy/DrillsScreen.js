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
import { mapPracticeDrill, openRemoteFile } from '../../../constants/academy';
import { showMessage } from '../../../utils';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { getPracticeDrills } from '../../../api/academyService';

/** Practice drills list — View (PDF) + Download (system open). */
const DrillsScreen = ({ navigation }) => {
  const blocked = useRequireLibraryMode();

  const { data, isLoading, isError, isFetching, refetch } = useCustomQuery({
    queryKey: ['practiceDrills'],
    queryFn: getPracticeDrills,
  });

  const drills = useMemo(
    () => (data?.items || []).map(mapPracticeDrill).filter(Boolean),
    [data?.items],
  );

  if (blocked) {
    return null;
  }

  const openPdf = drill => {
    if (!drill.fileUrl) {
      showMessage({
        type: 'danger',
        title: 'Unavailable',
        message: 'No PDF is available for this drill.',
        duration: 3000,
      });
      return;
    }
    navigation.navigate('DrillDetailScreen', { drill });
  };

  const downloadPdf = drill => {
    openRemoteFile(drill.fileUrl, Linking, showMessage);
  };

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Practice Drills"
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
        <Typography size={14} color={COLORS.textSecondary} mB={12}>
          View or download each drill PDF.
        </Typography>

        {isLoading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : isError ? (
          <View style={styles.errorBox}>
            <Typography color={COLORS.textSecondary} textAlign="center" mB={12}>
              Could not load drills. You may need an active subscription.
            </Typography>
            <TouchableOpacity onPress={refetch}>
              <Typography
                color={COLORS.primary}
                fFamily="barlowSemiBold600"
                textAlign="center"
              >
                Tap to retry
              </Typography>
            </TouchableOpacity>
          </View>
        ) : drills.length === 0 ? (
          <Typography color={COLORS.textSecondary}>No practice drills yet.</Typography>
        ) : (
          drills.map(drill => (
            <View key={drill.id} style={[GLOBALSTYLE.screenCard, styles.drillCard]}>
              <View style={styles.drillHeader}>
                <View style={styles.iconCircle}>
                  <Icon
                    name="document-text-outline"
                    iconFamily="Ionicons"
                    size={22}
                    color={COLORS.primary}
                  />
                </View>
                <View style={styles.drillText}>
                  <Typography fFamily="barlowSemiBold600" size={14} color={COLORS.textPrimary}>
                    {drill.title}
                  </Typography>
                  <Typography size={12} color={COLORS.textSecondary} mT={4}>
                    {drill.fileType?.toUpperCase() || 'PDF'}
                  </Typography>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.viewBtn}
                  activeOpacity={0.88}
                  onPress={() => openPdf(drill)}
                >
                  <Icon
                    name="eye-outline"
                    iconFamily="Ionicons"
                    size={14}
                    color={COLORS.white100}
                  />
                  <Typography
                    fFamily="barlowSemiBold600"
                    size={12}
                    color={COLORS.white100}
                    mL={6}
                  >
                    View
                  </Typography>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.downloadBtn}
                  activeOpacity={0.88}
                  onPress={() => downloadPdf(drill)}
                >
                  <Icon
                    name="download-outline"
                    iconFamily="Ionicons"
                    size={14}
                    color={COLORS.textPrimary}
                  />
                  <Typography
                    fFamily="barlowSemiBold600"
                    size={12}
                    color={COLORS.textPrimary}
                    mL={6}
                  >
                    Download
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </Container>
  );
};

export default DrillsScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(SPACING.component),
  },
  errorBox: {
    paddingVertical: Sizer.vSize(24),
    paddingHorizontal: Sizer.hSize(12),
    alignItems: 'center',
  },
  drillCard: {
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
  drillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
  },
  drillText: { flex: 1, minWidth: 0 },
  iconCircle: {
    width: Sizer.hSize(44),
    height: Sizer.hSize(44),
    borderRadius: Sizer.hSize(22),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: Sizer.hSize(10),
    marginTop: Sizer.vSize(12),
  },
  viewBtn: {
    flex: 1,
    height: Sizer.vSize(36),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadBtn: {
    flex: 1,
    height: Sizer.vSize(36),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderMuted,
    borderRadius: Sizer.hSize(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
});
