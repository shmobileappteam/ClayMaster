import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import LibraryVideoPlayer from '../../../components/video/LibraryVideoPlayer';
import { COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useRequireLibraryMode } from '../../../hooks/useRequireLibraryMode';
import { useModeSwitch } from '../../../hooks/useModeSwitch';
import { isVideoDownloaded } from '../../../utils/downloadedVideos';
import { useCustomQuery } from '../../../query/useCustomQuery';
import {
  getAdditionalVideo,
  getInstructionalVideo,
  getMonthlyWebcast,
  getTutorialVideo,
} from '../../../api/academyService';
import {
  mapInstructionalVideo,
  mapLibraryVideo,
  mapTutorialVideo,
  mapWebcast,
} from '../../../constants/academy';

const fetchDetailBySource = async (id, source) => {
  if (source === 'tutorial') return getTutorialVideo(id);
  if (source === 'additional') return getAdditionalVideo(id);
  if (source === 'webcast') return getMonthlyWebcast(id);
  return getInstructionalVideo(id);
};

const mapBySource = (item, source) => {
  if (source === 'tutorial') return mapTutorialVideo(item);
  if (source === 'webcast') return mapWebcast(item);
  if (source === 'additional') return mapLibraryVideo(item, 'additional');
  return mapInstructionalVideo(item);
};

const VideoDetailScreen = ({ navigation, route }) => {
  const fieldOnlineAccess = route?.params?.fieldOnlineAccess === true;
  const paramVideo = route?.params?.video || {};
  const videoId = paramVideo.id ?? route?.params?.videoId;
  const source = paramVideo.source || route?.params?.source || 'instructional';
  const blocked = useRequireLibraryMode({
    allowOnlineInField: fieldOnlineAccess,
  });
  const { canUseLibrary } = useModeSwitch();

  const needsFetch = Boolean(videoId) && !paramVideo.videoUrl;

  const { data: detailRaw } = useCustomQuery({
    queryKey: ['libraryVideo', source, videoId],
    queryFn: () => fetchDetailBySource(videoId, source),
    enabled: needsFetch,
  });

  const video = useMemo(() => {
    const fromApi = detailRaw ? mapBySource(detailRaw, source) : null;
    const base = fromApi || paramVideo;
    return {
      id: base.id ?? videoId,
      title: base.title || '',
      description: base.description || '',
      videoUrl: base.videoUrl || base.video_url || null,
      thumbnail: base.thumbnail || null,
      locked: Boolean(base.locked),
      canAccess:
        base.canAccess !== false &&
        Boolean(base.videoUrl || base.video_url),
      source: base.source || source,
      category: base.category || null,
    };
  }, [detailRaw, paramVideo, source, videoId]);

  if (blocked) {
    return null;
  }

  const savedOnDevice = isVideoDownloaded(video.id);
  const canStream = canUseLibrary && video.canAccess && !video.locked;

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title={video.title || 'Video'}
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <LibraryVideoPlayer
          uri={canStream || savedOnDevice ? video.videoUrl : null}
          locked={video.locked || (!canStream && !savedOnDevice)}
          lockedMessage={
            video.locked
              ? 'Upgrade your plan to unlock this video.'
              : 'Connect to the internet to play this video.'
          }
          poster={video.thumbnail || undefined}
        />

        <View style={[GLOBALSTYLE.paddingHor, styles.body]}>
          {video.title ? (
            <Typography fFamily="barlowBold700" size={24} color={COLORS.textPrimary}>
              {video.title}
            </Typography>
          ) : null}
          {video.category ? (
            <Typography size={14} color={COLORS.textSecondary} mT={8}>
              {video.category}
            </Typography>
          ) : null}
          {video.description ? (
            <Typography size={14} color={COLORS.textSecondary} lineHeight={22} mT={16}>
              {video.description}
            </Typography>
          ) : null}
        </View>
      </ScrollView>
    </Container>
  );
};

export default VideoDetailScreen;

const styles = StyleSheet.create({
  body: {
    paddingVertical: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
  },
});
