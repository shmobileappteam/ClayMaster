import store from '../redux/store/store';
import {
  setStripePublishableKey,
  setSubscriptionEnabled,
} from '../redux/slices/appSlice';
import { getSubscriptionEnabled } from './appService';

/** Shared boot fetch so Splash/Login don't race App.js. */
let inflight = null;

/**
 * Loads GET /subscription-enabled once; updates Redux.
 * @returns {Promise<{ subscription_enabled?: boolean, stripe_public_key?: string } | null>}
 */
export function ensureSubscriptionConfig() {
  if (inflight) return inflight;

  inflight = getSubscriptionEnabled()
    .then(data => {
      if (data && typeof data.subscription_enabled !== 'undefined') {
        store.dispatch(setSubscriptionEnabled(!!data.subscription_enabled));
      }
      if (data?.stripe_public_key) {
        store.dispatch(setStripePublishableKey(data.stripe_public_key));
      }
      return data || null;
    })
    .catch(() => {
      // Fail open: skip paywall when flag cannot be loaded
      store.dispatch(setSubscriptionEnabled(false));
      return null;
    });

  return inflight;
}

export function getSubscriptionEnabledFromStore() {
  return !!store.getState()?.app?.subscriptionEnabled;
}
