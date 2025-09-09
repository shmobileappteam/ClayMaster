export const stationsData = [
  {
    id: 1,
    name: 'Station 01',
    hits: 6,
    missed: 4,
    totalShots: 10,
    shots: [
      { id: 1, status: 'hit' }, // orange
      { id: 2, status: 'hit' }, // orange
      { id: 3, status: 'missed' }, // grey
      { id: 4, status: 'hit' }, // orange
      { id: 5, status: 'missed' }, // grey
      { id: 6, status: 'missed' }, // grey
      { id: 7, status: 'empty' }, // orange
      { id: 8, status: 'missed' }, // grey
      { id: 9, status: 'hit' }, // orange
      { id: 10, status: 'hit' }, // orange
    ],
    reportPair: 'TP', // TP or RF
    traps: {
      chandelle: 'Crosser',
      incomer: 'Knuckleball/Off-Speed',
      overhead: 'Quartering',
      rabbit: 'Tee',
      tower: 'Rabbit',
      trapTee: 'Trap Shot',
    },
  },
  {
    id: 2,
    name: 'Station 02',
    hits: 1,
    missed: 0,
    totalShots: 10,
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
    reportPair: 'RF',
    traps: {
      chandelle: 'Crosser',
      incomer: 'Knuckleball/Off-Speed',
      overhead: 'Quartering',
      rabbit: 'Tee',
      tower: 'Rabbit',
      trapTee: 'Trap Shot',
    },
  },
  {
    id: 3,
    name: 'Station 03',
    hits: 6,
    missed: 4,
    totalShots: 10,
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
      chandelle: 'Crosser',
      incomer: 'Knuckleball/Off-Speed',
      overhead: 'Quartering',
      rabbit: 'Tee',
      tower: 'Rabbit',
      trapTee: 'Trap Shot',
    },
  },
  {
    id: 4,
    name: 'Station 04',
    hits: 6,
    missed: 4,
    totalShots: 10,
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
    reportPair: 'RF',
    traps: {
      chandelle: 'Crosser',
      incomer: 'Knuckleball/Off-Speed',
      overhead: 'Quartering',
      rabbit: 'Tee',
      tower: 'Rabbit',
      trapTee: 'Trap Shot',
    },
  },
  {
    id: 5,
    name: 'Station 05',
    hits: 6,
    missed: 4,
    totalShots: 10,
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
      chandelle: 'Crosser',
      incomer: 'Knuckleball/Off-Speed',
      overhead: 'Quartering',
      rabbit: 'Tee',
      tower: 'Rabbit',
      trapTee: 'Trap Shot',
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

  { label: 'Our Reviews', icon: 'star-outline', family: 'Ionicons' },
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
