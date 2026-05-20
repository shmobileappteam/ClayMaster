import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
import CourseHeader from '../../../components/course/CourseHeader';
import Icon from '../../../helpers/Icon';
import { COLORS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { getMissCategory, MISS_CATEGORIES } from '../../../constants/missCategories';

const SPEEDS = ['0.75x', '1x', '1.25x', '1.5x'];

/**
 * CONTENT INVENTORY — ClayMaster-App-UI `CourseMissFixAudio.tsx`
 * Header: Audio Fix, showBack
 * Player card, transcript, 4 speed buttons
 */
const CourseMissFixAudioScreen = ({ navigation, route }) => {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState('1x');
  const cat = getMissCategory(route?.params?.categoryId) || MISS_CATEGORIES[0];
  const category = cat.name;
  const categoryLower = category.toLowerCase();

  return (
    <CourseLayout showTabs={false}>
      <CourseHeader title="Audio Fix" showBack onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.playerCard}>
          <View style={styles.iconCircle}>
            <Icon name="volume-high" iconFamily="Ionicons" size={36} color={COLORS.primary} />
          </View>
          <Typography
            fFamily="barlowBold700"
            size={20}
            lineHeight={28}
            color={COLORS.white100}
            textAlign="center"
            mT={16}
          >
            How to Fix: {category}
          </Typography>
          <Typography size={12} color="#666666" mT={4} textAlign="center" mB={24}>
            Audio coaching by Kevin DeMichiel · 1:30
          </Typography>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '33%' }]} />
          </View>
          <View style={styles.timeRow}>
            <Typography size={12} color="#666666">
              0:30
            </Typography>
            <Typography size={12} color="#666666">
              1:30
            </Typography>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity style={styles.skipBtn} activeOpacity={0.88}>
              <Icon name="play-skip-back" iconFamily="Ionicons" size={20} color={COLORS.white100} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.mainPlay}
              onPress={() => setPlaying(!playing)}
              activeOpacity={0.88}
            >
              <View style={playing ? undefined : styles.playOffset}>
                <Icon
                  name={playing ? 'pause' : 'play'}
                  iconFamily="Ionicons"
                  size={28}
                  color={COLORS.white100}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipBtn} activeOpacity={0.88}>
              <Icon name="play-skip-forward" iconFamily="Ionicons" size={20} color={COLORS.white100} />
            </TouchableOpacity>
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
            Transcript
          </Typography>
          <Typography size={14} color={COLORS.courseTextMuted} lineHeight={22}>
            "When you're shooting {categoryLower}, the most common issue is your focus point.
            Here's what I want you to do: before you call pull, make sure your eyes are locked on
            the break point, not the launch point. This single adjustment will help you read the
            target's line more accurately and correct the {categoryLower} miss pattern..."
          </Typography>
        </View>

        <View style={styles.speedRow}>
          {SPEEDS.map(s => {
            const active = s === speed;
            return (
              <TouchableOpacity
                key={s}
                style={[styles.speedBtn, active && styles.speedBtnActive]}
                onPress={() => setSpeed(s)}
                activeOpacity={0.88}
              >
                <Typography
                  fFamily="barlowSemiBold600"
                  size={14}
                  color={active ? COLORS.white100 : COLORS.courseTextMuted}
                >
                  {s}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </CourseLayout>
  );
};

export default CourseMissFixAudioScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(16),
    paddingTop: Sizer.vSize(20),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(20),
  },
  playerCard: {
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.courseBorder,
    padding: Sizer.hSize(24),
    alignItems: 'center',
  },
  iconCircle: {
    width: Sizer.hSize(80),
    height: Sizer.hSize(80),
    borderRadius: Sizer.hSize(40),
    backgroundColor: 'rgba(235, 108, 15, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: COLORS.courseBorder,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  timeRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Sizer.vSize(12),
    marginBottom: Sizer.vSize(24),
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizer.hSize(24),
  },
  skipBtn: {
    padding: Sizer.hSize(12),
    borderRadius: Sizer.hSize(24),
    backgroundColor: COLORS.courseBorder,
  },
  mainPlay: {
    width: Sizer.hSize(64),
    height: Sizer.hSize(64),
    borderRadius: Sizer.hSize(32),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playOffset: {
    paddingLeft: 4,
  },
  card: {
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.courseBorder,
    padding: Sizer.hSize(20),
  },
  sectionLabel: {
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  speedRow: {
    flexDirection: 'row',
    gap: Sizer.hSize(8),
  },
  speedBtn: {
    flex: 1,
    height: Sizer.vSize(48),
    borderRadius: Sizer.hSize(12),
    backgroundColor: COLORS.courseSurface,
    borderWidth: 1,
    borderColor: COLORS.courseBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speedBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
});
