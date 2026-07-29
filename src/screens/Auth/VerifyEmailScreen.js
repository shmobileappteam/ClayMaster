import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';

//------
import {
  FormController,
  SafeAreaWrapper,
  Typography,
} from '../../atomComponents';
import { Button, Header, TextField } from '../../components';
import { BASEOPACITY, COLORS } from '../../globalStyle/Theme';
import SlideInView from '../../animations/SlideView';
import Sizer from '../../helpers/Sizer';
import SuccessMessage from '../../components/SuccessMessage/SuccessMessage';
import { useCustomMutation } from '../../query/useCustomMutation';
import { getProfile, resendOtp, verifyOtp } from '../../api/userService';
import validatoinSchema from '../../validations';
import { showMessage } from '../../utils';
import { CommonActions } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../redux/slices/appSlice';
import { useResendCooldown } from '../../hooks/useResendCooldown';

const VerifyEmailScreen = ({ navigation, route }) => {
  const comeFromLogin = route.params?.fromLogin;
  const email = route.params?.email;
  const dispatch = useDispatch();

  const { user, subscriptionEnabled } = useSelector(state => state.app);

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const { secondsLeft, isCoolingDown, startCooldown } = useResendCooldown(60, {
    startOnMount: false,
  });

  // Resend Otp Query:
  const { mutateAsync: fetchOtp, isPending: isResendPending } =
    useCustomMutation({
      mutationFn: resendOtp,
    });

  // Verify Email Mutation:
  const { mutate: requestVerifyEmail, isPending } = useCustomMutation({
    mutationFn: verifyOtp,
    onSuccess: async response => {
      if (response.status) {
        try {
          const profile = await getProfile();
          if (profile?.status && profile?.user) {
            dispatch(setUser(profile.user));
          }
        } catch {
          /* continue with success UI even if profile refresh fails */
        }
        setIsEmailVerified(true);
      }
    },
  });

  // Resend Otp Request:
  const handleResendOtp = () => {
    if (isCoolingDown || isResendPending) {
      return;
    }
    fetchOtp(email).then(response => {
      startCooldown();
      showMessage({ type: 'success', message: response.message });
    });
  };

  // Enail Vefity Request:
  const handleVerifyEmail = ({ otp }) => {
    requestVerifyEmail({ email, otp });
  };

  function handleRouting() {
    if (comeFromLogin) {
      const needsSubscription =
        subscriptionEnabled && user?.subscription_status !== 'active';

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            needsSubscription
              ? {
                  name: 'SubscriptionScreen',
                  params: { fromAuth: true },
                }
              : { name: 'ModeSelectScreen' },
          ],
        }),
      );
    } else {
      navigation.replace('LoginScreen');
    }
  }

  return (
    <SafeAreaWrapper
      keyboardAvoid
      contentStyle={
        isEmailVerified && { justifyContent: 'center', alignItem: 'center' }
      }
    >
      <ScrollView
        contentContainerStyle={[
          { paddingBottom: 64 },
          isEmailVerified && {
            flexGrow: 1,
            justifyContent: 'center',
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {!isEmailVerified && (
          <Header
            isBackArrowVisible={!isEmailVerified}
            iconColor={COLORS.white100}
            left={Sizer.hSize(0)}
          />
        )}
        {!isEmailVerified && (
          <>
            <Typography
              size={40}
              textAlign="center"
              mT={52}
              fFamily="barlowBoldItalic700"
            >
              Verify Email{' '}
            </Typography>

            <Typography
              size={16}
              textAlign="center"
              color={COLORS.black200}
              mT={8}
            >
              We have sent you a verification code to your provided email
              address, Please enter the code.{' '}
            </Typography>

            <FormController
              initialValues={{
                otp: '',
              }}
              validationSchema={
                validatoinSchema.authValidations.verifyOtpSchema
              }
              onSubmit={handleVerifyEmail}
            >
              {props => {
                const {
                  handleSubmit,
                  handleChange,
                  values,
                  errors,
                  handleBlur,
                } = props;

                return (
                  <>
                    <TextField
                      placeholder="Enter 6-Digit Code"
                      leftIcon
                      leftIconName="number"
                      leftIconFamily="Octicons"
                      keyboardType="number-pad"
                      maxLength={6}
                      handleChange={handleChange('otp')}
                      value={values?.otp}
                      error={errors?.otp}
                      onBlur={handleBlur('otp')}
                      mT={23}
                      returnKeyType="done"
                    />
                    <TouchableOpacity
                      activeOpacity={BASEOPACITY}
                      style={styles.resenStyles}
                      disabled={isCoolingDown || isResendPending}
                      onPress={handleResendOtp}
                    >
                      <Typography fontSize={14} fFamily="poppinsMedium500">
                        Didn’t receive the code?{' '}
                        <Typography
                          fontSize={15}
                          mL={6}
                          fFamily="poppinsMedium500"
                          color={
                            isCoolingDown || isResendPending
                              ? COLORS.black200
                              : COLORS.primary
                          }
                        >
                          {isResendPending
                            ? 'Resending...'
                            : isCoolingDown
                              ? `Resend in ${secondsLeft}s`
                              : 'Resend Now'}
                        </Typography>
                      </Typography>
                    </TouchableOpacity>
                    <Button
                      label={'Verify Now'}
                      mt={12}
                      onPress={handleSubmit}
                      loader={isPending}
                    />
                  </>
                );
              }}
            </FormController>
          </>
        )}

        {isEmailVerified && (
          <SlideInView slide="right" slideDuration={350}>
            <SuccessMessage
              title="Email Verified Successfully"
              message="Your email has been successfully verified. You can now log in to your account."
              buttonLabel={comeFromLogin ? 'Continue' : 'Login Now'}
              onPress={handleRouting}
            />
          </SlideInView>
        )}
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default VerifyEmailScreen;

const styles = StyleSheet.create({
  resenStyles: {
    justifyContent: 'center',
    marginTop: Sizer.vSize(30),
    alignItems: 'center',
  },
});
