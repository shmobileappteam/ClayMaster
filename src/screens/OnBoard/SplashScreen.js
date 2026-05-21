import React, { useEffect } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { cmLogo } from '../../assets/images';
import { useAppMode } from '../../context/AppModeContext';
import { useCustomMutation } from '../../query/useCustomMutation';
import { onLoginSuccess } from '../../query/partials/responseManager';
import { login } from '../../api/userService';
import { handleLogout } from '../../redux/slices/appSlice';
import { KEYS } from '../../constants';
import { storage } from '../../api/api';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

/** Web `Splash.tsx` — `.cm-gradient` linear-gradient(180deg, #000000 0%, #974000 100%) */
const SplashScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { subscriptionEnabled } = useSelector(state => state.app);
  const { mode, activeRound } = useAppMode();

  const { mutate: requestLogin } = useCustomMutation({
    mutationFn: data => login(data, () => {}),
    onSuccess: (response, reqData) => {
      onLoginSuccess(
        response,
        navigation,
        dispatch,
        reqData,
        () => {},
        subscriptionEnabled,
        { showModeSelect: false },
      );
    },
    onError: () => {
      dispatch(handleLogout());
      navigation.replace('LoginScreen');
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      checkUser();
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const checkUser = () => {
    try {
      const onboarded = storage.getString(KEYS.IS_ONBOARD);
      if (!onboarded) {
        navigation.replace('OnboardingScreen');
        return;
      }

      if (activeRound && !activeRound.finished) {
        navigation.replace('CourseRoundScreen');
        return;
      }

      const credentials = storage.getString(KEYS.CREDENTIALS);
      if (credentials) {
        const userData = JSON.parse(credentials);
        const device_token = storage.getString(KEYS.FCM_TOKEN);
        requestLogin({ ...userData, device_token });
        return;
      }

      if (mode === 'course') {
        navigation.replace('CourseHomeScreen');
      } else {
        navigation.replace('LoginScreen');
      }
    } catch {
      navigation.replace('LoginScreen');
    }
  };

  return (
    <View style={styles.container}>
      <Svg width={SCREEN_W} height={SCREEN_H} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="splashGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#000000" />
            <Stop offset="1" stopColor="#974000" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width={SCREEN_W} height={SCREEN_H} fill="url(#splashGradient)" />
      </Svg>
      <Image source={cmLogo} style={styles.logo} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  logo: {
    width: 200,
    height: 120,
    tintColor: '#FFFFFF',
  },
});

export default SplashScreen;
