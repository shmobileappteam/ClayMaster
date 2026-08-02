import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '../../atomComponents';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';

/**
 * Flag for European-rotation rounds.
 * @param {'field'|'library'|'light'} variant
 *   field — primary fill (dark Field cards)
 *   library — white fill (dark Library resume)
 *   light — soft primary fill (light Library scorecard list)
 */
const EuropeanBadge = ({ variant = 'field', style }) => {
  const isField = variant === 'field';
  const isLight = variant === 'light';
  const iconColor = isField ? COLORS.white100 : COLORS.primary;

  return (
    <View
      style={[
        styles.badge,
        isField
          ? styles.badgeField
          : isLight
            ? styles.badgeLight
            : styles.badgeLibrary,
        style,
      ]}
    >
      <Icon
        name="sync"
        iconFamily="Ionicons"
        size={11}
        color={iconColor}
      />
      <Typography
        size={10}
        fFamily="barlowBold700"
        color={iconColor}
        mL={4}
        style={styles.label}
      >
        European
      </Typography>
    </View>
  );
};

export default EuropeanBadge;

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizer.hSize(8),
    paddingVertical: Sizer.vSize(4),
    borderRadius: Sizer.hSize(20),
  },
  badgeField: {
    backgroundColor: COLORS.primary,
  },
  badgeLibrary: {
    backgroundColor: COLORS.white100,
  },
  badgeLight: {
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: 'rgba(235, 108, 15, 0.35)',
  },
  label: {
    letterSpacing: 0.2,
  },
});
