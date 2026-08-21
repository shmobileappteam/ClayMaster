import { CommonActions } from '@react-navigation/native';
import { queryClient } from '../api/api';
import { logout as logoutApi } from '../api/userService';
import { handleLogout } from '../redux/slices/appSlice';

const STACK_ROUTE = 'BottomTabs';
const TAB_CONTAINER = 'MainTabs';
export const FIELD_MODE_ROUTE = 'FieldMode';

/**
 * Stack → Drawer (BottomTabs) → Tabs → Screen.
 * Walk up until we find the navigator that owns `BottomTabs` or `FieldMode`.
 */
export function getStackNavigation(navigation) {
  let current = navigation;
  while (current?.getState) {
    const routeNames = current.getState()?.routeNames ?? [];
    if (routeNames.includes('BottomTabs') || routeNames.includes(FIELD_MODE_ROUTE)) {
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

/** Open Field Mode tab shell (scorecard / miss / drills / downloaded videos). */
export function navigateToFieldMode(navigation, tabScreen = 'CourseHomeScreen') {
  const stack = getStackNavigation(navigation) ?? navigation;
  stack.navigate(FIELD_MODE_ROUTE, { screen: tabScreen });
}

/** Reset root stack to Field Mode (e.g. after mode select). */
export function resetToFieldMode(navigation, tabScreen = 'CourseHomeScreen') {
  const stack = getStackNavigation(navigation) ?? navigation;
  stack.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: FIELD_MODE_ROUTE,
          state: {
            routes: [{ name: tabScreen }],
            index: 0,
          },
        },
      ],
    }),
  );
}

/** Reload while actively playing — Field home under play screen so goBack/pause works. */
export function resetToActiveRoundPlay(navigation) {
  const stack = getStackNavigation(navigation) ?? navigation;
  stack.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [
        {
          name: FIELD_MODE_ROUTE,
          state: {
            routes: [{ name: 'CourseHomeScreen' }],
            index: 0,
          },
        },
        { name: 'CourseRoundScreen' },
      ],
    }),
  );
}

/** Push a stack overlay from inside Field Mode (round, miss fix, etc.). */
export function navigateFromFieldToStack(navigation, screenName, params) {
  const stack = getStackNavigation(navigation);
  stack?.navigate(screenName, params);
}

/**
 * Reset stack to drawer + bottom tab (nested state required — avoids blank screen).
 */
export function resetToBottomTab(navigation, tabName = 'Home') {
  const stack = getStackNavigation(navigation) ?? navigation;
  stack.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: STACK_ROUTE,
          state: {
            routes: [
              {
                name: TAB_CONTAINER,
                state: {
                  routes: [{ name: tabName }],
                  index: 0,
                },
              },
            ],
            index: 0,
          },
        },
      ],
    }),
  );
}

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
 * Drawer / More menu:
 * - Tab routes (Analytics, Shop, …) → bottom tab
 * - Stack routes (VT, Community, Coaching, …) → full-screen stack push
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
export async function performLogout(navigation, dispatch) {
  const stack = getStackNavigation(navigation) ?? navigation;

  try {
    await logoutApi();
  } catch {
    /* Local session still cleared below */
  }

  queryClient.clear();
  dispatch(handleLogout());

  stack.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    }),
  );
}
