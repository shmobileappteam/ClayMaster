import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
import CourseHeader from '../../../components/course/CourseHeader';
import Icon from '../../../helpers/Icon';
import { COLORS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';

/**
 * Field Mode — Miss Diagnostics (placeholder until content ships).
 */
const CourseMissDiagnosisScreen = () => {
  return (
    <CourseLayout showModeIndicator>
      <CourseHeader title="Miss Diagnostics" />

      <View style={styles.body}>
        <View style={styles.card}>
          <View style={styles.iconRing}>
            <View style={styles.iconInner}>
              <Icon
                name="sparkles-outline"
                iconFamily="Ionicons"
                size={32}
                color={COLORS.primary}
              />
            </View>
          </View>

          <View style={styles.badge}>
            <Typography
              fFamily="barlowBold700"
              size={11}
              color={COLORS.primary}
              style={styles.badgeText}
            >
              COMING SOON
            </Typography>
          </View>

          <Typography
            fFamily="barlowBold700"
            size={22}
            color={COLORS.white100}
            textAlign="center"
            mT={16}
          >
            Miss Diagnostics
          </Typography>
          <Typography
            size={14}
            lineHeight={21}
            color={COLORS.courseTextMuted}
            textAlign="center"
            mT={10}
          >
            Personalized miss categories, cues, and fix drills are on the way.
            Check back here once this feature is ready.
          </Typography>
        </View>
      </View>
    </CourseLayout>
  );
};

export default CourseMissDiagnosisScreen;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(40),
    justifyContent: 'flex-start',
  },
  card: {
    alignItems: 'center',
    paddingHorizontal: Sizer.hSize(24),
    paddingVertical: Sizer.vSize(36),
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(16),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
  },
  iconRing: {
    width: Sizer.hSize(88),
    height: Sizer.hSize(88),
    borderRadius: Sizer.hSize(44),
    borderWidth: 1,
    borderColor: 'rgba(235,108,15,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(235,108,15,0.06)',
  },
  iconInner: {
    width: Sizer.hSize(64),
    height: Sizer.hSize(64),
    borderRadius: Sizer.hSize(32),
    backgroundColor: 'rgba(235,108,15,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    marginTop: Sizer.vSize(20),
    paddingHorizontal: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(5),
    borderRadius: Sizer.hSize(20),
    borderWidth: 1,
    borderColor: 'rgba(235,108,15,0.45)',
    backgroundColor: 'rgba(235,108,15,0.12)',
  },
  badgeText: {
    letterSpacing: 1.4,
  },
});
