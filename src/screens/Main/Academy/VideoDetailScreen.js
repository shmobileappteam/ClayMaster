import React, { useCallback, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import Icon from '../../../helpers/Icon';
import { videoThumb1 } from '../../../assets/images';
import { COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useRequireLibraryMode } from '../../../hooks/useRequireLibraryMode';
import { useModeSwitch } from '../../../hooks/useModeSwitch';
import {
  isVideoDownloaded,
  saveDownloadedVideo,
} from '../../../utils/downloadedVideos';
import { showMessage } from '../../../utils';
import { navigateFromFieldToStack } from '../../../navigation/navigationHelpers';

const DEFAULT_VIDEO = {
  id: 'tower-shot-mastery',
  title: 'Tower Shot Mastery',
  instructor: 'Kevin DeMichiel',
  duration: '12:30',
  size: '86 MB',
  description:
    'Learn the fundamentals of the tower shot including proper stance, lead technique, and timing. This comprehensive guide covers everything from beginner to advanced positioning.',
};

const VideoDetailScreen = ({ navigation, route }) => {
  const fieldOnlineAccess = route?.params?.fieldOnlineAccess === true;
  const video = {
    ...DEFAULT_VIDEO,
    ...route?.params?.video,
    id: route?.params?.video?.id ?? route?.params?.videoId ?? DEFAULT_VIDEO.id,
    title: route?.params?.video?.title ?? route?.params?.title ?? DEFAULT_VIDEO.title,
    instructor:
      route?.params?.video?.instructor ?? route?.params?.instructor ?? DEFAULT_VIDEO.instructor,
    duration:
      route?.params?.video?.duration ?? route?.params?.duration ?? DEFAULT_VIDEO.duration,
    size: route?.params?.video?.size ?? route?.params?.size ?? DEFAULT_VIDEO.size,
    description: route?.params?.video?.description ?? route?.params?.description ?? DEFAULT_VIDEO.description,
  };

  const { canUseLibrary, isFieldMode } = useModeSwitch();
  const [savedOnDevice, setSavedOnDevice] = useState(() => isVideoDownloaded(video.id));

  useFocusEffect(
    useCallback(() => {
      setSavedOnDevice(isVideoDownloaded(video.id));
    }, [video.id]),
  );

  if (useRequireLibraryMode({ allowOnlineInField: fieldOnlineAccess })) {
    return null;
  }

  const canStream = canUseLibrary;
  const canSaveForOffline = canUseLibrary && !savedOnDevice;

  const handlePlay = () => {
    if (savedOnDevice) {
      const params = { title: video.title, videoId: video.id };
      if (isFieldMode || fieldOnlineAccess) {
        navigateFromFieldToStack(navigation, 'CourseMissFixVideoScreen', params);
      } else {
        navigation.navigate('CourseMissFixVideoScreen', params);
      }
      return;
    }
    if (!canStream) {
      showMessage({
        type: 'danger',
        title: 'Connection required',
        message:
          'Save this video to your device while online, then watch it offline in Field Mode → Downloaded Videos.',
        duration: 4000,
      });
      return;
    }
    showMessage({
      type: 'default',
      title: 'Streaming',
      message: 'Video playback will connect to the library stream when the player API is wired.',
      duration: 3000,
    });
  };

  const handleDownload = () => {
    if (savedOnDevice) {
      showMessage({
        type: 'default',
        title: 'Already on device',
        message: 'Find this clip under Field Mode → Downloaded Videos.',
        duration: 3000,
      });
      return;
    }
    if (!canSaveForOffline) {
      showMessage({
        type: 'danger',
        title: 'Connection required',
        message: 'Download videos in Full Library Mode (or when online) to watch at the range without Wi‑Fi.',
        duration: 4000,
      });
      return;
    }
    saveDownloadedVideo(video);
    setSavedOnDevice(true);
    showMessage({
      type: 'success',
      title: 'Saved for offline',
      message: 'Available in Field Mode under Downloaded Videos.',
      duration: 3500,
    });
  };

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title={video.title}
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {fieldOnlineAccess && !savedOnDevice ? (
          <Typography
            size={12}
            color={COLORS.primary}
            style={styles.streamBanner}
          >
            Streaming — save to device for offline range use
          </Typography>
        ) : null}
        <View style={styles.player}>
          <Image source={videoThumb1} style={styles.thumb} resizeMode="cover" />
          <View style={styles.playOverlay}>
            <TouchableOpacity style={styles.playBtn} activeOpacity={0.9} onPress={handlePlay}>
              <Icon
                name="play"
                iconFamily="Ionicons"
                size={28}
                color={COLORS.white100}
                style={styles.playIconOffset}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[GLOBALSTYLE.paddingHor, styles.body]}>
          <Typography fFamily="barlowBold700" size={24} color={COLORS.textPrimary}>
            {video.title}
          </Typography>
          <View style={styles.metaRow}>
            <Icon
              name="person-outline"
              iconFamily="Ionicons"
              size={16}
              color={COLORS.textSecondary}
            />
            <Typography size={14} color={COLORS.textSecondary} mL={6}>
              {video.instructor}
            </Typography>
            <Icon
              name="time-outline"
              iconFamily="Ionicons"
              size={16}
              color={COLORS.textSecondary}
              style={styles.metaSpacer}
            />
            <Typography size={14} color={COLORS.textSecondary} mL={6}>
              {video.duration}
            </Typography>
          </View>
          <Typography size={14} color={COLORS.textSecondary} lineHeight={22} mT={16}>
            {video.description}
          </Typography>
          {!canStream && !savedOnDevice ? (
            <Typography size={12} color={COLORS.primary} mT={12}>
              No stable connection — download this clip when online to watch at the range.
            </Typography>
          ) : null}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.playPrimary} activeOpacity={0.9} onPress={handlePlay}>
              <Icon
                name="play"
                iconFamily="Ionicons"
                size={18}
                color={COLORS.white100}
              />
              <Typography
                fFamily="barlowSemiBold600"
                size={15}
                color={COLORS.white100}
                mL={8}
              >
                {savedOnDevice ? 'Play (offline)' : 'Play'}
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconBtn, savedOnDevice && styles.iconBtnSaved]}
              activeOpacity={0.88}
              onPress={handleDownload}
            >
              <Icon
                name={savedOnDevice ? 'bookmark' : 'bookmark-outline'}
                iconFamily="Ionicons"
                size={20}
                color={savedOnDevice ? COLORS.primary : COLORS.textSecondary}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.88}>
              <Icon
                name="share-outline"
                iconFamily="Ionicons"
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

export default VideoDetailScreen;

const styles = StyleSheet.create({
  streamBanner: {
    paddingHorizontal: Sizer.hSize(16),
    paddingTop: Sizer.vSize(8),
  },
  player: {
    aspectRatio: 16 / 9,
    backgroundColor: COLORS.textPrimary,
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,26,26,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: Sizer.hSize(64),
    height: Sizer.hSize(64),
    borderRadius: Sizer.hSize(32),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconOffset: {
    marginLeft: 4,
  },
  body: {
    paddingVertical: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Sizer.vSize(12),
    flexWrap: 'wrap',
  },
  metaSpacer: {
    marginLeft: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: Sizer.hSize(12),
    marginTop: Sizer.vSize(24),
  },
  playPrimary: {
    flex: 1,
    height: Sizer.vSize(48),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    width: Sizer.hSize(48),
    height: Sizer.hSize(48),
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  iconBtnSaved: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
});
