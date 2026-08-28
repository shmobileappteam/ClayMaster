import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
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
import {
  getScoringLockIdleMs,
  SCORING_LOCK_OPTIONS,
  setScoringLockIdleMs,
} from '../../../utils/scoringLockSettings';
import { APP_VERSION, getApiEnv, isBetaEnv } from '../../../utils/apiEnvironment';
import useSecretGate from '../../../hooks/useSecretGate';

/** ClayMaster-App-UI `SettingsPage.tsx` */
const OPTIONS = [
  { icon: 'create-outline', label: 'Edit Profile', screen: 'ProfileDetailsScreen' },
  { icon: 'lock-closed-outline', label: 'Change Password', screen: 'ChangePasswordScreen' },
  {
    icon: 'card-outline',
    label: 'Membership Plan',
    screen: 'SubscriptionScreen',
    requiresSubscription: true,
  },
  {
    icon: 'trash-outline',
    label: 'Delete Account',
    screen: 'DeleteAccountScreen',
    danger: true,
  },
];

const SettingsScreen = ({ navigation }) => {
  const subscriptionEnabled = useSelector(state => state.app.subscriptionEnabled);
  const options = useMemo(
    () =>
      OPTIONS.filter(opt => subscriptionEnabled || !opt.requiresSubscription),
    [subscriptionEnabled],
  );
  const [lockIdleMs, setLockIdleMs] = useState(getScoringLockIdleMs);

  // Hidden entry to Developer Options — tap the version line 7x. Nothing in the
  // UI advertises it; a normal user only ever sees the version string.
  const { registerTap, remaining } = useSecretGate({
    onUnlock: () => navigateFromTabToStack(navigation, 'DeveloperScreen'),
  });

  const onSelectLock = value => {
    setScoringLockIdleMs(value);
    setLockIdleMs(value);
  };

  return (
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
        <Typography
          fFamily="barlowSemiBold600"
          size={14}
          color={COLORS.textSecondary}
          mB={8}
        >
          Field Mode — Scoring auto-lock
        </Typography>
        <Typography size={13} color={COLORS.textSecondary} mB={12} lineHeight={18}>
          After this idle time, HIT/MISS scoring locks until you tap to resume.
          Choose Off to use the lock icon only. (Phone screen sleep is controlled
          in your device Display settings.)
        </Typography>
        <View style={[GLOBALSTYLE.screenCard, styles.lockCard]}>
          {SCORING_LOCK_OPTIONS.map((opt, i) => {
            const selected = lockIdleMs === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.lockRow,
                  i < SCORING_LOCK_OPTIONS.length - 1 && styles.menuBorder,
                ]}
                onPress={() => onSelectLock(opt.value)}
                activeOpacity={0.88}
              >
                <Typography
                  fFamily="barlowMedium500"
                  size={TYPE.body.size}
                  color={COLORS.textPrimary}
                  style={{ flex: 1 }}
                >
                  {opt.label}
                </Typography>
                <Icon
                  name={selected ? 'radio-button-on' : 'radio-button-off'}
                  iconFamily="Ionicons"
                  size={20}
                  color={selected ? COLORS.primary : COLORS.textSecondary}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <Typography
          fFamily="barlowSemiBold600"
          size={14}
          color={COLORS.textSecondary}
          mT={20}
          mB={8}
        >
          Account
        </Typography>
        <View style={[GLOBALSTYLE.screenCard, styles.menuCard]}>
          {options.map((opt, i) => (
            <TouchableOpacity
              key={opt.label}
              style={[styles.menuRow, i < options.length - 1 && styles.menuBorder]}
              onPress={() =>
                navigateFromTabToStack(navigation, opt.screen, {
                  fromProfile: true,
                })
              }
              activeOpacity={0.88}
            >
              <View
                style={[styles.menuIcon, opt.danger && styles.menuIconDanger]}
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

        <TouchableOpacity
          onPress={registerTap}
          activeOpacity={1}
          style={styles.versionRow}
        >
          <Typography size={12} color={COLORS.textSecondary} textAlign="center">
            App Version {APP_VERSION}
            {isBetaEnv() ? ` · ${getApiEnv().label}` : ''}
            {remaining != null ? `  (${remaining})` : ''}
          </Typography>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
};

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
  lockCard: {
    overflow: 'hidden',
    padding: 0,
  },
  lockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizer.hSize(SPACING.cardP),
    paddingVertical: Sizer.vSize(14),
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
  versionRow: {
    marginTop: Sizer.vSize(28),
    paddingVertical: Sizer.vSize(10),
  },
});
