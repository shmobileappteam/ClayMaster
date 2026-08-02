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
import {
  COLORS,
  GLOBALSTYLE,
  SHADOWS,
  SPACING,
  TYPE,
} from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { getMonthlyWebcasts } from '../../../api/academyService';
import { mapWebcast } from '../../../constants/academy';
import { useRequireLibraryMode } from '../../../hooks/useRequireLibraryMode';

/** ClayMaster-App-UI `MonthlyWebcasts.tsx` — recordings from API */
const WebcastScreen = ({ navigation, route }) => {
  const fieldOnlineAccess = route?.params?.fieldOnlineAccess === true;
  const blocked = useRequireLibraryMode({
    allowOnlineInField: fieldOnlineAccess,
  });

  const { data, isLoading, isError, isFetching, refetch } = useCustomQuery({
    queryKey: ['monthlyWebcasts'],
    queryFn: getMonthlyWebcasts,
  });

  const webcasts = useMemo(
    () => (data?.items || []).map(mapWebcast).filter(Boolean),
    [data?.items],
  );

  if (blocked) {
    return null;
  }

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Monthly Webcasts"
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
        <Typography
          fFamily={TYPE.h2.fFamily}
          size={TYPE.h2.size}
          color={COLORS.textPrimary}
          mB={SPACING.component}
        >
          Recordings
        </Typography>

        {isLoading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : isError ? (
          <TouchableOpacity onPress={refetch}>
            <Typography color={COLORS.primary} fFamily="barlowSemiBold600">
              Could not load webcasts. Tap to retry.
            </Typography>
          </TouchableOpacity>
        ) : webcasts.length === 0 ? (
          <Typography color={COLORS.textSecondary}>
            No webcast recordings yet.
          </Typography>
        ) : (
          <View style={styles.list}>
            {webcasts.map(wc => (
              <TouchableOpacity
                key={wc.id}
                style={[GLOBALSTYLE.screenCard, styles.pastCard]}
                activeOpacity={0.88}
                onPress={() =>
                  navigation.navigate('VideoDetailScreen', {
                    video: wc,
                    source: 'webcast',
                    fieldOnlineAccess,
                  })
                }
              >
                {wc.locked ? (
                  <View style={styles.lockOverlay}>
                    <Icon
                      name="lock-closed-outline"
                      iconFamily="Ionicons"
                      size={22}
                      color={COLORS.textSecondary}
                    />
                    <Typography
                      size={TYPE.caption.size}
                      color={COLORS.textSecondary}
                      fFamily="barlowMedium500"
                      mT={4}
                    >
                      Locked
                    </Typography>
                  </View>
                ) : null}
                <View style={styles.iconCircle}>
                  <Icon
                    name="play-outline"
                    iconFamily="Ionicons"
                    size={18}
                    color={COLORS.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Typography
                    fFamily="barlowSemiBold600"
                    size={TYPE.body.size}
                    color={COLORS.textPrimary}
                  >
                    {wc.title}
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
        )}
      </ScrollView>
    </Container>
  );
};

export default WebcastScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(100),
  },
  list: {
    gap: Sizer.vSize(SPACING.component),
  },
  iconCircle: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    borderRadius: Sizer.hSize(20),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
    padding: Sizer.hSize(SPACING.cardP),
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.card,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.85)',
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
