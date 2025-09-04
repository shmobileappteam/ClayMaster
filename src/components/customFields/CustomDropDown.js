import React, {memo, useState} from 'react';
import {StyleSheet} from 'react-native';
// import {Dropdown} from 'react-native-element-dropdown';

import {COLORS, FONTS} from '../../globalStyle/Theme';

import Sizer from '../../helpers/Sizer';

const data = [
  {label: '1', value: '1'},
  {label: '2', value: '2'},
  {label: '3', value: '3'},
  {label: '4', value: '4'},
];

function CustomDropdown({onChange = () => {}, ...props}) {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <>
      {/* <Dropdown
        style={[
          styles.dropdown,
          isFocus && {borderColor: COLORS.primary},
          props?.dropdownStyle,
        ]}
        placeholderStyle={styles.placeholderStyle}
        containerStyle={styles.listContainer}
        selectedStyle={styles.selectStyle}
        itemTextStyle={styles.itemText}
        selectedTextStyle={styles.selectedTextStyle}
        activeColor={COLORS.primary}
        activeTextStyle={styles.activeTextStyle}
        iconStyle={styles.iconStyle}
        iconColor={isFocus ? COLORS.primary : COLORS.greyV2}
        data={props?.data || data}
        // maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? props?.placeholder : '...'}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
          onChange(item.value);
        }}
      /> */}
    </>
  );
}

export default memo(CustomDropdown);

const styles = StyleSheet.create({
  dropdown: {
    paddingLeft: Sizer.hSize(16),
    paddingRight: Sizer.hSize(10),
    borderRadius: Sizer.fS(12),
    borderWidth: 1,
    borderColor: COLORS.greyV1,
    height: 50,
  },
  placeholderStyle: {
    color: COLORS.greyV2,
    fontFamily: FONTS.regular,
    fontSize: Sizer.fS(13),
  },
  selectedTextStyle: {
    color: COLORS.greyV2,
    fontFamily: FONTS.regular,
    fontSize: Sizer.fS(13),
  },
  listContainer: {
    backgroundColor: COLORS.secondary,
    borderWidth: 0,
    borderRadius: 6,
  },
  selectStyle: {
    color: COLORS.whiteV1,
  },
  itemText: {
    color: COLORS.whiteV1,
    fontSize: Sizer.fS(14),
  },
  iconStyle: {
    color: COLORS.primary,
  },
});
