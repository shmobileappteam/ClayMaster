import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-paper';
//-------------
import { Flex, Typography } from '../../atomComponents';
import Icon from '../../helpers/Icon';
import {
  BASEOPACITY,
  COLORS,
  GLOBALSTYLE,
  WINDOW,
} from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import { AppIconSvg, AppLogoSvg, BellSvg } from '../../assets/svgs';
import SlideInView from '../../animations/SlideView';
import { useSelector } from 'react-redux';
import { API_DOMAIN, BASE_URL } from '../../api/endpoints';
// import { MainLogoSvg } from '../../assets/svgs';
// import HamBurgerSvg from '../../assets/svgs/HamBurgerSvg';
// import BellSvg from '../../assets/svgs/BellSvg';
// import {edit} from '../../assets/images';

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
  bgColor = COLORS.primary,
  defaultHeaderStyles,
  logoTextColor = COLORS.black100,
  left = Sizer.hSize(24),
  rightIconName = "poweroff",
  rightIconFamily = "AntDesign",
  ...titleStyles
}) => {
  const navigation = useNavigation();
  const { user } = useSelector(state => state.app);

  return (
    <View style={styles.container}>
      {type == 'home' ? (
        <SlideInView slide="up" slideDuration={800}>
          <Flex
            jusContent={'space-between'}
            algItems={'center'}
            flexStyle={styles.HomeHeaderStyle}
          >
            <Flex gap={12}>
              <Avatar.Image
                source={{
                  uri: `${BASE_URL}${user?.profile_image}`,
                }}
                size={Sizer.hSize(48)}
                style={{ backgroundColor: COLORS.orange400 }}
              />
              <View>
                <Typography size={15} color={COLORS.white100}>
                  Good Morning!
                </Typography>
                <Typography
                  color={COLORS.white100}
                  size={20}
                  fFamily="barlowSemiBold600"
                  textTransform={'capitalize'}
                >
                  {user?.first_name + ' ' + user?.last_name}
                </Typography>
              </View>
            </Flex>
            <View />
          </Flex>
        </SlideInView>
      ) : type == 'app' ? (
        <View style={{ width: '100%' }}>
          <SlideInView slide="up" slideDuration={800}>
            <Flex
              jusContent={'center'}
              algItems={'flex-end'}
              extraStyle={{
                backgroundColor: COLORS.primary,
                width: '100%',
                position: 'relative',
                borderBottomLeftRadius: Sizer.fS(12),
                borderBottomRightRadius: Sizer.fS(12),
                height: Sizer.hSize(120),
                paddingBottom: Sizer.hSize(24),
              }}
            >
              {isBackVisible && (
                <TouchableOpacity
                  activeOpacity={BASEOPACITY}
                  onPress={onPresBack ?? (() => navigation.goBack())}
                  style={{
                    // padding: Sizer.fS(8),
                    backgroundColor: COLORS.white100,
                    borderRadius: 100,
                    position: 'absolute',
                    left: Sizer.hSize(24),
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

              <Typography
                size={24}
                // mB={26}
                color="white"
                numberOfLines={1}
                fFamily="barlowBoldItalic700"
              >
                {title}
              </Typography>
            </Flex>
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
          <Icon name={rightIconName} iconFamily={rightIconFamily}
            size={Sizer.vSize(14)}

            color={COLORS.white100} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  HomeHeaderStyle: {
    width: '100%',
    borderBottomLeftRadius: Sizer.fS(20),
    borderBottomRightRadius: Sizer.fS(20),
    backgroundColor: COLORS.primary,
    paddingTop: Sizer.vSize(67),
    paddingBottom: Sizer.hSize(32),
    ...GLOBALSTYLE.paddingHor,
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
