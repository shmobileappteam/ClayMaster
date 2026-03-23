/**
 * Shared menu structure for the side drawer (Antigravity Screen 24).
 * Secondary destinations live here; primary areas stay on the bottom tabs.
 */
export const DRAWER_SECTIONS = [
  {
    key: 'ANALYTICS',
    title: 'Analytics',
    icon: 'stats-chart',
    items: [
      { label: 'Video tutorial', screen: 'AnalyticsDashboard', icon: 'play-circle-outline' },
      { label: 'Workbook', screen: 'AnalyticsDashboard', icon: 'book-outline' },
      { label: 'Managed services', screen: 'AnalyticsDashboard', icon: 'briefcase-outline' },
      { label: 'Tournament analytics', screen: 'AnalyticsDashboard', icon: 'analytics-outline' },
    ],
  },
  {
    key: 'TRAINING',
    title: 'Training',
    icon: 'barbell',
    items: [
      { label: 'Instructional videos', screen: 'InstructionalVideosScreen', icon: 'videocam-outline' },
      { label: 'Additional videos', screen: 'AdditionalVideosScreen', icon: 'film-outline' },
      { label: 'Practice drills', screen: 'DrillsScreen', icon: 'document-text-outline' },
    ],
  },
  {
    key: 'COACHING',
    title: 'Coaching',
    icon: 'videocam',
    items: [
      { label: 'Online coaching sessions', screen: 'CoachingScreen', icon: 'people-outline' },
    ],
  },
  {
    key: 'COMMUNITY',
    title: 'Community',
    icon: 'chatbubbles',
    items: [
      { label: 'Private forum', screen: 'CommunityScreen', icon: 'chatbox-ellipses-outline' },
      { label: 'Community guidelines', screen: 'HelpAndSupportScreen', icon: 'help-circle-outline' },
    ],
  },
  {
    key: 'TOURNAMENT',
    title: 'Tournament',
    icon: 'trophy',
    items: [
      { label: 'Guidelines', screen: 'VirtualTournamentScreen', icon: 'document-outline' },
      { label: 'Submit score', screen: 'VirtualTournamentScreen', icon: 'cloud-upload-outline' },
      { label: 'Live leaderboard', screen: 'VirtualTournamentScreen', icon: 'podium-outline' },
    ],
  },
  {
    key: 'COMMERCE',
    title: 'Shop',
    icon: 'cart',
    items: [
      { label: 'Exclusive shop', screen: 'ShopScreen', icon: 'storefront-outline' },
      { label: 'My orders', screen: 'OrdersScreen', icon: 'receipt-outline' },
    ],
  },
  {
    key: 'PERFORMANCE',
    title: 'Performance',
    icon: 'list',
    items: [
      {
        label: 'Main scorecard',
        icon: 'clipboard-outline',
        action: 'tab',
        tab: 'Home',
      },
      { label: 'My rounds', screen: 'NewRoundScreen', icon: 'golf-outline' },
    ],
  },
  {
    key: 'ACCOUNT',
    title: 'Account',
    icon: 'person-circle',
    items: [
      { label: 'Subscription & billing', screen: 'SubscriptionScreen', icon: 'card-outline' },
      { label: 'Account settings', screen: 'ProfileDetailsScreen', icon: 'settings-outline' },
      { label: 'Reviews & feedback', screen: 'ReviewsScreen', icon: 'star-outline' },
      { label: 'Delete account', screen: 'DeleteAccountScreen', icon: 'trash-outline' },
    ],
  },
];
