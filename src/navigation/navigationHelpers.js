import { CommonActions } from '@react-navigation/native';
import { queryClient } from '../api/api';
// import { logout as logoutApi } from '../api/userService';
import { handleLogout } from '../redux/slices/appSlice';

/**
 * Stack → Drawer (BottomTabs) → Tabs → Screen.
 * Walk up until we find the navigator that owns `BottomTabs`.
 */
export function getStackNavigation(navigation) {
  let current = navigation;
  while (current?.getState) {
    const routeNames = current.getState()?.routeNames ?? [];
    if (routeNames.includes('BottomTabs')) {
      return current;
    }
    current = current.getParent?.() ?? null;
  }
  return navigation.getParent?.() ?? null;
}

export function openDrawerFromTabNavigation(navigation) {
  navigation.getParent?.()?.openDrawer?.();
}

export function navigateFromTabToStack(navigation, screenName, params) {
  const stack = getStackNavigation(navigation);
  stack?.navigate(screenName, params);
}

const STACK_ROUTE = 'BottomTabs';
const TAB_CONTAINER = 'MainTabs';

/** Switch bottom tab and return to tab shell (pops stack overlays like duplicate ShopScreen). */
export function navigateToBottomTab(navigation, tabName) {
  const stack = getStackNavigation(navigation) ?? navigation;
  stack.dispatch(
    CommonActions.navigate({
      name: STACK_ROUTE,
      params: {
        screen: TAB_CONTAINER,
        params: { screen: tabName },
      },
    }),
  );
}

/** Switch bottom tab (works from tab screens and stack screens like Checkout). */
export function navigateFromTabToTab(navigation, tabName) {
  navigateToBottomTab(navigation, tabName);
}

/**
 * Drawer / More menu — web parity:
 * - Tab routes (/analytics, /tournament, /shop) → bottom tab
 * - Stack routes (/scorecard, /scoring) → full-screen stack push
 */
export function navigateFromMenuItem(navigation, item) {
  const stack = getStackNavigation(navigation) ?? navigation.getParent?.() ?? navigation;

  if (item.action === 'tab' && item.tab) {
    navigateToBottomTab(stack, item.tab);
    return;
  }

  if (item.screen) {
    stack.navigate(item.screen, item.params);
  }
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

  // logoutApi().catch(() => {
  //   /* Local session already cleared */
  // });
}
