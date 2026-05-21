/**
 * Menu structure — parity with ClayMaster-App-UI `menuSections.ts`.
 * Used by the side drawer (AppMenuSheet) and More screen (MoreMenu).
 *
 * action: 'tab' → switch bottom tab (keeps tab bar visible)
 * screen → push stack screen (full-screen, no tabs — matches web showTabs={false})
 */
export const MENU_SECTIONS = [
  {
    title: 'Training',
    items: [
      { label: 'Instructional Videos', screen: 'InstructionalVideosScreen', icon: 'play-outline' },
      { label: 'Additional Videos', screen: 'AdditionalVideosScreen', icon: 'film-outline' },
      { label: 'Practice Drills', screen: 'DrillsScreen', icon: 'fitness-outline' },
      { label: 'Coaching Sessions', screen: 'CoachingScreen', icon: 'people-outline' },
      { label: 'Monthly Webcasts', screen: 'WebcastScreen', icon: 'radio-outline' },
      { label: 'Documents', screen: 'AdditionalDocumentsScreen', icon: 'document-text-outline' },
    ],
  },
  {
    title: 'Analytics & Scoring',
    items: [
      { label: 'Analytics', action: 'tab', tab: 'Analytics', icon: 'stats-chart-outline' },
      { label: 'Managed Service', screen: 'ManagedServiceScreen', icon: 'headset-outline' },
      { label: 'Scorecard', screen: 'LibraryScorecardScreen', icon: 'clipboard-outline' },
      { label: 'My Rounds', screen: 'ScoringScreen', icon: 'list-outline' },
    ],
  },
  {
    title: 'Compete & Shop',
    items: [
      { label: 'Virtual Tournament', action: 'tab', tab: 'Tournament', icon: 'trophy-outline' },
      { label: 'Community Forum', screen: 'CommunityScreen', icon: 'people-outline' },
      { label: 'Reviews', screen: 'ReviewsScreen', icon: 'star-outline' },
      { label: 'Shop', action: 'tab', tab: 'Shop', icon: 'bag-outline' },
      { label: 'My Orders', screen: 'OrdersScreen', icon: 'receipt-outline' },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        label: 'Membership',
        screen: 'SubscriptionScreen',
        params: { fromProfile: true },
        icon: 'card-outline',
      },
      { label: 'Notifications', screen: 'NotificationScreen', icon: 'notifications-outline' },
      { label: 'Settings', screen: 'SettingsScreen', icon: 'settings-outline' },
    ],
  },
];
