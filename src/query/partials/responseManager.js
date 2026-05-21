import { showMessage } from '../../utils';
import { setUser } from '../../redux/slices/appSlice';
import { CommonActions } from '@react-navigation/native';
//-------
import { queryClient, storage } from '../../api/api';
import { AUTH_APIS_DISABLED, KEYS } from '../../constants';
import { getClasses, getCourses, getRounds } from '../../api/roundService';
import { getTraps } from '../../api/stationService';
import { getPackages } from '../../api/packageService';
import { resetToBottomTab, resetToFieldMode } from '../../navigation/navigationHelpers';
import { fetchNetworkStatus } from '../../utils/networkStatus';

async function Prefetching() {
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['courses'],
      queryFn: getCourses,
    }),
    queryClient.prefetchQuery({
      queryKey: ['classes'],
      queryFn: getClasses,
    }),
    queryClient.prefetchQuery({
      queryKey: ['rounds'],
      queryFn: getRounds,
    }),
    queryClient.prefetchQuery({
      queryKey: ['traps'],
      queryFn: getTraps,
    }),
    queryClient.prefetchQuery({
      queryKey: ['packages'],
      queryFn: getPackages,
    }),
  ]);
}

export const onLoginSuccess = async (
  response,
  navigation,
  dispatch,
  { email, password },
  setIsLoading = () => {},
  subscriptionEnabled,
  { showModeSelect = true } = {},
) => {
  try {
    if (response?.status) {
      dispatch(setUser(response?.user));
      storage.set(KEYS.ACCESS_TOKEN, response?.token);
      storage.set(KEYS.CREDENTIALS, JSON.stringify({ email, password }));
      if (!AUTH_APIS_DISABLED) {
        await Prefetching();
      }

      if (response?.user?.email_verified_at) {
        let redirectScreen = 'ModeSelectScreen';

        if (subscriptionEnabled && response?.user?.subscription_status !== 'active') {
          redirectScreen = 'SubscriptionScreen';
        } else if (!showModeSelect) {
          const storedMode = storage.getString(KEYS.APP_MODE);
          if (storedMode === 'course') {
            resetToFieldMode(navigation, 'CourseHomeScreen');
            return;
          }
          const net = await fetchNetworkStatus();
          if (!net.isStable) {
            storage.set(KEYS.APP_MODE, 'course');
            showMessage({
              type: 'default',
              title: 'Field Mode',
              message:
                'No stable internet — opening Field Mode. Full Library is available when you are online.',
              duration: 3500,
            });
            resetToFieldMode(navigation, 'CourseHomeScreen');
            return;
          }
          resetToBottomTab(navigation, 'Home');
          return;
        }

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: redirectScreen }],
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
