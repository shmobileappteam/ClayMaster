import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Typography } from '../../atomComponents';

export default function BooleanRadioSelector({
  onSetBoleanValue,
  boleanValue,
}) {
  const [value, setValue] = useState('false');

  return (
    <View
      style={{
        flexDirection: 'row',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <RadioButton.Android
          value="false"
          status={!boleanValue ? 'checked' : 'unchecked'}
          onPress={() => onSetBoleanValue(false)}
        />
        <Typography>No</Typography>
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
        />
        <Typography>Yes</Typography>
      </View>
    </View>
  );
}
