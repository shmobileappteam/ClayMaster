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
import { login } from '../../api/userService';
import { handleLogout } from '../../redux/slices/appSlice';
import { resetToFieldMode } from '../../navigation/navigationHelpers';
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

      const token = storage.getString(KEYS.ACCESS_TOKEN);
      const credentials = storage.getString(KEYS.CREDENTIALS);
      const hasSession = !!(token || credentials);

      if (!hasSession) {
        navigation.replace('LoginScreen');
        return;
      }

      if (activeRound && !activeRound.finished) {
        navigation.replace('CourseRoundScreen');
        return;
      }

      if (credentials) {
        const userData = JSON.parse(credentials);
        const device_token = storage.getString(KEYS.FCM_TOKEN);
        requestLogin({ ...userData, device_token });
        return;
      }

      if (mode === 'course') {
        resetToFieldMode(navigation, 'CourseHomeScreen');
      } else {
        navigation.replace('LoginScreen');
      }
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
