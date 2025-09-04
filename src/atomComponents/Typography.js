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
  children,
  style,
  onPress,
  ...props
}) => {
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
    ...(LineHeight && { lineHeight: Sizer.hSize(LineHeight) }),
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
