import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Container, Typography } from '../../../atomComponents';
import { Button, Header } from '../../../components';
import { CircledTickSvg } from '../../../assets/svgs';
import { GLOBALSTYLE } from '../../../globalStyle/Theme';
import SlideInView from '../../../animations/SlideView';
import Sizer from '../../../helpers/Sizer';

const SavedScoredcardSuccessScreen = ({ navigation, route }) => {
  const status = route.params?.status || 'Scorecard';
  const desc = route.params?.desc || 'Scorecard';
  return (
    <Container isPadding={false}>
      <Header type="app" isBackVisible={false} />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          ...GLOBALSTYLE.paddingHor,
        }}
      >
        <SlideInView slide="right" slideDuration={700}>
          <View
            style={{
              alignItems: 'center',
            }}
          >
            <CircledTickSvg />
            <Typography fFamily="barlowBoldItalic700" size={32} mT={10}>
              {status}
            </Typography>
            <Typography
              fFamily="barlowMedium500"
              textAlign="center"
              size={16}
              mT={2}
            >
              {desc}
            </Typography>
          </View>
        </SlideInView>
        <Button
          label="Back To Home"
          onPress={() => navigation.navigate('BottomTabs')}
          btnStyle={{
            position: 'absolute',
            bottom: Sizer.hSize(54),
            width: '100%',
          }}
        />
      </View>
    </Container>
  );
};

export default SavedScoredcardSuccessScreen;

const styles = StyleSheet.create({});
