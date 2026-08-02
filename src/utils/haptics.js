import { Platform, Vibration } from 'react-native';

/**
 * Field Mode shot feedback — built-in Vibration (no extra native dep).
 * HIT = short confirm · MISS = double alert · undo = light tick
 */
export const hapticHit = () => {
  try {
    if (Platform.OS === 'android') {
      Vibration.vibrate(35);
    } else {
      Vibration.vibrate();
    }
  } catch {
    // ignore — some devices / simulators lack a vibrator
  }
};

export const hapticMiss = () => {
  try {
    if (Platform.OS === 'android') {
      // wait, buzz, gap, buzz
      Vibration.vibrate([0, 45, 55, 45]);
    } else {
      Vibration.vibrate();
    }
  } catch {
    // ignore
  }
};

export const hapticUndo = () => {
  try {
    if (Platform.OS === 'android') {
      Vibration.vibrate(18);
    } else {
      Vibration.vibrate();
    }
  } catch {
    // ignore
  }
};
