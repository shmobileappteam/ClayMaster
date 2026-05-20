import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
import CourseHeader from '../../../components/course/CourseHeader';
import Icon from '../../../helpers/Icon';
import { COLORS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';

const DEFAULT_DRILL = {
  title: 'Follow-Through Focus',
  duration: '3 min',
  level: 'Beginner',
};

const DRILL_STEPS = [
  'Set up at your station with a clear view of the target line',
  'Call for the target and track it with your eyes only — do NOT shoot',
  'Mount the gun and follow the target line smoothly past the break point',
  'Fire and hold your follow-through for 2 full seconds',
  'Repeat 5 times, focusing on maintaining swing after the shot',
];

/**
 * CONTENT INVENTORY — ClayMaster-App-UI `CourseTrainDetail.tsx`
 * Header: Drill, showBack, showAudio
 * Orange hero, listen row, 5 toggle steps, progress, completion card
 */
const CourseTrainDetailScreen = ({ navigation, route }) => {
  const [completedSteps, setCompletedSteps] = useState([]);
  const drill = route?.params?.drill || DEFAULT_DRILL;
  const allDone = completedSteps.length === DRILL_STEPS.length;

  const toggleStep = index => {
    setCompletedSteps(prev =>
      prev.includes(index) ? prev.filter(s => s !== index) : [...prev, index],
    );
  };

  return (
    <CourseLayout showTabs={false}>
      <CourseHeader
        title="Drill"
        showBack
        showAudio
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Typography fFamily="barlowBold700" size={24} lineHeight={32} color={COLORS.white100}>
            {drill.title}
          </Typography>
          <View style={styles.heroMeta}>
            <View style={styles.heroMetaItem}>
              <Icon name="time-outline" iconFamily="Ionicons" size={14} color="rgba(255,255,255,0.8)" />
              <Typography size={14} color="rgba(255,255,255,0.8)" mL={4}>
                {drill.duration}
              </Typography>
            </View>
            <View style={styles.heroMetaItem}>
              <Icon name="locate-outline" iconFamily="Ionicons" size={14} color="rgba(255,255,255,0.8)" />
              <Typography size={14} color="rgba(255,255,255,0.8)" mL={4}>
                {drill.level}
              </Typography>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.listenRow} activeOpacity={0.88}>
          <Icon name="volume-high" iconFamily="Ionicons" size={22} color={COLORS.primary} />
          <Typography fFamily="barlowSemiBold600" size={14} color={COLORS.white100} mL={12}>
            Listen to instructions
          </Typography>
        </TouchableOpacity>

        <View style={styles.stepsGroup}>
          {DRILL_STEPS.map((step, i) => {
            const done = completedSteps.includes(i);
            return (
              <TouchableOpacity
                key={step}
                style={[styles.stepCard, done && styles.stepCardDone]}
                onPress={() => toggleStep(i)}
                activeOpacity={0.88}
              >
                <View style={styles.stepInner}>
                  <View style={[styles.stepNum, done && styles.stepNumDone]}>
                    {done ? (
                      <Icon name="checkmark-circle" iconFamily="Ionicons" size={18} color={COLORS.white100} />
                    ) : (
                      <Typography size={12} color={COLORS.courseTextMuted} fFamily="barlowBold700">
                        {i + 1}
                      </Typography>
                    )}
                  </View>
                  <Typography
                    fFamily="barlowMedium500"
                    size={14}
                    lineHeight={21}
                    color={done ? COLORS.primary : COLORS.white100}
                    style={styles.stepText}
                  >
                    {step}
                  </Typography>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Typography size={12} color="#999999" fFamily="barlowBold700">
              Progress
            </Typography>
            <Typography fFamily="barlowBold700" size={14} color={COLORS.primary}>
              {completedSteps.length}/{DRILL_STEPS.length}
            </Typography>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${(completedSteps.length / DRILL_STEPS.length) * 100}%` },
              ]}
            />
          </View>
        </View>

        {allDone ? (
          <View style={styles.completeCard}>
            <Icon name="checkmark-circle" iconFamily="Ionicons" size={32} color="#4ADE80" />
            <Typography fFamily="barlowBold700" size={20} color="#4ADE80" mT={8}>
              Drill Complete!
            </Typography>
            <Typography size={14} color={COLORS.courseTextMuted} mT={4} textAlign="center">
              Nice work on the range.
            </Typography>
          </View>
        ) : null}
      </ScrollView>
    </CourseLayout>
  );
};

export default CourseTrainDetailScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(16),
    paddingTop: Sizer.vSize(20),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(20),
  },
  hero: {
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    padding: Sizer.hSize(20),
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(16),
    marginTop: Sizer.vSize(8),
  },
  heroMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.courseBorder,
    padding: Sizer.hSize(16),
  },
  stepsGroup: {
    gap: Sizer.vSize(8),
  },
  stepCard: {
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.courseBorder,
    padding: Sizer.hSize(16),
  },
  stepCardDone: {
    backgroundColor: 'rgba(235, 108, 15, 0.1)',
    borderColor: 'rgba(235, 108, 15, 0.3)',
  },
  stepInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNum: {
    width: Sizer.hSize(32),
    height: Sizer.hSize(32),
    borderRadius: Sizer.hSize(16),
    backgroundColor: COLORS.courseBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Sizer.hSize(12),
  },
  stepNumDone: {
    backgroundColor: COLORS.primary,
  },
  stepText: {
    flex: 1,
  },
  progressCard: {
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.courseBorder,
    padding: Sizer.hSize(16),
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Sizer.vSize(8),
  },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.courseBorder,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  completeCard: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    padding: Sizer.hSize(20),
    alignItems: 'center',
  },
});
