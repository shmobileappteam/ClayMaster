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
  {
    label: 'Subscription',
    icon: 'star',
    family: 'Ionicons',
    navLink: 'SubscriptionScreen',
    stack: null,
    fromProfile: true,
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
  {
    label: 'Change Password',
    icon: 'help-circle-outline',
    family: 'Ionicons',
    navLink: 'ChangePasswordScreen',
  },
  { label: 'Help & Support', icon: 'help-circle-outline', family: 'Ionicons' },
  {
    label: 'Terms & Conditions',
    icon: 'document-text-outline',
    family: 'Ionicons',
  },
  {
    label: 'Delete Acount',
    icon: 'delete',
    family: 'AntDesign',
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
  13: true,
  14: true,
  15: true,
  16: true,
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

export const initialStation2 = [
  {
    station_number: 1,
    name: 'Station 1',
    pair_type: 'report_pair',
    traps: [
      { trap_id: 1, presentation: 'rabbit' },
      { trap_id: 2, presentation: 'chandelle' },
    ],
    shots: [
      { sequence: 1, result: 'dead' },
      { sequence: 2, result: 'lost' },
      { sequence: 3, result: 'dead' },
      { sequence: 4, result: 'lost' },
      { sequence: 5, result: 'dead' },
      { sequence: 6, result: 'lost' },
      { sequence: 7, result: 'dead' },
      { sequence: 8, result: 'lost' },
      { sequence: 9, result: 'dead' },
      { sequence: 10, result: 'lost' },
    ],
    selectedTargetPairs: 5,
  },
  {
    station_number: 2,
    name: 'Station 2',
    pair_type: 'report_pair',
    traps: [
      { trap_id: 1, presentation: 'rabbit' },
      { trap_id: 2, presentation: 'trap_shot' },
    ],
    shots: [
      { sequence: 1, result: 'dead' },
      { sequence: 2, result: 'lost' },
      { sequence: 3, result: 'dead' },
      { sequence: 4, result: 'lost' },
      { sequence: 5, result: 'dead' },
      { sequence: 6, result: 'lost' },
      { sequence: 7, result: 'dead' },
      { sequence: 8, result: 'lost' },
    ],
    selectedTargetPairs: 4,
  },
  {
    station_number: 3,
    name: 'Station 3',
    pair_type: 'report_pair',
    traps: [
      { trap_id: 1, presentation: 'teal' },
      { trap_id: 2, presentation: 'rabbit' },
    ],
    shots: [
      { sequence: 1, result: 'dead' },
      { sequence: 2, result: 'lost' },
      { sequence: 3, result: 'dead' },
      { sequence: 4, result: 'lost' },
      { sequence: 5, result: 'dead' },
      { sequence: 6, result: 'lost' },
    ],
    selectedTargetPairs: 3,
  },

  {
    station_number: 4,
    name: 'Station 4',
    pair_type: 'report_pair',
    traps: [
      { trap_id: 1, presentation: 'rabbit' },
      { trap_id: 2, presentation: 'chandelle' },
    ],
    shots: [
      { sequence: 1, result: 'dead' },
      { sequence: 2, result: 'lost' },
      { sequence: 3, result: 'dead' },
      { sequence: 4, result: 'lost' },
      { sequence: 5, result: 'dead' },
      { sequence: 6, result: 'lost' },
      { sequence: 7, result: 'dead' },
      { sequence: 8, result: 'lost' },
      { sequence: 9, result: 'dead' },
      { sequence: 10, result: 'lost' },
    ],
    selectedTargetPairs: 5,
  },
  {
    station_number: 5,
    name: 'Station 5',
    pair_type: 'report_pair',
    traps: [
      { trap_id: 1, presentation: 'trap_shot' },
      { trap_id: 2, presentation: 'rabbit' },
    ],
    shots: [
      { sequence: 1, result: 'dead' },
      { sequence: 2, result: 'lost' },
      { sequence: 3, result: 'dead' },
      { sequence: 4, result: 'lost' },
      { sequence: 5, result: 'dead' },
      { sequence: 6, result: 'lost' },
      { sequence: 7, result: 'dead' },
      { sequence: 8, result: 'lost' },
    ],
    selectedTargetPairs: 4,
  },
  {
    station_number: 6,
    name: 'Station 6',
    pair_type: 'report_pair',
    traps: [
      { trap_id: 1, presentation: 'teal' },
      { trap_id: 2, presentation: 'rabbit' },
    ],
    shots: [
      { sequence: 1, result: 'dead' },
      { sequence: 2, result: 'lost' },
      { sequence: 3, result: 'dead' },
      { sequence: 4, result: 'lost' },
      { sequence: 5, result: 'dead' },
      { sequence: 6, result: 'lost' },
    ],
    selectedTargetPairs: 3,
  },

  {
    station_number: 7,
    name: 'Station 7',
    pair_type: 'report_pair',
    traps: [
      { trap_id: 1, presentation: 'rabbit' },
      { trap_id: 2, presentation: 'chandelle' },
    ],
    shots: [
      { sequence: 1, result: 'dead' },
      { sequence: 2, result: 'lost' },
      { sequence: 3, result: 'dead' },
      { sequence: 4, result: 'lost' },
      { sequence: 5, result: 'dead' },
      { sequence: 6, result: 'lost' },
      { sequence: 7, result: 'dead' },
      { sequence: 8, result: 'lost' },
      { sequence: 9, result: 'dead' },
      { sequence: 10, result: 'lost' },
    ],
    selectedTargetPairs: 5,
  },
  {
    station_number: 8,
    name: 'Station 8',
    pair_type: 'report_pair',
    traps: [
      { trap_id: 1, presentation: 'trap_shot' },
      { trap_id: 2, presentation: 'rabbit' },
    ],
    shots: [
      { sequence: 1, result: 'dead' },
      { sequence: 2, result: 'lost' },
      { sequence: 3, result: 'dead' },
      { sequence: 4, result: 'lost' },
      { sequence: 5, result: 'dead' },
      { sequence: 6, result: 'lost' },
      { sequence: 7, result: 'dead' },
      { sequence: 8, result: 'lost' },
    ],
    selectedTargetPairs: 4,
  },
  {
    station_number: 9,
    name: 'Station 9',
    pair_type: 'report_pair',
    traps: [
      { trap_id: 1, presentation: 'teal' },
      { trap_id: 2, presentation: 'rabbit' },
    ],
    shots: [
      { sequence: 1, result: 'dead' },
      { sequence: 2, result: 'lost' },
      { sequence: 3, result: 'dead' },
      { sequence: 4, result: 'lost' },
      { sequence: 5, result: 'dead' },
      { sequence: 6, result: 'lost' },
    ],
    selectedTargetPairs: 3,
  },

  {
    station_number: 10,
    name: 'Station 10',
    pair_type: 'report_pair',
    traps: [
      { trap_id: 1, presentation: 'rabbit' },
      { trap_id: 2, presentation: 'chandelle' },
    ],
    shots: [
      { sequence: 1, result: 'dead' },
      { sequence: 2, result: 'lost' },
      { sequence: 3, result: 'dead' },
      { sequence: 4, result: 'lost' },
      { sequence: 5, result: 'dead' },
      { sequence: 6, result: 'lost' },
      { sequence: 7, result: 'dead' },
      { sequence: 8, result: 'lost' },
      { sequence: 9, result: 'dead' },
      { sequence: 10, result: 'lost' },
    ],
    selectedTargetPairs: 5,
  },
  {
    station_number: 11,
    name: 'Station 11',
    pair_type: 'report_pair',
    traps: [
      { trap_id: 1, presentation: 'rabbit' },
      { trap_id: 2, presentation: 'teal' },
    ],
    shots: [
      { sequence: 1, result: 'dead' },
      { sequence: 2, result: 'lost' },
      { sequence: 3, result: 'dead' },
      { sequence: 4, result: 'lost' },
      { sequence: 5, result: 'dead' },
      { sequence: 6, result: 'lost' },
      { sequence: 7, result: 'dead' },
      { sequence: 8, result: 'lost' },
      { sequence: 9, result: 'dead' },
      { sequence: 10, result: 'lost' },
    ],
    selectedTargetPairs: 5,
  },
];

export function generateStations(totalStations = 9) {
  const pairPattern = [5, 4, 3]; // allowed pairs only
  const presentations = ['rabbit', 'chandelle', 'trap_shot', 'teal'];
  const results = ['dead', 'lost'];

  let stations = [];
  let stationNumber = 1;

  for (let i = 0; i < totalStations; i++) {
    const selectedTargetPairs = pairPattern[i % pairPattern.length];
    const totalShots = selectedTargetPairs * 2;

    const shots = Array.from({ length: totalShots }, (_, index) => ({
      sequence: index + 1,
      result: results[index % results.length],
    }));

    stations.push({
      station_number: stationNumber,
      name: `Station ${stationNumber}`,
      pair_type: 'report_pair',
      traps: [
        {
          trap_id: 1,
          presentation: presentations[stationNumber % presentations.length],
        },
        {
          trap_id: 2,
          presentation:
            presentations[(stationNumber + 1) % presentations.length],
        },
      ],
      shots,
      selectedTargetPairs,
    });

    stationNumber++;
  }

  return stations;
}

export function generateStationsByTotalShots(targetShots) {
  // not working correctly
  const pairPattern = [5, 4, 3]; // allowed only
  const presentations = ['rabbit', 'chandelle', 'trap_shot', 'teal'];
  const results = ['dead', 'lost'];

  let stations = [];
  let stationNumber = 1;
  let totalGeneratedShots = 0;
  let patternIndex = 0;

  while (totalGeneratedShots < targetShots) {
    const selectedTargetPairs = pairPattern[patternIndex % pairPattern.length];
    const stationShots = selectedTargetPairs * 2;

    // 🚨 Prevent exceeding target shots
    if (totalGeneratedShots + stationShots > targetShots) break;

    const shots = Array.from({ length: stationShots }, (_, index) => ({
      sequence: index + 1,
      result: results[index % results.length],
    }));

    stations.push({
      station_number: stationNumber,
      name: `Station ${stationNumber}`,
      pair_type: 'report_pair',
      traps: [
        {
          trap_id: 1,
          presentation: presentations[stationNumber % presentations.length],
        },
        {
          trap_id: 2,
          presentation:
            presentations[(stationNumber + 1) % presentations.length],
        },
      ],
      shots,
      selectedTargetPairs,
    });

    totalGeneratedShots += stationShots;
    stationNumber++;
    patternIndex++;
  }

  return {
    totalShots: totalGeneratedShots,
    totalStations: stations.length,
    data: stations,
  };
}

export const validateLastStation = (lastStation = [], checkHasEmpty = true) => {
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

  if (checkHasEmpty) {
    const hasEmptyShots =
      !lastStation.shots.length ||
      lastStation.shots.some(
        shot => shot.result === '' || shot.result === 'empty',
      );

    if (hasEmptyShots) {
      return 'Please Select Target Pairs and complete all shots before proceeding';
    }
  }

  return null; // ✅ all good
};

export function validateRoundData(data) {
  if (!data.course_name || data.course_name.trim() === '') {
    return 'Course name is required';
  }

  if (!data.ncsca_class || data.ncsca_class.trim() === '') {
    return 'Class is required';
  }

  if (!data.squad_sequence || isNaN(data.squad_sequence)) {
    return 'Valid squad sequence is required';
  }

  if (
    !data.people_in_squad ||
    isNaN(data.people_in_squad) ||
    Number(data.people_in_squad) <= 0
  ) {
    return 'People in squad must be a positive number';
  }

  return '';
}

export const formatApiStations = (
  stations = [],
  isEuropeanRotation = false,
) => {
  if (!Array.isArray(stations) || stations.length === 0) return [];

  return stations.map((station, index) => {
    const stationNum = station?.station_number ?? index + 1;

    return {
      name: isEuropeanRotation
        ? `Station ${stationNum}`
        : `Station ${index + 1}`,
      station_number: stationNum,
      pair_type: station?.pair_type ?? '',
      dead: station?.dead ?? null,
      lost: station?.lost ?? null,
      traps: station?.traps || [],
      shots: station?.shots || [],
      isPairSelected: true,
      selectedTargetPairs: (station?.shots?.length || 0) / 2,
    };
  });
};

export const createRoundDropData = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
];

export const discountTypeOptions = [
  { label: 'Youth', value: 'student' },
  { label: 'Military Discount', value: 'military' },
];

export const handleStationChange = (updatedStation, scrollRef) => {
  const { pair_type, traps, selectedTargetPairs } = updatedStation;
  const hasPairType = !!pair_type;
  const allTrapsFilled =
    Array.isArray(traps) &&
    traps.length === 2 &&
    traps.every(trap => trap.presentation && trap.presentation.trim() !== '');
  const hasSelectedTargetPairs = !!selectedTargetPairs;

  if (hasPairType && allTrapsFilled && hasSelectedTargetPairs) {
    scrollRef?.current?.scrollToEnd({ animated: true });
  }
};

export const disableStation = (index, stations, isEuropeanRotation) => {
  const isLast = index === stations.length - 1;

  if (isEuropeanRotation) {
    // European: only last station can be edited
    return !isLast;
  } else {
    // Normal: also only last station editable
    return !isLast;
  }
};

function suggestPairsForEuropeanRotation(stations) {
  const minPairs = Math.ceil(100 / (2 * stations));
  const maxPairs = Math.floor(110 / (2 * stations));

  // If min=max, then same pairs for all stations (e.g., 10 stations = 5 pairs each)
  if (minPairs === maxPairs) {
    return Array(stations).fill(minPairs);
  }

  // Otherwise distribute mix of minPairs and maxPairs to stay close to 100–110 shots
  let result = Array(stations).fill(minPairs);
  let shots = stations * minPairs * 2;

  let i = 0;
  while (shots < 100 && i < stations) {
    result[i] = maxPairs;
    shots = result.reduce((sum, p) => sum + p * 2, 0);
    i++;
  }

  return result;
}
