import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import Icon from '../../../helpers/Icon';
import {
  COLORS,
  GLOBALSTYLE,
  SPACING,
  TYPE,
} from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { navigateFromTabToStack } from '../../../navigation/navigationHelpers';

/** ClayMaster-App-UI `SettingsPage.tsx` */
const OPTIONS = [
  { icon: 'create-outline', label: 'Edit Profile', screen: 'ProfileDetailsScreen' },
  { icon: 'lock-closed-outline', label: 'Change Password', screen: 'ChangePasswordScreen' },
  { icon: 'card-outline', label: 'Membership Plan', screen: 'SubscriptionScreen' },
  {
    icon: 'trash-outline',
    label: 'Delete Account',
    screen: 'DeleteAccountScreen',
    danger: true,
  },
];

const SettingsScreen = ({ navigation }) => (
  <Container isPadding={false} backgroundColor={COLORS.mainBg}>
    <LibraryHeader
      title="Settings"
      showBack
      showNotification={false}
      onBack={() => navigation.goBack()}
    />
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={[GLOBALSTYLE.screenCard, styles.menuCard]}>
        {OPTIONS.map((opt, i) => (
          <TouchableOpacity
            key={opt.label}
            style={[styles.menuRow, i < OPTIONS.length - 1 && styles.menuBorder]}
            onPress={() => navigateFromTabToStack(navigation, opt.screen, { fromProfile: true })}
            activeOpacity={0.88}
          >
            <View
              style={[
                styles.menuIcon,
                opt.danger && styles.menuIconDanger,
              ]}
            >
              <Icon
                name={opt.icon}
                iconFamily="Ionicons"
                size={18}
                color={opt.danger ? COLORS.destructive : COLORS.primary}
              />
            </View>
            <Typography
              fFamily="barlowMedium500"
              size={TYPE.body.size}
              color={opt.danger ? COLORS.destructive : COLORS.textPrimary}
              style={{ flex: 1 }}
            >
              {opt.label}
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
    </ScrollView>
  </Container>
);

export default SettingsScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
  },
  menuCard: {
    overflow: 'hidden',
    padding: 0,
  },
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
  menuIcon: {
    width: Sizer.hSize(36),
    height: Sizer.hSize(36),
    borderRadius: Sizer.hSize(18),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconDanger: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
  },
});
