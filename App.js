import { DefaultTheme, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { StripeProvider } from '@stripe/stripe-react-native';

//------
import RootStack from './src/navigation/RootStack';
import { COLORS } from './src/globalStyle/Theme';
import store from './src/redux/store/store';
import { queryClient, storage } from './src/api/api';
import { useEffect } from 'react';
import { STRIPE_PUBLISHABLE_KEY } from './src/constants';
import { getDiscountForPackages } from './src/api/packageService';
import { getSubscriptionEnabled } from './src/api/appService';
import { setSubscriptionEnabled } from './src/redux/slices/appSlice';

export default function App() {
  const Theme = {
    ...DefaultTheme,
    myOwnProperty: true,
    colors: {
      ...DefaultTheme.colors,
      ...COLORS,
    },
  };
  useEffect(() => {
    // storage.clearAll();
    queryClient.prefetchQuery({
      queryKey: ['discounts'],
      queryFn: getDiscountForPackages,
    });

    getSubscriptionEnabled()
      .then(data => {
        if (data && typeof data?.subscription_enabled !== 'undefined') {
          // console.log('Subscription Status:', data);
          // store.dispatch(setSubscriptionEnabled(true));
          store.dispatch(setSubscriptionEnabled(data?.subscription_enabled));
        }
      })
      .catch(err => {
        // console.log('Error fetching subscription status:', err);
        store.dispatch(setSubscriptionEnabled(false)); //for now to make the App live
      });
  }, []);

  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={Theme}>
        <SafeAreaProvider>
          <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
            <QueryClientProvider client={queryClient}>
              <RootStack />
            </QueryClientProvider>
          </StripeProvider>
        </SafeAreaProvider>
      </PaperProvider>
    </ReduxProvider>
  );
}
