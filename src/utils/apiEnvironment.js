import { MMKV } from 'react-native-mmkv';

import pkg from '../../package.json';

/**
 * Runtime API environment switch — backs the hidden Developer Options screen.
 *
 * `BASE_URL` used to be frozen at build time by `__DEV__`, so a release build
 * could only ever reach production and beta was untestable on a real device.
 * The target is now chosen at runtime and persisted, so it survives restarts.
 *
 * This module keeps its own MMKV handle rather than importing `storage` from
 * `api/api` — `api.js` reads this module, so importing back would be circular.
 * Both handles address the same default MMKV instance.
 */
const envStorage = new MMKV();

/** Not in `constants/KEYS` on purpose: that barrel re-exports `community.js`,
 *  which imports `endpoints.js`, which imports this file. */
const STORAGE_KEY = '@cm_api_env';

export const APP_VERSION = pkg.version;

export const API_ENVIRONMENTS = [
  {
    key: 'live',
    label: 'Live',
    baseUrl: 'https://claymaster.net/',
  },
  {
    key: 'beta',
    label: 'Beta',
    baseUrl: 'https://claymaster.net/beta/',
  },
];

/** Debug builds still default to beta, matching the old `__DEV__` behaviour. */
const DEFAULT_ENV_KEY = __DEV__ ? 'beta' : 'live';

const findEnv = key => API_ENVIRONMENTS.find(env => env.key === key);

let activeKey = (() => {
  const saved = envStorage.getString(STORAGE_KEY);
  return findEnv(saved) ? saved : DEFAULT_ENV_KEY;
})();

export const getApiEnvKey = () => activeKey;
export const getApiEnv = () => findEnv(activeKey) || findEnv(DEFAULT_ENV_KEY);
export const isBetaEnv = () => activeKey === 'beta';

/** Always trailing-slashed — callers concatenate relative media paths onto it. */
export const getBaseUrl = () => getApiEnv().baseUrl;
export const getApiDomain = () => `${getBaseUrl()}api/`;

/**
 * Switch environment. Callers must clear the session afterwards: tokens are
 * issued per environment, so a live token is meaningless to the beta server.
 *
 * @returns {boolean} true when the environment actually changed
 */
export function setApiEnv(key) {
  if (!findEnv(key) || key === activeKey) return false;
  activeKey = key;
  envStorage.set(STORAGE_KEY, key);
  return true;
}
