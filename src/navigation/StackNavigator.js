import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//------
import {
  ForgotPasswordScreen,
  LoginScreen,
  ResetPasswordScreen,
  SignupScreen,
  SplashScreen,
  VerifyEmailScreen,
} from '../screens';
import { COLORS } from '../globalStyle/Theme';
import BottomNavigator from './BottomNavigator';

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerTransparent: true,
        animationTypeForReplace: 'push',
        animation: 'slide_from_right',
        navigationBarColor: COLORS.mainBg,
      }}
      initialRouteName={__DEV__ ? 'SplashScreen' : 'SplashScreen'}
    >
      {/* Splash */}
      <Stack.Screen name="SplashScreen" component={SplashScreen} />

      {/* Onboard */}

      {/* Auth */}
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="VerifyEmailScreen" component={VerifyEmailScreen} />
      <Stack.Screen
        name="ForgotPasswordScreen"
        options={{ animation: 'slide_from_bottom' }}
        component={ForgotPasswordScreen}
      />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
      />

      {/* Main */}

      <Stack.Screen name="BottomTabs" component={BottomNavigator} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
