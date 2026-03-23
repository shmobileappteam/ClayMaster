import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//------
import {
  ChangePasswordScreen,
  AboutUsScreen,
  HelpAndSupportScreen,
  TermsAndConditionsScreen,
  CompleteRoundScreen,
  ForgotPasswordScreen,
  LoginScreen,
  NewRoundScreen,
  NotificationScreen,
  ProfileDetailsScreen,
  ResetPasswordScreen,
  SavedScoredcardSuccessScreen,
  ScorecardDetailsScreen,
  SignupScreen,
  SplashScreen,
  SubscribtionSuccessScreen,
  SubscriptionScreen,
  VerifyEmailScreen,
  InAppSubscriptionScreen,
  // ─── Milestone 2 ───────────────────────────────────────────────────────────
  AnalyticsDashboard,
  AnalyticsScheduleScreen,
  AcademyScreen,
  InstructionalVideosScreen,
  VideoDetailScreen,
  WebcastScreen,
  DrillsScreen,
  CoachingScreen,
  CommunityScreen,
  VirtualTournamentScreen,
  ShopScreen,
  OrdersScreen,
  ReviewsScreen,
  AdditionalDocumentsScreen,
  AdditionalVideosScreen,
  DeleteAccountScreen,
  DashboardScreen,
} from '../screens';
import { COLORS } from '../globalStyle/Theme';
import MainDrawer from './MainDrawer';

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerTransparent: true,
        animationTypeForReplace: 'push',
        animation: 'slide_from_right',
        navigationBarColor: COLORS.orange200,
      }}
      initialRouteName={__DEV__ ? 'SplashScreen' : 'SplashScreen'}
    >
      {/* Splash */}
      <Stack.Screen name="SplashScreen" component={SplashScreen} />

      {/* Auth */}
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="VerifyEmailScreen" component={VerifyEmailScreen} />
      <Stack.Screen
        name="ForgotPasswordScreen"
        options={{ animation: 'slide_from_bottom' }}
        component={ForgotPasswordScreen}
      />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
      />

      {/* Scorecard (Milestone 1) */}
      <Stack.Screen name="NewRoundScreen" component={NewRoundScreen} />
      <Stack.Screen
        name="CompleteRoundScreen"
        component={CompleteRoundScreen}
      />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="SubscriptionScreen" component={SubscriptionScreen} />
      <Stack.Screen
        name="SavedScoredcardSuccessScreen"
        component={SavedScoredcardSuccessScreen}
      />
      <Stack.Screen
        name="ScorecardDetailsScreen"
        component={ScorecardDetailsScreen}
      />
      <Stack.Screen
        name="ProfileDetailsScreen"
        component={ProfileDetailsScreen}
      />
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />
      <Stack.Screen
        name="DeleteAccountScreen"
        component={DeleteAccountScreen}
      />
      <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} />
      <Stack.Screen
        name="HelpAndSupportScreen"
        component={HelpAndSupportScreen}
      />
      <Stack.Screen
        name="TermsAndConditionsScreen"
        component={TermsAndConditionsScreen}
      />
      <Stack.Screen
        name="SubscribtionSuccessScreen"
        component={SubscribtionSuccessScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="InAppSubscriptionScreen"
        component={InAppSubscriptionScreen}
      />

      {/* Main app: bottom tabs + slide-out drawer (More menu) */}
      <Stack.Screen name="BottomTabs" component={MainDrawer} />

      {/* Dashboard */}
      <Stack.Screen name="DashboardScreen" component={DashboardScreen} />

      {/* ─── Milestone 2 Screens ──────────────────────────────────────────── */}

      {/* Analytics */}
      <Stack.Screen name="AnalyticsDashboard" component={AnalyticsDashboard} />
      <Stack.Screen
        name="AnalyticsScheduleScreen"
        component={AnalyticsScheduleScreen}
      />

      {/* Academy */}
      <Stack.Screen name="AcademyScreen" component={AcademyScreen} />
      <Stack.Screen
        name="InstructionalVideosScreen"
        component={InstructionalVideosScreen}
      />
      {/* <Stack.Screen name="VideoDetailScreen" component={VideoDetailScreen} /> */}
      <Stack.Screen name="WebcastScreen" component={WebcastScreen} />
      <Stack.Screen name="DrillsScreen" component={DrillsScreen} />

      {/* Coaching */}
      <Stack.Screen name="CoachingScreen" component={CoachingScreen} />

      {/* Community */}
      <Stack.Screen name="CommunityScreen" component={CommunityScreen} />
      <Stack.Screen
        name="VirtualTournamentScreen"
        component={VirtualTournamentScreen}
      />

      {/* Commerce */}
      <Stack.Screen name="ShopScreen" component={ShopScreen} />
      <Stack.Screen name="OrdersScreen" component={OrdersScreen} />

      {/* Reviews */}
      <Stack.Screen name="ReviewsScreen" component={ReviewsScreen} />

      {/* Documents & Videos */}
      <Stack.Screen
        name="AdditionalDocumentsScreen"
        component={AdditionalDocumentsScreen}
      />
      <Stack.Screen
        name="AdditionalVideosScreen"
        component={AdditionalVideosScreen}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
