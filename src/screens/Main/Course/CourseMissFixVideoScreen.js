import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
import CourseHeader from '../../../components/course/CourseHeader';
import Icon from '../../../helpers/Icon';
import { COLORS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { getMissCategory } from '../../../constants/missCategories';

const CourseMissFixVideoScreen = ({ navigation, route }) => {
  const cat = getMissCategory(route?.params?.categoryId);

  return (
    <CourseLayout showTabs={false}>
      <CourseHeader title="Fix Video" showBack onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.player}>
          <TouchableOpacity style={styles.playBtn}>
            <Icon name="play" iconFamily="Ionicons" size={32} color={COLORS.white100} />
          </TouchableOpacity>
        </View>
        <Typography fFamily="barlowBold700" size={22} color={COLORS.white100} mT={16}>
          {cat?.videoTitle ?? 'Why It Happens'}
        </Typography>
        <Typography size={14} color={COLORS.courseTextMuted} mT={8} lineHeight={22}>
          {cat?.cue ?? 'Watch this short explanation to understand the root cause of your miss.'}
        </Typography>
        <TouchableOpacity style={styles.replayBtn}>
          <Icon name="refresh" iconFamily="Ionicons" size={18} color={COLORS.primary} />
          <Typography fFamily="barlowSemiBold600" size={15} color={COLORS.primary} mL={8}>
            Replay
          </Typography>
        </TouchableOpacity>
      </ScrollView>
    </CourseLayout>
  );
};

export default CourseMissFixVideoScreen;

const styles = StyleSheet.create({
  scroll: { padding: Sizer.hSize(16), paddingBottom: Sizer.vSize(40) },
  player: {
    aspectRatio: 16 / 9,
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: Sizer.hSize(64),
    height: Sizer.hSize(64),
    borderRadius: Sizer.hSize(32),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  replayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizer.vSize(24),
    height: Sizer.vSize(48),
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
});
