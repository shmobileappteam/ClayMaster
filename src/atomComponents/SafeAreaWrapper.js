import { KeyboardAvoidingView, Platform } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

//----
import { COLORS, GLOBALSTYLE } from '../globalStyle/Theme';

/**
 * Auth / form screens: pass `keyboardAvoid` + wrap fields in a ScrollView
 * with `keyboardShouldPersistTaps="handled"`.
 */
const SafeAreaWrapper = ({
  children,
  edges = null,
  contentStyle = {},
  bgColor = COLORS.mainBg,
  keyboardAvoid = false,
  isPadding = true,
  keyboardVerticalOffset = 0,
}) => {
  return (
    <SafeAreaView
      {...(Platform.OS === 'ios'
        ? { edges: { bottom: 'off', top: 'maximum' } }
        : {})}
      style={[
        {
          flex: 1,
          backgroundColor: bgColor,
          ...contentStyle,
        },
        isPadding && GLOBALSTYLE.paddingHor,
      ]}
      {...edges}
    >
      {keyboardAvoid ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          {children}
        </KeyboardAvoidingView>
      ) : (
        children
      )}
    </SafeAreaView>
  );
};

export default SafeAreaWrapper;
