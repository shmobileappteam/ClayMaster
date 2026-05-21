/**
 * Notification list data + icon map — parity with ClayMaster-App-UI `Notifications.tsx`.
 * Each item stores `iconType` matching web's per-row Lucide icon (never one generic icon).
 */
export const NOTIFICATION_ICON_MAP = {
  trophy: { name: 'trophy-outline', iconFamily: 'Ionicons' },
  message: { name: 'chatbubble-ellipses-outline', iconFamily: 'Ionicons' },
  calendar: { name: 'calendar-outline', iconFamily: 'Ionicons' },
  shopping: { name: 'bag-outline', iconFamily: 'Ionicons' },
  bell: { name: 'notifications-outline', iconFamily: 'Ionicons' },
};

export const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    iconType: 'trophy',
    title: 'New Tournament Open',
    desc: 'Virtual Tournament 2026 registration is live!',
    time: '2h ago',
    unread: true,
    tab: 'Tournament',
  },
  {
    id: 2,
    iconType: 'message',
    title: 'Sarah replied to your post',
    desc: '"That\'s incredible! What station was the toughest?"',
    time: '3h ago',
    unread: true,
    screen: 'CommunityDetailScreen',
  },
  {
    id: 3,
    iconType: 'calendar',
    title: 'Session Reminder',
    desc: 'Coaching session with Kevin tomorrow at 10:30 AM',
    time: '5h ago',
    unread: false,
    screen: 'CoachingScreen',
  },
  {
    id: 4,
    iconType: 'shopping',
    title: 'Order Shipped',
    desc: 'Your ClayMaster Cap is on its way!',
    time: '1d ago',
    unread: false,
    screen: 'OrdersScreen',
  },
  {
    id: 5,
    iconType: 'bell',
    title: 'Score Milestone',
    desc: "Congrats! You've logged 25 rounds this month.",
    time: '2d ago',
    unread: false,
    screen: 'NewRoundScreen',
  },
];

export const getNotificationIcon = iconType =>
  NOTIFICATION_ICON_MAP[iconType] ?? NOTIFICATION_ICON_MAP.bell;
