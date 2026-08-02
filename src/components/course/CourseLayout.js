import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../globalStyle/Theme';
import CourseTabBar from './CourseTabBar';
import ModeIndicatorBar from '../layout/ModeIndicatorBar';

/** Field tab screens use FieldModeNavigator tab bar — pass showTabs={false}.
 * Mode switcher only on Field bottom tabs — pass showModeIndicator on those screens.
 */
const CourseLayout = ({
  children,
  showTabs = false,
  showModeIndicator = false,
}) => {
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
