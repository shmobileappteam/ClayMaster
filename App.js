import { DefaultTheme, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
//------
import RootStack from './src/navigation/RootStack';
import { COLORS } from './src/globalStyle/Theme';
import store from './src/redux/store/store';
import { queryClient, storage } from './src/api/api';
import { useEffect } from 'react';

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
          <QueryClientProvider client={queryClient}>
            <RootStack />
          </QueryClientProvider>
        </SafeAreaProvider>
      </PaperProvider>
    </ReduxProvider>
  );
}
