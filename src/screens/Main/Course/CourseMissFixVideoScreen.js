import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
import CourseHeader from '../../../components/course/CourseHeader';
import Icon from '../../../helpers/Icon';
import { COLORS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { getMissCategory, MISS_CATEGORIES } from '../../../constants/missCategories';

const KEY_TAKEAWAYS = [
  'Identify the visual cue that leads to this miss',
  'Understand the body mechanics causing the error',
  "Recognize when it's happening in real-time",
];

/**
 * CONTENT INVENTORY — ClayMaster-App-UI `CourseMissFixVideo.tsx`
 * Header: Fix Video, showBack, showAudio
 * Video placeholder, info card, key takeaways (3), Watch Again CTA
 */
const CourseMissFixVideoScreen = ({ navigation, route }) => {
  const cat = getMissCategory(route?.params?.categoryId) || MISS_CATEGORIES[0];
  const category = cat.name;

  return (
    <CourseLayout showTabs={false}>
      <CourseHeader
        title="Fix Video"
        showBack
        showAudio
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.player}>
          <View style={styles.playCircle}>
            <Icon name="play" iconFamily="Ionicons" size={32} color={COLORS.primary} />
          </View>
          <Typography size={14} color={COLORS.courseTextMuted} mT={12} textAlign="center">
            Video: Why "{category}" happens
          </Typography>
        </View>

        <View style={styles.card}>
          <Typography fFamily="barlowBold700" size={20} lineHeight={28} color={COLORS.white100}>
            Why You're Missing: {category}
          </Typography>
          <Typography size={14} color={COLORS.courseTextMuted} mT={8} lineHeight={22}>
            This video breaks down the most common cause of the "{category}" miss pattern.
            Watch the slow-motion analysis and learn to identify the root cause in your own
            shooting.
          </Typography>
          <View style={styles.metaRow}>
            <Typography size={12} color="#666666">
              Duration: 2:45
            </Typography>
            <Typography size={12} color="#666666">
              Coach: Kevin DeMichiel
            </Typography>
          </View>
        </View>

        <View style={styles.card}>
          <Typography
            size={12}
            color="#999999"
            fFamily="barlowBold700"
            style={styles.sectionLabel}
            mB={12}
          >
            Key Takeaways
          </Typography>
          {KEY_TAKEAWAYS.map((point, i) => (
            <View key={point} style={[styles.takeawayRow, i > 0 && styles.takeawayGap]}>
              <View style={styles.takeawayNum}>
                <Typography size={12} color={COLORS.primary} fFamily="barlowBold700">
                  {i + 1}
                </Typography>
              </View>
              <Typography size={14} color="#CCCCCC" lineHeight={22} style={styles.takeawayText}>
                {point}
              </Typography>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.watchAgainBtn} activeOpacity={0.88}>
          <Icon name="refresh" iconFamily="Ionicons" size={20} color={COLORS.white100} />
          <Typography fFamily="barlowBold700" size={14} color={COLORS.white100} mL={8}>
            Watch Again
          </Typography>
        </TouchableOpacity>
      </ScrollView>
    </CourseLayout>
  );
};

export default CourseMissFixVideoScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(16),
    paddingTop: Sizer.vSize(20),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(20),
  },
  player: {
    aspectRatio: 16 / 9,
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.courseBorder,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  playCircle: {
    width: Sizer.hSize(64),
    height: Sizer.hSize(64),
    borderRadius: Sizer.hSize(32),
    backgroundColor: 'rgba(235, 108, 15, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: Sizer.hSize(4),
  },
  card: {
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.courseBorder,
    padding: Sizer.hSize(20),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(16),
    marginTop: Sizer.vSize(16),
  },
  sectionLabel: {
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  takeawayRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  takeawayGap: {
    marginTop: Sizer.vSize(12),
  },
  takeawayNum: {
    width: Sizer.hSize(24),
    height: Sizer.hSize(24),
    borderRadius: Sizer.hSize(12),
    backgroundColor: 'rgba(235, 108, 15, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginRight: Sizer.hSize(12),
  },
  takeawayText: {
    flex: 1,
  },
  watchAgainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: Sizer.vSize(56),
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.courseBorder,
  },
});
