import { DefaultTheme, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
//----------------
import RootStack from './src/navigation/RootStack';
import { COLORS } from './src/globalStyle/Theme';

export default function App() {
  const Theme = {
    ...DefaultTheme,
    myOwnProperty: true, // For Custom Keys
    colors: {
      ...DefaultTheme.colors,
      ...COLORS,
    },
  };

  return (
    <PaperProvider theme={Theme}>
      <SafeAreaProvider>
        <GestureHandlerRootView>
          <RootStack />
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
