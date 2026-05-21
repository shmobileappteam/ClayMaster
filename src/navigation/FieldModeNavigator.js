import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CourseTabBar from '../components/course/CourseTabBar';
import CourseHomeScreen from '../screens/Main/Course/CourseHomeScreen';
import CourseMissDiagnosisScreen from '../screens/Main/Course/CourseMissDiagnosisScreen';
import CourseTrainScreen from '../screens/Main/Course/CourseTrainScreen';
import CourseDownloadedVideosScreen from '../screens/Main/Course/CourseDownloadedVideosScreen';
import { COLORS } from '../globalStyle/Theme';

const Tab = createBottomTabNavigator();

/**
 * Field Mode shell — four tabs only, isolated from Full Library bottom tabs.
 */
const FieldModeNavigator = () => (
  <Tab.Navigator
    initialRouteName="CourseHomeScreen"
    screenOptions={{
      headerShown: false,
      tabBarStyle: { display: 'none' },
      sceneStyle: {
        backgroundColor: COLORS.courseBg,
        paddingBottom: 72,
      },
    }}
    tabBar={props => <CourseTabBar {...props} />}
  >
    <Tab.Screen name="CourseHomeScreen" component={CourseHomeScreen} />
    <Tab.Screen name="CourseMissDiagnosisScreen" component={CourseMissDiagnosisScreen} />
    <Tab.Screen name="CourseTrainScreen" component={CourseTrainScreen} />
    <Tab.Screen
      name="CourseDownloadedVideosScreen"
      component={CourseDownloadedVideosScreen}
    />
  </Tab.Navigator>
);

export default FieldModeNavigator;
