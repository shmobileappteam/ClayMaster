import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
import CourseHeader from '../../../components/course/CourseHeader';
import Icon from '../../../helpers/Icon';
import { COLORS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { getMissCategory } from '../../../constants/missCategories';

const CourseMissFixAudioScreen = ({ navigation, route }) => {
  const [playing, setPlaying] = useState(false);
  const cat = getMissCategory(route?.params?.categoryId);

  return (
    <CourseLayout showTabs={false}>
      <CourseHeader title="Audio Fix" showBack onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <View style={styles.iconCircle}>
          <Icon name="volume-high" iconFamily="Ionicons" size={48} color={COLORS.primary} />
        </View>
        <Typography fFamily="barlowBold700" size={22} color={COLORS.white100} textAlign="center" mT={24}>
          {cat?.name ?? 'Field Cue'}
        </Typography>
        <Typography size={14} color={COLORS.courseTextMuted} mT={8} textAlign="center" style={{ fontStyle: 'italic' }}>
          "{cat?.cue}"
        </Typography>
        <View style={styles.controls}>
          <TouchableOpacity><Icon name="play-skip-back" iconFamily="Ionicons" size={28} color="#888" /></TouchableOpacity>
          <TouchableOpacity style={styles.mainPlay} onPress={() => setPlaying(!playing)}>
            <Icon name={playing ? 'pause' : 'play'} iconFamily="Ionicons" size={32} color={COLORS.white100} />
          </TouchableOpacity>
          <TouchableOpacity><Icon name="play-skip-forward" iconFamily="Ionicons" size={28} color="#888" /></TouchableOpacity>
        </View>
      </View>
    </CourseLayout>
  );
};

export default CourseMissFixAudioScreen;

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Sizer.hSize(24) },
  iconCircle: {
    width: Sizer.hSize(120),
    height: Sizer.hSize(120),
    borderRadius: Sizer.hSize(60),
    backgroundColor: COLORS.courseSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(32),
    marginTop: Sizer.vSize(48),
  },
  mainPlay: {
    width: Sizer.hSize(72),
    height: Sizer.hSize(72),
    borderRadius: Sizer.hSize(36),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
