import React, { useMemo } from 'react';
import {
  Image,
  RefreshControl,
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
import { videoThumb1 } from '../../../assets/images';
import { useRequireLibraryMode } from '../../../hooks/useRequireLibraryMode';
import { useCustomQuery } from '../../../query/useCustomQuery';
import {
  getInstructionalVideos,
  getTutorialVideos,
} from '../../../api/academyService';
import {
  groupInstructionalVideos,
  mapInstructionalVideo,
  mapTutorialVideo,
} from '../../../constants/academy';

/** Full Library catalog. Requires stable internet. */
const InstructionalVideosScreen = ({ navigation, route }) => {
  const fieldOnlineAccess = route?.params?.fieldOnlineAccess === true;
  const catalog = route?.params?.catalog || 'instructional';
  const presentationName = route?.params?.presentation?.name;
  const isTutorial = catalog === 'tutorial';
  const blocked = useRequireLibraryMode({
    allowOnlineInField: fieldOnlineAccess,
  });

  const { data, isLoading, isError, isFetching, refetch } = useCustomQuery({
    queryKey: [isTutorial ? 'tutorialVideos' : 'instructionalVideos'],
    queryFn: isTutorial ? getTutorialVideos : getInstructionalVideos,
  });

  const videos = useMemo(() => {
    const mapper = isTutorial ? mapTutorialVideo : mapInstructionalVideo;
    let list = (data?.items || []).map(mapper).filter(Boolean);
    if (presentationName) {
      const needle = String(presentationName).toLowerCase();
      const filtered = list.filter(v =>
        String(v.title).toLowerCase().includes(needle),
      );
      if (filtered.length) list = filtered;
    }
    return list;
  }, [data?.items, isTutorial, presentationName]);

  const sections = useMemo(() => {
    if (isTutorial) {
      return videos.length ? [{ label: null, videos }] : [];
    }
    return groupInstructionalVideos(videos);
  }, [videos, isTutorial]);

  const title = isTutorial ? 'Video Tutorials' : 'Instructional Videos';

  if (blocked) {
    return null;
  }

  const openVideo = video => {
    navigation.navigate('VideoDetailScreen', {
      fieldOnlineAccess,
      video,
      source: isTutorial ? 'tutorial' : 'instructional',
    });
  };

  const renderVideoRow = video => (
    <TouchableOpacity
      key={video.id}
      style={[GLOBALSTYLE.screenCard, styles.videoRow]}
      onPress={() => openVideo(video)}
      activeOpacity={0.88}
    >
      <View style={styles.thumbWrap}>
        <Image
          source={video.thumbnail ? { uri: video.thumbnail } : videoThumb1}
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
        >
          {video.title}
        </Typography>
        <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mT={2}>
          {video.locked ? 'Locked · upgrade to unlock' : 'Tap to watch'}
        </Typography>
      </View>
      <Icon
        name={video.locked ? 'lock-closed-outline' : 'chevron-forward'}
        iconFamily="Ionicons"
        size={20}
        color={COLORS.textSecondary}
      />
    </TouchableOpacity>
  );

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title={title}
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
          lineHeight={TYPE.body.lineHeight}
          mB={16}
        >
          {presentationName
            ? `Showing videos for ${presentationName}`
            : isTutorial
              ? 'Step-by-step tutorials for analytics and app features'
              : 'Target presentations, ClayMaster Vision, and more'}
        </Typography>

        {isLoading ? (
          <AppLoader />
        ) : isError ? (
          <TouchableOpacity onPress={refetch} activeOpacity={0.88}>
            <Typography color={COLORS.primary} fFamily="barlowSemiBold600">
              Could not load videos. Tap to retry.
            </Typography>
          </TouchableOpacity>
        ) : videos.length === 0 ? (
          <Typography color={COLORS.textSecondary}>No videos available.</Typography>
        ) : (
          sections.map(section => (
            <View key={section.label || 'all'} style={styles.sectionBlock}>
              {section.label ? (
                <Typography
                  fFamily="barlowBold700"
                  size={13}
                  color={COLORS.textSecondary}
                  style={styles.sectionLabel}
                  mB={10}
                >
                  {section.label}
                </Typography>
              ) : null}
              <View style={styles.list}>{section.videos.map(renderVideoRow)}</View>
            </View>
          ))
        )}
      </ScrollView>
    </Container>
  );
};

export default InstructionalVideosScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(100),
  },
  sectionBlock: {
    marginBottom: Sizer.vSize(20),
  },
  sectionLabel: {
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  list: {
    gap: Sizer.vSize(SPACING.component),
  },
  videoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    minHeight: Sizer.vSize(88),
    paddingVertical: Sizer.vSize(10),
    paddingLeft: Sizer.hSize(10),
    paddingRight: Sizer.hSize(12),
    gap: Sizer.hSize(4),
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
    paddingHorizontal: Sizer.hSize(8),
    justifyContent: 'center',
  },
});
