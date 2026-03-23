import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  AcademyScreen,
  CommunityScreen,
  DashboardScreen,
  MoreHubScreen,
  VirtualTournamentScreen,
} from '../screens';
import { COLORS } from '../globalStyle/Theme';
import Sizer from '../helpers/Sizer';
import { Typography } from '../atomComponents';
import Icon from '../helpers/Icon';

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: {
          height: Sizer.vSize(78),
          backgroundColor: COLORS.surface,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: COLORS.borderMuted,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarButton: props => (
            <BottomTabItem
              {...props}
              label={'Home'}
              isFocus={props['aria-selected']}
              icon="home"
              family="Ionicons"
            />
          ),
        }}
        component={DashboardScreen}
      />
      <Tab.Screen
        name="Videos"
        options={{
          tabBarButton: props => (
            <BottomTabItem
              {...props}
              label={'Videos'}
              isFocus={props['aria-selected']}
              icon="play-circle"
              family="Ionicons"
            />
          ),
        }}
        component={AcademyScreen}
      />
      <Tab.Screen
        name="Community"
        options={{
          tabBarButton: props => (
            <BottomTabItem
              {...props}
              label={'Community'}
              isFocus={props['aria-selected']}
              icon="chatbubbles"
              family="Ionicons"
            />
          ),
        }}
        component={CommunityScreen}
      />
      <Tab.Screen
        name="Tournament"
        options={{
          tabBarButton: props => (
            <BottomTabItem
              {...props}
              label={'Tournament'}
              isFocus={props['aria-selected']}
              icon="trophy"
              family="Ionicons"
            />
          ),
        }}
        component={VirtualTournamentScreen}
      />
      <Tab.Screen
        name="More"
        component={MoreHubScreen}
        options={{
          tabBarButton: props => (
            <BottomTabItem
              {...props}
              label={'More'}
              isFocus={props['aria-selected']}
              icon="grid"
              family="Ionicons"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const BottomTabItem = ({ label, isFocus, onPress, icon, family, ...props }) => {
  return (
    <TouchableOpacity
      {...props}
      style={styles.tabBtn}
      activeOpacity={0.88}
      onPress={onPress}
    >
      {isFocus ? (
        <View style={styles.tabTopPill} />
      ) : null}

      <View style={[styles.iconPill, isFocus && styles.iconPillActive]}>
        <Icon
          name={icon}
          iconFamily={family}
          size={isFocus ? 25 : 24}
          color={isFocus ? COLORS.primary : COLORS.textMuted}
        />
      </View>

      <Typography
        color={isFocus ? COLORS.primary : COLORS.textMuted}
        numberOfLines={1}
        size={11}
        lineHeight={14}
        fFamily={isFocus ? 'barlowBold700' : 'barlowMedium500'}
        textAlign="center"
        mT={5}
      >
        {label}
      </Typography>
    </TouchableOpacity>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Sizer.vSize(8),
    paddingBottom: Sizer.vSize(8),
    position: 'relative',
  },
  tabTopPill: {
    position: 'absolute',
    top: 0,
    width: '36%',
    minWidth: Sizer.hSize(28),
    height: Sizer.vSize(3),
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: Sizer.hSize(4),
    borderBottomRightRadius: Sizer.hSize(4),
  },
  iconPill: {
    width: Sizer.hSize(48),
    height: Sizer.hSize(48),
    borderRadius: Sizer.hSize(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPillActive: {
    backgroundColor: 'rgba(232, 93, 4, 0.14)',
  },
});
