import { StyleSheet, Text, View, Linking } from 'react-native';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//------------------
import {
  Flex,
  FormController,
  SafeAreaWrapper,
  Typography,
} from '../../atomComponents';
import { Button, Header, TextField } from '../../components';
import { login } from '../../api/userService';
import { useCustomMutation } from '../../query/useCustomMutation';
import { onLoginSuccess } from '../../query/partials/responseManager';
import validatoinSchema from '../../validations';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import { KEYS } from '../../constants';
import { storage } from '../../api/api';
import { formatBackendErrors } from '../../utils';

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { subscriptionEnabled } = useSelector(state => state.app);

  const [isLoading, setIsLoading] = useState(false);

  // Login Mutation:
  const { mutateAsync: requestLogin, isPending } = useCustomMutation({
    mutationFn: data => login(data, setIsLoading),
    onSuccess: (response, reqData) => {
      onLoginSuccess(
        response,
        navigation,
        dispatch,
        reqData,
        setIsLoading,
        subscriptionEnabled,
      );
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  // Handle Request:
  const handleLogin = async (values, { setErrors }) => {
    // const device_token = await AsyncStorage.getItem(KEYS.FCM_TOKEN);
    const device_token = storage.getString(KEYS.FCM_TOKEN);
    console.log('🚀 ~ handleLogin ~ device_token:', device_token);

    requestLogin({ ...values, device_token }).catch(err => {
      const response = err?.response;
      const parsedErrors = formatBackendErrors(response.data.errors);
      setErrors(parsedErrors);
    });
  };
  return (
    <SafeAreaWrapper>
      <Header
        iconColor={COLORS.white100}
        left={Sizer.hSize(0)}
        isBackVisible={false}
      />
      <Typography
        size={40}
        textAlign="center"
        mT={52}
        fFamily="barlowBoldItalic700"
      >
        Welcome Back!{' '}
      </Typography>

      <Typography size={16} textAlign="center" color={COLORS.black200} mT={8}>
        Sign in to continue{' '}
      </Typography>

      <FormController
        initialValues={{
          email: __DEV__ ? 'max@mailinator.com' : '',
          password: __DEV__ ? 'Admin@12345' : '',
        }}
        validationSchema={validatoinSchema.authValidations.SignInSchema}
        onSubmit={handleLogin}
      >
        {props => {
          const { handleSubmit, handleChange, values, errors, handleBlur } =
            props;

          return (
            <>
              <TextField
                placeholder="Email"
                leftIcon
                mT={23}
                handleChange={handleChange('email')}
                value={values?.email}
                error={errors?.email}
                onBlur={handleBlur('email')}
              />
              <TextField
                placeholder="Password"
                handleChange={handleChange('password')}
                value={values?.password}
                error={errors?.password}
                onBlur={handleBlur('password')}
                leftIcon
                leftIconName="key"
                rightIcon
                password
                mT={23}
              />
              <Typography
                fFamily={'barlowSemiBold600'}
                textAlign="right"
                mT={15}
                color={COLORS.primary}
                onPress={() => navigation.navigate('ForgotPasswordScreen')}
              >
                Forgot password?
              </Typography>
              <Button
                label="Login"
                mt={30}
                onPress={handleSubmit}
                loader={isLoading}
              />
            </>
          );
        }}
      </FormController>
      <Flex jusContent={'center'} mT={28} algItems={'center'}>
        <Typography color={COLORS.black100}>Create a New Account? </Typography>
        <Typography
          color={COLORS.orange100}
          size={15}
          fFamily="plusJakartaSansSemiBold600"
          onPress={() => {
            navigation.navigate('SignupScreen');
          }}
        >
          Sign Up{' '}
        </Typography>
      </Flex>
      <Typography
        textAlign="center"
        mT={20}
        color={COLORS.primary}
        fFamily="barlowMedium500"
        onPress={() => Linking.openURL('mailto:support@claymaster.net')}
      >
        Help and Support
      </Typography>
    </SafeAreaWrapper>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
