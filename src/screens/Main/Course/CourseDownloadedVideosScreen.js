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
import { getDownloadedVideos } from '../../../utils/downloadedVideos';

const VIDEO_CATEGORIES = [
  {
    id: 'instructional',
    label: 'Instructional Videos',
    desc: 'On-course target presentations & vision clips',
    icon: 'play-circle-outline',
    screen: 'InstructionalVideosScreen',
    params: { catalog: 'instructional', fieldOnlineAccess: true },
  },
  {
    id: 'additional',
    label: 'Additional Videos',
    desc: 'Bonus training clips',
    icon: 'film-outline',
    screen: 'AdditionalVideosScreen',
    params: { fieldOnlineAccess: true },
  },
];

/**
 * Field Mode Videos — browse by type + saved clips from library.
 */
const CourseDownloadedVideosScreen = ({ navigation }) => {
  const [videos, setVideos] = useState(getDownloadedVideos);

  useFocusEffect(
    useCallback(() => {
      setVideos(getDownloadedVideos());
    }, []),
  );

  const openCategory = cat => {
    navigateFromFieldToStack(navigation, cat.screen, cat.params);
  };

  const openSaved = video => {
    navigateFromFieldToStack(navigation, 'VideoDetailScreen', {
      video,
      source: video.source || 'instructional',
      fromFieldSaved: true,
      fieldOnlineAccess: true,
    });
  };

  return (
    <CourseLayout showModeIndicator>
      <CourseHeader title="Videos" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Typography
          size={12}
          lineHeight={17}
          color="#999"
          fFamily="barlowBold700"
          style={styles.sectionLabel}
          mB={10}
        >
          Browse
        </Typography>

        <View style={styles.categoryGroup}>
          {VIDEO_CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryRow}
              activeOpacity={0.88}
              onPress={() => openCategory(cat)}
            >
              <View style={styles.categoryIcon}>
                <Icon
                  name={cat.icon}
                  iconFamily="Ionicons"
                  size={20}
                  color={COLORS.primary}
                />
              </View>
              <View style={styles.rowText}>
                <Typography
                  fFamily="barlowSemiBold600"
                  size={15}
                  color={COLORS.white100}
                >
                  {cat.label}
                </Typography>
                <Typography size={12} color={COLORS.courseTextMuted} mT={2}>
                  {cat.desc}
                </Typography>
              </View>
              <Icon
                name="chevron-forward"
                iconFamily="Ionicons"
                size={18}
                color={COLORS.courseTextMuted}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Typography
          size={12}
          lineHeight={17}
          color="#999"
          fFamily="barlowBold700"
          style={styles.sectionLabel}
          mT={24}
          mB={10}
        >
          Saved
        </Typography>

        {videos.length === 0 ? (
          <Typography size={13} color={COLORS.courseTextMuted}>
            Save a video from any video detail screen to see it here.
          </Typography>
        ) : (
          videos.map((video, index) => (
            <TouchableOpacity
              key={`${video.id}-${video.source || 'v'}`}
              style={[styles.row, index < videos.length - 1 && styles.rowBorder]}
              activeOpacity={0.88}
              onPress={() => openSaved(video)}
            >
              <View style={styles.thumb}>
                <Icon
                  name="play"
                  iconFamily="Ionicons"
                  size={22}
                  color={COLORS.primary}
                />
              </View>
              <View style={styles.rowText}>
                <Typography
                  fFamily="barlowSemiBold600"
                  size={16}
                  color={COLORS.white100}
                >
                  {video.title}
                </Typography>
                {video.source ? (
                  <Typography size={12} color={COLORS.courseTextMuted} mT={4}>
                    {String(video.source)}
                  </Typography>
                ) : null}
              </View>
              <Icon
                name="bookmark"
                iconFamily="Ionicons"
                size={18}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </CourseLayout>
  );
};

export default CourseDownloadedVideosScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingBottom: Sizer.vSize(24),
    paddingTop: Sizer.vSize(8),
  },
  sectionLabel: {
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  categoryGroup: {
    gap: Sizer.vSize(8),
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
    padding: Sizer.hSize(14),
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
  },
  categoryIcon: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    borderRadius: Sizer.hSize(10),
    backgroundColor: 'rgba(235,108,15,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
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
});
