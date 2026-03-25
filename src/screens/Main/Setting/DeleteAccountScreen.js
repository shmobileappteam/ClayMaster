import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header, Button } from '../../../components';
import { COLORS, GLOBALSTYLE, BASEOPACITY, SHADOWS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';
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

  const { refetch: triggerDeleteAccount, isLoading } = useCustomQuery({
    queryKey: ['delete'],
    queryFn: deleteAccount,
    enabled: false,
  });

  const handleDeleteAcount = () => {
    triggerDeleteAccount().then(() => {
      clearApp();
      dispatch(handleLogout());
    });
  };

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <Header 
        type="app" 
        title="DELETE ACCOUNT" 
        isBackVisible={true} 
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={[GLOBALSTYLE.paddingHor, { marginTop: Sizer.vSize(24) }]}>
          
          <View style={styles.topIconBox}>
             <View style={styles.iconCircle}>
                <Icon name="trash-outline" iconFamily="Ionicons" size={48} color={COLORS.red300} />
             </View>
          </View>

          <Typography fFamily="barlowBold700" size={24} color={COLORS.black300} textAlign="center">
            We're sorry to see you go
          </Typography>
          
          <Typography color={COLORS.textMuted} size={15} mT={12} textAlign="center" lineHeight={22}>
            Deleting your account is permanent. All your data, scores, and history will be lost forever.
          </Typography>

          <View style={styles.dangerZone}>
            <Typography fFamily="barlowBold700" size={14} color={COLORS.red300} mB={16}>WHAT YOU'LL LOSE:</Typography>
            
            <View style={styles.warningItem}>
                <View style={[styles.iconSquare, { backgroundColor: 'rgba(235, 15, 15, 0.1)' }]}>
                    <Icon name="person-remove" iconFamily="Ionicons" size={20} color={COLORS.red300} />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                    <Typography fFamily="barlowBold700" size={14}>Profile & Access</Typography>
                    <Typography size={12} color={COLORS.textMuted} mT={2}>Your login credentials and profile details will be deleted.</Typography>
                </View>
            </View>

            <View style={styles.warningItem}>
                <View style={[styles.iconSquare, { backgroundColor: 'rgba(235, 15, 15, 0.1)' }]}>
                    <Icon name="bar-chart" iconFamily="Ionicons" size={20} color={COLORS.red300} />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                    <Typography fFamily="barlowBold700" size={14}>Scores & History</Typography>
                    <Typography size={12} color={COLORS.textMuted} mT={2}>All your practice rounds, tournament stats, and progress data will be vanished.</Typography>
                </View>
            </View>

            <View style={styles.warningItem}>
                <View style={[styles.iconSquare, { backgroundColor: 'rgba(235, 15, 15, 0.1)' }]}>
                    <Icon name="card" iconFamily="Ionicons" size={20} color={COLORS.red300} />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                    <Typography fFamily="barlowBold700" size={14}>Subscription</Typography>
                    <Typography size={12} color={COLORS.textMuted} mT={2}>Active subscriptions will be canceled and no refunds will be provided.</Typography>
                </View>
            </View>
          </View>

          <View style={{ marginTop: 40 }}>
            <Button 
                label="KEEP MY ACCOUNT" 
                type="primary"
                onPress={() => navigation.goBack()}
            />
            <TouchableOpacity 
                activeOpacity={BASEOPACITY} 
                style={styles.deleteLink}
                onPress={() => setVisibility(true)}
            >
                <Typography color={COLORS.red300} fFamily="barlowBold700" size={14}>YES, DELETE EVERYTHING</Typography>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisibility}
        statusBarTranslucent
        transparent
        animationType="fade"
        onRequestClose={() => setVisibility(false)}
      >
        <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <Icon name="alert-circle" iconFamily="Ionicons" size={40} color={COLORS.red300} />
                    <Typography fFamily="barlowBold700" size={20} mT={12}>Confirm Deletion</Typography>
                </View>
                
                <Typography size={14} textAlign="center" color={COLORS.textMuted} lineHeight={20}>
                    This is your final warning. Are you absolutely sure you want to permanently delete your ClayMaster account?
                </Typography>

                <Flex gap={12} mT={32}>
                    <Button
                        btnStyle={{ flex: 1, backgroundColor: COLORS.red300 }}
                        label="Delete"
                        onPress={handleDeleteAcount}
                        loader={isLoading}
                    />
                    <Button
                        btnStyle={{ flex: 1 }}
                        type="secondary"
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

const styles = StyleSheet.create({
  topIconBox: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(235, 15, 15, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(235, 15, 15, 0.1)',
  },
  dangerZone: {
    backgroundColor: COLORS.white100,
    borderRadius: 20,
    padding: 20,
    marginTop: 32,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    ...SHADOWS.card,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconSquare: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteLink: {
    marginTop: 24,
    alignItems: 'center',
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white100,
    borderRadius: 24,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  }
});

export default DeleteAccountScreen;
