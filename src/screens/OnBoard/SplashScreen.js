import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
// --------
import { Container } from '../../atomComponents';
import SlideInView from '../../animations/SlideView';
import { AppIconSvg, AppLogoSvg } from '../../assets/svgs';
import Sizer from '../../helpers/Sizer';
import { COLORS } from '../../globalStyle/Theme';
import { useAppMode } from '../../context/AppModeContext';
import { useCustomMutation } from '../../query/useCustomMutation';
import { onLoginSuccess } from '../../query/partials/responseManager';
import { getProfile, login } from '../../api/userService';
import { handleLogout } from '../../redux/slices/appSlice';
import { KEYS } from '../../constants';
import { storage } from '../../api/api';

/**
 * Reload routing:
 * 1. Actively playing (draft.playing) → reopen CourseRoundScreen
 * 2. APP_MODE field → Field home
 * 3. APP_MODE library → Library home
 * Draft alone does NOT force Field (resume-from-library keeps library mode).
 */
const SplashScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { subscriptionEnabled } = useSelector(state => state.app);
  const { mode, activeRound } = useAppMode();

  const goLogin = () => {
    dispatch(handleLogout());
    navigation.replace('LoginScreen');
  };

  const resolveAfterAuth = () => {
    const isPlaying =
      !!(activeRound?.roundId && !activeRound?.finished && activeRound?.playing);
    if (isPlaying) return 'playing';
    if (mode === 'course') return 'field';
    return 'library';
  };

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
        { showModeSelect: false, afterAuth: resolveAfterAuth() },
      );
    },
    onError: goLogin,
  });

  const restoreWithProfile = async credentials => {
    const afterAuth = resolveAfterAuth();
    try {
      const profile = await getProfile();
      if (!profile?.status || !profile?.user) {
        throw new Error('Invalid profile');
      }
      await onLoginSuccess(
        {
          status: true,
          token: storage.getString(KEYS.ACCESS_TOKEN),
          user: profile.user,
        },
        navigation,
        dispatch,
        credentials || {},
        () => {},
        subscriptionEnabled,
        { showModeSelect: false, afterAuth },
      );
    } catch {
      if (credentials?.email && credentials?.password) {
        const device_token = storage.getString(KEYS.FCM_TOKEN);
        requestLogin({ ...credentials, device_token });
        return;
      }
      goLogin();
    }
  };

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

      const token = storage.getString(KEYS.ACCESS_TOKEN);
      const credentialsRaw = storage.getString(KEYS.CREDENTIALS);
      const credentials = credentialsRaw ? JSON.parse(credentialsRaw) : null;
      const hasSession = !!(token || credentials);

      if (!hasSession) {
        navigation.replace('LoginScreen');
        return;
      }

      if (token) {
        restoreWithProfile(credentials);
        return;
      }

      if (credentials?.email && credentials?.password) {
        const device_token = storage.getString(KEYS.FCM_TOKEN);
        requestLogin({ ...credentials, device_token });
        return;
      }

      navigation.replace('LoginScreen');
    } catch {
      navigation.replace('LoginScreen');
    }
  };

  return (
    <Container conStyle={styles.container} isPaddingVertical={false}>
      <SlideInView slide="up" slideDuration={800}>
        <AppIconSvg />
      </SlideInView>
      <View style={styles.margin} />
      <SlideInView slide="down" slideDuration={800}>
        <AppLogoSvg textColor={COLORS.black100} />
      </SlideInView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  margin: {
    marginTop: Sizer.vSize(8),
  },
});

export default SplashScreen;
