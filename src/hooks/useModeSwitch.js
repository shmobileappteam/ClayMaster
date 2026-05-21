import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import { useAppMode } from '../context/AppModeContext';
import { MODE_LABELS } from '../constants/modeSections';
import {
  resetToBottomTab,
  resetToFieldMode,
} from '../navigation/navigationHelpers';
import {
  fetchNetworkStatus,
  getLibraryBlockedMessage,
  isStableInternet,
} from '../utils/networkStatus';
import { showMessage } from '../utils';

/**
 * Mode switching rules (PAGE 01):
 * - Field Mode: always available — assumes spotty/limited connectivity; use downloaded content.
 * - Full Library Mode: requires stable internet — full streaming catalog & portal.
 * - Optional: Field may open the online video catalog when connection is stable (see fieldOnlineAccess).
 */
export function useModeSwitch() {
  const navigation = useNavigation();
  const { mode, setMode } = useAppMode();
  const isFieldMode = mode === 'course';

  const [canUseLibrary, setCanUseLibrary] = useState(true);

  useEffect(() => {
    const apply = state => setCanUseLibrary(isStableInternet(state));

    NetInfo.fetch().then(apply);
    const unsub = NetInfo.addEventListener(apply);
    return unsub;
  }, []);

  const switchToFieldMode = useCallback(
    (tabScreen = 'CourseHomeScreen') => {
      setMode('course');
      resetToFieldMode(navigation, tabScreen);
      return true;
    },
    [navigation, setMode],
  );

  const switchToLibraryMode = useCallback(
    async (tabName = 'Home') => {
      const status = await fetchNetworkStatus();
      if (!status.isStable) {
        showMessage({
          type: 'danger',
          title: 'Connection required',
          message: getLibraryBlockedMessage(status),
          duration: 4000,
        });
        return false;
      }

      setMode('library');
      resetToBottomTab(navigation, tabName);
      return true;
    },
    [navigation, setMode],
  );

  const switchToOtherMode = useCallback(async () => {
    if (isFieldMode) {
      return switchToLibraryMode();
    }
    switchToFieldMode('CourseHomeScreen');
    return true;
  }, [isFieldMode, switchToFieldMode, switchToLibraryMode]);

  const currentLabel = isFieldMode ? MODE_LABELS.field : MODE_LABELS.library;
  const otherLabel = isFieldMode ? MODE_LABELS.library : MODE_LABELS.field;

  return {
    mode,
    isFieldMode,
    canUseLibrary,
    currentLabel,
    otherLabel,
    switchToFieldMode,
    switchToLibraryMode,
    switchToOtherMode,
  };
}
