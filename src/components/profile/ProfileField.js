import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../atomComponents';
import Icon from '../../helpers/Icon';
import { COLORS, SPACING, TYPE } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';

/** Web form field — label + h-12 card input */
const ProfileField = ({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  multiline,
  numberOfLines = 3,
  keyboardType,
  editable = true,
  secureTextEntry,
  showPasswordToggle,
  onTogglePassword,
  passwordVisible,
}) => (
  <View style={styles.wrap}>
    <Typography
      fFamily="barlowMedium500"
      size={TYPE.body.size}
      color={COLORS.textPrimary}
      mB={6}
    >
      {label}
    </Typography>
    <View style={styles.inputRow}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        editable={editable}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        style={[
          styles.input,
          multiline && styles.textArea,
          !editable && styles.inputDisabled,
          error ? styles.inputError : null,
          showPasswordToggle && styles.inputWithEye,
        ]}
      />
      {showPasswordToggle ? (
        <TouchableOpacity
          style={styles.eyeBtn}
          onPress={onTogglePassword}
          hitSlop={8}
        >
          <Icon
            name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
            iconFamily="Ionicons"
            size={20}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>
      ) : null}
    </View>
    {error ? (
      <Typography size={TYPE.caption.size} color={COLORS.destructive} mT={4}>
        {error}
      </Typography>
    ) : null}
  </View>
);

export default ProfileField;

const styles = StyleSheet.create({
  wrap: {
    marginBottom: Sizer.vSize(SPACING.component),
  },
  inputRow: {
    position: 'relative',
  },
  inputWithEye: {
    paddingRight: Sizer.hSize(44),
  },
  eyeBtn: {
    position: 'absolute',
    right: Sizer.hSize(12),
    top: 0,
    height: Sizer.vSize(48),
    justifyContent: 'center',
  },
  input: {
    height: Sizer.vSize(48),
    paddingHorizontal: Sizer.hSize(16),
    backgroundColor: COLORS.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderMuted,
    borderRadius: Sizer.hSize(12),
    fontFamily: 'Barlow-Regular',
    fontSize: Sizer.fS(TYPE.body.size),
    color: COLORS.textPrimary,
  },
  textArea: {
    height: Sizer.vSize(96),
    paddingTop: Sizer.vSize(12),
    textAlignVertical: 'top',
  },
  inputDisabled: {
    color: COLORS.textSecondary,
    backgroundColor: COLORS.surfaceMuted,
  },
  inputError: {
    borderColor: COLORS.destructive,
  },
});
