import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Container, FormController, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import ProfileField from '../../../components/profile/ProfileField';
import Icon from '../../../helpers/Icon';
import { COLORS, SPACING, TYPE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { changePassword } from '../../../api/userService';
import { useCustomMutation } from '../../../query/useCustomMutation';
import { formatBackendErrors, showToast } from '../../../utils';
import validatoinSchema from '../../../validations';

/** ClayMaster-App-UI `ChangePassword.tsx` — keeps changePassword API */
const ChangePasswordScreen = ({ navigation }) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutateAsync: changePass, isPending } = useCustomMutation({
    mutationFn: changePassword,
    onSuccess: (res, { resetForm }) => {
      showToast({ title: res?.message || 'Password updated' });
      resetForm();
      navigation.goBack();
    },
  });

  const handleChangePassword = (values, { resetForm, setErrors }) => {
    changePass({ ...values, resetForm }).catch(err => {
      const parsedErrors = formatBackendErrors(err?.response?.data?.errors);
      setErrors(parsedErrors);
    });
  };

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Change Password"
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.iconWrap}>
            <View style={styles.lockCircle}>
              <Icon
                name="lock-closed"
                iconFamily="Ionicons"
                size={32}
                color={COLORS.primary}
              />
            </View>
          </View>

          <FormController
            validationSchema={
              validatoinSchema.authValidations.changePaswordSchema
            }
            initialValues={{
              current_password: '',
              password: '',
              password_confirmation: '',
            }}
            onSubmit={handleChangePassword}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              errors,
            }) => (
              <>
                <ProfileField
                  label="Current Password"
                  value={values.current_password}
                  onChangeText={handleChange('current_password')}
                  onBlur={handleBlur('current_password')}
                  error={errors.current_password}
                  placeholder="Enter current password"
                  secureTextEntry={!showCurrent}
                  showPasswordToggle
                  passwordVisible={showCurrent}
                  onTogglePassword={() => setShowCurrent(v => !v)}
                />
                <ProfileField
                  label="New Password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  error={errors.password}
                  placeholder="Enter new password"
                  secureTextEntry={!showNew}
                  showPasswordToggle
                  passwordVisible={showNew}
                  onTogglePassword={() => setShowNew(v => !v)}
                />
                <ProfileField
                  label="Confirm New Password"
                  value={values.password_confirmation}
                  onChangeText={handleChange('password_confirmation')}
                  onBlur={handleBlur('password_confirmation')}
                  error={errors.password_confirmation}
                  placeholder="Confirm new password"
                  secureTextEntry={!showConfirm}
                  showPasswordToggle
                  passwordVisible={showConfirm}
                  onTogglePassword={() => setShowConfirm(v => !v)}
                />

                <View style={styles.requirements}>
                  <Typography
                    fFamily="barlowMedium500"
                    size={TYPE.body.size}
                    color={COLORS.textPrimary}
                    mB={8}
                  >
                    Password Requirements:
                  </Typography>
                  {[
                    'At least 8 characters',
                    'One uppercase letter',
                    'One number',
                    'One special character',
                  ].map(line => (
                    <Typography
                      key={line}
                      size={TYPE.caption.size}
                      color={COLORS.textSecondary}
                      mB={4}
                    >
                      • {line}
                    </Typography>
                  ))}
                </View>

                <TouchableOpacity
                  style={[styles.saveBtn, isPending && styles.saveBtnDisabled]}
                  onPress={handleSubmit}
                  disabled={isPending}
                  activeOpacity={0.88}
                >
                  <Typography
                    fFamily="barlowSemiBold600"
                    size={TYPE.h3.size}
                    color={COLORS.white100}
                  >
                    {isPending ? 'Updating...' : 'Update Password'}
                  </Typography>
                </TouchableOpacity>
              </>
            )}
          </FormController>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
  },
  iconWrap: {
    alignItems: 'center',
    marginBottom: Sizer.vSize(SPACING.section),
  },
  lockCircle: {
    width: Sizer.hSize(64),
    height: Sizer.hSize(64),
    borderRadius: Sizer.hSize(32),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requirements: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: Sizer.hSize(12),
    padding: Sizer.hSize(SPACING.cardP),
    marginBottom: Sizer.vSize(SPACING.section),
  },
  saveBtn: {
    height: Sizer.vSize(48),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDisabled: { opacity: 0.6 },
});
