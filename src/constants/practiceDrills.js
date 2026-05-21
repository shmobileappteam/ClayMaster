/**
 * PAGE 13 — Practice drill PDFs (2–4 pages each, small files for local storage).
 * Classic: 9 drills · Pro: 13 drills (Classic + 4 Pro-only).
 */

export const DRILL_TIER = {
  classic: 'classic',
  pro: 'pro',
};

export const DRILL_COUNTS = {
  classic: 9,
  pro: 13,
};

/** ~1.2 MB per 3-page PDF placeholder until API returns real asset size */
export const PRACTICE_DRILLS = [
  {
    id: 'drill-stance-mount',
    title: 'Stance & Mount Basics',
    desc: 'Foundation for consistent shooting',
    tier: DRILL_TIER.classic,
    pages: 3,
    duration: '15 min',
    level: 'Beginner',
  },
  {
    id: 'drill-eye-dominance',
    title: 'Eye Dominance Training',
    desc: 'Optimize your visual focus',
    tier: DRILL_TIER.classic,
    pages: 2,
    duration: '12 min',
    level: 'Beginner',
  },
  {
    id: 'drill-lead-methods',
    title: 'Lead Methods Drill',
    desc: 'Master pull-away and maintained lead',
    tier: DRILL_TIER.classic,
    pages: 4,
    duration: '20 min',
    level: 'Intermediate',
  },
  {
    id: 'drill-hold-point',
    title: 'Hold Point Setup',
    desc: 'Correct muzzle position before the call',
    tier: DRILL_TIER.classic,
    pages: 3,
    duration: '15 min',
    level: 'Beginner',
  },
  {
    id: 'drill-follow-through',
    title: 'Follow-Through Focus',
    desc: 'Maintain swing after the shot',
    tier: DRILL_TIER.classic,
    pages: 2,
    duration: '10 min',
    level: 'Beginner',
  },
  {
    id: 'drill-preshot',
    title: 'Pre-Shot Routine',
    desc: 'Repeatable sequence at the station',
    tier: DRILL_TIER.classic,
    pages: 3,
    duration: '12 min',
    level: 'All Levels',
  },
  {
    id: 'drill-swing-timing',
    title: 'Swing Timing Check',
    desc: 'Sync movement with target speed',
    tier: DRILL_TIER.classic,
    pages: 3,
    duration: '18 min',
    level: 'Intermediate',
  },
  {
    id: 'drill-station-transition',
    title: 'Station Transition Prep',
    desc: 'Reset between stations under pressure',
    tier: DRILL_TIER.classic,
    pages: 2,
    duration: '10 min',
    level: 'All Levels',
  },
  {
    id: 'drill-target-line',
    title: 'Target Line Reading',
    desc: 'Pick up line and break point quickly',
    tier: DRILL_TIER.classic,
    pages: 4,
    duration: '20 min',
    level: 'Intermediate',
  },
  {
    id: 'drill-advanced-analysis',
    title: 'Advanced Shot Analysis',
    desc: 'Break down complex shot patterns',
    tier: DRILL_TIER.pro,
    pages: 4,
    duration: '25 min',
    level: 'Advanced',
  },
  {
    id: 'drill-pressure-reset',
    title: 'Pressure Station Reset',
    desc: 'Recover after a miss in competition',
    tier: DRILL_TIER.pro,
    pages: 3,
    duration: '15 min',
    level: 'Advanced',
  },
  {
    id: 'drill-speed-control',
    title: 'Speed Target Control',
    desc: 'Fast crossers and teal targets',
    tier: DRILL_TIER.pro,
    pages: 3,
    duration: '18 min',
    level: 'Advanced',
  },
  {
    id: 'drill-competition-mental',
    title: 'Competition Mental Prep',
    desc: 'Focus plan before your squad',
    tier: DRILL_TIER.pro,
    pages: 2,
    duration: '12 min',
    level: 'Advanced',
  },
];

export function estimateDrillSizeMb(pages = 3) {
  return Math.max(1, Math.round(pages * 0.4));
}

export function getDrillsForTier(tier) {
  if (tier === DRILL_TIER.pro) {
    return PRACTICE_DRILLS;
  }
  return PRACTICE_DRILLS.filter(d => d.tier === DRILL_TIER.classic);
}
