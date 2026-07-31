import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '../../atomComponents';
import CustomDropdown from '../customFields/CustomDropDown';
import { COLORS, SPACING, TYPE } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';

/**
 * ProfileField-matching select for checkout (label + card dropdown + error).
 */
const ProfileSelect = ({
  label,
  value,
  data = [],
  placeholder,
  onChange,
  error,
  disabled = false,
  search = true,
}) => (
  <View style={styles.wrap}>
    <Typography
      fFamily="barlowMedium500"
      size={TYPE.body.size}
      color={COLORS.textPrimary}
      mB={6}
    >
      {label}
    </Typography>
    <CustomDropdown
      data={data}
      value={value || null}
      placeholder={placeholder}
      disable={disabled}
      search={search}
      searchPlaceholder="Search..."
      onChange={item => onChange?.(item)}
      dropdownStyle={[styles.dropdown, error ? styles.dropdownError : null]}
      placeholderStyle={styles.placeholder}
      selectedTextStyle={styles.selectedText}
    />
    {error ? (
      <Typography size={TYPE.caption.size} color={COLORS.destructive} mT={4}>
        {error}
      </Typography>
    ) : null}
  </View>
);

export default ProfileSelect;

const styles = StyleSheet.create({
  wrap: {
    marginBottom: Sizer.vSize(SPACING.component),
  },
  dropdown: {
    height: Sizer.vSize(48),
    paddingHorizontal: Sizer.hSize(16),
    backgroundColor: COLORS.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderMuted,
    borderRadius: Sizer.hSize(12),
  },
  dropdownError: {
    borderColor: COLORS.destructive,
  },
  placeholder: {
    color: COLORS.textSecondary,
    fontSize: Sizer.fS(TYPE.body.size),
    paddingLeft: 0,
  },
  selectedText: {
    color: COLORS.textPrimary,
    fontSize: Sizer.fS(TYPE.body.size),
    paddingLeft: 0,
  },
});
