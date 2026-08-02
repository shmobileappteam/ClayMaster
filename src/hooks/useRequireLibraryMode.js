import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useModeSwitch } from './useModeSwitch';

/**
 * Guards library-only screens (Analytics, streaming video catalog, etc.).
 *
 * @param {{ allowOnlineInField?: boolean, allowSavedInField?: boolean }} [options]
 *   allowOnlineInField — Field Mode may view while `canUseLibrary` (stable internet).
 *   allowSavedInField — Field Mode may view saved content without the online gate.
 * @returns {boolean} true while the screen should not render (redirect in progress)
 */
export function useRequireLibraryMode(options = {}) {
  const allowOnlineInField = options.allowOnlineInField === true;
  const allowSavedInField = options.allowSavedInField === true;
  const { isFieldMode, canUseLibrary, switchToFieldMode } = useModeSwitch();

  useFocusEffect(
    useCallback(() => {
      if (!isFieldMode) {
        return;
      }
      if (allowSavedInField) {
        return;
      }
      if (allowOnlineInField) {
        if (!canUseLibrary) {
          switchToFieldMode('CourseDownloadedVideosScreen');
        }
        return;
      }
      switchToFieldMode('CourseHomeScreen');
    }, [
      isFieldMode,
      allowOnlineInField,
      allowSavedInField,
      canUseLibrary,
      switchToFieldMode,
    ]),
  );

  if (!isFieldMode) {
    return false;
  }
  if (allowSavedInField) {
    return false;
  }
  if (allowOnlineInField) {
    return !canUseLibrary;
  }
  return true;
}
