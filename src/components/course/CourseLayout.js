import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../globalStyle/Theme';
import CourseTabBar from './CourseTabBar';
import ModeIndicatorBar from '../layout/ModeIndicatorBar';

/** Field tab screens use FieldModeNavigator tab bar — pass showTabs={false}. */
const CourseLayout = ({ children, showTabs = false, showModeIndicator = true }) => {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {showModeIndicator ? <ModeIndicatorBar variant="field" /> : null}
      <View style={[styles.content, showTabs && styles.contentWithTabs]}>
        {children}
      </View>
      {showTabs ? <CourseTabBar /> : null}
    </SafeAreaView>
  );
};

export default CourseLayout;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.courseBg,
  },
  content: {
    flex: 1,
  },
  contentWithTabs: {
    paddingBottom: 72,
  },
});
