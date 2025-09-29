import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
//------------------
import { Flex, SafeAreaWrapper, Typography } from '../../atomComponents';
import { Button, Header, TextField } from '../../components';
import { COLORS } from '../../globalStyle/Theme';
import SlideInView from '../../animations/SlideView';
import Sizer from '../../helpers/Sizer';

const LoginScreen = ({ navigation }) => {
  return (
    <SafeAreaWrapper>
      <Header iconColor={COLORS.white100} left={Sizer.hSize(0)} isBackVisible={false}/>
      <Typography
        size={40}
        textAlign="center"
        mT={52}
        fFamily="barlowBoldItalic700"
        
      >
        Welcome Back!{' '}
      </Typography>

      <Typography size={16} textAlign="center" color={COLORS.black200} mT={8}>
        Sign in to continue{' '}
      </Typography>
      <TextField
        placeholder="Email address"
        mT={29}
        leftIcon
        leftIconFamily="Ionicons"
        leftIconName="mail-outline"
      />
      <TextField
        placeholder="Password"
        password
        mT={29}
        leftIconFamily="Feather"
        leftIconName="lock"
        leftIcon
      />
      <Typography
        fFamily={'barlowSemiBold600'}
        textAlign="right"
        mT={15}
        color={COLORS.primary}
        // onPress={() => navigation.navigate('ForgotPasswordScreen')}
      >
        Forgot password?
      </Typography>
      <Button
        label="Login"
        mt={30}
        onPress={() => navigation.navigate('SubscriptionScreen')}
      />
      <Flex jusContent={'center'} mT={28} algItems={'center'}>
        <Typography color={COLORS.black100}>Create a New Account? </Typography>
        <Typography
          color={COLORS.orange100}
          size={15}
          fFamily="plusJakartaSansSemiBold600"
          onPress={() => {
            navigation.navigate('SignupScreen');
          }}
        >
          Sign Up{' '}
        </Typography>
      </Flex>
    </SafeAreaWrapper>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
