import axios from 'axios';
import { CSC_API_KEY } from '../constants';
import { CSC_DOMAIN, ENDPOINTS } from './endpoints';

const cscHeaders = {
  headers: {
    'X-CSCAPI-KEY': CSC_API_KEY,
  },
};

/**
 * GET all countries
 * @returns {{ label: string, value: string }[]} value = iso2 (e.g. US)
 */
export const getCountries = async () => {
  const { data } = await axios.get(
    `${CSC_DOMAIN}${ENDPOINTS.CSC_COUNTRIES}`,
    cscHeaders,
  );
  const list = Array.isArray(data) ? data : [];
  return list.map(item => ({
    label: item.name,
    value: item.iso2,
  }));
};

/**
 * GET states for a country iso2
 * @param {string} countryIso e.g. "US"
 * @returns {{ label: string, value: string }[]} value = state iso2
 */
export const getCountryStates = async countryIso => {
  if (!countryIso) return [];
  const { data } = await axios.get(
    `${CSC_DOMAIN}${ENDPOINTS.CSC_STATES(countryIso)}`,
    cscHeaders,
  );
  const list = Array.isArray(data) ? data : [];
  return list.map(item => ({
    label: item.name,
    value: item.iso2,
  }));
};

/**
 * GET cities for country + state iso2
 * @param {string} countryIso e.g. "US"
 * @param {string} stateIso e.g. "TX"
 * @returns {{ label: string, value: string }[]} value = city name
 */
export const getStateCities = async (countryIso, stateIso) => {
  if (!countryIso || !stateIso) return [];
  const { data } = await axios.get(
    `${CSC_DOMAIN}${ENDPOINTS.CSC_CITIES(countryIso, stateIso)}`,
    cscHeaders,
  );
  const list = Array.isArray(data) ? data : [];
  return list.map(item => ({
    label: item.name,
    value: item.name,
  }));
};
