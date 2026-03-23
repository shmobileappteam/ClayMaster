import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomNavigator from './BottomNavigator';
import CustomDrawerContent from './CustomDrawerContent';
import { COLORS } from '../globalStyle/Theme';

const Drawer = createDrawerNavigator();

/**
 * Wraps bottom tabs + slide-out drawer (Antigravity Screen 24).
 * Stack still registers this as "BottomTabs" so existing redirects keep working.
 */
const MainDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        drawerStyle: {
          backgroundColor: COLORS.secondary,
          width: '88%',
          maxWidth: 360,
        },
        overlayColor: 'rgba(0,0,0,0.5)',
        sceneContainerStyle: { backgroundColor: COLORS.mainBg },
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={BottomNavigator}
        options={{ title: 'ClayMaster' }}
      />
    </Drawer.Navigator>
  );
};

export default MainDrawer;
