import React, {memo, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import {IconButton} from 'react-native-paper';

import {setStatusBar} from '../../utils';
import {COLORS, GLOBALSTYLE} from '../../globalStyle/Theme';
import {FemaleIconPng, HeaderBGPng} from '../../assets/images';

import Typography from '../../atomComponents/Typography';
import Flex from '../../atomComponents/Flex';

import Sizer from '../../helpers/Sizer';
import TextField from '../customFields/TextField';
import Icon from '../../helpers/Icon';
import SlideInView from '../../animations/SlideView';

import Animated, {useAnimatedStyle} from 'react-native-reanimated';

const Header = ({
  leftIcon = 'menu',
  title = '',
  home = false,
  mT = null,
  backPress = () => {},
  left = true,
  chat = false,
  search = false,
  eclipse = false,
  profile = false,
  addProject = false,
  profilePress = () => {},
  addPress = () => {},
}) => {
  useEffect(() => {
    setStatusBar({color: 'transparent', content: 'light-content'});
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    marginTop: mT ? -mT.value : 0,
    opacity: mT && mT.value > 10 ? 0.2 : 1,
  }));
  return (
    <ImageBackground
      source={HeaderBGPng}
      style={[styles.headerWrapper, home && {borderRadius: 12}]}>
      <Flex algItems={'center'} flexStyle={{zIndex: 2}}>
        <View style={styles.flex1}>
          {left && (
            <TouchableOpacity onPress={() => backPress()}>
              <IconButton
                size={18}
                icon={leftIcon}
                style={GLOBALSTYLE.iconBtnStyle(COLORS.secondary)}
                iconColor={COLORS.whiteV1}
              />
            </TouchableOpacity>
          )}
          {profile && (
            <TouchableOpacity onPress={profilePress}>
              <Image
                resizeMode="cover"
                style={styles.proIamge}
                source={FemaleIconPng}
              />
            </TouchableOpacity>
          )}
        </View>
        <View
          style={[
            {
              alignItems: chat ? 'flex-start' : 'center',
              flex: chat ? 5 : 2,
            },
          ]}>
          <SlideInView slide="right">
            <Typography size={18} color={COLORS.whiteV1} fFamily="bold">
              {title}
            </Typography>
          </SlideInView>
        </View>
        <View style={[styles.flex1, {alignItems: 'flex-end'}]}>
          {search && (
            <IconButton
              size={18}
              icon={'magnify'}
              style={GLOBALSTYLE.iconBtnStyle(COLORS.secondary)}
              iconColor={COLORS.whiteV1}
              onPress={addPress}
            />
          )}
          {addProject && (
            <IconButton
              size={18}
              icon={'plus'}
              style={GLOBALSTYLE.iconBtnStyle(COLORS.secondary)}
              iconColor={COLORS.whiteV1}
              onPress={addPress}
            />
          )}
          {eclipse && (
            <TouchableOpacity>
              <Icon
                name={'dots-three-vertical'}
                iconFamily={'Entypo'}
                size={18}
                color={COLORS.whiteV1}
              />
            </TouchableOpacity>
          )}
        </View>
      </Flex>
      {home && (
        <Animated.View
          style={[
            animatedStyle,
            {
              zIndex: 1,
              // marginTop: Sizer.hSize(-mT),
              // opacity: mT.value >= 0 ? 0.2 : 1,
            },
          ]}>
          <Typography color={COLORS.whiteV1} size={12} mT={18}>
            Hi, Steven
          </Typography>
          <Typography
            color={COLORS.whiteV1}
            size={24}
            textTransform={'capitalize'}>
            Let’s Decorate Your {'\n'}house!
          </Typography>
          <Flex flex={1} gap={18} algItems={'center'} mt={24} mb={18}>
            <TextField
              placeholder="Search..."
              containerSt={styles.containerSt}
              leftIcon={
                <Icon name={'search'} color={COLORS.greyV1} size={16} />
              }
            />
            <IconButton
              icon={'filter'}
              iconColor={COLORS.whiteV1}
              size={18}
              style={GLOBALSTYLE.iconBtnStyle(COLORS.secondary)}
            />
          </Flex>
        </Animated.View>
      )}
      {/* {home && (
        <View
          style={{
            zIndex: 1,
            marginTop: Sizer.hSize(-mT),
            opacity: mT == 0 ? 1 : 0.2,
          }}>
          <Typography color={COLORS.whiteV1} size={12} mT={18}>
            Hi, Steven
          </Typography>
          <Typography
            color={COLORS.whiteV1}
            size={24}
            textTransform={'capitalize'}>
            Let’s Decorate Your {'\n'}house!
          </Typography>
          <Flex flex={1} gap={18} algItems={'center'} mt={24} mb={18}>
            <TextField
              placeholder="Search..."
              containerSt={styles.containerSt}
              leftIcon={
                <Icon name={'search'} color={COLORS.greyV1} size={16} />
              }
            />
            <IconButton
              icon={'filter'}
              iconColor={COLORS.whiteV1}
              size={18}
              style={GLOBALSTYLE.iconBtnStyle(COLORS.secondary)}
            />
          </Flex>
        </View>
      )} */}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    padding: 18,
    paddingTop:
      Platform.OS == 'ios'
        ? Sizer.hSize(60)
        : Sizer.hSize(StatusBar.currentHeight + 10),
    borderRadius: 0,
    overflow: 'hidden',
    minHeight: Sizer.hSize(120),
  },
  flex1: {
    flex: 1,
  },
  containerSt: {
    flex: 1,
    height: 40,
    borderRadius: 10,
  },
  proIamge: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.greyV2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.whiteV1,
  },
});

export default memo(Header);
