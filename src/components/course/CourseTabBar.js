import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../atomComponents';
import Icon from '../../helpers/Icon';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import { FIELD_MODE_TABS } from '../../constants/modeSections';

/**
 * Custom tab bar for FieldModeNavigator — never touches library BottomTabs.
 */
const CourseTabBar = ({ state, navigation }) => {
  const onTabPress = (routeName, isFocused) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: state.routes.find(r => r.name === routeName)?.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  return (
    <View style={styles.bar}>
      {FIELD_MODE_TABS.map(tab => {
        const routeIndex = state.routes.findIndex(r => r.name === tab.screen);
        const isActive = state.index === routeIndex;
        const color = isActive ? COLORS.primary : '#888888';

        return (
          <TouchableOpacity
            key={tab.screen}
            style={styles.tab}
            onPress={() => onTabPress(tab.screen, isActive)}
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
    backgroundColor: COLORS.courseSurface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.courseBorder,
  },
  tab: {
    alignItems: 'center',
    paddingHorizontal: Sizer.hSize(8),
  },
});
