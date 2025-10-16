import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
//------------------
import {
  Flex,
  FormController,
  SafeAreaWrapper,
  Typography,
} from '../../atomComponents';
import { Button, Header, TextField } from '../../components';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import { useCustomMutation } from '../../query/useCustomMutation';
import { onRegisterSuccess } from '../../query/partials/responseManager';
import validatoinSchema from '../../validations';
import { formatBackendErrors, maskPhoneNumber } from '../../utils';
import { register } from '../../api/userService';

const SignupScreen = ({ navigation }) => {
  // Register Mutation Hook:
  const { mutateAsync: requestRegister, isPending } = useCustomMutation({
    mutationFn: register,
    onSuccess: (response, { resetForm }) => {
      resetForm();
      onRegisterSuccess(response, response?.user?.email, navigation);
    },
  });

  // Handle Register:
  const handleRegister = async (values, { setErrors, resetForm }) => {
    console.log('🚀 ~ handleRegister ~ values:', values);
    requestRegister({ ...values, navigation, resetForm }).catch(err => {
      const response = err?.response;
      console.log('🚀 ~ handleRegister ~ response:', response);
      const parsedErrors = formatBackendErrors(response.data.errors);
      setErrors(parsedErrors);
    });
  };

  return (
    <SafeAreaWrapper keyboardAvoid>
      <Header
        iconColor={COLORS.white100}
        left={Sizer.hSize(0)}
        isBackVisible={false}
      />
      <Typography
        size={42}
        textAlign="center"
        mT={52}
        fFamily="barlowBoldItalic700"
      >
        Sign Up
      </Typography>
      <Typography size={16} textAlign="center" color={COLORS.black200} mT={8}>
        Sign up to get started{' '}
      </Typography>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <FormController
          initialValues={{
            first_name: __DEV__ ? 'Toliver' : '',
            last_name: __DEV__ ? 'John' : '',
            email: __DEV__ ? 'Toliver@mailinator.com' : '',
            password: __DEV__ ? 'Admin@1234' : '',
            password_confirmation: __DEV__ ? 'Admin@1234' : '',
            // phone: __DEV__ ? '1234567890' : '',
          }}
          validationSchema={validatoinSchema.authValidations.SignUpSchema}
          onSubmit={handleRegister}
        >
          {props => {
            const { handleSubmit, handleChange, values, errors, handleBlur } =
              props;

            return (
              <>
                <TextField
                  placeholder="First Name"
                  leftIcon
                  handleChange={handleChange('first_name')}
                  value={values.first_name}
                  error={errors.first_name}
                  onBlur={handleBlur('first_name')}
                  mT={23}
                />
                <TextField
                  placeholder="Last Name"
                  leftIcon
                  handleChange={handleChange('last_name')}
                  value={values.last_name}
                  error={errors.last_name}
                  onBlur={handleBlur('last_name')}
                  mT={23}
                />
                <TextField
                  placeholder="Email"
                  leftIcon
                  handleChange={handleChange('email')}
                  value={values.email}
                  error={errors.email}
                  onBlur={handleBlur('email')}
                  mT={23}
                />
                <TextField
                  placeholder="Password"
                  leftIcon
                  leftIconName="key"
                  rightIcon
                  password
                  handleChange={handleChange('password')}
                  value={values.password}
                  error={errors.password}
                  onBlur={handleBlur('password')}
                  mT={23}
                />
                <TextField
                  placeholder="Confirm Password"
                  leftIcon
                  leftIconName="key"
                  rightIcon
                  password
                  handleChange={handleChange('password_confirmation')}
                  value={values.password_confirmation}
                  error={errors.password_confirmation}
                  onBlur={handleBlur('password_confirmation')}
                  mT={23}
                />

                <Button
                  label={'Sign Up'}
                  mt={26}
                  onPress={handleSubmit}
                  loader={isPending}
                />
              </>
            );
          }}
        </FormController>
        <Flex jusContent={'center'} mT={28} algItems={'center'}>
          <Typography color={COLORS.black100}>
            Already have an account?{' '}
          </Typography>
          <Typography
            color={COLORS.orange100}
            size={15}
            fFamily="plusJakartaSansSemiBold600"
            onPress={() => {
              navigation.navigate('LoginScreen');
            }}
          >
            Sign In{' '}
          </Typography>
        </Flex>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({});
