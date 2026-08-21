import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  AnalyticsDashboard,
  DashboardScreen,
  ProfileScreen,
  ShopScreen,
} from '../screens';
import { COLORS } from '../globalStyle/Theme';
import Sizer from '../helpers/Sizer';
import { Typography } from '../atomComponents';
import Icon from '../helpers/Icon';

const Tab = createBottomTabNavigator();

/**
 * Library footer tabs — VT removed per client feedback (access via Services).
 * Customizable footer is Priority C / later.
 */
const TABS = [
  { name: 'Home', label: 'Home', icon: 'home-outline', screen: DashboardScreen },
  {
    name: 'Analytics',
    label: 'Analytics',
    icon: 'stats-chart-outline',
    screen: AnalyticsDashboard,
  },
  { name: 'Shop', label: 'Shop', icon: 'bag-outline', screen: ShopScreen },
  {
    name: 'Profile',
    label: 'Profile',
    icon: 'person-outline',
    screen: ProfileScreen,
  },
];

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: styles.tabBar,
      }}
      initialRouteName="Home"
    >
      {TABS.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.screen}
          options={{
            tabBarButton: props => (
              <BottomTabItem
                {...props}
                label={tab.label}
                isFocus={props['aria-selected']}
                icon={tab.icon}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

const BottomTabItem = ({ label, isFocus, onPress, icon, ...props }) => {
  return (
    <TouchableOpacity
      {...props}
      style={styles.tabBtn}
      activeOpacity={0.88}
      onPress={onPress}
    >
      <Icon
        name={icon}
        iconFamily="Ionicons"
        size={24}
        color={isFocus ? COLORS.primary : COLORS.textSecondary}
      />
      <Typography
        color={isFocus ? COLORS.primary : COLORS.textSecondary}
        numberOfLines={1}
        size={12}
        lineHeight={17}
        fFamily={isFocus ? 'barlowMedium500' : 'barlowRegular400'}
        textAlign="center"
        mT={2}
      >
        {label}
      </Typography>
    </TouchableOpacity>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  tabBar: {
    height: Sizer.vSize(64),
    backgroundColor: COLORS.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.borderMuted,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: Sizer.vSize(8),
    paddingBottom: Sizer.vSize(8),
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Sizer.vSize(4),
    paddingHorizontal: Sizer.hSize(12),
  },
});
