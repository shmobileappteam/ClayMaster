import {
  LIBRARY_CORE_SECTIONS,
  LIBRARY_PORTAL_SECTIONS,
} from '../constants/modeSections';

/**
 * Full Library Mode menu — core four items match Field Mode order (PAGE 01).
 *
 * action: 'tab' → switch bottom tab
 * screen → push stack screen
 */
const coreMenuItems = LIBRARY_CORE_SECTIONS
  // Miss Diagnostics — commented out of drawer for now
  .filter(s => s.label !== 'Miss Diagnostics')
  .map(s => ({
    label: s.label,
    icon: s.icon,
    screen: s.screen,
    action: s.action,
    tab: s.tab,
  }));

const portalMenuItems = [
  ...LIBRARY_PORTAL_SECTIONS.map(s => ({
    label: s.label,
    icon: s.icon,
    screen: s.screen,
    action: s.action,
    tab: s.tab,
    params: s.params,
  })),
  { label: 'Reviews', screen: 'ReviewsScreen', icon: 'star-outline' },
  { label: 'My Orders', screen: 'OrdersScreen', icon: 'receipt-outline' },
];

export const MENU_SECTIONS = [
  {
    title: 'Training',
    items: coreMenuItems,
  },
  {
    title: 'Services',
    items: portalMenuItems,
  },
  {
    title: 'Account',
    items: [
      {
        label: 'Membership',
        screen: 'SubscriptionScreen',
        params: { fromProfile: true },
        icon: 'card-outline',
        requiresSubscription: true,
      },
      { label: 'Notifications', screen: 'NotificationScreen', icon: 'notifications-outline' },
      { label: 'Settings', screen: 'SettingsScreen', icon: 'settings-outline' },
    ],
  },
];

/** Hide Membership rows when GET /subscription-enabled is false. */
export function filterMenuSections(sections, subscriptionEnabled) {
  if (subscriptionEnabled) return sections;
  return sections
    .map(section => ({
      ...section,
      items: section.items.filter(item => !item.requiresSubscription),
    }))
    .filter(section => section.items.length > 0);
}
