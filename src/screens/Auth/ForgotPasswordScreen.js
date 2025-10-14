import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
//---
import {
  Container,
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
  // Forget Password Mutation:
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

  // Handle Forgot Passeord:
  const handleForgotPassword = (values, { setErrors }) => {
    fp(values).catch(err => {
      const response = err?.response;
      const parsedErrors = formatBackendErrors(response.data.errors);
      setErrors(parsedErrors);
    });
  };

  return (
    <SafeAreaWrapper>
      <Header type="title" iconColor={COLORS.white100} left={Sizer.hSize(0)} />

      <Typography
        size={40}
        textAlign="center"
        mT={52}
        fFamily="barlowBoldItalic700"
      >
        Forgot Password
      </Typography>

      <Typography size={16} textAlign="center" color={COLORS.black200} mT={8}>
        Enter your email address to Verify it's you.
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
                leftIconName="mail"
                leftIconFamily="Octicons"
                keyboardType="email-address"
                mT={23}
              />

              <Button
                label={'Get Verification Code'}
                mt={30}
                onPress={handleSubmit}
                loader={isPending}
              />
            </>
          );
        }}
      </FormController>
    </SafeAreaWrapper>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({});
