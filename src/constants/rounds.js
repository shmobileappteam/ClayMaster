/**
 * Rounds / stations helpers — API shapes from docs/api/request-response/04-rounds-stations.md
 * No hardcoded list/scorecard demo data.
 */

import { formatApiStations, initialStation } from './dummydata';

/** HIT → dead, MISS → lost (API StationUpsertRequest) */
export const shotResultFromHitMiss = hit => (hit ? 'dead' : 'lost');

export const isRoundComplete = round =>
  !!(round?.complete_status === true || round?.status === 'completed');

export const isRoundResumable = round => !isRoundComplete(round);

/** Keep API sequence. Optionally pin the active (in-progress) round at top only. */
export const sortRoundsForFieldList = (rounds = [], activeRoundId = null) => {
  const list = Array.isArray(rounds) ? [...rounds] : [];
  if (activeRoundId == null || activeRoundId === '') return list;
  const activeIdx = list.findIndex(
    r => Number(r?.id) === Number(activeRoundId),
  );
  if (activeIdx <= 0) return list;
  const [active] = list.splice(activeIdx, 1);
  return [active, ...list];
};

export const seedStationFromRound = round => {
  const seq = Array.isArray(round?.station_sequence) ? round.station_sequence : [];
  const first = seq.length ? seq[0] : 1;
  return [
    {
      ...initialStation,
      station_number: first,
      name: `Station ${first}`,
      traps: [{ trap_id: 1, presentation: '' }],
      shots: [],
      selectedTargetPairs: '',
    },
  ];
};

/** Map GET stations traps.selected_presentation → UI presentation */
export const hydrateStationsForPlay = (apiStations = [], european = false) => {
  const formatted = formatApiStations(apiStations, european);
  return formatted.map(st => ({
    ...st,
    traps: (st.traps || []).map(t => ({
      trap_id: t.trap_id,
      presentation: t.presentation || t.selected_presentation || '',
    })),
    selectedTargetPairs:
      st.selectedTargetPairs ||
      (Array.isArray(st.shots) && st.shots.length ? st.shots.length / 2 : ''),
  }));
};

/** Strip UI-only fields before POST /rounds/{id}/stations */
export const buildStationsPayload = (stations = []) =>
  stations.map(st => ({
    station_number: st.station_number,
    pair_type: st.pair_type,
    traps: (st.traps || []).map(t => ({
      trap_id: t.trap_id,
      presentation: t.presentation || t.selected_presentation || '',
    })),
    shots: (st.shots || []).map(s => ({
      sequence: s.sequence,
      result: !s.result || s.result === '' ? 'empty' : s.result,
    })),
  }));

export const buildActiveDraft = ({
  round,
  stations,
  courseName,
  createdAt,
}) => {
  const id = round?.id;
  const stationList =
    Array.isArray(stations) && stations.length
      ? stations
      : seedStationFromRound(round || {});
  const current = stationList[stationList.length - 1];
  return {
    roundId: id,
    course_name: courseName || round?.course_name || 'Course',
    ncsca_class: round?.ncsca_class,
    created_at: createdAt || round?.created_at || new Date().toISOString(),
    european_rotation: !!round?.european_rotation,
    starting_station: round?.starting_station ?? null,
    total_stations: round?.total_stations ?? null,
    station_sequence: Array.isArray(round?.station_sequence)
      ? round.station_sequence
      : [],
    stations: stationList,
    currentStation: current?.station_number ?? 1,
    finished: false,
    playing: false,
  };
};

/**
 * Milestone Field score logic:
 * - only count shots already taken (ignore `empty`)
 * - hit = dead (or legacy `hit: true`)
 * - display as hits / taken
 */
export const isShotTaken = shot => {
  if (!shot) return false;
  if (shot.result === 'dead' || shot.result === 'lost') return true;
  if (typeof shot.hit === 'boolean') return true;
  return false;
};

export const isShotHit = shot => {
  if (!shot) return false;
  if (shot.result === 'dead') return true;
  if (shot.hit === true) return true;
  return false;
};

/** Per-station or round score — same as milestone `{hits}/{taken}` */
export const scoreFromShots = (shots = []) => {
  const takenShots = (shots || []).filter(isShotTaken);
  return {
    hits: takenShots.filter(isShotHit).length,
    taken: takenShots.length,
  };
};

/**
 * Station denominator from setup (pairs × 2 targets), not shots taken so far.
 * Client: show e.g. 1/8 after config, not 1/2 while scoring.
 */
export const expectedShotsForStation = (station = {}) => {
  const pairs = Number(station?.selectedTargetPairs) || 0;
  if (pairs > 0) return pairs * 2;
  const allocated = Array.isArray(station?.shots) ? station.shots.length : 0;
  return allocated;
};

/** Display hits against configured station total */
export const stationScoreAgainstExpected = (station = {}) => {
  const { hits } = scoreFromShots(station?.shots);
  const expected = expectedShotsForStation(station);
  return {
    hits,
    expected,
    label: `${hits}/${expected || 0}`,
  };
};

/** Short target reminder e.g. "TP · Crosser / Rabbit" */
export const formatStationTargetReminder = (station = {}, trapsCatalog = []) => {
  if (!station) return '';
  const pairAbbr =
    station.pair_type === 'true_pair'
      ? 'TP'
      : station.pair_type === 'report_pair'
        ? 'RP'
        : '';
  const labels = (station.traps || [])
    .map(t => {
      const slug = t.presentation || t.selected_presentation || '';
      if (!slug) return '';
      const hit = (trapsCatalog || []).find(c => c.slug === slug);
      return hit?.label || slug;
    })
    .filter(Boolean);
  if (!pairAbbr && !labels.length) return '';
  if (pairAbbr && labels.length) return `${pairAbbr} · ${labels.join(' / ')}`;
  return pairAbbr || labels.join(' / ');
};

export const scoreFromStations = (stations = []) =>
  (stations || []).reduce(
    (acc, st) => {
      const fromShots = scoreFromShots(st?.shots);
      if (fromShots.taken > 0) {
        return { hits: acc.hits + fromShots.hits, taken: acc.taken + fromShots.taken };
      }
      // GET /stations may expose dead/lost without expanding shots
      const dead = Number(st?.dead) || 0;
      const lost = Number(st?.lost) || 0;
      if (dead + lost > 0) {
        return { hits: acc.hits + dead, taken: acc.taken + dead + lost };
      }
      return acc;
    },
    { hits: 0, taken: 0 },
  );

/** Scorecard UI: dead = hit, lost = miss; ignore empty */
export const mapRoundToScorecardStations = round => {
  const stations = Array.isArray(round?.stations) ? round.stations : [];
  return stations.map((st, index) => {
    const shots = (st.shots || [])
      .filter(isShotTaken)
      .map(s => isShotHit(s));
    const num = st.station_number ?? index + 1;
    return {
      name: `Station ${num}`,
      shots,
    };
  });
};

export const formatRoundMetaLine = round => {
  if (!round) return '';
  const date = round.created_at
    ? new Date(round.created_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';
  const klass = round.ncsca_class ? ` · ${round.ncsca_class}` : '';
  return `${date}${klass}`.trim();
};
