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
