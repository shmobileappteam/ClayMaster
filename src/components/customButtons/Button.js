import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

import Sizer from '../../helpers/Sizer';
import {BASEOPACITY, COLORS, FONTS} from '../../globalStyle/Theme';
import Flex from '../../atomComponents/Flex';

function Button({
  label = 'Custom Button',
  btnStyle = '',
  textStyle = '',
  loader = false,
  disabled = false,
  upperCase = false,
  onPress = () => {},
  icon = false,
  rightIcon = false,
  type = 'primary',
  mb = 0,
  mt = 0,
  iconGap = 8,
  fontSize = 14,
  ...props
}) {
  let bgColor;
  let textColor = COLORS.whiteV1;
  let loaderColor = COLORS.whiteV1;
  let borderColor = COLORS.primary;
  let borderWidth = 1;

  if (type === 'primary') {
    bgColor = disabled ? COLORS.greyV1 : COLORS.primary;
    borderColor = disabled ? COLORS.greyV1 : COLORS.primary;
  } else if (type === 'secondary') {
    bgColor = disabled ? COLORS.greyV1 : COLORS.secondary;
    borderColor = disabled ? COLORS.greyV1 : COLORS.secondary;
  } else if (type === 'danger') {
    bgColor = COLORS.dangerV1;
    borderColor = COLORS.dangerV1;
  } else if (type === 'success') {
    bgColor = COLORS.greenV1;
    borderColor = COLORS.greenV1;
  } else if (type === 'dark') {
    bgColor = disabled ? COLORS.greyV1 : COLORS.darkV3;
    borderColor = disabled ? COLORS.greyV1 : COLORS.darkV3;
  } else if (type === 'outline') {
    borderWidth = 1;
    bgColor = 'transparent';
    textColor = COLORS.darkV1;
    loaderColor = COLORS.whiteV1;
    borderColor = COLORS.greyV1;
  } else if (type === 'blue') {
    bgColor = COLORS.blueV1;
    borderColor = COLORS.blueV1;
    textColor = COLORS.whiteV1;
    loaderColor = COLORS.whiteV1;
  } else {
    bgColor = COLORS.whiteV1;
    borderColor = COLORS.whiteV1;
    textColor = COLORS.darkV1;
    loaderColor = COLORS.whiteV1;
  }

  const styles = {
    btn: {
      borderRadius: Sizer.fS(15),
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Sizer.hSize(10),
      paddingHorizontal: Sizer.hSize(12),
      borderColor: borderColor,
      borderWidth: borderWidth,
    },
    btnTextStyle: {
      fontFamily: FONTS.medium,
      fontSize: Sizer.fS(fontSize),
      textAlign: 'center',
      textTransform: upperCase ? 'uppercase' : 'capitalize',
    },
  };

  return (
    <TouchableOpacity
      disabled={loader || disabled}
      activeOpacity={BASEOPACITY}
      style={[
        styles.btn,
        {
          backgroundColor: bgColor,
          marginBottom: Sizer.hSize(mb),
          marginTop: Sizer.hSize(mt),
        },
        btnStyle,
      ]}
      onPress={onPress}
      {...props}>
      {loader ? (
        <ActivityIndicator size={Sizer.fS(16)} color={loaderColor} />
      ) : (
        <Flex gap={iconGap} algItems="center">
          {!!icon && icon}
          <Text style={[styles.btnTextStyle, {color: textColor}, textStyle]}>
            {label}
          </Text>
          {!!rightIcon && rightIcon}
        </Flex>
      )}
    </TouchableOpacity>
  );
}

export default React.memo(Button);
