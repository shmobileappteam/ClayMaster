import {View, StyleSheet} from 'react-native';
import React from 'react';

import {COLORS} from '../globalStyle/Theme';

const Container = ({children, conStyle = {}}) => {
  return <View style={[styles.container, conStyle]}>{children}</View>;
};

export default Container;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.whiteV1,
  },
});
