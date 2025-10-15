import React, { useState, useCallback, useEffect } from 'react';
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
//-----
import { Button, Header, TextField } from '../../../components';
import { Container, FormController, Typography } from '../../../atomComponents';
import { COLORS, FONTS } from '../../../globalStyle/Theme';
import { changePassword } from '../../../api/userService';
import { useCustomMutation } from '../../../query/useCustomMutation';
import { formatBackendErrors, showMessage } from '../../../utils';
import validatoinSchema from '../../../validations';

const ChangePasswordScreen = () => {
  const { mutateAsync: changePass, isPending } = useCustomMutation({
    mutationFn: changePassword,
    onSuccess: (res, { resetForm }) => {
      showMessage({ message: res?.message, type:"success" });
      resetForm();
    },
  });

  const handleChangePassword = (values, { resetForm , setErrors}) => {
    changePass({ ...values, resetForm }).catch(err => {
      const response = err?.response;
      console.log("🚀 ~ handleChangePassword ~ response:", response)
      const parsedErrors = formatBackendErrors(response?.data?.errors);
      setErrors(parsedErrors);
    });
  };

  return (
    <Container isPadding={false}>
      <Header type="app" title={'Change Password'} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ gap: 15 }}>
            <FormController
              validationSchema={
                validatoinSchema.authValidations.changePaswordSchema
              }
              initialValues={{
                current_password: __DEV__ ? '' : '',
                password: __DEV__ ? '' : '',
                password_confirmation: __DEV__ ? '' : '',
              }}
              onSubmit={handleChangePassword}
            >
              {props => {
                const {
                  handleSubmit,
                  handleChange,
                  handleBlur,
                  values,
                  errors,
                } = props;

                return (
                  <>
                    <InputLabel title="Current Password" />
                    <TextField
                      placeholder="Current Password"
                      leftIcon
                      leftIconName="key"
                      rightIcon
                      password
                      handleChange={handleChange('current_password')}
                      value={values.current_password}
                      error={errors.current_password}
                      onBlur={handleBlur('current_password')}
                    />
                    <InputLabel title="New Password" />

                    <TextField
                      placeholder="New Password"
                      leftIcon
                      leftIconName="key"
                      rightIcon
                      password
                      handleChange={handleChange('password')}
                      value={values.password}
                      error={errors.password}
                      onBlur={handleBlur('password')}
                    />
                    <InputLabel title="Confirm Password" />

                    <TextField
                      placeholder="Confirm Password"
                      leftIcon
                      leftIconName="key"
                      rightIcon
                      password
                      handleChange={handleChange('password_confirmation')}
                      value={values.password_confirmation}
                      error={errors.password_confirmation}
                      onBlur={handleBlur('password_confirmation')}
                    />
                    <Button
                      label="Save Changes"
                      onPress={handleSubmit}
                      loader={isPending}
                      disabled={isPending}
                      mt={30}
                    />
                  </>
                );
              }}
            </FormController>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

const InputLabel = ({ title = '', ...props }) => {
  return (
    <Typography
      mT={12}
      size={12}
      color={COLORS.primary}
      fFamily="barlowMedium500"
      {...props}
    >
      {title}
    </Typography>
  );
};

const styles = StyleSheet.create({
  label: {
    fontFamily: FONTS.Medium,
    color: COLORS.text,
  },
});

export default ChangePasswordScreen;
