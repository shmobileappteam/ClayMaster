import { videoThumb1, videoThumb2 } from '../assets/images';

/** ClayMaster-App-UI `AdditionalVideos.tsx` */
export const ADDITIONAL_VIDEOS = [
  {
    id: 1,
    title: 'Gun Fit & Setup Essentials',
    coach: 'Kevin DeMichiel',
    duration: '14:20',
    image: videoThumb1,
  },
  {
    id: 2,
    title: 'Reading Wind Conditions',
    coach: 'Kevin DeMichiel',
    duration: '11:05',
    image: videoThumb2,
  },
  {
    id: 3,
    title: 'Mental Game & Focus',
    coach: 'Kevin DeMichiel',
    duration: '16:30',
    image: videoThumb1,
  },
  {
    id: 4,
    title: 'Competition Day Preparation',
    coach: 'Kevin DeMichiel',
    duration: '09:45',
    image: videoThumb2,
  },
  {
    id: 5,
    title: 'Eye Dominance & Correction',
    coach: 'Kevin DeMichiel',
    duration: '12:10',
    image: videoThumb1,
  },
  {
    id: 6,
    title: 'Shotgun Maintenance Tips',
    coach: 'Kevin DeMichiel',
    duration: '08:55',
    image: videoThumb2,
  },
];

/** ClayMaster-App-UI `AdditionalDocuments.tsx` */
export const LIBRARY_DOCUMENTS = [
  { title: 'Scoring Reference Guide', type: 'PDF', size: '2.4 MB', category: 'Reference' },
  { title: 'Station Setup Diagrams', type: 'PDF', size: '5.1 MB', category: 'Training' },
  { title: 'Safety Rules & Regulations', type: 'PDF', size: '1.2 MB', category: 'Rules' },
  { title: 'Equipment Checklist', type: 'PDF', size: '0.8 MB', category: 'Reference' },
  { title: 'Competition Calendar 2026', type: 'PDF', size: '1.5 MB', category: 'Events' },
  { title: 'Shotgun Shell Comparison Chart', type: 'PDF', size: '3.2 MB', category: 'Reference' },
  { title: 'Training Log Template', type: 'PDF', size: '0.5 MB', category: 'Training' },
];

/** ClayMaster-App-UI `MonthlyWebcasts.tsx` */
export const WEBCAST_UPCOMING = [
  {
    title: 'April Live Q&A: Tournament Prep',
    date: 'Apr 18, 2026',
    time: '7:00 PM EST',
    live: true,
  },
  {
    title: 'May Webcast: Advanced Lead Methods',
    date: 'May 16, 2026',
    time: '7:00 PM EST',
    live: false,
  },
];

export const WEBCAST_PAST = [
  { title: 'March: Reading the Bird', date: 'Mar 21, 2026', duration: '58 min', locked: false },
  { title: 'February: Mental Toughness', date: 'Feb 14, 2026', duration: '52 min', locked: false },
  { title: 'January: Season Kickoff', date: 'Jan 17, 2026', duration: '47 min', locked: true },
];

/** ClayMaster-App-UI `Coaching.tsx` */
export const COACHING_PACKAGES = [
  { sessions: '1 Session', desc: 'One-on-one with Kevin', price: '$75' },
  { sessions: '10 Sessions', desc: 'Save $50 – Best value', price: '$700' },
];

/** ClayMaster-App-UI `Reviews.tsx` */
export const LIBRARY_REVIEWS = [
  {
    name: 'Mike T.',
    rating: 5,
    date: 'Apr 5, 2026',
    text: "Kevin's coaching transformed my crosser shots. Went from 18/25 to consistently hitting 23/25. Worth every penny!",
    likes: 12,
  },
  {
    name: 'Sarah K.',
    rating: 5,
    date: 'Mar 28, 2026',
    text: 'The analytics workbook is incredible. Being able to track my progress station by station has been a game changer.',
    likes: 8,
  },
  {
    name: 'James R.',
    rating: 4,
    date: 'Mar 15, 2026',
    text: 'Great training videos with clear instruction. Would love more content on rabbit targets specifically.',
    likes: 5,
  },
  {
    name: 'Emily W.',
    rating: 5,
    date: 'Mar 10, 2026',
    text: "The virtual tournament feature keeps me competitive even when I can't make it to the range. Love the leaderboard!",
    likes: 15,
  },
  {
    name: 'David L.',
    rating: 4,
    date: 'Feb 28, 2026',
    text: 'Good community forum. Nice to connect with other shooters and share tips. Coaching sessions are top-notch.',
    likes: 3,
  },
];

export const REVIEW_STATS = {
  avg: 4.8,
  total: 247,
  five: 198,
  four: 38,
  three: 8,
  two: 2,
  one: 1,
};

export const getReviewInitials = name => {
  const parts = name.replace('.', '').split(' ');
  return `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase();
};
