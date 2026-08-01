import React from 'react';
import { View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Typography } from '../../atomComponents';
import { COLORS } from '../../globalStyle/Theme';

export default function BooleanRadioSelector({
  onSetBoleanValue,
  boleanValue,
  variant = 'default',
}) {
  const isField = variant === 'field';
  const textColor = isField ? COLORS.white100 : COLORS.black100;
  const unchecked = isField ? COLORS.courseBorder : undefined;

  return (
    <View style={{ flexDirection: 'row' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <RadioButton.Android
          value="false"
          status={!boleanValue ? 'checked' : 'unchecked'}
          onPress={() => onSetBoleanValue(false)}
          color={COLORS.primary}
          uncheckedColor={unchecked}
        />
        <Typography color={textColor}>No</Typography>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          flex: 2,
        }}
      >
        <RadioButton.Android
          value="true"
          status={boleanValue ? 'checked' : 'unchecked'}
          onPress={() => onSetBoleanValue(true)}
          color={COLORS.primary}
          uncheckedColor={unchecked}
        />
        <Typography color={textColor}>Yes</Typography>
      </View>
    </View>
  );
}
