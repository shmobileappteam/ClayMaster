import * as React from 'react';
import {View, TextInput, StyleSheet, Platform} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Sizer from '../../helpers/Sizer';
import {COLORS, FONTS} from '../../globalStyle/Theme';
import Typography from '../../atomComponents/Typography';

const TextField = React.forwardRef(
  (
    {
      containerSt = {},
      inputStyle = {},
      placeholder = '',
      label = '',
      placeholderColor = COLORS.greyV1,
      handleChange = e => {},
      rightIcon = '',
      leftIcon = '',
      focusFunctionality = false,
      next,
      borderWidth,
      password = false,
      leftIconContainer = {},
      customIcon = '',
      rightIconTopVal = 0,
      leftIconTopVal = 0,
      mT = 0,
      mB = 0,
      ...props
    },
    ref,
  ) => {
    const [value, setValue] = React.useState();
    const [hidePass, setHidePass] = React.useState(true);

    return (
      <View
        style={{
          marginTop: mT,
          marginBottom: mB,
          ...styles.container,
          ...containerSt,
        }}>
        {label && (
          <View style={[styles.label]}>
            <Typography size={12} color={COLORS.greyV2}>
              {label}
            </Typography>
          </View>
        )}
        {!!leftIcon && <View style={styles.leftIconCont}>{leftIcon}</View>}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={placeholderColor}
          ref={ref}
          value={value}
          secureTextEntry={password && hidePass}
          onChangeText={e => {
            setValue(e);
            handleChange(e);
          }}
          style={{
            ...styles.textInput,
            ...inputStyle,
          }}
          {...props}
        />
        {!!rightIcon && (
          <View style={styles.rightIconCont}>
            {password && (
              <MaterialCommunityIcons
                size={Sizer.fS(18)}
                color={COLORS.greyV1}
                name={hidePass ? 'eye-off-outline' : 'eye-outline'}
                onPress={() => setHidePass(!hidePass)}
              />
            )}
            {customIcon}
          </View>
        )}
      </View>
    );
  },
);

export default React.memo(TextField);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Sizer.fS(15),
    backgroundColor: COLORS.whiteV1,
    height: Sizer.hSize(50),
    paddingHorizontal: Sizer.wSize(12),
  },
  leftIconCont: {
    paddingRight: Sizer.wSize(6),
  },
  rightIconCont: {
    paddingLeft: Sizer.wSize(6),
  },
  label: {
    position: 'absolute',
    top: Sizer.wSize(0),
    zIndex: 3,
  },
  textInput: {
    flex: 1,
    color: COLORS.greyV1,
    fontSize: Sizer.fS(14),
    paddingHorizontal: Sizer.wSize(6),
  },
});
