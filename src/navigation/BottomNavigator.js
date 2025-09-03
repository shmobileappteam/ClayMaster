// import React from 'react';
// import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
// } from 'react-native-reanimated';
// React;

// //------------
// import { BASEOPACITY, COLORS } from '../globalStyle/Theme';
// import Sizer from '../helpers/Sizer';
// import { useKeyboard } from '../hooks/useKeyboard';

// import {
//   HomeScreen,
//   MenuScreen,
//   MyBookingsScreen,
//   MyPetsScreen,
//   ServiceScreen,
// } from '../screens';
// import { CalendarSvg, HomeSvg, MenuSvg, PetSvg, ServiceSvg } from '../svgs';

// const Tab = createBottomTabNavigator();

// const BottomNavigator = () => {
//   const { keyboardOpen } = useKeyboard();

//   return (
//     <Tab.Navigator
//       screenOptions={{
//         tabBarHideOnKeyboard: true,
//         headerShown: false,
//         tabBarShowLabel: false,
//       }}
//       tabBar={props => (!keyboardOpen ? <MyTabBar {...props} /> : null)}
//       initialRouteName="Home"
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Service" component={ServiceScreen} />
//       <Tab.Screen name="Pets" component={MyPetsScreen} />
//       <Tab.Screen name="Bookings" component={MyBookingsScreen} />
//       <Tab.Screen name="Menu" component={MenuScreen} />
//     </Tab.Navigator>
//   );
// };

// const MyTabBar = ({ state, descriptors, navigation }) => {
//   return (
//     <View style={styles.conStyle}>
//       <View style={styles.menuContainer}>
//         {state.routes.map((route, index) => {
//           const { options } = descriptors[route.key];
//           const isFocused = state.index === index;

//           const icons = {
//             Home: <HomeSvg active={isFocused} />,
//             Service: <ServiceSvg active={isFocused} />,
//             Pets: <PetSvg active={isFocused} />,
//             Bookings: <CalendarSvg active={isFocused} />,
//             Menu: <MenuSvg active={isFocused} />,
//           };

//           return (
//             <AnimatedTabItem
//               key={route.key}
//               isFocused={isFocused}
//               onPress={() => navigation.navigate(route.name)}
//             >
//               {icons[route.name]}
//             </AnimatedTabItem>
//           );
//         })}
//       </View>
//     </View>
//   );
// };

// const AnimatedTabItem = ({ isFocused, onPress, children }) => {
//   const scale = useSharedValue(1);
//   const bg = useSharedValue(isFocused ? COLORS.red400 : COLORS.white100);

//   React.useEffect(() => {
//     scale.value = withTiming(isFocused ? 1.15 : 1, { duration: 150 });
//     bg.value = isFocused ? COLORS.red400 : COLORS.white100;
//   }, [isFocused]);

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: scale.value }],
//     backgroundColor: bg.value,
//   }));

//   return (
//     <TouchableOpacity onPress={onPress} activeOpacity={BASEOPACITY}>
//       <Animated.View style={[styles.menuItem, animatedStyle]}>
//         {children}
//       </Animated.View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   conStyle: {
//     backgroundColor: COLORS.white100,
//     paddingBottom: Platform.select({
//       ios: Sizer.vSize(10),
//     }),
  
//     height: Platform.select({
//       android: Sizer.vSize(70),
//       ios: Sizer.vSize(90),
//     }),
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   menuContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//     alignItems: 'center',
//   },
//   menuItem: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: Sizer.fS(15),
//     width: Sizer.hSize(50),
//     height: Sizer.hSize(50),
//   },
// });

// export default BottomNavigator;
