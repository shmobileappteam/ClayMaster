import { ScrollView, StyleSheet, Text, View, Linking } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
//------------------
import {
  Flex,
  FormController,
  SafeAreaWrapper,
  Typography,
} from '../../atomComponents';
import { Button, CustomDropdown, Header, TextField } from '../../components';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import { useCustomMutation } from '../../query/useCustomMutation';
import { onRegisterSuccess } from '../../query/partials/responseManager';
import validatoinSchema from '../../validations';
import { formatBackendErrors } from '../../utils';
import { register } from '../../api/userService';
import { useCustomQuery } from '../../query/useCustomQuery';
import { getDiscountForPackages } from '../../api/packageService';
import Icon from '../../helpers/Icon';

const SignupScreen = ({ navigation }) => {
  const { subscriptionEnabled } = useSelector(state => state.app);

  const { data: packagesDiscount } = useCustomQuery({
    queryKey: ['discounts'],
    queryFn: getDiscountForPackages,
  });

  const discountData = React.useMemo(
    () =>
      packagesDiscount?.data?.map(item => ({
        label: `${
          item?.discount_value == 'student'
            ? 'Youth'
            : 'Military & First Responders'
        }`,
        value: item?.discount_value,
      })) || [],
    [packagesDiscount?.data],
  );

  const { mutateAsync: requestRegister, isPending } = useCustomMutation({
    mutationFn: register,
    onSuccess: (response, { resetForm }) => {
      resetForm();
      onRegisterSuccess(response, response?.user?.email, navigation);
    },
  });

  const handleRegister = async (values, { setErrors, resetForm }) => {
    requestRegister({ ...values, navigation, resetForm }).catch(err => {
      const response = err?.response;
      if (response?.data?.errors) {
        const parsedErrors = formatBackendErrors(response.data.errors);
        setErrors(parsedErrors);
      }
    });
  };

  return (
    <SafeAreaWrapper keyboardAvoid>
      <Header
        iconColor={COLORS.white100}
        left={Sizer.hSize(0)}
        isBackVisible={false}
      />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Typography
            size={40}
            textAlign="center"
            mT={52}
            fFamily="barlowBoldItalic700"
        >
            Create account
        </Typography>

        <Typography size={16} textAlign="center" color={COLORS.black200} mT={8}>
            Join the community today
        </Typography>

        <FormController
            initialValues={{
                first_name: __DEV__ ? 'William' : '',
                last_name: __DEV__ ? 'Brown' : '',
                email: __DEV__ ? 'william@mailinator.com' : '',
                password: __DEV__ ? 'Admin@1234' : '',
                password_confirmation: __DEV__ ? 'Admin@1234' : '',
                discount_type: subscriptionEnabled ? '' : 'student',
            }}
            validationSchema={validatoinSchema.authValidations.SignUpSchema}
            onSubmit={handleRegister}
        >
            {props => {
                const {
                    handleSubmit,
                    handleChange,
                    values,
                    errors,
                    handleBlur,
                    setFieldValue,
                } = props;


                return (
                    <>
                        <TextField
                            placeholder="First name"
                            leftIcon
                            handleChange={handleChange('first_name')}
                            value={values.first_name}
                            error={errors.first_name}
                            onBlur={handleBlur('first_name')}
                            mT={23}
                        />
                        <TextField
                            placeholder="Last name"
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
                        {subscriptionEnabled && (
                            <>
                                <CustomDropdown
                                    label="Are you?"
                                    data={discountData}
                                    placeholder="Select category"
                                    dropdownStyle={{ marginTop: Sizer.vSize(23) }}
                                    value={values?.discount_type}
                                    onChange={item => {
                                        setFieldValue('discount_type', item?.value);
                                    }}
                                    mode={'default'}
                                    dropdownPosition={'top'}
                                    leftIcon={() => (
                                        <Icon
                                            iconFamily={'MaterialIcons'}
                                            size={20}
                                            name={'discount'}
                                            color={COLORS.textMuted}
                                        />
                                    )}
                                />
                                {errors?.discount_type && (
                                    <Typography
                                        size={13}
                                        color={COLORS.red}
                                        mT={6}
                                    >
                                        {errors?.discount_type}
                                    </Typography>
                                )}
                            </>
                        )}
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
                            placeholder="Confirm password"
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
                            label="Create account"
                            mt={30}
                            onPress={handleSubmit}
                            loader={isPending}
                        />
                    </>
                );
            }}
        </FormController>

        <Flex jusContent="center" mT={28} algItems="center">
            <Typography color={COLORS.black100}>Already have an account? </Typography>
            <Typography
                color={COLORS.orange100}
                size={15}
                fFamily="plusJakartaSansSemiBold600"
                onPress={() => navigation.navigate('LoginScreen')}
            >
                Sign in
            </Typography>
        </Flex>

        <Typography
            textAlign="center"
            mT={20}
            color={COLORS.primary}
            fFamily="barlowMedium500"
            onPress={() => Linking.openURL('mailto:support@claymaster.net')}
        >
            Help and Support
        </Typography>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: Sizer.vSize(40),
        paddingHorizontal: Sizer.hSize(0),
    },
});
