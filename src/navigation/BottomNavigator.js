import { StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//----
import { CustomScoreCard, SettingsScreen } from '../screens';
import { COLORS, FONTS } from '../globalStyle/Theme';
import Sizer from '../helpers/Sizer';
import Icon from '../helpers/Icon';
import { HamburgerSvg, HomeSvg } from '../assets/svgs';
import { Typography } from '../atomComponents';

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: {
          height: Sizer.hSize(90),
          backgroundColor: COLORS.orange200,
        },
        // tabBarLabelStyle: {
        //   fontFamily: FONTS.barlowMedium500,
        // //   color: COLORS.primary,
        //   fontSize: Sizer.hSize(14),
        // },
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        options={{
          title: 'Custom Scorecard',
          tabBarButton: props => (
            <BottomTabItem
              {...props}
              svg={<HomeSvg />}
              label={'Custom Scorecard'}
              isFocus={props['aria-selected']}
            />
          ),
        }}
        component={CustomScoreCard}
      />
      <Tab.Screen
        name="Settings"
        options={{
          title: 'Setting',
          tabBarButton: props => (
            <BottomTabItem
              {...props}
              svg={<HamburgerSvg />}
              label={'Setting'}
              isFocus={props['aria-selected']}
            />
          ),
        }}
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
};

const BottomTabItem = ({ svg, label, isFocus, ...props }) => {
  console.log('🚀 ~ BottomTabItem ~ props:', props);
  return (
    <TouchableOpacity
      {...props}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Sizer.hSize(12),
      }}
      onPress={() => {
        console.log('🚀 ~ BottomTabItem ~ isFocus:', props, isFocus);
        // NavigationContainer.navigat
      }}
    >
      {svg}

      <Typography
        color={isFocus ? COLORS.primary : COLORS.black400}
        numberOfLines={2}
        style={{ maxWidth: Sizer.hSize(80) }}
        textAlign="center"
      >
        {label}
      </Typography>
    </TouchableOpacity>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({});
