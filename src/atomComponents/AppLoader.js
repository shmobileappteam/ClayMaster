import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
//----
import { ActivityIndicator } from 'react-native-paper';

const AppLoader = () => {
  return (
    <View style={styles.root}>
      <ActivityIndicator />
    </View>
  );
};

export default AppLoader;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
