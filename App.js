import { DefaultTheme, PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { StripeProvider } from '@stripe/stripe-react-native';

//------
import RootStack from './src/navigation/RootStack';
import { COLORS } from './src/globalStyle/Theme';
import store from './src/redux/store/store';
import { queryClient, storage } from './src/api/api';
import { AppModeProvider } from './src/context/AppModeContext';
import { useEffect } from 'react';
import { STRIPE_PUBLISHABLE_KEY } from './src/constants';
import { getDiscountForPackages } from './src/api/packageService';
import { getSubscriptionEnabled } from './src/api/appService';
import {
  setSubscriptionEnabled,
  setStripePublishableKey,
} from './src/redux/slices/appSlice';
import { useState } from 'react';

export default function App() {
  const [stripeKey, setStripeKey] = useState(STRIPE_PUBLISHABLE_KEY);
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
        if (data) {
          if (typeof data?.subscription_enabled !== 'undefined') {
            store.dispatch(setSubscriptionEnabled(data?.subscription_enabled));
          }
          if (data?.stripe_public_key) {
            setStripeKey(data?.stripe_public_key);
            store.dispatch(setStripePublishableKey(data?.stripe_public_key));
          }
        }
      })
      .catch(err => {
        store.dispatch(setSubscriptionEnabled(false));
      });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReduxProvider store={store}>
        <PaperProvider theme={Theme}>
          <SafeAreaProvider>
            <StripeProvider publishableKey={stripeKey}>
              <QueryClientProvider client={queryClient}>
                <AppModeProvider>
                  <RootStack />
                </AppModeProvider>
              </QueryClientProvider>
            </StripeProvider>
          </SafeAreaProvider>
        </PaperProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
}
