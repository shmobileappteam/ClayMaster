import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
//------------------
import { Flex, SafeAreaWrapper, Typography } from '../../atomComponents';
import { Button, Header, TextField } from '../../components';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';

const SignupScreen = ({ navigation }) => {
  return (
    <SafeAreaWrapper keyboardAvoid>
      <Header iconColor={COLORS.white100} left={Sizer.hSize(0)} />
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
        <TextField
          placeholder="Username"
          leftIcon
          mT={29}
          leftIconFamily="Ionicons"
          leftIconName="person-outline"
        />
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
        <TextField
          placeholder="Confirm Password"
          password
          mT={29}
          leftIconFamily="Feather"
          leftIconName="lock"
          leftIcon
        />

        <Button
          label="Sign Up"
          mt={30}
          onPress={() => navigation.navigate('SubscriptionScreen')}
        />
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
