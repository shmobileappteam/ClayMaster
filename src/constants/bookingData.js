/** Mock booking data — ClayMaster-App-UI `booking-data.ts` parity */

export const coachInfo = {
  name: 'Kevin DeMichiel',
  initials: 'KD',
  experience: 'Head Coach · 15 yrs experience',
};

export const timeSlots = [
  '9:00 AM',
  '10:30 AM',
  '12:00 PM',
  '2:00 PM',
  '3:30 PM',
  '5:00 PM',
];

export const focusOptions = [
  'General Improvement',
  'Tower Shots',
  'Crossers',
  'Stance & Mount',
  'Competition Prep',
];

export const initialPastBookings = [
  {
    id: 1,
    coach: coachInfo.name,
    initials: coachInfo.initials,
    sessionDate: '2026-04-05',
    date: 'Apr 5, 2026',
    time: '10:30 AM',
    type: 'Virtual',
    focus: 'Crossers',
    status: 'Completed',
  },
  {
    id: 2,
    coach: coachInfo.name,
    initials: coachInfo.initials,
    sessionDate: '2026-03-22',
    date: 'Mar 22, 2026',
    time: '2:00 PM',
    type: 'In-Person',
    focus: 'Tower Shots',
    status: 'Completed',
  },
  {
    id: 3,
    coach: coachInfo.name,
    initials: coachInfo.initials,
    sessionDate: '2026-03-08',
    date: 'Mar 8, 2026',
    time: '9:00 AM',
    type: 'Virtual',
    focus: 'Stance & Mount',
    status: 'Cancelled',
  },
];

export const initialUpcomingBookings = [
  {
    id: 4,
    coach: coachInfo.name,
    initials: coachInfo.initials,
    sessionDate: '2026-04-12',
    date: 'Apr 12, 2026',
    time: '3:30 PM',
    type: 'Virtual',
    focus: 'Competition Prep',
    status: 'Confirmed',
    notes: 'Review pre-event routine and station strategy.',
  },
];

export const getDefaultBookingDate = () => {
  const nextDay = new Date();
  nextDay.setDate(nextDay.getDate() + 1);
  const y = nextDay.getFullYear();
  const m = String(nextDay.getMonth() + 1).padStart(2, '0');
  const d = String(nextDay.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const formatSessionDate = value => {
  if (!value) return '';
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(year, month - 1, day));
};
