import React, { useMemo } from 'react';
import {
  ActivityIndicator,
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
import { mapPracticeDrill } from '../../../constants/academy';
import { showMessage } from '../../../utils';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { getPracticeDrills } from '../../../api/academyService';

/** Practice drills list → tap opens in-app PDF viewer. */
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
          Tap a drill to open the PDF.
        </Typography>

        {isLoading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : isError ? (
          <TouchableOpacity onPress={refetch}>
            <Typography color={COLORS.primary} fFamily="barlowSemiBold600">
              Could not load drills. Tap to retry.
            </Typography>
          </TouchableOpacity>
        ) : drills.length === 0 ? (
          <Typography color={COLORS.textSecondary}>No practice drills yet.</Typography>
        ) : (
          drills.map(drill => (
            <TouchableOpacity
              key={drill.id}
              style={[GLOBALSTYLE.screenCard, styles.drillCard]}
              activeOpacity={0.88}
              onPress={() => openPdf(drill)}
            >
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
              <Icon
                name="chevron-forward"
                iconFamily="Ionicons"
                size={18}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
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
  drillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Sizer.hSize(SPACING.cardP),
    gap: Sizer.hSize(12),
    ...SHADOWS.card,
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
});
