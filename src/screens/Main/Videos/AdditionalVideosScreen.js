import React, { useCallback, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
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
import { ADDITIONAL_VIDEOS } from '../../../constants/libraryContent';
import { navigateFromTabToStack } from '../../../navigation/navigationHelpers';
import { useRequireLibraryMode } from '../../../hooks/useRequireLibraryMode';
import { useModeSwitch } from '../../../hooks/useModeSwitch';
import {
  getOfflineStorageSummary,
  isVideoDownloaded,
  parseSizeMb,
  removeDownloadedVideo,
  saveDownloadedVideo,
  toDownloadEntry,
} from '../../../utils/downloadedVideos';
import { showMessage } from '../../../utils';

/**
 * PAGE 12 — Placeholder supplementary videos (Full Library only).
 * Users choose clips to save for Field Mode while online.
 */
const AdditionalVideosScreen = ({ navigation }) => {
  const { canUseLibrary } = useModeSwitch();
  const [savedIds, setSavedIds] = useState(() =>
    ADDITIONAL_VIDEOS.filter(v => isVideoDownloaded(v.id)).map(v => v.id),
  );

  const storage = useMemo(() => getOfflineStorageSummary(), [savedIds]);

  useFocusEffect(
    useCallback(() => {
      setSavedIds(ADDITIONAL_VIDEOS.filter(v => isVideoDownloaded(v.id)).map(v => v.id));
    }, []),
  );

  if (useRequireLibraryMode()) {
    return null;
  }

  const openDetail = video => {
    navigateFromTabToStack(navigation, 'VideoDetailScreen', {
      video: toDownloadEntry({ ...video, source: 'additional' }),
    });
  };

  const toggleDownload = video => {
    if (!canUseLibrary) {
      showMessage({
        type: 'danger',
        title: 'Connection required',
        message: 'Save videos for the range when you have a stable Wi‑Fi or cellular connection.',
        duration: 4000,
      });
      return;
    }

    const alreadySaved = savedIds.includes(video.id);
    if (alreadySaved) {
      removeDownloadedVideo(video.id);
      setSavedIds(prev => prev.filter(id => id !== video.id));
      showMessage({
        type: 'default',
        title: 'Removed from device',
        message: `"${video.title}" will no longer appear in Field Mode downloads.`,
        duration: 3000,
      });
      return;
    }

    const summary = getOfflineStorageSummary();
    const entry = toDownloadEntry({ ...video, source: 'additional' });
    const addMb = parseSizeMb(entry.size);
    if (summary.totalMb + addMb >= summary.recommendedBudgetMb) {
      showMessage({
        type: 'danger',
        title: 'Storage budget reached',
        message: `You've saved about ${summary.totalMb} MB. Remove a clip or free space on your phone before adding more (typical guidance ~${summary.recommendedBudgetMb} MB).`,
        duration: 4500,
      });
      return;
    }

    saveDownloadedVideo(entry);
    setSavedIds(prev => [...prev, video.id]);
    showMessage({
      type: 'success',
      title: 'Saved for Field Mode',
      message: 'Find this under Field Mode → Downloaded Videos.',
      duration: 3500,
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
      >
        <Typography size={TYPE.body.size} color={COLORS.textSecondary} mB={SPACING.component}>
          Bonus training content & supplementary material (placeholder examples)
        </Typography>

        <View style={[GLOBALSTYLE.screenCard, styles.downloadSection]}>
          <View style={styles.downloadSectionHeader}>
            <Icon name="cloud-download-outline" iconFamily="Ionicons" size={22} color={COLORS.primary} />
            <Typography
              fFamily="barlowSemiBold600"
              size={TYPE.body.size}
              color={COLORS.textPrimary}
              mL={10}
              style={styles.downloadSectionTitle}
            >
              Download for Field Mode
            </Typography>
          </View>
          <Typography size={TYPE.caption.size} color={COLORS.textSecondary} lineHeight={18} mT={8}>
            While you have full internet or strong Wi‑Fi, tap the download icon on any video below.
            Saved clips play offline at the range under Field Mode → Downloaded Videos.
          </Typography>
          <View style={styles.storageRow}>
            <Typography size={TYPE.caption.size} color={COLORS.textPrimary} fFamily="barlowMedium500">
              {storage.count} saved · ~{storage.totalMb} MB
            </Typography>
            <Typography size={TYPE.caption.size} color={COLORS.textSecondary}>
              Guidance ~{storage.recommendedBudgetMb} MB total
            </Typography>
          </View>
          {storage.isNearLimit ? (
            <Typography size={TYPE.caption.size} color={COLORS.primary} mT={8}>
              {storage.isOverBudget
                ? 'At or over the suggested offline budget — remove clips you no longer need.'
                : 'Approaching the suggested offline budget — device limits vary by phone storage.'}
            </Typography>
          ) : null}
          {!canUseLibrary ? (
            <Typography size={TYPE.caption.size} color={COLORS.primary} mT={8}>
              No stable connection — downloads are unavailable until you are back online.
            </Typography>
          ) : null}
        </View>

        <Typography
          fFamily="barlowSemiBold600"
          size={TYPE.caption.size}
          color={COLORS.textSecondary}
          mB={8}
          style={styles.listLabel}
        >
          Supplementary library
        </Typography>

        {ADDITIONAL_VIDEOS.map(video => {
          const saved = savedIds.includes(video.id);
          return (
            <View key={video.id} style={[GLOBALSTYLE.screenCard, styles.videoRow]}>
              <TouchableOpacity
                style={styles.videoMain}
                activeOpacity={0.88}
                onPress={() => openDetail(video)}
              >
                <View style={styles.thumbWrap}>
                  <Image source={video.image} style={styles.thumb} resizeMode="cover" />
                  <View style={styles.thumbOverlay}>
                    <View style={styles.playCircle}>
                      <Icon name="play" iconFamily="Ionicons" size={14} color={COLORS.white100} />
                    </View>
                  </View>
                </View>
                <View style={styles.videoBody}>
                  <Typography fFamily="barlowSemiBold600" size={TYPE.body.size} color={COLORS.textPrimary}>
                    {video.title}
                  </Typography>
                  <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mT={2}>
                    {video.coach}
                  </Typography>
                  <View style={styles.durationRow}>
                    <Icon name="time-outline" iconFamily="Ionicons" size={12} color={COLORS.textSecondary} />
                    <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mL={4}>
                      {video.duration}
                    </Typography>
                    {saved ? (
                      <Typography size={TYPE.caption.size} color={COLORS.primary} mL={8}>
                        · On device
                      </Typography>
                    ) : null}
                  </View>
                </View>
                <Icon name="chevron-forward" iconFamily="Ionicons" size={18} color={COLORS.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.downloadBtn, saved && styles.downloadBtnSaved]}
                activeOpacity={0.88}
                onPress={() => toggleDownload(video)}
                accessibilityLabel={saved ? 'Remove download' : 'Download for offline'}
              >
                <Icon
                  name={saved ? 'checkmark-circle' : 'download-outline'}
                  iconFamily="Ionicons"
                  size={22}
                  color={saved ? COLORS.primary : COLORS.textSecondary}
                />
              </TouchableOpacity>
            </View>
          );
        })}
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
  downloadSection: {
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
  downloadSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadSectionTitle: {
    flex: 1,
  },
  storageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Sizer.vSize(12),
    paddingTop: Sizer.vSize(12),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.borderMuted,
  },
  listLabel: {
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  videoRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    overflow: 'hidden',
    padding: 0,
    ...SHADOWS.card,
  },
  videoMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbWrap: {
    width: Sizer.hSize(112),
    height: Sizer.hSize(80),
    position: 'relative',
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
    width: Sizer.hSize(32),
    height: Sizer.hSize(32),
    borderRadius: Sizer.hSize(16),
    backgroundColor: 'rgba(235, 108, 15, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2,
  },
  videoBody: {
    flex: 1,
    paddingHorizontal: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(12),
    minWidth: 0,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Sizer.vSize(6),
    flexWrap: 'wrap',
  },
  downloadBtn: {
    width: Sizer.hSize(52),
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: COLORS.borderMuted,
    backgroundColor: COLORS.surface,
  },
  downloadBtnSaved: {
    backgroundColor: COLORS.primaryLight,
  },
});
