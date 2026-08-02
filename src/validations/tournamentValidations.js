import * as Yup from 'yup';

/** Matches POST /api/tournament/submit — same Formik + Yup pattern as login. */
const TournamentEntrySchema = Yup.object().shape({
  nsca_class: Yup.string().required('NSCA class is required'),
  competitor_name: Yup.string().trim().required('Competitor name is required'),
  event_score: Yup.number()
    .typeError('Enter a valid event score')
    .required('Event score is required')
    .min(0, 'Score cannot be negative'),
  adj_factor: Yup.number()
    .typeError('Enter a valid adjustment factor')
    .required('Adjustment factor is required'),
  tournament_name: Yup.string().trim().required('Tournament name is required'),
  tournament_date: Yup.string()
    .required('Tournament date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Select a valid date'),
});

export default {
  TournamentEntrySchema,
};
