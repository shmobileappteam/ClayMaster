import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import FlashMessage from 'react-native-flash-message';

//----
import StackNavigator from './StackNavigator';
import { COLORS } from '../globalStyle/Theme';
import NetworkStateMonitor from '../utils/NetworkStateMonitor';
import { storage } from '../api/api';

const RootStack = () => {
  const navigationRef = useNavigationContainerRef();

  const [appBarStyle, setAppBarStyle] = useState({
    bgColor: COLORS.mainBg,
    contStyle: 'light-content',
    translucent: null,
  });

  const authScreens = [
    'LoginScreen',
    'SignupScreen',
    'VerifyEmailScreen',
    'ForgotPasswordScreen',
    'ResetPasswordScreen',
    'GetStartedScreen',
    'SplashScreen',
    'OnboardingScreen',
    'ModeSelectScreen',
    'AddPetScreen-',
  ];

  const handleStatusBar = () => {
    const route = navigationRef.getCurrentRoute();
``
    if (authScreens.includes(route.name)) {
      setAppBarStyle({
        bgColor: COLORS.mainBg,
        contStyle: 'dark-content',
        translucent: false,
      });
    } else if (route.name == 'OnBoardingScreen') {
      setAppBarStyle({
        bgColor: COLORS.red100,
        contStyle: 'dark-content',
        translucent: false,
      });
    } else {
      setAppBarStyle({
        bgColor: 'transparent',
        contStyle: 'light-content',
        translucent: true,
      });
    }
  };

  useEffect(() => {
    //  storage.clearAll()
    // async()=>{

    // }
    // (async () => {
    //   let fcmToken = await AsyncStorage.getItem(KEYS.FCM_TOKEN);
    //   __DEV__ && console.log(' RootStack:83 ~ fcmToken:', !!fcmToken);

    //   if (!fcmToken) {
    //     requestNotificationPermission();
    //   }
    //   notificationListener(dispatch);
    // })();
  }, []);



  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={handleStatusBar}
      onStateChange={handleStatusBar}
  >
      <FlashMessage position="top" onHide={handleStatusBar} />
      <StatusBar
        animated={true}
        backgroundColor={appBarStyle.bgColor}
        barStyle={appBarStyle.contStyle}
        translucent={appBarStyle.translucent}
        showHideTransition={'fade'}
      />
      <StackNavigator />
      {/* <Loader /> */}
      <NetworkStateMonitor />
    </NavigationContainer>
  );
};
export default RootStack;
