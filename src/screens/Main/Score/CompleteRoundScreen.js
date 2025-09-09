import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
//----
import { Container } from '../../../atomComponents';
import { Button, Header, Label } from '../../../components';
import StationsList from '../../../components/Round/StationsList';
import { GLOBALSTYLE } from '../../../globalStyle/Theme';
import { stationsData } from '../../../constants/dummydata';

const CompleteRoundScreen = () => {
  return (
    <Container isPadding={false}>
      <Header type="app" title="Round Completed" />
      <View style={[GLOBALSTYLE.paddingHor, {flex:1  }]}>
        <Label title="Custom Score Card" fFamily={'barlowBold700'} size={20} />
        <StationsList data={stationsData} />
        <View style={{flex:1}}>

        </View>
      </View>
    </Container>
  );
};

export default CompleteRoundScreen;

const styles = StyleSheet.create({});
