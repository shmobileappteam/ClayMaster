import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ChangePasswordScreen,
  AboutUsScreen,
  HelpAndSupportScreen,
  TermsAndConditionsScreen,
  CompleteRoundScreen,
  ForgotPasswordScreen,
  LoginScreen,
  NewRoundScreen,
  LibraryScorecardScreen,
  ScoringScreen,
  NotificationScreen,
  ProfileDetailsScreen,
  SettingsScreen,
  ResetPasswordScreen,
  SavedScoredcardSuccessScreen,
  ScorecardDetailsScreen,
  SignupScreen,
  SplashScreen,
  OnboardingScreen,
  ModeSelectScreen,
  SubscribtionSuccessScreen,
  SubscriptionScreen,
  VerifyEmailScreen,
  InAppSubscriptionScreen,
  AnalyticsDashboard,
  AnalyticsScheduleScreen,
  WorkbookDetailScreen,
  ManagedServiceScreen,
  AcademyScreen,
  InstructionalVideosScreen,
  VideoDetailScreen,
  WebcastScreen,
  DrillsScreen,
  DrillDetailScreen,
  CoachingScreen,
  CalendlyBookingScreen,
  CommunityScreen,
  CommunityDetailScreen,
  CreatePostScreen,
  ProductDetailScreen,
  OrdersScreen,
  ReviewsScreen,
  AdditionalDocumentsScreen,
  AdditionalVideosScreen,
  DeleteAccountScreen,
  DashboardScreen,
  CartScreen,
  CheckoutScreen,
  CourseMissFixVideoScreen,
  CourseMissFixAudioScreen,
  CourseMissFixDrillScreen,
  CourseTrainDetailScreen,
  CourseAudioTipScreen,
  CourseProgressScreen,
  CourseProgressDetailScreen,
  CourseAddScoreScreen,
  CourseScorecardScreen,
  CourseRoundScreen,
  CourseRoundSummaryScreen,
  MoreHubScreen,
} from '../screens';
import { COLORS } from '../globalStyle/Theme';
import MainDrawer from './MainDrawer';
import FieldModeNavigator from './FieldModeNavigator';

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerTransparent: true,
        animationTypeForReplace: 'push',
        animation: 'slide_from_right',
        navigationBarColor: COLORS.mainBg,
      }}
      initialRouteName="SplashScreen"
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
      <Stack.Screen name="ModeSelectScreen" component={ModeSelectScreen} />

      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="VerifyEmailScreen" component={VerifyEmailScreen} />
      <Stack.Screen
        name="ForgotPasswordScreen"
        options={{ animation: 'slide_from_bottom' }}
        component={ForgotPasswordScreen}
      />
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />

      <Stack.Screen name="NewRoundScreen" component={NewRoundScreen} />
      <Stack.Screen name="LibraryScorecardScreen" component={LibraryScorecardScreen} />
      <Stack.Screen name="ScoringScreen" component={ScoringScreen} />
      <Stack.Screen name="CompleteRoundScreen" component={CompleteRoundScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="SubscriptionScreen" component={SubscriptionScreen} />
      <Stack.Screen
        name="SavedScoredcardSuccessScreen"
        component={SavedScoredcardSuccessScreen}
      />
      <Stack.Screen name="ScorecardDetailsScreen" component={ScorecardDetailsScreen} />
      <Stack.Screen name="ProfileDetailsScreen" component={ProfileDetailsScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
      <Stack.Screen name="DeleteAccountScreen" component={DeleteAccountScreen} />
      <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} />
      <Stack.Screen name="HelpAndSupportScreen" component={HelpAndSupportScreen} />
      <Stack.Screen name="TermsAndConditionsScreen" component={TermsAndConditionsScreen} />
      <Stack.Screen
        name="SubscribtionSuccessScreen"
        component={SubscribtionSuccessScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="InAppSubscriptionScreen" component={InAppSubscriptionScreen} />

      <Stack.Screen name="BottomTabs" component={MainDrawer} />
      <Stack.Screen name="DashboardScreen" component={DashboardScreen} />

      <Stack.Screen name="AnalyticsDashboard" component={AnalyticsDashboard} />
      <Stack.Screen name="AnalyticsScheduleScreen" component={AnalyticsScheduleScreen} />
      <Stack.Screen name="WorkbookDetailScreen" component={WorkbookDetailScreen} />
      <Stack.Screen name="ManagedServiceScreen" component={ManagedServiceScreen} />

      <Stack.Screen name="AcademyScreen" component={AcademyScreen} />
      <Stack.Screen name="InstructionalVideosScreen" component={InstructionalVideosScreen} />
      <Stack.Screen name="VideoDetailScreen" component={VideoDetailScreen} />
      <Stack.Screen name="WebcastScreen" component={WebcastScreen} />
      <Stack.Screen name="DrillsScreen" component={DrillsScreen} />
      <Stack.Screen name="DrillDetailScreen" component={DrillDetailScreen} />

      <Stack.Screen name="CoachingScreen" component={CoachingScreen} />
      <Stack.Screen name="CalendlyBookingScreen" component={CalendlyBookingScreen} />

      <Stack.Screen name="CommunityScreen" component={CommunityScreen} />
      <Stack.Screen name="CommunityDetailScreen" component={CommunityDetailScreen} />
      <Stack.Screen name="CreatePostScreen" component={CreatePostScreen} />

      <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} />
      <Stack.Screen name="OrdersScreen" component={OrdersScreen} />
      <Stack.Screen
        name="CartScreen"
        component={CartScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} />

      <Stack.Screen name="ReviewsScreen" component={ReviewsScreen} />
      <Stack.Screen name="AdditionalDocumentsScreen" component={AdditionalDocumentsScreen} />
      <Stack.Screen name="AdditionalVideosScreen" component={AdditionalVideosScreen} />
      <Stack.Screen name="MoreHubScreen" component={MoreHubScreen} />

      {/* Field Mode — 4 tabs (isolated from library BottomTabs) */}
      <Stack.Screen name="FieldMode" component={FieldModeNavigator} />
      <Stack.Screen name="CourseMissFixVideoScreen" component={CourseMissFixVideoScreen} />
      <Stack.Screen name="CourseMissFixAudioScreen" component={CourseMissFixAudioScreen} />
      <Stack.Screen name="CourseMissFixDrillScreen" component={CourseMissFixDrillScreen} />
      <Stack.Screen name="CourseTrainDetailScreen" component={CourseTrainDetailScreen} />
      <Stack.Screen name="CourseAudioTipScreen" component={CourseAudioTipScreen} />
      <Stack.Screen name="CourseProgressScreen" component={CourseProgressScreen} />
      <Stack.Screen name="CourseProgressDetailScreen" component={CourseProgressDetailScreen} />
      <Stack.Screen name="CourseAddScoreScreen" component={CourseAddScoreScreen} />
      <Stack.Screen name="CourseScorecardScreen" component={CourseScorecardScreen} />
      <Stack.Screen name="CourseRoundScreen" component={CourseRoundScreen} />
      <Stack.Screen name="CourseRoundSummaryScreen" component={CourseRoundSummaryScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
