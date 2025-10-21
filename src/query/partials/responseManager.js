import { showMessage } from '../../utils';
import { setUser } from '../../redux/slices/appSlice';
import { CommonActions } from '@react-navigation/native';
//-------
import { queryClient, storage } from '../../api/api';
import { KEYS } from '../../constants';
import { getClasses, getCourses, getRounds } from '../../api/roundService';
import { getTraps } from '../../api/stationService';

async function Prefetching() {
  await Promise.all([
    await queryClient.prefetchQuery({
      queryKey: ['courses'],
      queryFn: getCourses,
    }),
    await queryClient.prefetchQuery({
      queryKey: ['classes'],
      queryFn: getClasses,
    }),
    await queryClient.prefetchQuery({
      queryKey: ['rounds'],
      queryFn: getRounds,
    }),
    await queryClient.prefetchQuery({
      queryKey: ['traps'],
      queryFn: getTraps,
    }),
  ]);
}

export const onLoginSuccess = async (
  response,
  navigation,
  dispatch,
  { email, password },
  setIsLoading = () => {},
) => {
  try {
    if (response?.status) {
      dispatch(setUser(response?.user));
      storage.set(KEYS.ACCESS_TOKEN, response?.token);
      storage.set(KEYS.CREDENTIALS, JSON.stringify({ email, password }));
      await Prefetching();

      if (response?.user?.email_verified_at) {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'BottomTabs' }],
          }),
        );
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: 'LoginScreen',
              },
              {
                name: 'VerifyEmailScreen',
                params: {
                  email,
                  fromLogin: true,
                },
              },
            ],
          }),
        );
      }

      // navigation.dispatch(
      //   CommonActions.reset({
      //     index: 0,
      //     routes: [
      //       {
      //         name: 'BottomTabs',
      //         // params: {
      //         //   screen: 'BottomTabs',
      //         // },
      //       },
      //     ],
      //   }),
      // );
    }
  } catch (err) {
    console.log('🚀 ~ onLoginSuccess ~ err:', err);
  } finally {
    setIsLoading(false);
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
