import NetInfo from '@react-native-community/netinfo';

/**
 * Stable connection = device connected and internet is reachable (not false).
 * `isInternetReachable` may be null on some OS builds while connected; we allow that.
 */
export function isStableInternet(state) {
  if (state?.isConnected !== true) {
    return false;
  }
  if (state.isInternetReachable === false) {
    return false;
  }
  return true;
}

export async function fetchNetworkStatus() {
  const state = await NetInfo.fetch();
  return {
    isConnected: state.isConnected === true,
    isInternetReachable: state.isInternetReachable,
    isStable: isStableInternet(state),
    connectionType: state.type,
  };
}

export function getLibraryBlockedMessage(status) {
  if (!status?.isConnected) {
    return 'Full Library Mode needs an internet connection. Connect to Wi‑Fi or cellular data, or stay in Field Mode.';
  }
  if (status.isInternetReachable === false) {
    return 'Internet is not reachable right now. Field Mode works offline with your downloaded content.';
  }
  return 'Full Library Mode requires a stable internet connection.';
}
