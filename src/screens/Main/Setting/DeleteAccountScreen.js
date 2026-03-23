import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header, Button } from '../../../components';
import { COLORS, GLOBALSTYLE, BASEOPACITY } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { deleteAccount } from '../../../api/userService';
import { handleLogout } from '../../../redux/slices/appSlice';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { queryClient } from '../../../api/api';
import { CommonActions } from '@react-navigation/native';

const DeleteAccountScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [modalVisibility, setVisibility] = useState(false);

  function clearApp() {
    queryClient.clear();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      }),
    );
  }

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

  const handleDeletePress = () => {
    setVisibility(true);
  };

  return (
    <Container isPadding={false}>
      <Header 
        type="app" 
        title="DELETE ACCOUNT" 
        isBackVisible={true} 
      />

      <View style={[GLOBALSTYLE.paddingHor, { marginTop: Sizer.vSize(20) }]}>
        <View style={styles.card}>
          <Typography fFamily="barlowBold700" size={18} color={COLORS.black300}>
            Are you sure you want to delete your account?
          </Typography>
          
          <Typography color={COLORS.grey200} size={13} mT={12} lineHeight={20}>
            If you delete your account, your access will end immediately and your account data will be permanently removed. This action cannot be undone.
          </Typography>

          {/* Warning Box */}
          <View style={styles.warningBox}>
            <View style={styles.warningItem}>
              <View style={styles.bullet} />
              <Typography color={COLORS.red300} size={12}>Your login access will be removed.</Typography>
            </View>
            <View style={styles.warningItem}>
              <View style={styles.bullet} />
              <Typography color={COLORS.red300} size={12}>Your subscription/access (if any) will no longer be available.</Typography>
            </View>
            <View style={styles.warningItem}>
              <View style={styles.bullet} />
              <Typography color={COLORS.red300} size={12}>Your account will be permanently deleted and cannot be restored.</Typography>
            </View>
          </View>

          {/* Action Buttons */}
          <Flex direction="row" jusContent="space-between" mT={32}>
            <TouchableOpacity 
              style={styles.cancelBtn}
              activeOpacity={BASEOPACITY}
              onPress={() => navigation.goBack()}
            >
              <Typography fFamily="barlowBold700" size={13}>CANCEL</Typography>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.deleteBtn}
              activeOpacity={BASEOPACITY}
              onPress={handleDeletePress}
              disabled={isLoading}
            >
              <Typography color={COLORS.white100} fFamily="barlowBold700" size={13}>
                YES, DELETE MY ACCOUNT
              </Typography>
            </TouchableOpacity>
          </Flex>
        </View>
      </View>

      <Modal
        visible={modalVisibility}
        statusBarTranslucent
        transparent
        animationType="fade"
        onRequestClose={() => setVisibility(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Typography textAlign="center" fFamily="barlowSemiBold600" size={20}>
              Are you sure you want to delete your account?
            </Typography>

            <Typography size={14} textAlign="center" color={COLORS.grey300} mT={10}>
              This action is permanent and cannot be undone.
            </Typography>

            <Flex gap={12} mT={30}>
              <Button
                btnStyle={{ flex: 1, backgroundColor: COLORS.red300 }}
                label="Delete"
                textColor={COLORS.white100}
                onPress={handleDeleteAcount}
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

export default DeleteAccountScreen;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white100,
    borderRadius: Sizer.hSize(12),
    padding: Sizer.hSize(20),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  warningBox: {
    backgroundColor: 'rgba(235, 15, 15, 0.05)',
    borderRadius: Sizer.hSize(8),
    padding: Sizer.hSize(16),
    marginTop: Sizer.vSize(20),
    borderWidth: 1,
    borderColor: 'rgba(235, 15, 15, 0.1)',
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Sizer.vSize(8),
  },
  bullet: {
    width: Sizer.hSize(6),
    height: Sizer.hSize(6),
    borderRadius: 3,
    backgroundColor: COLORS.red200,
    marginRight: Sizer.hSize(10),
    marginTop: Sizer.vSize(6),
  },
  cancelBtn: {
    flex: 1,
    height: Sizer.vSize(48),
    borderWidth: 1,
    borderColor: COLORS.black200,
    borderRadius: Sizer.hSize(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Sizer.hSize(10),
  },
  deleteBtn: {
    flex: 1.5,
    height: Sizer.vSize(48),
    backgroundColor: COLORS.red200,
    borderRadius: Sizer.hSize(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white100,
    marginHorizontal: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '90%',
  }
});
