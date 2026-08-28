import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { CommonActions } from '@react-navigation/native';

import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import Icon from '../../../helpers/Icon';
import { COLORS, GLOBALSTYLE, SPACING, TYPE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { queryClient } from '../../../api/api';
import { logout as logoutApi } from '../../../api/userService';
import { handleLogout } from '../../../redux/slices/appSlice';
import {
  API_ENVIRONMENTS,
  APP_VERSION,
  getApiEnvKey,
  setApiEnv,
} from '../../../utils/apiEnvironment';
import { showMessage } from '../../../utils';

/**
 * Hidden Developer Options — reached only by the tap gesture on the Settings
 * version line. Lets an internal tester point a release build at the beta
 * backend without shipping a separate build.
 *
 * The PIN keeps the screen out of reach of a user who taps around by accident.
 * It is NOT a security boundary: anyone who unpacks the app can read it. The
 * real boundary is the beta server's own authentication.
 */
const DEV_ACCESS_PIN = '123456';

const DeveloperScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [selected, setSelected] = useState(getApiEnvKey);
  const [applying, setApplying] = useState(false);

  const activeKey = getApiEnvKey();
  const dirty = selected !== activeKey;

  const submitPin = () => {
    if (pin.trim() === DEV_ACCESS_PIN) {
      setPinError('');
      setUnlocked(true);
      return;
    }
    setPin('');
    setPinError('Incorrect PIN');
  };

  const applyEnvironment = async () => {
    const target = API_ENVIRONMENTS.find(env => env.key === selected);
    if (!target || applying) return;

    setApplying(true);

    // Log out on the CURRENT server before switching — afterwards the token
    // belongs to an environment we are no longer talking to.
    try {
      await logoutApi();
    } catch {
      /* Session is cleared locally regardless */
    }

    setApiEnv(target.key);
    queryClient.clear();
    dispatch(handleLogout());

    showMessage({
      type: 'success',
      message: `Switched to ${target.label} — sign in again`,
    });

    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'LoginScreen' }] }),
    );
  };

  const confirmApply = () => {
    const target = API_ENVIRONMENTS.find(env => env.key === selected);
    Alert.alert(
      `Switch to ${target?.label}?`,
      'You will be signed out and must log in again with an account that exists on that server.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Switch', style: 'destructive', onPress: applyEnvironment },
      ],
    );
  };

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Developer Options"
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {!unlocked ? (
          <View style={[GLOBALSTYLE.screenCard, styles.pinCard]}>
            <Typography
              fFamily="barlowSemiBold600"
              size={15}
              color={COLORS.textPrimary}
              mB={6}
            >
              Enter access PIN
            </Typography>
            <Typography
              size={13}
              color={COLORS.textSecondary}
              mB={14}
              lineHeight={18}
            >
              Internal use only.
            </Typography>
            <TextInput
              value={pin}
              onChangeText={text => {
                setPin(text);
                if (pinError) setPinError('');
              }}
              onSubmitEditing={submitPin}
              placeholder="••••••"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="number-pad"
              secureTextEntry
              maxLength={12}
              autoFocus
              returnKeyType="go"
              style={[styles.pinInput, !!pinError && styles.pinInputError]}
            />
            {!!pinError && (
              <Typography size={12} color={COLORS.destructive} mT={8}>
                {pinError}
              </Typography>
            )}
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={submitPin}
              activeOpacity={0.88}
            >
              <Typography
                fFamily="barlowSemiBold600"
                size={TYPE.body.size}
                color={COLORS.white100}
              >
                Unlock
              </Typography>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Typography
              fFamily="barlowSemiBold600"
              size={14}
              color={COLORS.textSecondary}
              mB={8}
            >
              API environment
            </Typography>
            <Typography
              size={13}
              color={COLORS.textSecondary}
              mB={12}
              lineHeight={18}
            >
              Changes which server this build talks to. The choice is remembered
              across restarts.
            </Typography>

            <View style={[GLOBALSTYLE.screenCard, styles.menuCard]}>
              {API_ENVIRONMENTS.map((env, i) => {
                const isSelected = selected === env.key;
                return (
                  <TouchableOpacity
                    key={env.key}
                    style={[
                      styles.envRow,
                      i < API_ENVIRONMENTS.length - 1 && styles.menuBorder,
                    ]}
                    onPress={() => setSelected(env.key)}
                    activeOpacity={0.88}
                  >
                    <View style={{ flex: 1 }}>
                      <Typography
                        fFamily="barlowMedium500"
                        size={TYPE.body.size}
                        color={COLORS.textPrimary}
                      >
                        {env.label}
                        {env.key === activeKey ? '  (current)' : ''}
                      </Typography>
                      <Typography
                        size={12}
                        color={COLORS.textSecondary}
                        mT={2}
                        lineHeight={16}
                      >
                        {env.baseUrl}
                      </Typography>
                    </View>
                    <Icon
                      name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                      iconFamily="Ionicons"
                      size={20}
                      color={isSelected ? COLORS.primary : COLORS.textSecondary}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, !dirty && styles.primaryBtnDisabled]}
              onPress={confirmApply}
              disabled={!dirty || applying}
              activeOpacity={0.88}
            >
              <Typography
                fFamily="barlowSemiBold600"
                size={TYPE.body.size}
                color={COLORS.white100}
              >
                {applying ? 'Switching…' : 'Apply & sign out'}
              </Typography>
            </TouchableOpacity>

            <Typography
              size={12}
              color={COLORS.textSecondary}
              mT={16}
              textAlign="center"
            >
              Build {APP_VERSION}
            </Typography>
          </>
        )}
      </ScrollView>
    </Container>
  );
};

export default DeveloperScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
  },
  pinCard: {
    padding: Sizer.hSize(SPACING.cardP),
  },
  menuCard: {
    overflow: 'hidden',
    padding: 0,
  },
  envRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizer.hSize(SPACING.cardP),
    paddingVertical: Sizer.vSize(14),
    gap: Sizer.hSize(12),
  },
  menuBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.borderMuted,
  },
  pinInput: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderMuted,
    borderRadius: Sizer.hSize(10),
    paddingHorizontal: Sizer.hSize(14),
    paddingVertical: Sizer.vSize(12),
    fontSize: Sizer.fS(16),
    letterSpacing: 4,
    color: COLORS.textPrimary,
  },
  pinInputError: {
    borderColor: COLORS.destructive,
  },
  primaryBtn: {
    marginTop: Sizer.vSize(18),
    borderRadius: Sizer.hSize(12),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Sizer.vSize(14),
  },
  primaryBtnDisabled: {
    opacity: 0.45,
  },
});
