import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Typography } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
import CourseHeader from '../../../components/course/CourseHeader';
import Icon from '../../../helpers/Icon';
import { COLORS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { navigateFromFieldToStack } from '../../../navigation/navigationHelpers';
import { useModeSwitch } from '../../../hooks/useModeSwitch';
import { getDownloadedVideos } from '../../../utils/downloadedVideos';
import { FIELD_VIDEO_ACCESS } from '../../../constants/modeSections';

/**
 * Field Mode — Downloaded Instructional Videos (PAGE 01 + PAGE 11).
 * Offline playback; optional online catalog when connection is stable.
 */
const CourseDownloadedVideosScreen = ({ navigation }) => {
  const { canUseLibrary } = useModeSwitch();
  const [videos, setVideos] = useState(getDownloadedVideos);

  useFocusEffect(
    useCallback(() => {
      setVideos(getDownloadedVideos());
    }, []),
  );

  return (
    <CourseLayout>
      <CourseHeader title="Downloaded Videos" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Typography size={14} lineHeight={21} color={COLORS.courseTextMuted} mB={16}>
          {canUseLibrary
            ? 'On-device clips work offline. Stream refreshers while your connection is stable, or download more from the full library.'
            : 'Clips saved on this device — watch at the range without Wi‑Fi. Stream and save more when you have a strong connection.'}
        </Typography>

        {canUseLibrary && FIELD_VIDEO_ACCESS.streamingRequiresStableInternet ? (
          <TouchableOpacity
            style={styles.onlineRow}
            activeOpacity={0.88}
            onPress={() =>
              navigateFromFieldToStack(navigation, 'InstructionalVideosScreen', {
                fieldOnlineAccess: true,
              })
            }
          >
            <View style={styles.onlineIcon}>
              <Icon name="play-circle-outline" iconFamily="Ionicons" size={22} color={COLORS.primary} />
            </View>
            <View style={styles.rowText}>
              <Typography fFamily="barlowSemiBold600" size={16} color={COLORS.white100}>
                Browse online training videos
              </Typography>
              <Typography size={12} color={COLORS.courseTextMuted} mT={4}>
                Quick refresher — requires stable Wi‑Fi or cellular
              </Typography>
            </View>
            <Icon name="chevron-forward" iconFamily="Ionicons" size={20} color={COLORS.courseTextMuted} />
          </TouchableOpacity>
        ) : null}

        <Typography
          size={12}
          lineHeight={17}
          color="#999"
          fFamily="barlowBold700"
          style={styles.sectionLabel}
          mB={8}
        >
          On this device
        </Typography>

        {videos.map((video, index) => (
          <TouchableOpacity
            key={video.id}
            style={[styles.row, index < videos.length - 1 && styles.rowBorder]}
            activeOpacity={0.88}
            onPress={() =>
              navigateFromFieldToStack(navigation, 'CourseMissFixVideoScreen', {
                title: video.title,
                videoId: video.id,
              })
            }
          >
            <View style={styles.thumb}>
              <Icon name="play" iconFamily="Ionicons" size={22} color={COLORS.primary} />
            </View>
            <View style={styles.rowText}>
              <Typography fFamily="barlowSemiBold600" size={16} color={COLORS.white100}>
                {video.title}
              </Typography>
              <Typography size={12} color={COLORS.courseTextMuted} mT={4}>
                On device
              </Typography>
            </View>
            <Icon
              name="checkmark-circle"
              iconFamily="Ionicons"
              size={20}
              color="#4ADE80"
            />
          </TouchableOpacity>
        ))}

        <View style={styles.hint}>
          <Icon name="cloud-download-outline" iconFamily="Ionicons" size={18} color={COLORS.courseTextMuted} />
          <Typography size={12} color={COLORS.courseTextMuted} mL={8} style={styles.hintText}>
            {canUseLibrary
              ? 'Open videos in Full Library Mode to stream them. Saved clips appear here for offline use.'
              : 'When online, switch to Full Library Mode to browse videos before heading to the field.'}
          </Typography>
        </View>
      </ScrollView>
    </CourseLayout>
  );
};

export default CourseDownloadedVideosScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingBottom: Sizer.vSize(24),
  },
  sectionLabel: {
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Sizer.vSize(14),
    gap: Sizer.hSize(12),
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.courseBorder,
  },
  thumb: {
    width: Sizer.hSize(56),
    height: Sizer.hSize(56),
    borderRadius: Sizer.hSize(8),
    backgroundColor: COLORS.courseSurface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1, minWidth: 0 },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Sizer.vSize(14),
    paddingHorizontal: Sizer.hSize(12),
    marginBottom: Sizer.vSize(16),
    gap: Sizer.hSize(12),
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(8),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.primary,
  },
  onlineIcon: {
    width: Sizer.hSize(44),
    height: Sizer.hSize(44),
    borderRadius: Sizer.hSize(8),
    backgroundColor: 'rgba(235,108,15,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Sizer.vSize(20),
    padding: Sizer.hSize(12),
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(8),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
  },
  hintText: {
    flex: 1,
  },
});
