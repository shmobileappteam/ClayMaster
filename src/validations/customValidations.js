import * as Yup from 'yup';

// Custom regex
export const passwordRegex =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;

export const nameRegex = /^[a-zA-Z\s]+$/;

export const nameValidation = (min, max) =>
  Yup.string()
    .required('This field is required')
    .min(min, `Name must be at least ${min} characters long.`)
    .max(max, `Name must be at most ${max} characters long.`)
    .matches(
      nameRegex,
      'Name can only contain alphabetic characters and spaces.',
    );

export const imageValidation = Yup.mixed()
  .required('Image is required')
  .test('fileType', 'Only JPEG, PNG, and JPG images are allowed', value => {
    if (!value || value.length === 0) return false;

    // If value is a single string (maybe a URL) allow it
    if (typeof value === 'string') return true;

    const supportedFormats = ['image/jpeg', 'image/png', 'image/jpg'];

    if (Array.isArray(value)) {
      return value.every(file => supportedFormats.includes(file.type));
    }

    return supportedFormats.includes(value);
    // Check if every file in the array has a valid type
  });

// SIZE LIMIT IF YOU WANT.
// .test('fileSize', 'Image must be less than 5MB', value => {
//   // if (!value || typeof value === 'string') return true; // Skip if URL
//   // return value?.size <= 5 * 1024 * 1024; // 5MB max
// });
