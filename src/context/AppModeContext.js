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

/**
 * @typedef {'course' | 'library'} AppMode
 *
 * Active round draft (MMKV) — stations stay local until Complete posts to API.
 * `playing` = user is on the play screen (not paused). Reload reopens play only when true.
 * @typedef {{
 *   roundId: number,
 *   course_name: string,
 *   ncsca_class?: string,
 *   created_at?: string,
 *   european_rotation?: boolean,
 *   starting_station?: number|null,
 *   total_stations?: number|null,
 *   station_sequence?: number[],
 *   stations: object[],
 *   currentStation: number,
 *   finished?: boolean,
 *   playing?: boolean,
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

  /**
   * Replace the single active draft.
   * Does NOT change APP_MODE — mode only changes via explicit Field/Library switch or Pause.
   */
  const setActiveDraft = useCallback(draft => {
    if (!draft?.roundId) {
      setActiveRound(null);
      return;
    }
    setActiveRound({
      ...draft,
      finished: false,
      playing: draft.playing === true,
      currentStation:
        draft.currentStation ??
        draft.stations?.[draft.stations.length - 1]?.station_number ??
        1,
    });
  }, []);

  const updateDraftStations = useCallback(stations => {
    setActiveRound(r => {
      if (!r) return r;
      const current =
        stations?.[stations.length - 1]?.station_number ?? r.currentStation;
      return { ...r, stations, currentStation: current, finished: false };
    });
  }, []);

  /** Mark play session active (reload → CourseRound) or paused (reload → mode home). */
  const setRoundPlaying = useCallback(playing => {
    setActiveRound(r => {
      if (!r?.roundId) return r;
      return { ...r, playing: !!playing, finished: false };
    });
  }, []);

  const clearRound = useCallback(() => setActiveRound(null), []);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      activeRound,
      setActiveDraft,
      updateDraftStations,
      setRoundPlaying,
      clearRound,
      lastPrimaryMiss,
      setLastPrimaryMiss,
    }),
    [
      mode,
      setMode,
      activeRound,
      setActiveDraft,
      updateDraftStations,
      setRoundPlaying,
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
