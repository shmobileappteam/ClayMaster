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
