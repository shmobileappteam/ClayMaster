import { View, KeyboardAvoidingView, Platform } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

//----
import { COLORS, GLOBALSTYLE } from '../globalStyle/Theme';

const SafeAreaWrapper = ({
  children,
  edges = null,
  contentStyle = {},
  bgColor = COLORS.mainBg,
  keyboardAvoid = false,
  isPadding = true,
}) => {
  const Wrapper = keyboardAvoid ? KeyboardAvoidingView : React.Fragment;

  return (
    <SafeAreaView
      {...(Platform.OS === "ios" ? { edges: { bottom: 'off', top: 'maximum' } } : {})}

      style={[
        {
          flex: 1,
          backgroundColor: bgColor,
          ...contentStyle,
        },
        isPadding && GLOBALSTYLE.paddingHor,
      ]}
      {...edges}>
      <Wrapper
        {...(keyboardAvoid
          ? {
            behavior: Platform.OS === 'ios' ? 'padding' : 'height',
            style: { flex: 1 },
            keyboardVerticalOffset: -100,
          }
          : {})}>
        {children}
      </Wrapper>
    </SafeAreaView>
  );
};

export default SafeAreaWrapper;
