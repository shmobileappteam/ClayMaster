import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useModeSwitch } from './useModeSwitch';

/**
 * Guards library-only screens (Analytics, streaming video catalog, etc.).
 *
 * @param {{ allowOnlineInField?: boolean }} [options]
 *   When true, Field Mode may view this screen only while `canUseLibrary` (stable internet).
 *   Otherwise Field users are reset to the scorecard tab.
 * @returns {boolean} true while the screen should not render (redirect in progress)
 */
export function useRequireLibraryMode(options = {}) {
  const allowOnlineInField = options.allowOnlineInField === true;
  const { isFieldMode, canUseLibrary, switchToFieldMode } = useModeSwitch();

  useFocusEffect(
    useCallback(() => {
      if (!isFieldMode) {
        return;
      }
      if (allowOnlineInField) {
        if (!canUseLibrary) {
          switchToFieldMode('CourseDownloadedVideosScreen');
        }
        return;
      }
      switchToFieldMode('CourseHomeScreen');
    }, [isFieldMode, allowOnlineInField, canUseLibrary, switchToFieldMode]),
  );

  if (!isFieldMode) {
    return false;
  }
  if (allowOnlineInField) {
    return !canUseLibrary;
  }
  return true;
}
