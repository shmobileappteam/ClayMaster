import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import ProfileField from '../../../components/profile/ProfileField';
import Icon from '../../../helpers/Icon';
import {
  COLORS,
  GLOBALSTYLE,
  SHADOWS,
  SPACING,
  TYPE,
} from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { deleteAccount } from '../../../api/userService';
import { handleLogout } from '../../../redux/slices/appSlice';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { queryClient } from '../../../api/api';

const LOSE_ITEMS = [
  'All scoring history & analytics',
  'Coaching session credits (3 remaining)',
  'Community posts & replies',
  'Tournament entries & rankings',
  'Order history & membership',
];

/** ClayMaster-App-UI `DeleteAccount.tsx` — keeps deleteAccount API */
const DeleteAccountScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [confirmText, setConfirmText] = useState('');

  const { refetch: triggerDeleteAccount, isLoading } = useCustomQuery({
    queryKey: ['delete'],
    queryFn: deleteAccount,
    enabled: false,
  });

  const clearApp = () => {
    queryClient.clear();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      }),
    );
  };

  const handleDelete = () => {
    if (confirmText.trim().toUpperCase() !== 'DELETE') return;
    triggerDeleteAccount().then(() => {
      clearApp();
      dispatch(handleLogout());
    });
  };

  const canDelete = confirmText.trim().toUpperCase() === 'DELETE';

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Delete Account"
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.warningBox}>
          <Icon
            name="warning"
            iconFamily="Ionicons"
            size={24}
            color={COLORS.destructive}
          />
          <View style={styles.warningText}>
            <Typography
              fFamily="barlowSemiBold600"
              size={TYPE.h3.size}
              color={COLORS.destructive}
            >
              This action is permanent
            </Typography>
            <Typography
              size={TYPE.body.size}
              color={COLORS.textSecondary}
              mT={4}
              lineHeight={22}
            >
              Once you delete your account, all your data including scores,
              analytics, bookings, and community posts will be permanently
              removed. This cannot be undone.
            </Typography>
          </View>
        </View>

        <Typography
          fFamily={TYPE.h2.fFamily}
          size={TYPE.h2.size}
          color={COLORS.textPrimary}
          mB={SPACING.component}
        >
          What you'll lose
        </Typography>
        <View style={[GLOBALSTYLE.screenCard, styles.listCard]}>
          {LOSE_ITEMS.map((item, i) => (
            <View
              key={item}
              style={[
                styles.listRow,
                i < LOSE_ITEMS.length - 1 && styles.listBorder,
              ]}
            >
              <View style={styles.bullet} />
              <Typography size={TYPE.body.size} color={COLORS.textPrimary} style={{ flex: 1 }}>
                {item}
              </Typography>
            </View>
          ))}
        </View>

        <ProfileField
          label='Type "DELETE" to confirm'
          value={confirmText}
          onChangeText={setConfirmText}
          placeholder="Type DELETE"
        />

        <TouchableOpacity
          style={[styles.deleteBtn, (!canDelete || isLoading) && styles.btnDisabled]}
          onPress={handleDelete}
          disabled={!canDelete || isLoading}
          activeOpacity={0.88}
        >
          <Icon name="trash-outline" iconFamily="Ionicons" size={18} color={COLORS.white100} />
          <Typography
            fFamily="barlowSemiBold600"
            size={TYPE.h3.size}
            color={COLORS.white100}
            mL={8}
          >
            {isLoading ? 'Deleting...' : 'Delete My Account'}
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.88}
        >
          <Typography
            fFamily="barlowSemiBold600"
            size={TYPE.body.size}
            color={COLORS.textPrimary}
          >
            Cancel
          </Typography>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
};

export default DeleteAccountScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(SPACING.section),
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizer.hSize(12),
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    borderRadius: Sizer.hSize(12),
    padding: Sizer.hSize(SPACING.cardP),
  },
  warningText: { flex: 1 },
  listCard: {
    overflow: 'hidden',
    padding: 0,
    ...SHADOWS.card,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
    paddingHorizontal: Sizer.hSize(SPACING.cardP),
    paddingVertical: Sizer.vSize(14),
  },
  listBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.borderMuted,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.destructive,
  },
  deleteBtn: {
    height: Sizer.vSize(48),
    backgroundColor: COLORS.destructive,
    borderRadius: Sizer.hSize(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    height: Sizer.vSize(48),
    borderRadius: Sizer.hSize(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderMuted,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.5 },
});
