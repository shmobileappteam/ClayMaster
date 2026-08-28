import { useCallback, useRef, useState } from 'react';

/**
 * Counts rapid taps on an innocuous element and fires `onUnlock` once the
 * threshold is hit inside the time window. Used to reveal Developer Options
 * without putting anything discoverable in the UI.
 *
 * The counter resets whenever the gap between taps exceeds `windowMs`, so
 * incidental taps by a normal user never accumulate.
 */
export default function useSecretGate({
  taps = 7,
  windowMs = 3000,
  onUnlock,
} = {}) {
  const countRef = useRef(0);
  const lastTapRef = useRef(0);
  const [remaining, setRemaining] = useState(null);

  const registerTap = useCallback(() => {
    const now = Date.now();

    if (now - lastTapRef.current > windowMs) {
      countRef.current = 0;
    }
    lastTapRef.current = now;
    countRef.current += 1;

    const left = taps - countRef.current;

    if (left <= 0) {
      countRef.current = 0;
      lastTapRef.current = 0;
      setRemaining(null);
      onUnlock?.();
      return;
    }

    // Stay silent until the taps are clearly deliberate, so a stray
    // double-tap never hints that anything is hidden here.
    setRemaining(left <= 3 ? left : null);
  }, [taps, windowMs, onUnlock]);

  const reset = useCallback(() => {
    countRef.current = 0;
    lastTapRef.current = 0;
    setRemaining(null);
  }, []);

  return { registerTap, remaining, reset };
}
