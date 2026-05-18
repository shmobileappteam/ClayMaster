import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
import CourseHeader from '../../../components/course/CourseHeader';
import Icon from '../../../helpers/Icon';
import { COLORS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';

const CourseAudioTipScreen = ({ navigation }) => {
  const [playing, setPlaying] = useState(false);

  return (
    <CourseLayout showTabs={false}>
      <CourseHeader title="Audio Tip" showBack onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <Typography fFamily="barlowBold700" size={22} color={COLORS.white100} textAlign="center">
          Station Focus Cue
        </Typography>
        <Typography size={14} color={COLORS.courseTextMuted} mT={8} textAlign="center">
          "See the target longer before you move."
        </Typography>
        <View style={styles.controls}>
          <TouchableOpacity><Icon name="play-skip-back" iconFamily="Ionicons" size={28} color="#888" /></TouchableOpacity>
          <TouchableOpacity style={styles.play} onPress={() => setPlaying(!playing)}>
            <Icon name={playing ? 'pause' : 'play'} iconFamily="Ionicons" size={32} color={COLORS.white100} />
          </TouchableOpacity>
          <TouchableOpacity><Icon name="play-skip-forward" iconFamily="Ionicons" size={28} color="#888" /></TouchableOpacity>
        </View>
      </View>
    </CourseLayout>
  );
};

export default CourseAudioTipScreen;

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Sizer.hSize(24) },
  controls: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(32), marginTop: Sizer.vSize(48) },
  play: {
    width: Sizer.hSize(72),
    height: Sizer.hSize(72),
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
