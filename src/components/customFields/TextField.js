import * as React from 'react';
import { View, TextInput, StyleSheet, Pressable, Animated } from 'react-native';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//-------
import Sizer from '../../helpers/Sizer';
import { COLORS, FONTS } from '../../globalStyle/Theme';
import Typography from '../../atomComponents/Typography';
import Icon from '../../helpers/Icon';
// import { PhoneNoFlagSvg } from '../../svgs';
import { Flex } from '../../atomComponents';
import { MailSvg } from '../../assets/svgs';

const TextField = React.forwardRef(
  (
    {
      containerSt = {},
      inputStyle = {},
      placeholder = 'Placeholder',
      label = '',
      placeholderColor = COLORS.grey100,
      handleChange = e => {},
      rightIcon = false,
      leftIcon = false,
      leftIconType = 'icon',
      leftIconSvg = () => {},
      leftIconName = 'mail',
      leftIconFamily = 'Ionicons',
      focusFunctionality = false,
      next,
      borderWidth,
      password = false,
      leftIconContainer = {},
      customIcon = null,
      rightIconTopVal = 0,
      leftIconTopVal = 0,
      mT = 0,
      mB = 0,
      defaultValue = '',
      error = '',
      maxLength,
      disable = true,
      leftIconInActiveColor = COLORS.black300,
      borderInactiveWidth = null,
      borderInactiveColor = COLORS.grey100,
      ...props
    },
    ref,
  ) => {
    const inputRef = React.useRef(ref || null);
    const labelAnimation = React.useRef(
      new Animated.Value(defaultValue ? 1 : 0),
    ).current;

    const [value, setValue] = React.useState(defaultValue);
    const [hidePass, setHidePass] = React.useState(true);
    const [isFocus, setIsFocus] = React.useState(false);

    // Handle focus state animations
    React.useEffect(() => {
      Animated.timing(labelAnimation, {
        toValue: isFocus || value ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }, [isFocus, value]);

    // Label position and size animations
    const labelStyle = {
      top: labelAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [Sizer.vSize(15), Sizer.vSize(-8)],
      }),
      fontSize: labelAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [Sizer.fS(14), Sizer.fS(12)],
      }),
    };

    // Focus the input when container is pressed
    const handleContainerPress = () => {
      inputRef.current?.focus();
    };

    // Handle text change with validation
    const handleTextChange = text => {
      setValue(text);
      handleChange(text);
    };

    // Determine label color based on state
    const getLabelColor = () => {
      if (isFocus) return COLORS.primary;
      if (value) return COLORS.secondary;
      return COLORS.grey200;
    };

    return (
      <View style={[styles.wrapper, { marginTop: mT, marginBottom: mB }]}>
        <Pressable
          onPress={handleContainerPress}
          style={[
            styles.container,
            containerSt,
            {
              borderWidth: Sizer.fS(1.3),
              borderColor: isFocus ? COLORS.primary : borderInactiveColor,
            },
            error ? styles.errorContainer : null,
          ]}
        >
          {label && (
            <Animated.View style={[styles.labelContainer, labelStyle]}>
              <Typography
                size={labelAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [14, 12],
                })}
                color={getLabelColor()}
              >
                {label}
              </Typography>
            </Animated.View>
          )}

          {leftIcon && (
            <>
              {leftIconName == 'phone' ? (
                <Flex>
                  {/* <PhoneNoFlagSvg /> */}
                  <Typography
                    color={isFocus ? COLORS.black200 : leftIconInActiveColor}
                  >
                    {' ' + '(+1)'}
                  </Typography>
                </Flex>
              ) : leftIconType === 'icon' ? (
                <Icon
                  color={isFocus ? COLORS.primary : leftIconInActiveColor}
                  iconFamily={leftIconFamily}
                  size={Sizer.vSize(16)}
                  name={leftIconName}
                />
              ) : (
                leftIconSvg(isFocus)
              )}
            </>
          )}

          <TextInput
            editable={disable}
            placeholder={isFocus || !label ? placeholder : ''}
            placeholderTextColor={isFocus ? COLORS.black200 : placeholderColor}
            ref={inputRef}
            value={value}
            maxLength={maxLength}
            secureTextEntry={password && hidePass}
            autoCapitalize="none"
            onChangeText={handleTextChange}
            style={[
              styles.textInput,
              {
                color: isFocus ? COLORS.black100 : COLORS.grey200,
                paddingLeft: leftIcon ? Sizer.hSize(8) : Sizer.hSize(12),
                paddingRight:
                  rightIcon || password ? Sizer.hSize(8) : Sizer.hSize(12),
              },
              inputStyle,
            ]}
            cursorColor={COLORS.primary}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            {...props}
          />

          {(rightIcon || password) && (
            <View style={styles.rightIconCont}>
              {password && (
                <Pressable
                  style={styles.iconButton}
                  onPress={() => setHidePass(!hidePass)}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                  <Icon
                    size={Sizer.fS(16)}
                    color={isFocus ? COLORS.primary : leftIconInActiveColor}
                    name={hidePass ? 'eye-invisible' : 'eye'}
                    iconFamily={'AntDesign'}
                  />
                </Pressable>
              )}
            </View>
          )}
        </Pressable>

        {error ? (
          <Typography
            size={13}
            color={COLORS.red}
            mT={6}
            style={styles.errorText}
            LineHeight={16}
          >
            {error}
          </Typography>
        ) : null}
      </View>
    );
  },
);

export default React.memo(TextField);

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Sizer.fS(10),
    backgroundColor: COLORS.white100,
    height: Sizer.vSize(48),
    paddingHorizontal: Sizer.hSize(16),
  },
  leftIconCont: {
    // paddingRight: Sizer.hSize(6),
    width: Sizer.hSize(36),
    height: Sizer.hSize(36),
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconCont: {
    paddingLeft: Sizer.hSize(6),
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelContainer: {
    position: 'absolute',
    left: Sizer.hSize(20),
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
    zIndex: 3,
  },
  textInput: {
    flex: 1,
    fontSize: Sizer.fS(14),
    fontFamily: FONTS.barlowRegular400,
    height: '100%',
  },
  errorContainer: {
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorText: {
    marginLeft: Sizer.hSize(6),
    marginRight: Sizer.hSize(6),
  },
  iconButton: {
    padding: 4,
  },
});
