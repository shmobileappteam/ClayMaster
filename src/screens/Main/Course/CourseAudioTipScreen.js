import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
import CourseHeader from '../../../components/course/CourseHeader';
import Icon from '../../../helpers/Icon';
import { COLORS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';

const DEFAULT_TIP = { title: 'Pre-Shot Routine', duration: '2:30' };

/**
 * CONTENT INVENTORY — ClayMaster-App-UI `CourseAudioTip.tsx`
 * Header: Audio Tip, showBack
 * Player card (icon, title, coach, progress, controls), About This Tip card
 */
const CourseAudioTipScreen = ({ navigation, route }) => {
  const [playing, setPlaying] = useState(false);
  const tip = route?.params?.tip || DEFAULT_TIP;
  const titleLower = tip.title.toLowerCase();

  return (
    <CourseLayout showTabs={false}>
      <CourseHeader title="Audio Tip" showBack onBack={() => navigation.goBack()} />
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
            {tip.title}
          </Typography>
          <Typography size={12} color="#666666" mT={4} textAlign="center" mB={24}>
            Coach Kevin DeMichiel · {tip.duration}
          </Typography>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: 0 }]} />
          </View>
          <View style={styles.timeRow}>
            <Typography size={12} color="#666666">
              0:00
            </Typography>
            <Typography size={12} color="#666666">
              {tip.duration}
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

        <View style={styles.aboutCard}>
          <Typography
            size={12}
            color="#999999"
            fFamily="barlowBold700"
            style={styles.sectionLabel}
            mB={12}
          >
            About This Tip
          </Typography>
          <Typography size={14} color={COLORS.courseTextMuted} lineHeight={22}>
            Learn the essentials of a solid {titleLower}. This audio coaching session covers the
            key mental and physical steps to establish consistency before every shot.
          </Typography>
        </View>
      </ScrollView>
    </CourseLayout>
  );
};

export default CourseAudioTipScreen;

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
  aboutCard: {
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
});
