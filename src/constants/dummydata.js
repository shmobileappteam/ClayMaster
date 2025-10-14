import { COLORS } from '../globalStyle/Theme';

export const initialStationData = {
  id: 1,
  name: 'Station 1',
};

export const stationsData = [
  {
    id: 1,
    name: 'Station 1',
    hits: 6,
    missed: 4,
    totalShots: 10,
    isPairSelected: false,
    shots: [
      { id: 1, status: 'hit' }, // orange
      { id: 2, status: 'empty' }, // white
      { id: 3, status: 'empty' }, // white
      { id: 4, status: 'empty' }, // white
      { id: 5, status: 'empty' }, // white
      { id: 6, status: 'empty' }, // white
      { id: 7, status: 'empty' }, // white
      { id: 8, status: 'empty' }, // white
      { id: 9, status: 'empty' }, // white
      { id: 10, status: 'empty' }, // white
    ],
    reportPair: 'TP', // TP or RF
    traps: {
      chandelle: 'Rabbit',
      Crosser: 'Rabbue',
      Incomer: 'Teal',
      Knuckleball: 'Tower',
      Overhead: 'Trap Shot',
      Quartering: 'Trap-Teal',
    },
  },
  {
    id: 2,
    name: 'Station 2',
    hits: 1,
    missed: 0,
    totalShots: 10,
    isPairSelected: false,

    shots: [
      { id: 1, status: 'hit' }, // orange
      { id: 2, status: 'empty' }, // white
      { id: 3, status: 'empty' }, // white
      { id: 4, status: 'empty' }, // white
      { id: 5, status: 'empty' }, // white
      { id: 6, status: 'empty' }, // white
      { id: 7, status: 'empty' }, // white
      { id: 8, status: 'empty' }, // white
      { id: 9, status: 'empty' }, // white
      { id: 10, status: 'empty' }, // white
    ],
    reportPair: 'RP',
    traps: {
      chandelle: 'Rabbit',
      Crosser: 'Rabbue',
      Incomer: 'Teal',
      Knuckleball: 'Tower',
      Overhead: 'Trap Shot',
      Quartering: 'Trap-Teal',
    },
  },
  {
    id: 3,
    name: 'Station 3',
    hits: 6,
    missed: 4,
    totalShots: 10,
    isPairSelected: false,

    shots: [
      { id: 1, status: 'hit' },
      { id: 2, status: 'hit' },
      { id: 3, status: 'missed' },
      { id: 4, status: 'hit' },
      { id: 5, status: 'missed' },
      { id: 6, status: 'missed' },
      { id: 7, status: 'hit' },
      { id: 8, status: 'missed' },
      { id: 9, status: 'hit' },
      { id: 10, status: 'hit' },
    ],
    reportPair: 'TP',
    traps: {
      chandelle: 'Rabbit',
      Crosser: 'Rabbue',
      Incomer: 'Teal',
      Knuckleball: 'Tower',
      Overhead: 'Trap Shot',
      Quartering: 'Trap-Teal',
    },
  },
  {
    id: 4,
    name: 'Station 4',
    hits: 6,
    missed: 4,
    totalShots: 10,
    isPairSelected: false,

    shots: [
      { id: 1, status: 'hit' },
      { id: 2, status: 'hit' },
      { id: 3, status: 'missed' },
      { id: 4, status: 'hit' },
      { id: 5, status: 'missed' },
      { id: 6, status: 'missed' },
      { id: 7, status: 'hit' },
      { id: 8, status: 'missed' },
      { id: 9, status: 'hit' },
      { id: 10, status: 'hit' },
    ],
    reportPair: 'TP',
    traps: {
      chandelle: 'Rabbit',
      Crosser: 'Rabbue',
      Incomer: 'Teal',
      Knuckleball: 'Tower',
      Overhead: 'Trap Shot',
      Quartering: 'Trap-Teal',
    },
  },
  {
    id: 5,
    name: 'Station 5',
    hits: 0,
    missed: 1,
    totalShots: 10,
    isPairSelected: false,
    shots: [
      { id: 1, status: 'missed' },
      { id: 2, status: 'empty' },
      { id: 3, status: 'empty' },
      { id: 4, status: 'empty' },
      { id: 5, status: 'empty' },
      { id: 6, status: 'empty' },
      { id: 7, status: 'empty' },
      { id: 8, status: 'empty' },
      { id: 9, status: 'empty' },
      { id: 10, status: 'empty' },
    ],
    reportPair: 'TP',
    traps: {
      chandelle: 'Rabbit',
      Crosser: 'Rabbue',
      Incomer: 'Teal',
      Knuckleball: 'Tower',
      Overhead: 'Trap Shot',
      Quartering: 'Trap-Teal',
    },
  },
];

export const generalMenus = [
  {
    label: 'Profile Details',
    icon: 'person-outline',
    family: 'Ionicons',
    navLink: 'ProfileDetailsScreen',
    stack: null,
  },
  {
    label: 'My Scorecards',
    icon: 'book-outline',
    family: 'Ionicons',
    navLink: 'Home',
    stack: 'BottomTabs',
  },
];

export const moreMenus = [
  {
    label: 'About Us',
    icon: 'information-circle-outline',
    family: 'Ionicons',
    navLink: 'AboutusScreen',
    stack: null,
  },

  // { label: 'Our Reviews', icon: 'star-outline', family: 'Ionicons' },
];

export const settingData = [
  { label: 'Change Password', icon: 'help-circle-outline', family: 'Ionicons' },
  { label: 'Help & Support', icon: 'help-circle-outline', family: 'Ionicons' },
  {
    label: 'Terms & Conditions',
    icon: 'document-text-outline',
    family: 'Ionicons',
  },
  {
    label: 'Log out',
    icon: 'logout',
    family: 'AntDesign',
    navLink: 'LoginScreen',
  },
];

export const subscriptionPlans = [
  {
    id: 1,
    name: 'Silver Plan',
    price: '$25',
    period: 'month',
    icon: '👑',
    features: [
      'Self-assessment tab',
      'Tips/techniques that can help improve your shooting performance.',
      'Expanded practice drills.',
      'Going beyond normal break points.',
      'Additional 30 minute online coaching sessions can be purchased for $85/session.',
    ],
    additionalCount: 5,
  },
  {
    id: 2,
    name: 'Gold Plan',
    price: '$45',
    period: 'month',
    icon: '👑',
    features: [
      'Everything in Silver Plan',
      'Advanced performance analytics',
      'Personalized training programs',
      'Priority support',
      'Monthly video analysis',
      'Competition preparation guides',
    ],
    additionalCount: 8,
  },
  {
    id: 3,
    name: 'Platinum Plan',
    price: '$75',
    period: 'month',
    icon: '💎',
    features: [
      'Everything in Gold Plan',
      'One-on-one coaching sessions',
      'Custom equipment recommendations',
      'Weekly performance reviews',
      'Access to exclusive tournaments',
      'Mobile app premium features',
    ],
    additionalCount: 10,
    isPopular: false,
    backgroundColor: '#2C5F41', // Dark green/platinum color
  },
];

export const statsData = [
  {
    id: 1,
    label: 'Total Dead',
    value: '70',
    labelColor: COLORS.primary, // Orange color
  },
  {
    id: 2,
    label: 'Total Lost',
    value: '30',
    labelColor: '#656565', // Grey color
  },
  {
    id: 3,
    label: 'Total Shots',
    value: '100',
    labelColor: COLORS.black100, // Black color
  },
];

export const scorecardData = [
  {
    id: 1,
    title: 'Saltwaters Black Course',
    date: '26 - Aug - 2025',
    status: 'sent', // ✅
    action: 'download',
    actionLabel: 'Download',
    statusLabel: 'Sent',
    hasNotification: true,
  },
  {
    id: 2,
    title: 'Saltwaters Black Course',
    date: '26 - Aug - 2025',
    status: 'completed', // ✅
    action: 'saved',
    actionLabel: 'Saved',
    statusLabel: 'Completed',
    hasNotification: false,
  },
  {
    id: 3,
    title: 'Saltwaters Black Course',
    date: '26 - Aug - 2025',
    status: 'completed', // ✅
    action: 'saved',
    actionLabel: 'Saved',
    statusLabel: 'Completed',
    hasNotification: false,
  },
];

export const expandedStationCardsObject = {
  1: true,
  2: true,
  3: true,
  4: true,
  5: true,
  6: true,
  7: true,
  8: true,
  9: true,
  10: true,
  11: true,
  12: true,
};

export const pairOfTargets = {
  3: [
    { sequence: 1, result: 'empty' },
    { sequence: 2, result: 'empty' },
    { sequence: 3, result: 'empty' },
    { sequence: 4, result: 'empty' },
    { sequence: 5, result: 'empty' },
    { sequence: 6, result: 'empty' },
  ],
  4: [
    { sequence: 1, result: 'empty' },
    { sequence: 2, result: 'empty' },
    { sequence: 3, result: 'empty' },
    { sequence: 4, result: 'empty' },
    { sequence: 5, result: 'empty' },
    { sequence: 6, result: 'empty' },
    { sequence: 7, result: 'empty' },
    { sequence: 8, result: 'empty' },
  ],
  5: [
    { sequence: 1, result: 'empty' },
    { sequence: 2, result: 'empty' },
    { sequence: 3, result: 'empty' },
    { sequence: 4, result: 'empty' },
    { sequence: 5, result: 'empty' },
    { sequence: 6, result: 'empty' },
    { sequence: 7, result: 'empty' },
    { sequence: 8, result: 'empty' },
    { sequence: 9, result: 'empty' },
    { sequence: 10, result: 'empty' },
  ],
};

export const initialStation = {
  station_number: 1,
  name: `Station 1`,
  pair_type: '',
  traps: [{ trap_id: 1, presentation: '' }],
  shots: [],
  selectedTargetPairs: '',
};

export const validateLastStation = (lastStation = []) => {
  if (!lastStation?.pair_type) {
    return 'Please select Pair Type';
  }

  if (!lastStation.traps || lastStation.traps.length !== 2) {
    return 'Please add both trap presentations';
  }

  const hasEmptyPresentation = lastStation.traps.some(
    trap => !trap.presentation.trim(),
  );
  if (hasEmptyPresentation) {
    return 'Please fill both trap presentations';
  }

  const hasEmptyShots =
    !lastStation.shots.length ||
    lastStation.shots.some(
      shot => shot.result === '' || shot.result === 'empty',
    );

  if (hasEmptyShots) {
    return 'Please Select Target Pairs and complete all shots before proceeding';
  }

  return null; // ✅ all good
};

export const formatApiStations = (stations = []) => {
  if (!Array.isArray(stations) || stations.length === 0) return [];

  return stations.map((station, index) => ({
    name: `Station ${index + 1}`,
    station_number: station.station_number ?? null,
    pair_type: station.pair_type ?? '',
    dead: station?.hits ?? null,
    lost: station?.missed ?? null,
    traps: station?.traps || [],
    shots: station?.shots || [],
    isPairSelected: true,
    selectedTargetPairs: station?.shots?.length / 2,
  }));
};

export const stationsDataList = [
  {
    id: 1,
    name: 'Station 01',
    hits: 6,
    missed: 4,
    totalShots: 10,
    isPairSelected: true,
    shots: [
      { id: 1, status: 'hit' }, // orange
      { id: 2, status: 'empty' }, // white
      { id: 3, status: 'empty' }, // white
      { id: 4, status: 'empty' }, // white
      { id: 5, status: 'empty' }, // white
      { id: 6, status: 'empty' }, // white
      { id: 7, status: 'empty' }, // white
      { id: 8, status: 'empty' }, // white
      { id: 9, status: 'empty' }, // white
      { id: 10, status: 'empty' }, // white
    ],
    reportPair: 'TP', // TP or RF
    traps: {
      chandelle: 'Rabbit',
      Crosser: 'Rabbue',
      Incomer: 'Teal',
      Knuckleball: 'Tower',
      Overhead: 'Trap Shot',
      Quartering: 'Trap-Teal',
    },
  },
  {
    id: 2,
    name: 'Station 02',
    hits: 1,
    missed: 0,
    totalShots: 10,
    isPairSelected: true,

    shots: [
      { id: 1, status: 'hit' }, // orange
      { id: 2, status: 'empty' }, // white
      { id: 3, status: 'empty' }, // white
      { id: 4, status: 'empty' }, // white
      { id: 5, status: 'empty' }, // white
      { id: 6, status: 'empty' }, // white
      { id: 7, status: 'empty' }, // white
      { id: 8, status: 'empty' }, // white
      { id: 9, status: 'empty' }, // white
      { id: 10, status: 'empty' }, // white
    ],
    reportPair: 'RP',
    traps: {
      chandelle: 'Rabbit',
      Crosser: 'Rabbue',
      Incomer: 'Teal',
      Knuckleball: 'Tower',
      Overhead: 'Trap Shot',
      Quartering: 'Trap-Teal',
    },
  },
  {
    id: 3,
    name: 'Station 03',
    hits: 6,
    missed: 4,
    totalShots: 10,
    isPairSelected: true,

    shots: [
      { id: 1, status: 'hit' },
      { id: 2, status: 'hit' },
      { id: 3, status: 'missed' },
      { id: 4, status: 'hit' },
      { id: 5, status: 'missed' },
      { id: 6, status: 'missed' },
      { id: 7, status: 'hit' },
      { id: 8, status: 'missed' },
      { id: 9, status: 'hit' },
      { id: 10, status: 'hit' },
    ],
    reportPair: 'TP',
    traps: {
      chandelle: 'Rabbit',
      Crosser: 'Rabbue',
      Incomer: 'Teal',
      Knuckleball: 'Tower',
      Overhead: 'Trap Shot',
      Quartering: 'Trap-Teal',
    },
  },
  {
    id: 4,
    name: 'Station 04',
    hits: 6,
    missed: 4,
    totalShots: 10,
    isPairSelected: true,

    shots: [
      { id: 1, status: 'hit' },
      { id: 2, status: 'hit' },
      { id: 3, status: 'missed' },
      { id: 4, status: 'hit' },
      { id: 5, status: 'missed' },
      { id: 6, status: 'missed' },
      { id: 7, status: 'hit' },
      { id: 8, status: 'missed' },
      { id: 9, status: 'hit' },
      { id: 10, status: 'hit' },
    ],
    reportPair: 'TP',
    traps: {
      chandelle: 'Rabbit',
      Crosser: 'Rabbue',
      Incomer: 'Teal',
      Knuckleball: 'Tower',
      Overhead: 'Trap Shot',
      Quartering: 'Trap-Teal',
    },
  },
  {
    id: 5,
    name: 'Station 05',
    hits: 0,
    missed: 1,
    totalShots: 10,
    isPairSelected: true,
    shots: [
      { id: 1, status: 'missed' },
      { id: 2, status: 'empty' },
      { id: 3, status: 'empty' },
      { id: 4, status: 'empty' },
      { id: 5, status: 'empty' },
      { id: 6, status: 'empty' },
      { id: 7, status: 'empty' },
      { id: 8, status: 'empty' },
      { id: 9, status: 'empty' },
      { id: 10, status: 'empty' },
    ],
    reportPair: 'TP',
    traps: {
      chandelle: 'Rabbit',
      Crosser: 'Rabbue',
      Incomer: 'Teal',
      Knuckleball: 'Tower',
      Overhead: 'Trap Shot',
      Quartering: 'Trap-Teal',
    },
  },
];
