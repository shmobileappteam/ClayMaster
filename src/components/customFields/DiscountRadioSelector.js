import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Typography } from '../../atomComponents';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';

export default function DiscountRadioSelector({
  options = [],
  selectedValue,
  onValueChange,
}) {
  return (
    <View style={styles.container}>
      {options.map((option, index) => (
        <View key={option.value} style={styles.optionContainer}>
          <RadioButton.Android
            value={option.value}
            status={selectedValue === option.value ? 'checked' : 'unchecked'}
            onPress={() => onValueChange(option.value)}
            color={COLORS.orange100}
          />
          <Typography
            size={15}
            color={COLORS.black100}
            onPress={() => onValueChange(option.value)}
            style={styles.label}
          >
            {option.label}
          </Typography>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Sizer.hSize(23),
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizer.hSize(12),
  },
  label: {
    flex: 1,
    marginLeft: Sizer.hSize(8),
  },
});
