import { BackHandler, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { CommonActions } from '@react-navigation/native';
//---------
import {
  FormController,
  SafeAreaWrapper,
  Typography,
} from '../../atomComponents';
import { Button, Header, TextField } from '../../components';
import { BASEOPACITY, COLORS } from '../../globalStyle/Theme';
import SuccessMessage from '../../components/SuccessMessage/SuccessMessage';
import SlideInView from '../../animations/SlideView';
import validatoinSchema from '../../validations';
import { useCustomMutation } from '../../query/useCustomMutation';
import { resendPasswordOtp, resetPassword } from '../../api/userService';
import { onResetPasswordError } from '../../query/partials/responseManager';
import { showMessage } from '../../utils';
import Sizer from '../../helpers/Sizer';

const ResetPasswordScreen = ({ navigation, route }) => {
  const email = route?.params?.email;
  console.log('🚀 ~ ResetPasswordScreen ~ email:', email);
  const [screenType, setScreenType] = useState('verification');

  // Reset Mutation Hook:
  const { mutate: resetPass, isPending } = useCustomMutation({
    mutationFn: resetPassword,
    onSuccess: response => {
      if (response?.message) {
        setScreenType('success');
      }
    },
    on422Error: parsedErrors => {
      if (parsedErrors?.otp) {
        setScreenType('verification');
      }
    },
    onError: response =>
      onResetPasswordError(response, setScreenType, navigation),
  });

  //  Resend Otp:
  const { mutate: fetchOtp, isPending: isResendOtpPending } = useCustomMutation(
    {
      mutationFn: resendPasswordOtp,
      onSuccess: response => {
        if (response.status) {
          showMessage({
            type: 'success',
            message: response?.message,
            position: 'top',
          });
        }
      },
    },
  );

  //All Request Handler:

  //Handle Reset Password
  const handleResetPassword = values => {
    resetPass({ ...values });
  };

  // Resend Otp Request:
  const handleResendOtp = values => {
    console.log('🚀 ~ handleResendOtp ~ values:', values);
    fetchOtp({ email });
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (screenType == 'reset') {
          setScreenType('verification');
          return true;
        } else {
          return false;
        }
      },
    );

    return () => backHandler.remove();
  }, [screenType]);

  return (
    <SafeAreaWrapper
      contentStyle={
        screenType == 'success' && {
          justifyContent: 'center',
          alignItem: 'center',
        }
      }
    >
      {screenType !== 'success' && (
        <Header
          type="title"
          onPresBack={
            screenType == 'reset' ? () => setScreenType('verification') : null
          }
          iconColor={COLORS.white100}
          left={Sizer.hSize(0)}
        />
      )}

      <FormController
        initialValues={{
          otp: '',
          password: 'Admin@12345',
          password_confirmation: 'Admin@12345',
          email: email,
        }}
        validationSchema={validatoinSchema.authValidations.ResetPasswordSchema}
        onSubmit={handleResetPassword}
      >
        {props => {
          const {
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            errors,
            setErrors,
            setFieldTouched,
          } = props;

          return (
            <>
              {screenType === 'verification' && (
                <SlideInView slide="right" slideDuration={400}>
                  <Typography
                    size={40}
                    textAlign="center"
                    mT={52}
                    fFamily="barlowBoldItalic700"
                  >
                    Verify Email
                  </Typography>

                  <Typography
                    size={16}
                    textAlign="center"
                    color={COLORS.black200}
                    mT={8}
                  >
                    have sent you a verification code to Please enter the code
                    below.{' '}
                  </Typography>

                  <TextField
                    placeholder="Enter 6-Digit Code"
                    value={values?.otp}
                    error={errors?.otp}
                    handleChange={handleChange('otp')}
                    handleBlur={handleBlur('otp')}
                    leftIcon
                    leftIconName="number"
                    leftIconFamily="Octicons"
                    keyboardType="number-pad"
                    maxLength={6}
                    mT={23}
                  />

                  <TouchableOpacity
                    activeOpacity={BASEOPACITY}
                    style={styles.resenStyles}
                    disabled={isResendOtpPending}
                    onPress={handleResendOtp.bind(this, values)}
                  >
                    <Typography fontSize={14} fFamily="poppinsMedium500">
                      Didn’t receive the code?{' '}
                      <Typography
                        fontSize={15}
                        mL={6}
                        fFamily="poppinsMedium500"
                        color={COLORS.primary}
                      >
                        Resend Now{' '}
                      </Typography>
                    </Typography>
                  </TouchableOpacity>

                  <Button
                    label={'Verify'}
                    mt={35}
                    onPress={async () => {
                      try {
                        await validatoinSchema.authValidations.ResetPasswordSchema.validateAt(
                          'otp',
                          values,
                        );
                        setScreenType('reset');
                      } catch (err) {
                        setFieldTouched('otp', true);
                        setErrors({ otp: err.message });
                      }
                    }}
                  />
                </SlideInView>
              )}

              {screenType === 'reset' && (
                <SlideInView slide="right" slideDuration={350}>
                  <Typography fFamily="poppinsSemiBold600" size={30} mT={30}>
                    Reset Your Password
                  </Typography>
                  <Typography size={14} LineHeight={22}>
                    Please enter your new password below.
                  </Typography>

                  <TextField
                    placeholder="New Password"
                    value={values?.password}
                    error={errors?.password}
                    handleChange={handleChange('password')}
                    handleBlur={handleBlur('password')}
                    leftIcon
                    leftIconName="key"
                    rightIcon
                    password
                    mT={23}
                  />
                  <TextField
                    placeholder="Confirm New Password"
                    value={values?.password_confirmation}
                    error={errors?.password_confirmation}
                    handleChange={handleChange('password_confirmation')}
                    handleBlur={handleBlur('password_confirmation')}
                    leftIcon
                    leftIconName="key"
                    rightIcon
                    password
                    mT={23}
                  />
                  <Button
                    label={'Change Password'}
                    mt={35}
                    loader={isPending}
                    onPress={handleSubmit}
                  />
                </SlideInView>
              )}

              {screenType === 'success' && (
                <SlideInView slide="right" slideDuration={350}>
                  <SuccessMessage
                    title="Password Changed Successfully"
                    message="You have successfully updated your password. Please use your new password when logging in."
                    buttonLabel="Login Now"
                    onPress={() =>
                      navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [
                            {
                              name: 'LoginScreen',
                            },
                          ],
                        }),
                      )
                    }
                  />
                </SlideInView>
              )}
            </>
          );
        }}
      </FormController>
    </SafeAreaWrapper>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  resenStyles: {
    justifyContent: 'center',
    marginTop: Sizer.vSize(18),
    alignItems: 'center',
  },
});
