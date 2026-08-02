import { ENDPOINTS } from './endpoints';
import api from './api';

/**
 * GET /api/tournament/leaderboard?year=&month=&mine=0|1
 */
export const getTournamentLeaderboard = async (params = {}) => {
  const year = params.year ?? new Date().getFullYear();
  const month = params.month ?? new Date().getMonth() + 1;
  const mine = params.mine ? 1 : 0;

  const response = await api.get(ENDPOINTS.GET_TOURNAMENT_LEADERBOARD, {
    params: { year, month, mine },
  });
  const body = response.data;
  const data =
    body?.data && typeof body.data === 'object' && !Array.isArray(body.data)
      ? body.data
      : {};

  return {
    year: Number(data.year) || year,
    month: Number(data.month) || month,
    monthTitle: data.month_title || '',
    mine: Boolean(data.mine),
    standings: Array.isArray(data.standings) ? data.standings : [],
    entries: Array.isArray(data.entries) ? data.entries : [],
    status: body?.status,
    message: body?.message,
  };
};

/**
 * POST /api/tournament/submit
 * Body: nsca_class, competitor_name, event_score, adj_factor, tournament_name, tournament_date
 */
export const submitTournamentEntry = async payload => {
  const response = await api.post(ENDPOINTS.SUBMIT_TOURNAMENT, {
    nsca_class: payload.nsca_class,
    competitor_name: payload.competitor_name,
    event_score: Number(payload.event_score),
    adj_factor: Number(payload.adj_factor),
    tournament_name: payload.tournament_name,
    tournament_date: payload.tournament_date,
  });
  return response.data;
};
