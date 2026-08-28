import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from 'react-native-paper';
//-------------
import { Flex, Typography } from '../../atomComponents';
import Icon from '../../helpers/Icon';
import {
  BASEOPACITY,
  COLORS,
  GLOBALSTYLE,
  SHADOWS,
} from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import { AppIconSvg, AppLogoSvg } from '../../assets/svgs';
import SlideInView from '../../animations/SlideView';
import { useSelector } from 'react-redux';
import { getBaseUrl } from '../../api/endpoints';

const APP_BAR_SIDE = Sizer.hSize(48);

const Header = ({
  type = '',
  title = '',
  onPresBack = null,
  isBackVisible = true,
  iconColor = COLORS.primary,
  isEdit,
  onEditPress,
  profileEidtState,
  appIconStyles = {},
  isBackGreen,
  centerType = null,
  onPressRight = null,
  /** Optional node for app bar right (e.g. cart icon). Keeps title centered. */
  rightSlot = null,
  /** Home header: opens side menu (drawer) — e.g. hamburger top-right */
  onMenuPress = null,
  bgColor = COLORS.primary,
  defaultHeaderStyles,
  logoTextColor = COLORS.black100,
  left = Sizer.hSize(24),
  rightIconName = 'poweroff',
  rightIconFamily = 'AntDesign',
  ...titleStyles
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useSelector(state => state.app);

  return (
    <View style={styles.container}>
      {type == 'home' ? (
        <SlideInView
          slide="up"
          slideDuration={800}
          containerStyle={styles.homeSlideWrap}
        >
          <View
            style={[
              styles.HomeHeaderStyle,
              { paddingTop: insets.top + Sizer.vSize(12) },
            ]}
          >
              <Flex
                jusContent="space-between"
                algItems="center"
                flexStyle={styles.homeHeaderRow}
              >
                <Flex gap={12} flexStyle={styles.homeHeaderLeft}>
                  <View style={styles.avatarRing}>
                    <Avatar.Image
                      source={{
                        uri: `${getBaseUrl()}${user?.profile_image}`,
                      }}
                      size={Sizer.hSize(48)}
                      style={{ backgroundColor: COLORS.orange400 }}
                    />
                  </View>
                  <View style={styles.homeNameBlock}>
                    <Typography
                      size={13}
                      color="rgba(255,255,255,0.88)"
                      lineHeight={18}
                      fFamily="barlowMedium500"
                    >
                      Good morning
                    </Typography>
                    <Typography
                      color={COLORS.white100}
                      size={22}
                      lineHeight={28}
                      fFamily="barlowSemiBold600"
                      textTransform={'capitalize'}
                    >
                      {user?.first_name + ' ' + user?.last_name}
                    </Typography>
                  </View>
                </Flex>
                {onMenuPress ? (
                  <TouchableOpacity
                    onPress={onMenuPress}
                    style={styles.homeMenuBtn}
                    hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
                    accessibilityRole="button"
                    accessibilityLabel="Open full menu"
                  >
                    <Icon
                      name="menu"
                      iconFamily="Ionicons"
                      size={Sizer.vSize(28)}
                      color={COLORS.white100}
                    />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.homeHeaderRightSpacer} />
                )}
              </Flex>
              <View style={styles.homeAccentBar} />
            </View>
        </SlideInView>
      ) : type == 'app' ? (
        <View style={{ width: '100%', zIndex: 10, elevation: 10 }}>
          <SlideInView
            slide="up"
            slideDuration={800}
            containerStyle={styles.homeSlideWrap}
          >
            <View
              style={[
                styles.appBarShell,
                {
                  paddingTop: insets.top + Sizer.vSize(8),
                  paddingBottom: Sizer.vSize(14),
                },
                SHADOWS.header,
              ]}
            >
              <View style={styles.appBarRow}>
                <View style={[styles.appBarSide, { alignItems: 'flex-start' }]}>
                  {isBackVisible ? (
                    <TouchableOpacity
                      activeOpacity={0.88}
                      onPress={onPresBack ?? (() => navigation.goBack())}
                      style={styles.iconHit}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    >
                      <Icon
                        color={iconColor || COLORS.black300}
                        iconFamily={'Ionicons'}
                        size={Sizer.vSize(24)}
                        name={'arrow-back'}
                      />
                    </TouchableOpacity>
                  ) : (
                    <View style={{ width: APP_BAR_SIDE }} />
                  )}
                </View>

                <Typography
                  size={19}
                  color={COLORS.textPrimary}
                  numberOfLines={1}
                  fFamily="barlowBold700"
                  textAlign="center"
                  style={styles.appTitle}
                  {...titleStyles}
                >
                  {title}
                </Typography>

                <View style={[styles.appBarSide, { alignItems: 'flex-end' }]}>
                  {rightSlot ? (
                    <View style={styles.rightSlotWrap}>{rightSlot}</View>
                  ) : (
                    <View style={{ width: APP_BAR_SIDE }} />
                  )}
                </View>
              </View>
            </View>
          </SlideInView>
        </View>
      ) : (
        <View
          style={{
            marginTop: Sizer.hSize(24),
            alignItems: 'center',
            width: '100%',
            ...defaultHeaderStyles,
          }}
        >
          {isBackVisible && (
            <TouchableOpacity
              activeOpacity={BASEOPACITY}
              onPress={onPresBack ?? (() => navigation.goBack())}
              style={{
                backgroundColor: bgColor,
                borderRadius: 100,
                position: 'absolute',
                left: left,
                bottom: Sizer.hSize(30),
              }}
            >
              <Icon
                color={iconColor}
                iconFamily={'Ionicons'}
                size={Sizer.vSize(20)}
                name={'arrow-back'}
              />
            </TouchableOpacity>
          )}
          <SlideInView slide="left" slideDuration={800}>
            <AppIconSvg width={Sizer.hSize(151)} height={Sizer.hSize(59)} />
          </SlideInView>
          <SlideInView slide="right" slideDuration={800}>
            <AppLogoSvg
              textColor={logoTextColor}
              width={Sizer.hSize(150)}
              height={Sizer.hSize(27)}
            />
          </SlideInView>
        </View>
      )}

      {onPressRight && (
        <TouchableOpacity
          activeOpacity={BASEOPACITY}
          style={{
            borderRadius: Sizer.vSize(30),
            position: 'absolute',
            right: Sizer.hSize(24),
            bottom: Sizer.hSize(30),
            backgroundColor: COLORS.red,
            padding: Sizer.vSize(4),
          }}
          onPress={onPressRight}
        >
          <Icon
            name={rightIconName}
            iconFamily={rightIconFamily}
            size={Sizer.vSize(14)}
            color={COLORS.white100}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    width: '100%',
    overflow: 'hidden',
  },
  /** Animated wrapper must span screen width or the home header shrinks to content */
  homeSlideWrap: {
    width: '100%',
    alignSelf: 'stretch',
  },
  homeHeaderRow: {
    width: '100%',
  },
  homeHeaderLeft: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
  },
  homeNameBlock: {
    flex: 1,
    minWidth: 0,
  },
  homeMenuBtn: {
    width: APP_BAR_SIDE,
    height: Sizer.vSize(48),
    borderRadius: Sizer.hSize(14),
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  homeHeaderRightSpacer: {
    width: APP_BAR_SIDE,
    height: Sizer.vSize(48),
  },
  HomeHeaderStyle: {
    width: '100%',
    borderBottomLeftRadius: Sizer.fS(24),
    borderBottomRightRadius: Sizer.fS(24),
    backgroundColor: COLORS.secondary,
    paddingBottom: Sizer.hSize(20),
    elevation: 8,
    shadowColor: '#0D0D0D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    ...GLOBALSTYLE.paddingHor,
  },
  avatarRing: {
    borderWidth: 2,
    borderColor: 'rgba(232, 93, 4, 0.55)',
    borderRadius: Sizer.hSize(28),
    padding: Sizer.hSize(2),
  },
  homeAccentBar: {
    alignSelf: 'center',
    width: '42%',
    maxWidth: Sizer.hSize(160),
    height: Sizer.vSize(4),
    marginTop: Sizer.vSize(18),
    borderRadius: Sizer.hSize(4),
    backgroundColor: COLORS.primary,
    opacity: 0.95,
  },
  appBarShell: {
    backgroundColor: COLORS.surface,
    width: '100%',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.borderSubtle,
  },
  appBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: Sizer.hSize(12),
  },
  appBarSide: {
    width: APP_BAR_SIDE,
    justifyContent: 'center',
    minHeight: Sizer.vSize(40),
  },
  appTitle: {
    flex: 1,
    paddingHorizontal: Sizer.hSize(4),
  },
  iconHit: {
    padding: Sizer.hSize(4),
  },
  rightSlotWrap: {
    minWidth: APP_BAR_SIDE,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: Sizer.vSize(0),
    padding: Sizer.fS(8),
    borderRadius: 100,
    zIndex: 100,
  },
  centeredContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
