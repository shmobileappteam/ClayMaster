import * as Yup from 'yup';
import { nameValidation, passwordRegex } from './customValidations';

const SignInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),

  password: Yup.string().required('Password is required'),
  // .matches(
  //   passwordRegex,
  //   'Password must contain at least one alphabetic character, one numeric character, and one special character.',
  // ),
});

const SignUpSchema = Yup.object().shape({
  first_name: nameValidation(2, 30),
  last_name: nameValidation(2, 30),
  email: Yup.string().email('Invalid email').required('Email is required'),

  // phone: Yup.string()
  //   .required('Phone number is required')
  //   .matches(/^\d{10}$/, 'Phone number must be 10 digits'),

  password: Yup.string()
    .required('Password is required')
    .matches(
      passwordRegex,
      'Password must contain at least one alphabetic character, one numeric character, and one special character.',
    ),

  password_confirmation: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords do not match'),
  // discount_type: Yup.string().required("Discount type is required")
});

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  otp: Yup.string()
    .required('OTP is required')
    .matches(/^[0-9]+$/, 'OTP only digits')
    .min(6, 'Invalid OTP')
    .max(6, 'Invalid OTP'),

  password: Yup.string()
    .required('Password is required')
    .matches(
      passwordRegex,
      'Password must contain at least one alphabetic character, one numeric character, and one special character.',
    ),

  password_confirmation: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords do not match'),
});

const verifyOtpSchema = Yup.object().shape({
  otp: Yup.string()
    .required('OTP is required')
    .matches(/^[0-9]+$/, 'OTP only digits')
    .length(6, 'Invalid OTP'),
});

const changePaswordSchema = Yup.object().shape({
  current_password: Yup.string()
    .required('Password is required')
    .matches(
      passwordRegex,
      'Password must contain at least one alphabetic character, one numeric character, and one special character.',
    ),
  password: Yup.string()
    .required('Password is required')
    .matches(
      passwordRegex,
      'Password must contain at least one alphabetic character, one numeric character, and one special character.',
    ),

  password_confirmation: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords do not match'),
});

/** Matches POST /api/edit-profile validation rules */
const editProfileSchema = Yup.object().shape({
  first_name: Yup.string()
    .required('First name is required')
    .max(25, 'First name must be at most 25 characters'),
  last_name: Yup.string()
    .required('Last name is required')
    .max(25, 'Last name must be at most 25 characters'),
  username: Yup.string().nullable(),
  contact: Yup.string()
    .nullable()
    .transform(value => (value == null ? '' : String(value)))
    .test('phone', 'Invalid phone number.', value => {
      if (!value) return true;
      const digits = value.replace(/\D/g, '');
      return digits.length === 10;
    }),
  address: Yup.string()
    .nullable()
    .max(25, 'Address must be at most 25 characters'),
});

export default {
  SignUpSchema,
  SignInSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  verifyOtpSchema,
  changePaswordSchema,
  editProfileSchema,
};
