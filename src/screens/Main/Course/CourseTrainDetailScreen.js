import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
import CourseHeader from '../../../components/course/CourseHeader';
import Icon from '../../../helpers/Icon';
import { COLORS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';

const CourseTrainDetailScreen = ({ navigation, route }) => {
  const title = route?.params?.title ?? 'Training Drill';

  return (
    <CourseLayout showTabs={false}>
      <CourseHeader title="Drill" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Typography fFamily="barlowBold700" size={24} color={COLORS.white100}>{title}</Typography>
        <View style={styles.steps}>
          {['Set up at station', 'Run 5 pairs focusing on cue', 'Log hits and misses'].map((step, i) => (
            <View key={step} style={styles.step}>
              <View style={styles.stepNum}><Typography color={COLORS.white100} fFamily="barlowBold700">{i + 1}</Typography></View>
              <Typography size={14} color={COLORS.courseTextMuted} style={{ flex: 1 }}>{step}</Typography>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('CourseAudioTipScreen')}>
          <Icon name="volume-high" iconFamily="Ionicons" size={20} color={COLORS.primary} />
          <Typography color={COLORS.primary} mL={8} fFamily="barlowSemiBold600">Audio tip</Typography>
        </TouchableOpacity>
      </ScrollView>
    </CourseLayout>
  );
};

export default CourseTrainDetailScreen;

const styles = StyleSheet.create({
  scroll: { padding: Sizer.hSize(16), paddingBottom: Sizer.vSize(40) },
  steps: { marginTop: Sizer.vSize(24), gap: Sizer.vSize(12) },
  step: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(12) },
  stepNum: {
    width: Sizer.hSize(28),
    height: Sizer.hSize(28),
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Sizer.vSize(32),
    padding: Sizer.hSize(16),
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
});
