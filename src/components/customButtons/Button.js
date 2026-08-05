import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import Sizer from '../../helpers/Sizer';
import { BASEOPACITY, COLORS, FONTS } from '../../globalStyle/Theme';
import Flex from '../../atomComponents/Flex';
import AppLoader from '../../atomComponents/AppLoader';

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
  fontSize = 16,
  fontFamily = FONTS.barlowSemiBold600,
  bgColor = null,
  textColor = null,
  loadColor = null,
  ...props
}) {
  let defaultBgColor;
  let defaultTextColor = COLORS.white100;
  let loaderColor = loadColor || COLORS.white100;
  let borderColor = COLORS.black100;
  let borderWidth = 0;

  if (type === 'primary') {
    defaultBgColor = disabled ? COLORS.grey200 : COLORS.primary;
  } else if (type === 'secondary') {
    defaultBgColor = disabled ? COLORS.grey200 : COLORS.white100;
    defaultTextColor = disabled ? COLORS.white100 : COLORS.black100;
    borderWidth = disabled ? 0 : Sizer.hSize(1);
  } else {
    defaultBgColor = COLORS.grey100;
    defaultTextColor = COLORS.white100;
  }

  const backgroundColor = bgColor || defaultBgColor;
  const color = textColor || defaultTextColor;

  const styles = {
    btn: {
      borderRadius: Sizer.hSize(12),
      alignItems: 'center',
      justifyContent: 'center',
      height: Sizer.hSize(52),
      borderColor: borderColor,
      borderWidth: borderWidth,
      ...(type === 'primary' && {
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.28,
        shadowRadius: 12,
      }),
    },
    btnTextStyle: {
      fontFamily: fontFamily,
      fontSize: Sizer.fS(fontSize),
      textAlign: 'center',
      textTransform: upperCase ? 'uppercase' : 'capitalize',
    },
  };

  return (
    <TouchableOpacity
      disabled={loader || disabled}
      activeOpacity={0.88}
      style={[
        styles.btn,
        {
          backgroundColor: backgroundColor,
          marginBottom: Sizer.vSize(mb),
          marginTop: Sizer.vSize(mt),
          boxSizing: 'content-box',
        },
        btnStyle,
      ]}
      onPress={onPress}
      {...props}
    >
      {loader ? (
        <AppLoader compact size="small" color={loaderColor} />
      ) : (
        <Flex gap={iconGap} algItems="center">
          {!!icon && icon}
          <Text style={[styles.btnTextStyle, { color: color }, textStyle]}>
            {label}
          </Text>
          {!!rightIcon && rightIcon}
        </Flex>
      )}
    </TouchableOpacity>
  );
}

export default Button;
