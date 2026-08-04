import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../atomComponents';
import Icon from '../../helpers/Icon';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';

const CourseHeader = ({
  title,
  showBack,
  onBack,
  showAudio,
  onAudioToggle,
  rightAction,
}) => {
  return (
    <View style={styles.wrap}>
      <View style={styles.side}>
        {showBack ? (
          <TouchableOpacity
            onPress={onBack}
            hitSlop={12}
            style={styles.iconBtn}
            activeOpacity={0.88}
          >
            <Icon
              name="arrow-back"
              iconFamily="Ionicons"
              size={26}
              color={COLORS.white100}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      <Typography
        fFamily="barlowBold700"
        size={18}
        color={COLORS.white100}
        textAlign="center"
        style={styles.title}
        numberOfLines={1}
      >
        {title?.toUpperCase()}
      </Typography>
      <View style={[styles.side, styles.sideRight]}>
        {showAudio ? (
          <TouchableOpacity
            onPress={onAudioToggle}
            style={styles.audioBtn}
            activeOpacity={0.88}
          >
            <Icon
              name="volume-high"
              iconFamily="Ionicons"
              size={20}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        ) : null}
        {rightAction}
      </View>
    </View>
  );
};

export default CourseHeader;

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: Sizer.vSize(64),
    paddingHorizontal: Sizer.hSize(16),
    backgroundColor: 'rgba(13, 13, 13, 0.95)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.courseBorder,
  },
  side: {
    width: Sizer.hSize(48),
    minWidth: Sizer.hSize(48),
    alignItems: 'flex-start',
    zIndex: 1,
  },
  sideRight: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Sizer.hSize(4),
  },
  title: {
    flex: 1,
    letterSpacing: 0.5,
    paddingHorizontal: Sizer.hSize(4),
  },
  iconBtn: {
    padding: Sizer.hSize(4),
  },
  audioBtn: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    borderRadius: Sizer.hSize(20),
    backgroundColor: COLORS.courseSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
