import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Image,
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
import { videoThumb1 } from '../../../assets/images';
import { navigateFromTabToStack } from '../../../navigation/navigationHelpers';
import { useRequireLibraryMode } from '../../../hooks/useRequireLibraryMode';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { getAdditionalVideos } from '../../../api/academyService';
import { flattenAdditionalVideos } from '../../../constants/academy';

/** PAGE 12 — Supplementary videos (Full Library / Field browse). */
const AdditionalVideosScreen = ({ navigation, route }) => {
  const fieldOnlineAccess = route?.params?.fieldOnlineAccess === true;
  const blocked = useRequireLibraryMode({
    allowOnlineInField: fieldOnlineAccess,
  });

  const { data, isLoading, isError, isFetching, refetch } = useCustomQuery({
    queryKey: ['additionalVideos'],
    queryFn: getAdditionalVideos,
  });

  const videos = useMemo(
    () => flattenAdditionalVideos(data?.items || []),
    [data?.items],
  );

  if (blocked) {
    return null;
  }

  const openDetail = video => {
    navigateFromTabToStack(navigation, 'VideoDetailScreen', {
      video: { ...video, source: 'additional' },
      fieldOnlineAccess,
    });
  };

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Additional Videos"
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
          size={TYPE.body.size}
          color={COLORS.textSecondary}
          mB={SPACING.component}
        >
          Bonus training content & supplementary material
        </Typography>

        {isLoading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : isError ? (
          <TouchableOpacity onPress={refetch}>
            <Typography color={COLORS.primary} fFamily="barlowSemiBold600">
              Could not load videos. Tap to retry.
            </Typography>
          </TouchableOpacity>
        ) : videos.length === 0 ? (
          <Typography color={COLORS.textSecondary}>No additional videos yet.</Typography>
        ) : (
          videos.map(video => (
            <TouchableOpacity
              key={video.id}
              style={[GLOBALSTYLE.screenCard, styles.videoRow]}
              activeOpacity={0.88}
              onPress={() => openDetail(video)}
            >
              <View style={styles.thumbWrap}>
                <Image
                  source={
                    video.thumbnail
                      ? { uri: video.thumbnail }
                      : video.illustration
                        ? { uri: video.illustration }
                        : videoThumb1
                  }
                  style={styles.thumb}
                  resizeMode="cover"
                />
                <View style={styles.thumbOverlay}>
                  <View style={styles.playCircle}>
                    <Icon
                      name={video.locked ? 'lock-closed' : 'play'}
                      iconFamily="Ionicons"
                      size={14}
                      color={COLORS.white100}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.videoBody}>
                <Typography
                  fFamily="barlowSemiBold600"
                  size={TYPE.body.size}
                  color={COLORS.textPrimary}
                  numberOfLines={2}
                  style={styles.titleText}
                >
                  {video.title}
                </Typography>
                {(video.category || video.subcategory) ? (
                  <Typography
                    size={TYPE.caption.size}
                    color={COLORS.textSecondary}
                    mT={2}
                    numberOfLines={1}
                  >
                    {video.category || video.subcategory}
                  </Typography>
                ) : null}
              </View>
              <View style={styles.chevronWrap}>
                <Icon
                  name="chevron-forward"
                  iconFamily="Ionicons"
                  size={18}
                  color={COLORS.textSecondary}
                />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </Container>
  );
};

export default AdditionalVideosScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(100),
    gap: Sizer.vSize(SPACING.component),
  },
  videoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    minHeight: Sizer.vSize(88),
    paddingVertical: Sizer.vSize(10),
    paddingLeft: Sizer.hSize(10),
    paddingRight: Sizer.hSize(8),
    ...SHADOWS.card,
  },
  thumbWrap: {
    width: Sizer.hSize(96),
    height: Sizer.vSize(68),
    borderRadius: Sizer.hSize(8),
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceMuted,
    flexShrink: 0,
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  thumbOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,26,26,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCircle: {
    width: Sizer.hSize(28),
    height: Sizer.hSize(28),
    borderRadius: Sizer.hSize(14),
    backgroundColor: 'rgba(235, 108, 15, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2,
  },
  videoBody: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: Sizer.hSize(10),
    justifyContent: 'center',
  },
  titleText: {
    flexShrink: 1,
  },
  chevronWrap: {
    width: Sizer.hSize(22),
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
