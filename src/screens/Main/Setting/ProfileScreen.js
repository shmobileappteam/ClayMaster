import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import { ConfirmModal } from '../../../components';
import Icon from '../../../helpers/Icon';
import {
  COLORS,
  GLOBALSTYLE,
  RADIUS,
  SPACING,
} from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useModeSwitch } from '../../../hooks/useModeSwitch';
import {
  navigateFromTabToStack,
  performLogout,
} from '../../../navigation/navigationHelpers';
import { resolveMediaUrl } from '../../../constants/community';

const MENU_ITEMS = [
  { icon: 'person-outline', label: 'My Account', screen: 'ProfileDetailsScreen' },
  {
    icon: 'card-outline',
    label: 'Subscription',
    screen: 'SubscriptionScreen',
    requiresSubscription: true,
  },
  { icon: 'cube-outline', label: 'Orders', screen: 'OrdersScreen' },
  { icon: 'settings-outline', label: 'Settings', screen: 'SettingsScreen' },
  { icon: 'help-circle-outline', label: 'Help & Support', screen: 'HelpAndSupportScreen' },
  { icon: 'information-circle-outline', label: 'About Us', screen: 'AboutUsScreen' },
  { icon: 'document-text-outline', label: 'Terms & Conditions', screen: 'TermsAndConditionsScreen' },
];

/**
 * Profile tab — parity with ClayMaster-App-UI `Profile.tsx`.
 */
const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user, subscriptionEnabled } = useSelector(state => state.app);
  const { switchToFieldMode } = useModeSwitch();
  const [logoutVisible, setLogoutVisible] = useState(false);
  const menuItems = MENU_ITEMS.filter(
    item => subscriptionEnabled || !item.requiresSubscription,
  );

  const displayName =
    user?.first_name || user?.last_name
      ? `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim()
      : 'Member';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const avatarUri = resolveMediaUrl(user?.profile_image);

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader title="Profile" showNotification={false} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* flex items-center gap-4 */}
        <View style={styles.userRow}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
          ) : (
            <View style={styles.avatar}>
              <Typography fFamily="barlowBold700" size={24} lineHeight={31} color={COLORS.white100}>
                {initials || 'CM'}
              </Typography>
            </View>
          )}
          <View>
            <Typography fFamily="barlowSemiBold600" size={20} lineHeight={26} color={COLORS.textPrimary}>
              {displayName}
            </Typography>
            <Typography size={14} lineHeight={21} color={COLORS.textSecondary} mT={4}>
              Pro Member
            </Typography>
          </View>
        </View>

        <View style={[GLOBALSTYLE.screenCard, styles.menuCard]}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuRow,
                i < menuItems.length - 1 && styles.menuBorder,
              ]}
              onPress={() =>
                navigateFromTabToStack(navigation, item.screen, {
                  fromProfile: true,
                })
              }
              activeOpacity={0.88}
            >
              <View style={styles.menuIcon}>
                <Icon
                  name={item.icon}
                  iconFamily="Ionicons"
                  size={18}
                  color={COLORS.primary}
                />
              </View>
              <Typography
                fFamily="barlowMedium500"
                size={14}
                lineHeight={21}
                color={COLORS.textPrimary}
                style={{ flex: 1 }}
              >
                {item.label}
              </Typography>
              <Icon
                name="chevron-forward"
                iconFamily="Ionicons"
                size={18}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Switch into Field Mode (same name as mode labels elsewhere) */}
        <TouchableOpacity
          style={[styles.fullWidthBtn, styles.darkBtn]}
          activeOpacity={0.88}
          onPress={() => switchToFieldMode('CourseHomeScreen')}
        >
          <Icon name="locate" iconFamily="Ionicons" size={18} color={COLORS.white100} />
          <Typography fFamily="barlowSemiBold600" size={14} lineHeight={21} color={COLORS.white100} mL={8}>
            Switch to Field Mode
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.fullWidthBtn, styles.destructiveOutlineBtn]}
          activeOpacity={0.88}
          onPress={() => setLogoutVisible(true)}
        >
          <Icon name="log-out-outline" iconFamily="Ionicons" size={18} color={COLORS.destructive} />
          <Typography fFamily="barlowSemiBold600" size={14} lineHeight={21} color={COLORS.destructive} mL={8}>
            Logout
          </Typography>
        </TouchableOpacity>
      </ScrollView>

      <ConfirmModal
        visible={logoutVisible}
        setVisibility={setLogoutVisible}
        title="Log out?"
        confirmText="Log out"
        cancelText="Cancel"
        handleComplete={() => performLogout(navigation, dispatch)}
      />
    </Container>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  // px-screen-px py-4 space-y-section
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(100),
    gap: Sizer.vSize(SPACING.section),
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(16),
  },
  // w-16 h-16 (64) rounded-full bg-cm-orange
  avatar: {
    width: Sizer.hSize(64),
    height: Sizer.hSize(64),
    borderRadius: Sizer.hSize(32),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {
    width: Sizer.hSize(64),
    height: Sizer.hSize(64),
    borderRadius: Sizer.hSize(32),
    backgroundColor: COLORS.surfaceMuted,
  },
  menuCard: {
    overflow: 'hidden',
    padding: 0,
  },
  // w-full flex-row gap-3 px-card-p py-4
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizer.hSize(SPACING.cardP),
    paddingVertical: Sizer.vSize(16),
    gap: Sizer.hSize(12),
  },
  menuBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.borderMuted,
  },
  // w-9 h-9 (36) rounded-full bg-cm-orange-light
  menuIcon: {
    width: Sizer.hSize(36),
    height: Sizer.hSize(36),
    borderRadius: Sizer.hSize(18),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthBtn: {
    width: '100%',
    height: Sizer.vSize(48),
    borderRadius: Sizer.hSize(RADIUS.md),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkBtn: {
    backgroundColor: COLORS.textPrimary,
  },
  destructiveOutlineBtn: {
    borderWidth: 1,
    borderColor: COLORS.destructive,
    backgroundColor: COLORS.surface,
  },
});
