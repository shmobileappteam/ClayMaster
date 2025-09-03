import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Searchbar} from 'react-native-paper';

import {COLORS} from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';

const SearchField = ({}) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Searchbar
      placeholder="Search item..."
      onChangeText={setSearchQuery}
      value={searchQuery}
      inputStyle={styles.inputStyle}
      mode="view"
      showDivider={false}
      style={styles.conStyle}
      placeholderTextColor={COLORS.greyV1}
      iconColor={COLORS.greyV1}
    />
  );
};

const styles = StyleSheet.create({
  conStyle: {
    borderWidth: 1,
    borderColor: COLORS.greyV1,
    backgroundColor: COLORS.whiteV1,
    height: Sizer.hSize(45),
    minHeight: Sizer.hSize(45),
    borderRadius: Sizer.fS(8),
    overflow: 'hidden',
  },
  inputStyle: {
    height: Sizer.hSize(42),
    minHeight: Sizer.hSize(42),
    color: COLORS.greyV1,
    fontSize: Sizer.fS(15),
  },
});

export default SearchField;
