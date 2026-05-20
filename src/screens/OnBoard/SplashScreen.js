import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { cmLogo } from '../../assets/images';
import { useAppMode } from '../../context/AppModeContext';
import { useCustomMutation } from '../../query/useCustomMutation';
import { onLoginSuccess } from '../../query/partials/responseManager';
import { login } from '../../api/userService';
import { handleLogout } from '../../redux/slices/appSlice';
import { KEYS } from '../../constants';
import { storage } from '../../api/api';

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
      <View style={styles.gradientOverlay} />
      <View style={styles.logoWrap}>
        <Image source={cmLogo} style={styles.logo} resizeMode="contain" />
      </View>
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
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#974000',
    opacity: 0.45,
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 120,
    tintColor: '#FFFFFF',
  },
});

export default SplashScreen;
