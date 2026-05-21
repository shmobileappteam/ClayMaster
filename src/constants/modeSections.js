/**
 * PAGE 01 — Two modes with aligned sequence (client spec):
 *
 * 1. Field Mode — scorecard, miss diagnostics, practice drills, downloaded videos only
 * 2. Full Library Mode — full portal on mobile (same core order, then portal sections)
 */

export const MODE_LABELS = {
  field: 'Field Mode',
  library: 'Full Library Mode',
};

/**
 * Connectivity assumptions (enforced in useModeSwitch + screen guards):
 * - Field Mode: spotty / limited Wi‑Fi or cellular — offline-first (downloaded videos, local scorecard).
 * - Full Library Mode: strong, reliable internet — streaming catalog, analytics portal, shop, etc.
 */
export const MODE_SWITCH_RULES = {
  fieldAlwaysAvailable: true,
  libraryRequiresStableInternet: true,
  /** Full Kevin & Bill catalog; Field may open only when connection is stable (see fieldOnlineAccess). */
  fieldOnlineVideosOptional: true,
};

/**
 * PAGE 11 — Instructional videos in Field Mode:
 * - Offline: clips downloaded in advance (Field → Downloaded Videos tab).
 * - Online: stream refresher clips only when connection is stable; otherwise use downloads.
 */
export const FIELD_VIDEO_ACCESS = {
  offlineDownloads: true,
  streamingRequiresStableInternet: true,
};

/**
 * PAGE 12 — Additional Videos (library placeholders): users pick clips to save for Field Mode.
 * Device storage varies; use soft budget until real file sizes come from the CDN/API.
 */
export const OFFLINE_VIDEO_STORAGE = {
  /** Suggested total offline budget — not enforced, shown as guidance only */
  recommendedBudgetMb: 500,
  warnAboveMb: 400,
};

/**
 * PAGE 13 — Practice Drills: always in Field Mode; small PDFs (2–4 pages) stored locally.
 * Classic = 9 drills, Pro = 13 drills. Download while online in Full Library or Field.
 */
export const FIELD_DRILL_ACCESS = {
  supportedInFieldMode: true,
  classicDrillCount: 9,
  proDrillCount: 13,
  avgPdfPages: '2-4',
  /** PAGE 14 — list shows preview only; full steps open via explicit View */
  previewBeforeDetail: true,
};

/** PAGE 15–17 — Tournament portal: library-only leaderboard; no guidelines PDF or submit entry in app */
export const TOURNAMENT_PORTAL = {
  libraryOnly: true,
  guidelinesSupported: false,
  submitEntrySupported: false,
};

/** Core sequence shared by both modes (order must stay aligned). */
export const SHARED_TRAINING_ORDER = [
  {
    id: 'scorecard',
    field: {
      label: 'Digital Scorecard',
      shortLabel: 'Scorecard',
      icon: 'clipboard-outline',
      screen: 'CourseHomeScreen',
    },
    library: {
      label: 'Digital Scorecard',
      desc: 'View & print scorecard',
      icon: 'clipboard-outline',
      screen: 'LibraryScorecardScreen',
    },
  },
  {
    id: 'miss',
    field: {
      label: 'Miss Diagnostics',
      shortLabel: 'Miss',
      icon: 'warning-outline',
      screen: 'CourseMissDiagnosisScreen',
    },
    library: {
      label: 'Miss Diagnostics',
      desc: 'Trends & miss patterns',
      icon: 'sparkles-outline',
      action: 'tab',
      tab: 'Analytics',
    },
  },
  {
    id: 'drills',
    field: {
      label: 'Practice Drills',
      shortLabel: 'Drills',
      icon: 'barbell-outline',
      screen: 'CourseTrainScreen',
    },
    library: {
      label: 'Practice Drills',
      desc: 'Focused exercises',
      icon: 'locate-outline',
      screen: 'DrillsScreen',
    },
  },
  {
    id: 'videos',
    field: {
      label: 'Downloaded Instructional Videos',
      shortLabel: 'Videos',
      icon: 'download-outline',
      screen: 'CourseDownloadedVideosScreen',
    },
    library: {
      label: 'Instructional Videos',
      desc: "Kevin & Bill's library",
      icon: 'play-circle-outline',
      screen: 'InstructionalVideosScreen',
    },
  },
];

/** Field Mode bottom tabs — only the four agreed tools. */
export const FIELD_MODE_TABS = SHARED_TRAINING_ORDER.map(item => ({
  label: item.field.shortLabel,
  icon: item.field.icon,
  screen: item.field.screen,
}));

/** Full Library — core grid (same order as Field Mode). */
export const LIBRARY_CORE_SECTIONS = SHARED_TRAINING_ORDER.map(item => ({
  label: item.library.label,
  desc: item.library.desc,
  icon: item.library.icon,
  screen: item.library.screen,
  action: item.library.action,
  tab: item.library.tab,
}));

/** Full Library — additional portal sections after the core four. */
export const LIBRARY_PORTAL_SECTIONS = [
  {
    label: 'On-line Coaching',
    desc: 'Book a session',
    icon: 'people-outline',
    screen: 'CoachingScreen',
  },
  {
    label: 'Private Community',
    desc: 'Connect & share',
    icon: 'chatbubbles-outline',
    screen: 'CommunityScreen',
  },
  {
    label: 'Monthly Webcasts',
    desc: 'Live sessions',
    icon: 'radio-outline',
    screen: 'WebcastScreen',
  },
  {
    label: 'Virtual Tournament',
    desc: 'Leaderboard (Full Library only)',
    icon: 'trophy-outline',
    action: 'tab',
    tab: 'Tournament',
  },
  {
    label: 'Shop',
    desc: 'Merchandise & gear',
    icon: 'bag-outline',
    action: 'tab',
    tab: 'Shop',
  },
];

export const FIELD_MODE_SELECT_TAGS = SHARED_TRAINING_ORDER.map(
  item => item.field.label,
);

export const LIBRARY_MODE_SELECT_TAGS = [
  'Analytics',
  'Coaching',
  'Community',
  'Tournament',
  'Shop',
  'Documents',
];

/** In-progress drill / video — Field Mode (Practice Drills), not Full Library home. */
export const FIELD_CONTINUE_TRAINING = [
  {
    label: 'Mastering the Tower Shot',
    desc: 'Last watched · 4:12 of 12:30',
    icon: 'play',
    screen: 'CourseMissFixVideoScreen',
    params: { title: 'Mastering the Tower Shot' },
  },
  {
    label: 'Late Trigger Correction',
    desc: 'Drill in progress · 2 of 5 steps',
    icon: 'locate-outline',
    screen: 'CourseTrainDetailScreen',
    params: {
      drill: {
        title: 'Late Trigger Correction',
        duration: '5 min',
        level: 'Intermediate',
      },
    },
  },
];
