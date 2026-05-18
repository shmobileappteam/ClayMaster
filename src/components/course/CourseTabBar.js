import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Typography } from '../../atomComponents';
import Icon from '../../helpers/Icon';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import { useAppMode } from '../../context/AppModeContext';

const TABS = [
  {
    label: 'Score',
    icon: 'radio-button-on',
    screen: 'CourseHomeScreen',
  },
  {
    label: 'Miss Fix',
    icon: 'warning-outline',
    screen: 'CourseMissDiagnosisScreen',
  },
  {
    label: 'Train',
    icon: 'barbell-outline',
    screen: 'CourseTrainScreen',
  },
  {
    label: 'Progress',
    icon: 'trending-up-outline',
    screen: 'CourseProgressScreen',
  },
  {
    label: 'Go Deeper',
    icon: 'library-outline',
    screen: 'BottomTabs',
    isLibrary: true,
  },
];

const CourseTabBar = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { setMode } = useAppMode();

  const onTabPress = tab => {
    if (tab.isLibrary) {
      setMode('library');
      navigation.navigate('BottomTabs');
      return;
    }
    if (route.name !== tab.screen) {
      navigation.navigate(tab.screen);
    }
  };

  return (
    <View style={styles.bar}>
      {TABS.map(tab => {
        const isActive = route.name === tab.screen;
        const isGoDeeper = tab.isLibrary;
        const color = isActive
          ? COLORS.primary
          : isGoDeeper
            ? '#666666'
            : '#888888';
        return (
          <TouchableOpacity
            key={tab.label}
            style={styles.tab}
            onPress={() => onTabPress(tab)}
            activeOpacity={0.88}
          >
            <Icon
              name={tab.icon}
              iconFamily="Ionicons"
              size={24}
              color={color}
            />
            <Typography
              size={11}
              fFamily={isActive ? 'barlowSemiBold600' : 'barlowMedium500'}
              color={color}
              mT={4}
            >
              {tab.label}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CourseTabBar;

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Sizer.vSize(8),
    paddingBottom: Sizer.vSize(12),
    backgroundColor: '#1A1A1A',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.courseBorder,
  },
  tab: {
    alignItems: 'center',
    paddingHorizontal: Sizer.hSize(8),
  },
});
