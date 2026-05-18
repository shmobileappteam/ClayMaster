import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { storage } from '../api/api';
import { KEYS } from '../constants';

/** @typedef {'course' | 'library'} AppMode */

/**
 * @typedef {'visual-discipline'|'timing-breakdown'|'speed-mismatch'|'target-line-misread'|'pressure-seq-breakdown'|'planning-error'} MissCategoryId
 */

/**
 * @typedef {{ station: number, shots: { hit: boolean, missCategory?: MissCategoryId }[] }} StationRecord
 */

/**
 * @typedef {{
 *   course: string,
 *   discipline: string,
 *   startedAt: string,
 *   currentStation: number,
 *   totalStations: number,
 *   shotsPerStation: number,
 *   stations: StationRecord[],
 *   finished?: boolean,
 * }} ActiveRound
 */

const AppModeContext = createContext(undefined);

const readJson = key => {
  const raw = storage.getString(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const AppModeProvider = ({ children }) => {
  const [mode, setModeState] = useState(() => {
    const stored = storage.getString(KEYS.APP_MODE);
    return stored === 'course' ? 'course' : 'library';
  });
  const [activeRound, setActiveRound] = useState(() =>
    readJson(KEYS.ACTIVE_ROUND),
  );
  const [lastPrimaryMiss, setLastPrimaryMiss] = useState(() => {
    const stored = storage.getString(KEYS.LAST_PRIMARY_MISS);
    return stored || null;
  });

  const setMode = useCallback(m => {
    setModeState(m);
    storage.set(KEYS.APP_MODE, m);
  }, []);

  useEffect(() => {
    if (activeRound) {
      storage.set(KEYS.ACTIVE_ROUND, JSON.stringify(activeRound));
    } else {
      storage.delete(KEYS.ACTIVE_ROUND);
    }
  }, [activeRound]);

  const startRound = useCallback(init => {
    const round = {
      course: init?.course ?? 'Practice Range',
      discipline: init?.discipline ?? 'Sporting Clays',
      startedAt: new Date().toISOString(),
      currentStation: 1,
      totalStations: init?.totalStations ?? 5,
      shotsPerStation: init?.shotsPerStation ?? 5,
      stations: [{ station: 1, shots: [] }],
    };
    setActiveRound(round);
    setMode('course');
  }, [setMode]);

  const recordShot = useCallback((hit, missCategory) => {
    setActiveRound(r => {
      if (!r) return r;
      const stations = r.stations.map(s => ({ ...s, shots: [...s.shots] }));
      const cur = stations.find(s => s.station === r.currentStation);
      if (cur) cur.shots.push({ hit, missCategory });
      return { ...r, stations };
    });
  }, []);

  const updateLastShotMiss = useCallback(missCategoryId => {
    setActiveRound(r => {
      if (!r) return r;
      const stations = r.stations.map(s => ({
        ...s,
        shots: s.shots.map(sh => ({ ...sh })),
      }));
      const cur = stations.find(s => s.station === r.currentStation);
      if (cur && cur.shots.length > 0) {
        const last = cur.shots[cur.shots.length - 1];
        if (!last.hit) last.missCategory = missCategoryId;
      }
      return { ...r, stations };
    });
  }, []);

  const nextStation = useCallback(() => {
    setActiveRound(r => {
      if (!r) return r;
      const next = r.currentStation + 1;
      if (next > r.totalStations) return r;
      const exists = r.stations.find(s => s.station === next);
      const stations = exists
        ? r.stations
        : [...r.stations, { station: next, shots: [] }];
      return { ...r, currentStation: next, stations };
    });
  }, []);

  const finishRound = useCallback(() => {
    setActiveRound(r => {
      if (!r) return r;
      const tally = {};
      r.stations.forEach(s =>
        s.shots.forEach(sh => {
          if (!sh.hit && sh.missCategory) {
            tally[sh.missCategory] = (tally[sh.missCategory] || 0) + 1;
          }
        }),
      );
      const primary = Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0];
      if (primary) {
        setLastPrimaryMiss(primary);
        storage.set(KEYS.LAST_PRIMARY_MISS, primary);
      }
      return { ...r, finished: true };
    });
  }, []);

  const clearRound = useCallback(() => setActiveRound(null), []);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      activeRound,
      startRound,
      recordShot,
      updateLastShotMiss,
      nextStation,
      finishRound,
      clearRound,
      lastPrimaryMiss,
    }),
    [
      mode,
      setMode,
      activeRound,
      startRound,
      recordShot,
      updateLastShotMiss,
      nextStation,
      finishRound,
      clearRound,
      lastPrimaryMiss,
    ],
  );

  return (
    <AppModeContext.Provider value={value}>{children}</AppModeContext.Provider>
  );
};

export const useAppMode = () => {
  const context = useContext(AppModeContext);
  if (!context) {
    throw new Error('useAppMode must be used within AppModeProvider');
  }
  return context;
};
