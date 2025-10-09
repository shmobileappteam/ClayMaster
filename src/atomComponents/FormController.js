import React from 'react';
import {Formik} from 'formik';

const FormController = props => {
  const {
    initialValues,
    validationSchema,
    validateOnChange = true,
    validateOnBlur = true,
    onSubmit,
    children,
    validate,
  } = props;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnChange={validateOnChange}
      validateOnBlur={validateOnBlur}
      onSubmit={onSubmit}
      validate={validate}>
      {formikProps => {
        const enhancedProps = {
          ...formikProps,
          // Expose validateField method
          errors: Object.keys(formikProps?.errors).reduce((acc, field) => {
            if (formikProps.touched[field] || formikProps.submitCount > 0) {
              acc[field] = formikProps.errors[field];
            }
            return acc;
          }, {}),
        };

        return <>{children(enhancedProps)}</>;
      }}
    </Formik>
  );
};

export default FormController;
