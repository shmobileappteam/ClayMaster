import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { Avatar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
//----
import { Container, Flex, Typography } from '../../../atomComponents';
import { Button, Header } from '../../../components';
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
import { deleteAccount, logout } from '../../../api/userService';
import { queryClient } from '../../../api/api';
import { CommonActions } from '@react-navigation/native';
import { handleLogout } from '../../../redux/slices/appSlice';
import { BASE_URL } from '../../../api/endpoints';

const SettingsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [modalVisibility, setVisibility] = useState(false);

  const { user } = useSelector(state => state.app);

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

  //Custom Delate Query Hook
  const { refetch: triggerDeleteAccount, isLoading } = useCustomQuery({
    queryKey: ['delete'],
    queryFn: deleteAccount,
    enabled: false,
  });

  //Request Delete
  const handleDeleteAcount = () => {
    triggerDeleteAccount().then(() => {
      clearApp();
      dispatch(handleLogout());
    });
  };

  const MenuItem = ({ icon, family, label, navLink, stack, fromProfile }) => (
    <TouchableOpacity
      style={styles.menuContainer}
      activeOpacity={BASEOPACITY}
      onPress={() => {
        if (label == 'Log out') {
          logoutHandler();
        } else if (label == 'Delete Acount') {
          setVisibility(true);
        } else {
          stack
            ? navigation.navigate(stack, { screen: navLink })
            : navLink && navigation.navigate(navLink, { fromProfile });
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
              source={{
                uri: `${BASE_URL}${user?.profile_image}`,
              }}
              size={Sizer.hSize(55)}
              style={{ backgroundColor: COLORS.orange400 }}
            />
            <Typography
              size={18}
              fFamily={'barlowSemiBold600'}
              textTransform={'capitalize'}
            >
              {user?.first_name + ' ' + user?.last_name}
            </Typography>
          </Flex>
          <Title title="General" />
          <View style={styles.menuCard}>
            {generalMenus.map((item, idx) => (
              <MenuItem key={idx} {...item} />
            ))}
          </View>
          <Title title="More With ClayMaster" />
          <View style={styles.menuCard}>
            {moreMenus.map((item, idx) => (
              <MenuItem key={idx} {...item} />
            ))}
          </View>
          <Title title="Settings" />
          <View style={styles.menuCard}>
            {settingData.map((item, idx) => (
              <MenuItem key={idx} {...item} />
            ))}
          </View>
        </SlideInView>
      </ScrollView>
      <Modal
        visible={modalVisibility}
        statusBarTranslucent
        transparent
        animationType="fade"
        onRequestClose={() => setVisibility(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.white100,
              marginHorizontal: 20,
              paddingVertical: 30,
              paddingHorizontal: 20,
              borderRadius: 12,
              width: '90%',
            }}
          >
            <Typography
              textAlign="center"
              fFamily="barlowSemiBold600"
              size={20}
            >
              Are you sure you want to delete your account?
            </Typography>

            <Typography
              size={14}
              textAlign="center"
              color={COLORS.grey300}
              mT={10}
            >
              This action is permanent and cannot be undone.
            </Typography>

            <Flex gap={12} mT={30}>
              <Button
                btnStyle={{ flex: 1, backgroundColor: COLORS.grey100 }}
                label="Delete"
                type="primary"
                textColor={COLORS.white100}
                onPress={handleDeleteAcount}
                loadColor={COLORS.red}
                loader={isLoading}
              />
              <Button
                btnStyle={{ flex: 1 }}
                label="Cancel"
                onPress={() => setVisibility(false)}
                disabled={isLoading}
              />
            </Flex>
          </View>
        </View>
      </Modal>
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
