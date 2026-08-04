import {
  LIBRARY_CORE_SECTIONS,
  LIBRARY_PORTAL_SECTIONS,
  MODE_LABELS,
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
  })),
  { label: 'Additional Videos', screen: 'AdditionalVideosScreen', icon: 'film-outline' },
  { label: 'Documents', screen: 'AdditionalDocumentsScreen', icon: 'document-text-outline' },
  // { label: 'Managed Service', screen: 'ManagedServiceScreen', icon: 'headset-outline' },
  { label: 'Reviews', screen: 'ReviewsScreen', icon: 'star-outline' },
  { label: 'My Orders', screen: 'OrdersScreen', icon: 'receipt-outline' },
];

export const MENU_SECTIONS = [
  {
    title: `Core (${MODE_LABELS.field} order)`,
    items: coreMenuItems,
  },
  {
    title: 'Portal & More',
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
