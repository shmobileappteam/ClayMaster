import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomNavigator from './BottomNavigator';
import CustomDrawerContent from './CustomDrawerContent';
import { COLORS } from '../globalStyle/Theme';

const Drawer = createDrawerNavigator();

/**
 * Wraps bottom tabs + side menu sheet (web AppMenuSheet parity).
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
          backgroundColor: COLORS.surface,
          width: '88%',
          maxWidth: 384,
        },
        overlayColor: 'rgba(0,0,0,0.8)',
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
