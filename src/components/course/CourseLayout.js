import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../globalStyle/Theme';
import CourseTabBar from './CourseTabBar';

const CourseLayout = ({ children, showTabs = true }) => {
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
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
