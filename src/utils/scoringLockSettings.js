import { storage } from '../api/api';
import { KEYS } from '../constants';

/** Default 20s — client found previous ~10s auto-lock too fast */
export const DEFAULT_SCORING_LOCK_IDLE_MS = 20000;

export const SCORING_LOCK_OPTIONS = [
  { label: 'Off (manual only)', value: 0 },
  { label: '20 seconds', value: 20000 },
  { label: '60 seconds', value: 60000 },
  { label: '2 minutes', value: 120000 },
];

export function getScoringLockIdleMs() {
  const raw = storage.getString(KEYS.SCORING_LOCK_IDLE_MS);
  if (raw == null || raw === '') return DEFAULT_SCORING_LOCK_IDLE_MS;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return DEFAULT_SCORING_LOCK_IDLE_MS;
  return n;
}

export function setScoringLockIdleMs(ms) {
  const n = Number(ms);
  storage.set(
    KEYS.SCORING_LOCK_IDLE_MS,
    String(Number.isFinite(n) && n >= 0 ? n : DEFAULT_SCORING_LOCK_IDLE_MS),
  );
}
