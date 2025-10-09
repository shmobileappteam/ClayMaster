import { showMessage } from '../../utils';
import { setUser } from '../../redux/slices/appSlice';
import { CommonActions } from '@react-navigation/native';
//-------
import { queryClient, storage } from '../../api/api';
import { KEYS } from '../../constants';

export const onLoginSuccess = async (
  response,
  navigation,
  dispatch,
  { email, password },
) => {
  if (response?.status) {
    // await AsyncStorage.setItem(KEYS.ACCESS_TOKEN, response?.token);
    // await AsyncStorage.setItem(
    //   KEYS.CREDENTIALS,
    //   JSON.stringify({ email, password }),
    // );
    storage.set(KEYS.ACCESS_TOKEN, response?.token);
    storage.set(KEYS.CREDENTIALS, JSON.stringify({ email, password }));

    dispatch(setUser(response?.user));

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'BottomTabs',
            // params: {
            //   screen: 'BottomTabs',
            // },
          },
        ],
      }),
    );
  }
};

export const onRegisterSuccess = async (response, email, navigation) => {
  if (response?.status) {
    storage.set(KEYS.ACCESS_TOKEN, response?.token);
    showMessage({
      type: 'success',
      message: response?.message,
    });
    navigation.navigate('VerifyEmailScreen', { email });
  }
};

export const onResetPasswordError = async (response, setScreenType) => {
  if (response?.status == 401) {
    const otpMessage = response?.data?.message;
    console.log('🚀 ~ otpMessage:', otpMessage);
    if (otpMessage.indexOf('otp') !== -1 || otpMessage.indexOf('OTP') !== -1) {
      setScreenType('verification');
    }
  }
};
