/** ClayMaster-App-UI `Community.tsx` / `PostDetail.tsx` mock data */

export const COMMUNITY_POSTS = [
  {
    id: 1,
    user: 'John Smith',
    time: '2h ago',
    content:
      "Just hit 23/25 on my sporting clays round! The tower shot drills from Kevin's videos really helped.",
    detailContent:
      "Just hit 23/25 on my sporting clays round! The tower shot drills from Kevin's videos really helped. Finally breaking through that plateau I've been stuck on for weeks. 🎯",
    likes: 14,
    replies: 3,
  },
  {
    id: 2,
    user: 'Sarah Johnson',
    time: '5h ago',
    content:
      'Anyone heading to the regional tournament next week? Looking for practice partners this weekend.',
    likes: 8,
    replies: 7,
  },
  {
    id: 3,
    user: 'Mike Williams',
    time: '1d ago',
    content:
      'New shooter here - the Classic Workbook has been incredibly helpful for understanding the fundamentals.',
    likes: 22,
    replies: 5,
  },
];

export const POST_REPLIES = [
  {
    user: 'Sarah Johnson',
    time: '1h ago',
    content: "That's incredible! What station was the toughest for you?",
  },
  {
    user: 'Mike Williams',
    time: '45m ago',
    content: 'Nice score! I need to try those tower drills too.',
  },
  {
    user: 'Emily Davis',
    time: '20m ago',
    content: 'Congrats John! 🎯 Keep it up!',
  },
];

export const SUGGESTED_TAGS = [
  '#SportingClays',
  '#Skeet',
  '#Trap',
  '#Training',
  '#Competition',
  '#NewShooter',
];

export const getCommunityPost = id =>
  COMMUNITY_POSTS.find(p => p.id === Number(id)) || COMMUNITY_POSTS[0];

export const getInitials = name =>
  (name || '')
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
