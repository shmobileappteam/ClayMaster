import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import Sizer from '../../helpers/Sizer';
import { Flex, Typography } from '../../atomComponents';
import { COLORS } from '../../globalStyle/Theme';

const TrapsList = () => {
  return (
    <View style={{ marginTop: Sizer.hSize(15) }}>
      {Object.entries(station.traps).map(([key, value], index) => (
        <Flex
          key={key}
          direction="row"
          algItems="center"
          mB={Object.entries(station.traps).length == index + 1 ? 0 : 10}
        >
          <View style={{ flex: 1 }}>
            <View
              style={[
                styles.bottomRectangle,
                key == 'Quartering' && {
                  backgroundColor: COLORS.primary,
                },
              ]}
            >
              <Typography
                size={14}
                color={key == 'Quartering' ? COLORS.white100 : COLORS.black100}
                fFamily="barlowMedium500"
                textTransform="capitalize"
              >
                {key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase())}
              </Typography>
            </View>
          </View>

          <View style={{ width: '60%' }}>
            <View style={[styles.bottomRectangle]}>
              <Typography size={14} fFamily="barlowMedium500">
                {value}
              </Typography>
            </View>
          </View>
        </Flex>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomRectangle: {
    backgroundColor: COLORS.grey800,
    paddingVertical: Sizer.hSize(6),
    paddingHorizontal: Sizer.hSize(8),
    borderRadius: Sizer.hSize(5),
    alignSelf: 'flex-start',
  },
});

export default TrapsList;
