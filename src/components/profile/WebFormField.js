import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Typography } from '../../atomComponents';
import { COLORS, SPACING, TYPE } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';

/** Web EditProfile / ChangePassword input styling */
const WebFormField = ({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  secureTextEntry,
  keyboardType,
  multiline,
  numberOfLines = 3,
  editable = true,
  rightElement,
}) => (
  <View style={styles.wrap}>
    {label ? (
      <Typography
        fFamily="barlowMedium500"
        size={TYPE.body.size}
        color={COLORS.textPrimary}
        mB={6}
      >
        {label}
      </Typography>
    ) : null}
    <View style={styles.inputRow}>
      <TextInput
        style={[
          styles.input,
          multiline && styles.textarea,
          error && styles.inputError,
          rightElement && styles.inputWithRight,
        ]}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        editable={editable}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      {rightElement}
    </View>
    {error ? (
      <Typography size={TYPE.caption.size} color={COLORS.destructive} mT={4}>
        {error}
      </Typography>
    ) : null}
  </View>
);

export default WebFormField;

const styles = StyleSheet.create({
  wrap: {
    marginBottom: Sizer.vSize(SPACING.component),
  },
  inputRow: {
    position: 'relative',
  },
  input: {
    height: Sizer.vSize(48),
    paddingHorizontal: Sizer.hSize(16),
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    borderRadius: Sizer.hSize(12),
    fontFamily: 'Barlow-Regular',
    fontSize: Sizer.fS(TYPE.body.size),
    color: COLORS.textPrimary,
  },
  inputWithRight: {
    paddingRight: Sizer.hSize(48),
  },
  textarea: {
    height: Sizer.vSize(96),
    paddingTop: Sizer.vSize(12),
    paddingBottom: Sizer.vSize(12),
  },
  inputError: {
    borderColor: COLORS.destructive,
  },
});
