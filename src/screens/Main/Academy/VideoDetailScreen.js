import React, { useCallback, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import LibraryVideoPlayer from '../../../components/video/LibraryVideoPlayer';
import Icon from '../../../helpers/Icon';
import { COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useRequireLibraryMode } from '../../../hooks/useRequireLibraryMode';
import { useModeSwitch } from '../../../hooks/useModeSwitch';
import {
  isVideoDownloaded,
  removeDownloadedVideo,
  saveDownloadedVideo,
} from '../../../utils/downloadedVideos';
import { showMessage } from '../../../utils';
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
  const fromFieldSaved = route?.params?.fromFieldSaved === true;
  const paramVideo = route?.params?.video || {};
  const videoId = paramVideo.id ?? route?.params?.videoId;
  const source = paramVideo.source || route?.params?.source || 'instructional';
  const blocked = useRequireLibraryMode({
    allowOnlineInField: fieldOnlineAccess,
    allowSavedInField: fromFieldSaved,
  });
  const { canUseLibrary } = useModeSwitch();
  const [saved, setSaved] = useState(false);

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
      sizeMb: base.sizeMb || 0,
    };
  }, [detailRaw, paramVideo, source, videoId]);

  useFocusEffect(
    useCallback(() => {
      if (video.id != null) {
        setSaved(isVideoDownloaded(video.id));
      }
    }, [video.id]),
  );

  if (blocked) {
    return null;
  }

  const canStream =
    (canUseLibrary || fromFieldSaved || saved) &&
    video.canAccess &&
    !video.locked;

  const toggleSave = () => {
    if (!video.id || !video.videoUrl) {
      showMessage({
        type: 'danger',
        title: 'Unavailable',
        message: 'This video cannot be saved yet.',
        duration: 3000,
      });
      return;
    }
    if (saved) {
      removeDownloadedVideo(video.id);
      setSaved(false);
      showMessage({
        type: 'success',
        title: 'Removed',
        message: 'Video removed from Field Mode Videos.',
        duration: 2500,
      });
      return;
    }
    saveDownloadedVideo(video);
    setSaved(true);
    showMessage({
      type: 'success',
      title: 'Saved',
      message: 'Video added to Field Mode Videos.',
      duration: 2500,
    });
  };

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
          uri={canStream ? video.videoUrl : null}
          locked={video.locked || !canStream}
          lockedMessage={
            video.locked
              ? 'Upgrade your plan to unlock this video.'
              : 'Unable to play this video right now.'
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

          <TouchableOpacity
            style={[styles.saveBtn, saved && styles.saveBtnActive]}
            activeOpacity={0.88}
            onPress={toggleSave}
          >
            <Icon
              name={saved ? 'bookmark' : 'bookmark-outline'}
              iconFamily="Ionicons"
              size={18}
              color={saved ? COLORS.white100 : COLORS.primary}
            />
            <Typography
              fFamily="barlowSemiBold600"
              size={14}
              color={saved ? COLORS.white100 : COLORS.primary}
              mL={8}
            >
              {saved ? 'Saved for Field Mode' : 'Save for Field Mode'}
            </Typography>
          </TouchableOpacity>

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
  saveBtn: {
    marginTop: Sizer.vSize(16),
    height: Sizer.vSize(44),
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  saveBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
});
