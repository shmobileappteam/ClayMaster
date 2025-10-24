import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Sizer from '../../helpers/Sizer';
import { Typography } from '../../atomComponents';
import { COLORS } from '../../globalStyle/Theme';
import SlideInView from '../../animations/SlideView';

const TrapsList = ({
  trapsData = [],
  selectedPresentation = '',
  onSelectPresentation = () => {},
  slide,
}) => {
  // Divide array into two halves
  const mid = Math.ceil(trapsData.length / 2);
  const leftColumn = trapsData.slice(0, mid);
  const rightColumn = trapsData.slice(mid);

  return (
    <SlideInView slide={slide}>
      <View style={[styles.trapsContainer, { zIndex: -2 }]}>
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
    </SlideInView>
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
