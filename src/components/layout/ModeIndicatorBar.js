import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../atomComponents';
import Icon from '../../helpers/Icon';
import { COLORS, SPACING } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import { useModeSwitch } from '../../hooks/useModeSwitch';

/**
 * Persistent mode indicator + one-tap switch (shown on Field and Library screens).
 */
const ModeIndicatorBar = ({ variant = 'library' }) => {
  const {
    isFieldMode,
    canUseLibrary,
    currentLabel,
    otherLabel,
    switchToOtherMode,
  } = useModeSwitch();

  const isDark = variant === 'field';
  const switchDisabled = isFieldMode && !canUseLibrary;

  const palette = isDark
    ? {
        bg: COLORS.courseSurface,
        border: COLORS.courseBorder,
        text: COLORS.white100,
        muted: COLORS.courseTextMuted,
        pillBg: 'rgba(235,108,15,0.2)',
        pillText: COLORS.primary,
        btnBg: switchDisabled ? COLORS.courseBorder : COLORS.primary,
        btnText: COLORS.white100,
      }
    : {
        bg: COLORS.primaryLight,
        border: COLORS.borderMuted,
        text: COLORS.textPrimary,
        muted: COLORS.textSecondary,
        pillBg: isFieldMode ? 'rgba(235,108,15,0.15)' : COLORS.surface,
        pillText: COLORS.primary,
        btnBg: switchDisabled ? COLORS.borderMuted : COLORS.primary,
        btnText: COLORS.white100,
      };

  const statusHint =
    isFieldMode && !canUseLibrary
      ? 'Offline — Field Mode'
      : !isFieldMode && !canUseLibrary
        ? 'Limited connection'
        : null;

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: palette.bg,
          borderBottomColor: palette.border,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={[styles.pill, { backgroundColor: palette.pillBg }]}>
          <Icon
            name={isFieldMode ? 'locate' : 'library-outline'}
            iconFamily="Ionicons"
            size={14}
            color={palette.pillText}
          />
          <Typography
            size={11}
            fFamily="barlowSemiBold600"
            color={palette.pillText}
            mL={6}
            style={styles.uppercase}
          >
            {currentLabel}
          </Typography>
        </View>

        {statusHint ? (
          <Typography size={11} color={palette.muted} style={styles.hint}>
            {statusHint}
          </Typography>
        ) : (
          <View style={styles.hintSpacer} />
        )}

        <TouchableOpacity
          style={[styles.switchBtn, { backgroundColor: palette.btnBg }]}
          onPress={switchToOtherMode}
          disabled={switchDisabled}
          activeOpacity={0.88}
        >
          {switchDisabled ? (
            <Icon
              name="cloud-offline-outline"
              iconFamily="Ionicons"
              size={14}
              color={palette.muted}
            />
          ) : (
            <Icon
              name="swap-horizontal"
              iconFamily="Ionicons"
              size={14}
              color={palette.btnText}
            />
          )}
          <Typography
            size={11}
            fFamily="barlowSemiBold600"
            color={switchDisabled ? palette.muted : palette.btnText}
            mL={4}
          >
            {switchDisabled ? 'No internet' : `→ ${otherLabel}`}
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ModeIndicatorBar;

const styles = StyleSheet.create({
  wrap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingVertical: Sizer.vSize(8),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(8),
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizer.hSize(10),
    paddingVertical: Sizer.vSize(4),
    borderRadius: Sizer.hSize(20),
  },
  uppercase: {
    letterSpacing: 0.6,
  },
  hint: {
    flex: 1,
  },
  hintSpacer: {
    flex: 1,
  },
  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizer.hSize(10),
    paddingVertical: Sizer.vSize(6),
    borderRadius: Sizer.hSize(8),
    maxWidth: '46%',
  },
});
