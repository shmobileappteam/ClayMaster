import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
import CourseHeader from '../../../components/course/CourseHeader';
import Icon from '../../../helpers/Icon';
import { COLORS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { getMissCategory } from '../../../constants/missCategories';

const CourseMissFixDrillScreen = ({ navigation, route }) => {
  const cat = getMissCategory(route?.params?.categoryId);

  return (
    <CourseLayout showTabs={false}>
      <CourseHeader title="Quick Drill" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <Icon name="barbell" iconFamily="Ionicons" size={40} color={COLORS.primary} />
        </View>
        <Typography fFamily="barlowBold700" size={24} color={COLORS.white100}>
          {cat?.drillTitle ?? 'Correction Drill'}
        </Typography>
        <View style={styles.meta}>
          <Icon name="time-outline" iconFamily="Ionicons" size={16} color="#888" />
          <Typography size={13} color="#888" mL={6}>5 min · 10 shots</Typography>
        </View>
        <Typography size={14} color={COLORS.courseTextMuted} lineHeight={22} mT={16}>
          Run this drill at your next station to correct {cat?.short?.toLowerCase() ?? 'this'} misses.
          Focus on: {cat?.cue}
        </Typography>
        <TouchableOpacity style={styles.startBtn}>
          <Icon name="play" iconFamily="Ionicons" size={20} color={COLORS.white100} />
          <Typography fFamily="barlowSemiBold600" size={16} color={COLORS.white100} mL={8}>
            Start Drill
          </Typography>
        </TouchableOpacity>
      </ScrollView>
    </CourseLayout>
  );
};

export default CourseMissFixDrillScreen;

const styles = StyleSheet.create({
  scroll: { padding: Sizer.hSize(16), paddingBottom: Sizer.vSize(40) },
  hero: {
    height: Sizer.vSize(120),
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizer.vSize(16),
  },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: Sizer.vSize(8) },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: Sizer.vSize(52),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    marginTop: Sizer.vSize(32),
  },
});
