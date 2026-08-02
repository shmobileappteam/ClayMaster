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
  OrderDetailScreen,
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

/** Android system nav bar (back / home / recents) — match each mode’s bottom chrome. */
const NATIVE_NAV_BAR = {
  library: COLORS.surface,
  field: COLORS.courseSurface,
  auth: COLORS.mainBg,
};

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerTransparent: true,
        animationTypeForReplace: 'push',
        animation: 'slide_from_right',
        navigationBarColor: NATIVE_NAV_BAR.library,
      }}
      initialRouteName="SplashScreen"
    >
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ navigationBarColor: NATIVE_NAV_BAR.auth }}
      />
      <Stack.Screen
        name="OnboardingScreen"
        component={OnboardingScreen}
        options={{ navigationBarColor: NATIVE_NAV_BAR.auth }}
      />
      <Stack.Screen
        name="ModeSelectScreen"
        component={ModeSelectScreen}
        options={{ navigationBarColor: NATIVE_NAV_BAR.auth }}
      />

      <Stack.Screen
        name="SignupScreen"
        component={SignupScreen}
        options={{ navigationBarColor: NATIVE_NAV_BAR.auth }}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ navigationBarColor: NATIVE_NAV_BAR.auth }}
      />
      <Stack.Screen
        name="VerifyEmailScreen"
        component={VerifyEmailScreen}
        options={{ navigationBarColor: NATIVE_NAV_BAR.auth }}
      />
      <Stack.Screen
        name="ForgotPasswordScreen"
        options={{
          animation: 'slide_from_bottom',
          navigationBarColor: NATIVE_NAV_BAR.auth,
        }}
        component={ForgotPasswordScreen}
      />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
        options={{ navigationBarColor: NATIVE_NAV_BAR.auth }}
      />

      <Stack.Screen
        name="NewRoundScreen"
        component={NewRoundScreen}
        options={{ navigationBarColor: NATIVE_NAV_BAR.field }}
      />
      <Stack.Screen name="LibraryScorecardScreen" component={LibraryScorecardScreen} />
      <Stack.Screen name="ScoringScreen" component={ScoringScreen} />
      <Stack.Screen
        name="CompleteRoundScreen"
        component={CompleteRoundScreen}
        options={{ navigationBarColor: NATIVE_NAV_BAR.field }}
      />
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

      <Stack.Screen
        name="BottomTabs"
        component={MainDrawer}
        options={{ navigationBarColor: NATIVE_NAV_BAR.library }}
      />
      <Stack.Screen name="DashboardScreen" component={DashboardScreen} />

      <Stack.Screen name="AnalyticsDashboard" component={AnalyticsDashboard} />
      <Stack.Screen name="AnalyticsScheduleScreen" component={AnalyticsScheduleScreen} />
      <Stack.Screen name="WorkbookDetailScreen" component={WorkbookDetailScreen} />
      <Stack.Screen name="ManagedServiceScreen" component={ManagedServiceScreen} />

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
      <Stack.Screen name="OrderDetailScreen" component={OrderDetailScreen} />
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
      <Stack.Screen
        name="FieldMode"
        component={FieldModeNavigator}
        options={{ navigationBarColor: NATIVE_NAV_BAR.field }}
      />
      <Stack.Screen
        name="CourseMissFixVideoScreen"
        component={CourseMissFixVideoScreen}
        options={{ navigationBarColor: NATIVE_NAV_BAR.field }}
      />
      <Stack.Screen
        name="CourseMissFixAudioScreen"
        component={CourseMissFixAudioScreen}
        options={{ navigationBarColor: NATIVE_NAV_BAR.field }}
      />
      <Stack.Screen
        name="CourseMissFixDrillScreen"
        component={CourseMissFixDrillScreen}
        options={{ navigationBarColor: NATIVE_NAV_BAR.field }}
      />
      <Stack.Screen
        name="CourseTrainDetailScreen"
        component={CourseTrainDetailScreen}
        options={{ navigationBarColor: NATIVE_NAV_BAR.field }}
      />
      <Stack.Screen
        name="CourseAudioTipScreen"
        component={CourseAudioTipScreen}
        options={{ navigationBarColor: NATIVE_NAV_BAR.field }}
      />
      <Stack.Screen
        name="CourseProgressScreen"
        component={CourseProgressScreen}
        options={{ navigationBarColor: NATIVE_NAV_BAR.field }}
      />
      <Stack.Screen
        name="CourseProgressDetailScreen"
        component={CourseProgressDetailScreen}
        options={{ navigationBarColor: NATIVE_NAV_BAR.field }}
      />
      <Stack.Screen
        name="CourseAddScoreScreen"
        component={CourseAddScoreScreen}
        options={{ navigationBarColor: NATIVE_NAV_BAR.field }}
      />
      <Stack.Screen
        name="CourseScorecardScreen"
        component={CourseScorecardScreen}
        options={{ navigationBarColor: NATIVE_NAV_BAR.field }}
      />
      <Stack.Screen
        name="CourseRoundScreen"
        component={CourseRoundScreen}
        options={{ navigationBarColor: NATIVE_NAV_BAR.field }}
      />
      <Stack.Screen
        name="CourseRoundSummaryScreen"
        component={CourseRoundSummaryScreen}
        options={{ navigationBarColor: NATIVE_NAV_BAR.field }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
