import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
//------
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import Sizer from '../../helpers/Sizer';
import { BASEOPACITY, COLORS } from '../../globalStyle/Theme';

const IconButton = ({ text = 'New Round', onPress }) => {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={BASEOPACITY} onPress={onPress}>
      <Icon
        iconFamily={'Octicons'}
        name={'plus'}
        size={Sizer.hSize(20)}
        color={COLORS.white100}
      />
      <Typography fFamily="barlowSemiBold600" size={18} color={COLORS.white100}>
        {text}
      </Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(5),
    backgroundColor: COLORS.primary,
    alignSelf: 'center',
    paddingVertical: Sizer.hSize(12),
    paddingHorizontal: Sizer.hSize(20),
    borderRadius: Sizer.hSize(10),
  },
});
export default IconButton;
