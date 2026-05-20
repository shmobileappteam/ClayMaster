import { CommonActions } from '@react-navigation/native';
import { queryClient } from '../api/api';
import { logout as logoutApi } from '../api/userService';
import { handleLogout } from '../redux/slices/appSlice';

/**
 * Tab navigator is nested: Stack → Drawer → Tabs → Screen.
 * Drawer content only needs one getParent() to reach Stack.
 * Tab screens need two getParent() calls to reach Stack.
 */
export function getStackNavigation(navigation) {
  const drawer = navigation.getParent?.();
  const stack = drawer?.getParent?.();
  return stack ?? drawer ?? null;
}

export function openDrawerFromTabNavigation(navigation) {
  navigation.getParent?.()?.openDrawer?.();
}

export function navigateFromTabToStack(navigation, screenName, params) {
  const stack = getStackNavigation(navigation);
  stack?.navigate(screenName, params);
}

/** Clear session and reset root stack to Login (works from tabs, drawer, or stack screens). */
export function performLogout(navigation, dispatch) {
  const stack = getStackNavigation(navigation) ?? navigation;

  queryClient.clear();
  dispatch(handleLogout());

  stack.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    }),
  );

  logoutApi().catch(() => {
    /* Local session already cleared */
  });
}
