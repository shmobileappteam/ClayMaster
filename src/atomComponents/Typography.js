import React from 'react';
import { Text } from 'react-native';

import { COLORS, FONTS } from '../globalStyle/Theme';
import Sizer from '../helpers/Sizer';

const Typography = ({
  color = COLORS.black100,
  size = 14,
  pT = 0,
  pB = 0,
  pR = 0,
  pL = 0,
  mT = 0,
  mB = 0,
  mL = 0,
  mR = 0,
  fFamily = 'barlowRegular400',
  textAlign = 'left',
  textTransform,
  numberOfLines,
  LineHeight,
  /** Scaled line height (logical px). Prefer over legacy LineHeight. */
  lineHeight,
  children,
  style,
  onPress,
  ...props
}) => {
  const resolvedLineHeight =
    lineHeight != null
      ? Sizer.fS(lineHeight)
      : LineHeight != null
        ? Sizer.hSize(LineHeight)
        : undefined;

  const styleObj = {
    color: color,
    fontSize: Sizer.fS(size),
    paddingTop: Sizer.hSize(pT),
    paddingBottom: Sizer.hSize(pB),
    paddingLeft: Sizer.vSize(pL),
    paddingRight: Sizer.vSize(pR),
    marginTop: Sizer.hSize(mT),
    marginBottom: Sizer.hSize(mB),
    marginLeft: Sizer.vSize(mL),
    marginRight: Sizer.vSize(mR),
    fontFamily: FONTS[fFamily],
    textAlign: textAlign,
    ...(textTransform && { textTransform: textTransform }),
    ...(resolvedLineHeight != null && { lineHeight: resolvedLineHeight }),
    ...style,
  };

  return (
    <Text
      style={styleObj}
      numberOfLines={numberOfLines}
      onPress={onPress}
      {...props}
    >
      {children}
    </Text>
  );
};

export default React.memo(Typography);
