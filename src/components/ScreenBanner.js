import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Typography, Flex } from '../atomComponents';
import { COLORS, defaultBannerHeight, SHADOWS } from '../globalStyle/Theme';
import Sizer from '../helpers/Sizer';

/**
 * Page intro / instruction block: light, readable “card” — not a heavy black hero.
 * Keeps title, subtitle, optional CTA, optional thumbnail on every screen.
 */
const ScreenBanner = ({
  title,
  subtitle,
  image,
  buttonLabel,
  onButtonPress,
  height,
}) => {
  const minH = height ?? defaultBannerHeight;

  return (
    <View style={[styles.wrap, { minHeight: Sizer.vSize(minH) }]}>
      <View style={[styles.card, SHADOWS.banner]}>
        <View style={styles.cardTopGlow} pointerEvents="none" />
        <Flex direction="row" algItems="flex-start" flexStyle={styles.cardInner}>
          <View style={styles.accentRail} />

          <View style={styles.copyBlock}>
            <Typography
              color={COLORS.textPrimary}
              fFamily="barlowBold700"
              size={20}
              lineHeight={26}
            >
              {title}
            </Typography>
            {subtitle ? (
              <Typography
                color={COLORS.textSecondary}
                size={14}
                lineHeight={22}
                mT={8}
              >
                {subtitle}
              </Typography>
            ) : null}
            {buttonLabel ? (
              <TouchableOpacity
                style={styles.btnWrapper}
                onPress={onButtonPress}
                activeOpacity={0.88}
              >
                <Typography
                  color={COLORS.white100}
                  size={13}
                  fFamily="barlowBold700"
                  style={styles.ctaLabel}
                >
                  {buttonLabel}
                </Typography>
              </TouchableOpacity>
            ) : null}
          </View>

          {image ? (
            <View style={styles.thumbShell}>
              <Image
                source={{ uri: image }}
                style={styles.thumbImage}
                resizeMode="cover"
              />
            </View>
          ) : null}
        </Flex>
      </View>
    </View>
  );
};

export default ScreenBanner;

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    paddingHorizontal: Sizer.hSize(16),
    paddingTop: Sizer.vSize(12),
    paddingBottom: Sizer.vSize(8),
    backgroundColor: COLORS.mainBg,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: Sizer.hSize(16),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderSubtle,
    overflow: 'hidden',
  },
  cardTopGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Sizer.vSize(3),
    backgroundColor: 'rgba(232, 93, 4, 0.22)',
    borderTopLeftRadius: Sizer.hSize(16),
    borderTopRightRadius: Sizer.hSize(16),
  },
  cardInner: {
    paddingVertical: Sizer.vSize(18),
    paddingRight: Sizer.hSize(16),
    paddingLeft: 0,
  },
  accentRail: {
    width: Sizer.hSize(4),
    alignSelf: 'stretch',
    minHeight: Sizer.vSize(48),
    backgroundColor: COLORS.primary,
    borderTopRightRadius: Sizer.hSize(3),
    borderBottomRightRadius: Sizer.hSize(3),
    marginRight: Sizer.hSize(14),
  },
  copyBlock: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    paddingRight: Sizer.hSize(8),
  },
  btnWrapper: {
    marginTop: Sizer.vSize(14),
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: Sizer.hSize(18),
    paddingVertical: Sizer.vSize(10),
    borderRadius: Sizer.hSize(10),
  },
  ctaLabel: {
    textTransform: 'none',
  },
  thumbShell: {
    width: Sizer.hSize(80),
    height: Sizer.hSize(80),
    borderRadius: Sizer.hSize(14),
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderMuted,
    backgroundColor: COLORS.surfaceMuted,
    alignSelf: 'center',
    ...SHADOWS.soft,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
});
