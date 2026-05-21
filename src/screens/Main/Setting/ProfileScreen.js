import React from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
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

const MENU_ITEMS = [
  { icon: 'person-outline', label: 'My Account', screen: 'ProfileDetailsScreen' },
  { icon: 'card-outline', label: 'Subscription', screen: 'SubscriptionScreen' },
  { icon: 'cube-outline', label: 'Orders', screen: 'OrdersScreen' },
  { icon: 'settings-outline', label: 'Settings', screen: 'SettingsScreen' },
];

/**
 * Profile tab — parity with ClayMaster-App-UI `Profile.tsx`.
 */
const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.app);
  const { switchToFieldMode } = useModeSwitch();

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

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader title="Profile" showNotification={false} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* flex items-center gap-4 */}
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Typography fFamily="barlowBold700" size={24} lineHeight={31} color={COLORS.white100}>
              {initials || 'CM'}
            </Typography>
          </View>
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
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuRow,
                i < MENU_ITEMS.length - 1 && styles.menuBorder,
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

        {/* w-full h-12 bg-foreground rounded-lg flex-row center gap-2 */}
        <TouchableOpacity
          style={[styles.fullWidthBtn, styles.darkBtn]}
          activeOpacity={0.88}
          onPress={() => switchToFieldMode('CourseHomeScreen')}
        >
          <Icon name="locate" iconFamily="Ionicons" size={18} color={COLORS.white100} />
          <Typography fFamily="barlowSemiBold600" size={14} lineHeight={21} color={COLORS.white100} mL={8}>
            Switch to On the Course
          </Typography>
        </TouchableOpacity>

        {/* w-full h-12 border border-cm-orange text-cm-orange rounded-lg */}
        <TouchableOpacity
          style={[styles.fullWidthBtn, styles.orangeOutlineBtn]}
          activeOpacity={0.88}
          onPress={() => navigateFromTabToStack(navigation, 'CommunityScreen')}
        >
          <Typography fFamily="barlowSemiBold600" size={14} lineHeight={21} color={COLORS.primary}>
            View Community
          </Typography>
        </TouchableOpacity>

        {/* w-full h-12 border border-destructive text-destructive rounded-lg */}
        <TouchableOpacity
          style={[styles.fullWidthBtn, styles.destructiveOutlineBtn]}
          activeOpacity={0.88}
          onPress={() => performLogout(navigation, dispatch)}
        >
          <Icon name="log-out-outline" iconFamily="Ionicons" size={18} color={COLORS.destructive} />
          <Typography fFamily="barlowSemiBold600" size={14} lineHeight={21} color={COLORS.destructive} mL={8}>
            Logout
          </Typography>
        </TouchableOpacity>
      </ScrollView>
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
  orangeOutlineBtn: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  destructiveOutlineBtn: {
    borderWidth: 1,
    borderColor: COLORS.destructive,
    backgroundColor: COLORS.surface,
  },
});
