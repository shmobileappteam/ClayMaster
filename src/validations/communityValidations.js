import * as Yup from 'yup';

/** Matches POST /api/forums create topic. */
const CreateForumSchema = Yup.object().shape({
  title: Yup.string().trim().required('Title is required').max(160, 'Title is too long'),
  category_id: Yup.mixed().required('Category is required'),
  description: Yup.string()
    .trim()
    .required('Description is required')
    .min(10, 'Please write a bit more detail'),
  tags: Yup.array().of(Yup.string()),
  enable_poll: Yup.boolean(),
  poll_question: Yup.string().when('enable_poll', {
    is: true,
    then: schema => schema.trim().required('Poll question is required'),
    otherwise: schema => schema.nullable(),
  }),
  poll_option_a: Yup.string().when('enable_poll', {
    is: true,
    then: schema => schema.trim().required('Option 1 is required'),
    otherwise: schema => schema.nullable(),
  }),
  poll_option_b: Yup.string().when('enable_poll', {
    is: true,
    then: schema => schema.trim().required('Option 2 is required'),
    otherwise: schema => schema.nullable(),
  }),
});

export default {
  CreateForumSchema,
};
