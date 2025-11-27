import React, { memo, useState } from 'react';
import { StyleSheet } from 'react-native';
//-----
import { Dropdown } from 'react-native-element-dropdown';

import { COLORS, FONTS } from '../../globalStyle/Theme';

import Sizer from '../../helpers/Sizer';

const data = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
];

function CustomDropdown({ onChange = () => { }, defaultValue, ...props }) {
  const [value, setValue] = useState(defaultValue);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <>
      <Dropdown
        style={[
          styles.dropdown,
          isFocus && { borderColor: COLORS.primary },
          props?.dropdownStyle,
        ]}
        placeholderStyle={styles.placeholderStyle}
        containerStyle={styles.listContainer}
        selectedStyle={styles.selectStyle}
        itemTextStyle={styles.itemText}
        selectedTextStyle={styles.selectedTextStyle}
        activeColor={COLORS.primary}
        activeTextStyle={styles.activeTextStyle}
        iconColor={isFocus ? COLORS.primary : COLORS.greyV2}
        data={props?.data || data}
        labelField="label"
        valueField="value"
        mode="modal"
        placeholder={props?.placeholder}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        renderLeftIcon={props?.leftIcon}
        iconStyle={styles.iconStyle}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
          onChange(item);
        }}
      />
    </>
  );
}

export default memo(CustomDropdown);

const styles = StyleSheet.create({
  dropdown: {
    paddingHorizontal: Sizer.hSize(16),
    borderRadius: Sizer.fS(10),
    borderWidth: Sizer.fS(1.3),
    borderColor: COLORS.grey100,
    height: Sizer.vSize(48),
    backgroundColor: COLORS.white100,
  },
  placeholderStyle: {
    color: COLORS.greyV2,
    fontFamily: FONTS.barlowRegular400,
    fontSize: Sizer.fS(13),
    paddingLeft: Sizer.hSize(12)
  },
  selectedTextStyle: {
    color: COLORS.greyV2,
    fontFamily: FONTS.barlowRegular400,
    fontSize: Sizer.fS(13),
    paddingLeft: Sizer.hSize(12)

  },
  listContainer: {
    backgroundColor: COLORS.white100,
    borderWidth: 0,
    borderRadius: 6,
    maxHeight: '50%',
  },
  selectStyle: {
    color: COLORS.whiteV1,
  },
  itemText: {
    fontSize: Sizer.fS(14),
  },
  iconStyle: {
    // backgroundColor: "pink"

  },
});
