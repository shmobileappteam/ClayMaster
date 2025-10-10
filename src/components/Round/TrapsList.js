import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Sizer from '../../helpers/Sizer';
import { Flex, Typography } from '../../atomComponents';
import { BASEOPACITY, COLORS } from '../../globalStyle/Theme';

const TrapsList = ({
  trapsData = [],
  selectedPresentation = '',
  onSelectPresentation = () => {},
}) => {
  // Divide array into two halves
  const mid = Math.ceil(trapsData.length / 2);
  const leftColumn = trapsData.slice(0, mid);
  const rightColumn = trapsData.slice(mid);

  return (
    <View style={styles.trapsContainer}>
      <View
        style={{
          marginRight: Sizer.hSize(8),
        }}
      >
        {leftColumn.map((item, index) => (
          <View
            key={`left-${index}`}
            style={[
              styles.bottomRectangle,
              {
                marginBottom:
                  index === leftColumn.length - 1 ? 0 : Sizer.hSize(8),
              },
              item?.slug == selectedPresentation && {
                backgroundColor: COLORS.primary,
              },
            ]}
          >
            <Typography
              size={14}
              fFamily="barlowMedium500"
              textTransform="capitalize"
              numberOfLines={1}
              adjustsFontSizeToFit
              onPress={onSelectPresentation.bind(this, item)}
              color={
                item?.slug == selectedPresentation
                  ? COLORS.white100
                  : COLORS.black100
              }
            >
              {item?.label}
            </Typography>
          </View>
        ))}
      </View>

      <View>
        {rightColumn.map((item, index) => (
          <View
            key={`right-${index}`}
            style={[
              styles.bottomRectangle,
              {
                marginBottom:
                  index === rightColumn.length - 1 ? 0 : Sizer.hSize(8),
              },
              item?.slug == selectedPresentation && {
                backgroundColor: COLORS.primary,
              },
            ]}
          >
            <Typography
              size={14}
              fFamily="barlowMedium500"
              textTransform="capitalize"
              numberOfLines={1}
              adjustsFontSizeToFit
              onPress={onSelectPresentation.bind(this, item)}
              color={
                item?.slug == selectedPresentation
                  ? COLORS.white100
                  : COLORS.black100
              }
            >
              {item?.label}
            </Typography>
          </View>
        ))}
      </View>
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
  trapsContainer: {
    flexDirection: 'row',
    marginTop: Sizer.hSize(15),
  },
});

export default TrapsList;
