/**
 * Menu structure — parity with ClayMaster-App-UI `menuSections.ts`.
 * Used by the side drawer (AppMenuSheet) and More screen (MoreMenu).
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
      { label: 'Analytics', screen: 'AnalyticsDashboard', icon: 'stats-chart-outline' },
      { label: 'Managed Service', screen: 'AnalyticsDashboard', icon: 'headset-outline' },
      { label: 'Scorecard', action: 'tab', tab: 'Home', icon: 'clipboard-outline' },
      { label: 'My Rounds', screen: 'NewRoundScreen', icon: 'clipboard-outline' },
    ],
  },
  {
    title: 'Compete & Shop',
    items: [
      { label: 'Virtual Tournament', screen: 'VirtualTournamentScreen', icon: 'trophy-outline' },
      { label: 'Community Forum', screen: 'CommunityScreen', icon: 'people-outline' },
      { label: 'Reviews', screen: 'ReviewsScreen', icon: 'star-outline' },
      { label: 'Shop', screen: 'ShopScreen', icon: 'bag-outline' },
      { label: 'My Orders', screen: 'OrdersScreen', icon: 'receipt-outline' },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Membership', screen: 'SubscriptionScreen', icon: 'card-outline' },
      { label: 'Notifications', screen: 'NotificationScreen', icon: 'notifications-outline' },
      { label: 'Account Settings', screen: 'ProfileDetailsScreen', icon: 'settings-outline' },
    ],
  },
];
