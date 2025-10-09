import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { Avatar } from 'react-native-paper';
import { useDispatch } from 'react-redux';
//----
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header } from '../../../components';
import { BASEOPACITY, COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useCustomQuery } from '../../../query/useCustomQuery';
import SlideInView from '../../../animations/SlideView';
import {
  generalMenus,
  moreMenus,
  settingData,
} from '../../../constants/dummydata';
import Icon from '../../../helpers/Icon';
import { logout } from '../../../api/userService';
import { queryClient } from '../../../api/api';
import { CommonActions } from '@react-navigation/native';

const SettingsScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  function clearApp() {
    queryClient.clear();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      }),
    );
  }

  //Custom Logout Query Hook
  const { refetch: triggerLogout } = useCustomQuery({
    queryKey: ['logout'],
    queryFn: logout,
    enabled: false,
  });

  // Request Logout:
  const logoutHandler = () => {
    clearApp();
    triggerLogout().then(() => {
      dispatch(handleLogout());
    });
  };

  const MenuItem = ({ icon, family, label, navLink, stack }) => (
    <TouchableOpacity
      style={styles.menuContainer}
      activeOpacity={BASEOPACITY}
      onPress={() => {
        if (label == 'Log out') {
          logoutHandler();
        } else {
          stack
            ? navigation.navigate(stack, { screen: navLink })
            : navLink && navigation.navigate(navLink);
        }
      }}
    >
      <Flex gap={16} algItems={'center'}>
        <View
          style={[
            styles.iconContainer,
            label == 'Log out' && { backgroundColor: COLORS.red300 },
          ]}
        >
          <Icon
            name={icon}
            iconFamily={family}
            size={16}
            color={COLORS.white100}
          />
        </View>
        <Typography>{label}</Typography>
      </Flex>
    </TouchableOpacity>
  );
  return (
    <Container isPadding={false}>
      <Header type="app" title="Menu" isBackVisible={false} />{' '}
      <ScrollView
        style={{ ...GLOBALSTYLE.paddingHor, marginTop: Sizer.hSize(30) }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <SlideInView slide="down">
          <Flex extraStyle={styles.nameContainer} gap={13} algItems={'center'}>
            <Avatar.Image
              source={GLOBALSTYLE.dynamicAvatar}
              size={Sizer.hSize(55)}
            />
            <Typography size={18} fFamily={'barlowSemiBold600'}>
              William Anderson
            </Typography>
          </Flex>
          <Title title="General" />
          <View style={styles.menuCard}>
            {generalMenus.map((item, idx) => (
              <MenuItem key={idx} {...item} />
            ))}
          </View>
          <Title title="More With Clay Master" />
          <View style={styles.menuCard}>
            {moreMenus.map((item, idx) => (
              <MenuItem key={idx} {...item} />
            ))}
          </View>
          <Title title="Aettings" />
          <View style={styles.menuCard}>
            {settingData.map((item, idx) => (
              <MenuItem key={idx} {...item} />
            ))}
          </View>
        </SlideInView>
      </ScrollView>
    </Container>
  );
};

const Title = ({ title = '' }) => {
  title;
  return (
    <Typography fFamily="barlowMedium500" size={16} mT={25}>
      {title}
    </Typography>
  );
};
const styles = StyleSheet.create({
  nameContainer: {
    paddingVertical: Sizer.hSize(14),
    paddingHorizontal: Sizer.hSize(12),
    borderRadius: Sizer.fS(8),
    backgroundColor: COLORS.white100,
  },

  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Sizer.hSize(12),
    paddingHorizontal: Sizer.hSize(8),
    backgroundColor: COLORS.white100,
  },
  iconContainer: {
    width: Sizer.hSize(30),
    height: Sizer.hSize(30),
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  menuCard: {
    borderRadius: Sizer.fS(8),
    marginTop: Sizer.hSize(8),
  },
});

export default SettingsScreen;
