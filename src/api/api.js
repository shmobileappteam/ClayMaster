import axios from 'axios';
import { MMKV } from 'react-native-mmkv';
import { QueryClient } from '@tanstack/react-query';
//----
import { getApiDomain } from './endpoints';
import { showMessage } from '../utils';

import { AUTH_APIS_DISABLED, KEYS } from '../constants';

/** Do not retry client errors (403 subscription, 401, 404, …) — avoids stuck screen spinners + repeat toasts. */
const shouldRetryQuery = (failureCount, error) => {
  const status = error?.response?.status;
  if (status >= 400 && status < 500) {
    return false;
  }
  return failureCount < 2;
};

// Query Constructor:
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetryQuery,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Storage Constructor:
export const storage = new MMKV();

const api = axios.create({
  baseURL: getApiDomain(),
});

api.interceptors.request.use(
  async config => {
    // Re-read every request: Developer Options can switch beta/live at runtime.
    config.baseURL = getApiDomain();

    // const token = await AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
    const token = storage.getString(KEYS.ACCESS_TOKEN);
    // console.log('🚀 ~ token:', token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  res => res,
  err => {
    const error = err.response;
    console.log('Error in Axios Response Instance: ', error);

    if (error?.status === 500) {
      showMessage({
        type: 'danger',
        message: error?.data?.error || 'Something went wrong please try again',
      });
    }

    if (error?.status === 400 || error?.status === 401) {
      if (!AUTH_APIS_DISABLED) {
        showMessage({
          type: 'danger',
          message: error?.data?.message || 'Something went wrong! Bad Request',
        });
      }
    }

    if (error?.status === 404) {
      showMessage({
        type: 'danger',
        message: 'Request not found!',
      });
    }

    if (error?.status === 403) {
      if (!AUTH_APIS_DISABLED) {
        showMessage({
          type: 'danger',
          message: error?.data?.message || 'Forbidden!',
        });
      }
    }

    return Promise.reject(err);
  },
);

export default api;
