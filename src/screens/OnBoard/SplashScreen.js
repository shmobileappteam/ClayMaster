import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';
// --------
import { Container } from '../../atomComponents';
import SlideInView from '../../animations/SlideView';
import { AppIconSvg, AppLogoSvg } from '../../assets/svgs';

import Sizer from '../../helpers/Sizer';
import { COLORS } from '../../globalStyle/Theme';
import { useCustomMutation } from '../../query/useCustomMutation';
import { onLoginSuccess } from '../../query/partials/responseManager';
import { login } from '../../api/userService';
import { handleLogout } from '../../redux/slices/appSlice';
import { KEYS } from '../../constants';
import { storage } from '../../api/api';

const SplashScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  // Custom Mutation Hook:
  const { mutate: requestLogin } = useCustomMutation({
    mutationFn: login,
    onSuccess: (response, reqData) => {
      onLoginSuccess(response, navigation, dispatch, reqData);
    },
    onError: () => {
      dispatch(handleLogout());
      navigation.replace('LoginScreen');
    },
  });

  useEffect(() => {
    // storage.clearAll();
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const fisrtTime = storage.getString(KEYS.IS_ONBOARD);
      if (fisrtTime === null) {
        navigation.replace('LoginScreen');
        return;
      }
      const device_token = storage.getString(KEYS.FCM_TOKEN);
      const credentials = storage.getString(KEYS.CREDENTIALS);

      if (credentials) {
        const userData = JSON.parse(credentials);
        requestLogin({ ...userData, device_token });
      } else {
        navigation.replace('LoginScreen');
      }
    } catch (err) {
      console.log('🚀 ~ checkUser ~ err:', err);
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
