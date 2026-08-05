import { ScrollView, StyleSheet } from 'react-native';
import React from 'react';
//---
import {
  FormController,
  SafeAreaWrapper,
  Typography,
} from '../../atomComponents';
import { Button, Header, TextField } from '../../components';
import { COLORS } from '../../globalStyle/Theme';
import validatoinSchema from '../../validations';
import { useCustomMutation } from '../../query/useCustomMutation';
import { forgotPassword } from '../../api/userService';
import { formatBackendErrors } from '../../utils';
import Sizer from '../../helpers/Sizer';

const ForgotPasswordScreen = ({ navigation }) => {
  const { mutateAsync: fp, isPending } = useCustomMutation({
    mutationFn: forgotPassword,
    onSuccess: (response, { email }) => {
      if (response.message) {
        navigation.navigate('ResetPasswordScreen', {
          email: email,
        });
      }
    },
  });

  const handleForgotPassword = (values, { setErrors }) => {
    fp(values).catch(err => {
      const response = err?.response;
      if (response?.data?.errors) {
        const parsedErrors = formatBackendErrors(response.data.errors);
        setErrors(parsedErrors);
      }
    });
  };

  return (
    <SafeAreaWrapper keyboardAvoid>
      <Header
        iconColor={COLORS.white100}
        left={Sizer.hSize(0)}
        isBackVisible={true}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <Typography
          size={40}
          textAlign="center"
          mT={52}
          fFamily="barlowBoldItalic700"
        >
          Reset password
        </Typography>

        <Typography size={16} textAlign="center" color={COLORS.black200} mT={8}>
          Enter your email to receive a verification code
        </Typography>

        <FormController
          initialValues={{ email: __DEV__ ? 'david@mailinator.com' : '' }}
          validationSchema={validatoinSchema.authValidations.ForgotPasswordSchema}
          onSubmit={handleForgotPassword}
        >
          {props => {
            const { handleSubmit, handleBlur, handleChange, values, errors } =
              props;
            return (
              <>
                <TextField
                  placeholder="Email"
                  handleChange={handleChange('email')}
                  handleBlur={handleBlur('email')}
                  value={values?.email}
                  error={errors?.email}
                  leftIcon
                  mT={23}
                  keyboardType="email-address"
                />

                <Button
                  label="Send code"
                  mt={30}
                  onPress={handleSubmit}
                  loader={isPending}
                />
              </>
            );
          }}
        </FormController>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Sizer.vSize(32),
  },
});
