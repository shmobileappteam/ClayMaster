import { StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//----
import { CustomScoreCard, SettingsScreen } from '../screens';
import { COLORS } from '../globalStyle/Theme';
import Sizer from '../helpers/Sizer';
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
          height: Sizer.hSize(75),
          backgroundColor: COLORS.orange200,
        },
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
              label={'Custom Scorecard'}
              isFocus={props['aria-selected']}
              renderSvg={isFocus => <HomeSvg active={isFocus} />}
            />
          ),
        }}
        component={CustomScoreCard}
      />
      <Tab.Screen
        name="Setting"
        options={{
          title: 'Setting',
          tabBarButton: props => (
            <BottomTabItem
              {...props}
              label={'Setting'}
              isFocus={props['aria-selected']}
              renderSvg={isFocus => <HamburgerSvg active={isFocus} />}
            />
          ),
        }}
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
};

const BottomTabItem = ({ renderSvg, label, isFocus, onPress, ...props }) => {
  return (
    <TouchableOpacity
      {...props}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Sizer.hSize(12),
      }}
      onPress={onPress}
    >
      {renderSvg(isFocus)}

      <Typography
        color={isFocus ? COLORS.primary : COLORS.black400}
        numberOfLines={2}
        style={{ maxWidth: Sizer.hSize(80) }}
        textAlign="center"
        mT={3}
      >
        {label}
      </Typography>
    </TouchableOpacity>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({});
