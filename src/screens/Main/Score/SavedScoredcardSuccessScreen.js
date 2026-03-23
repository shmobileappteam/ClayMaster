import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Container, Typography } from '../../../atomComponents';
import { Button, Header } from '../../../components';
import { CircledTickSvg } from '../../../assets/svgs';
import { COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
import SlideInView from '../../../animations/SlideView';
import Sizer from '../../../helpers/Sizer';

const SavedScoredcardSuccessScreen = ({ navigation, route }) => {
  const status = route.params?.status || 'Scorecard';
  const desc = route.params?.desc || 'Scorecard';
  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
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
            <Typography fFamily="barlowBold700" size={32} color={COLORS.black300} mT={16} mB={8}>
              {status}
            </Typography>
            <Typography
              fFamily="barlowMedium500"
              textAlign="center"
              color={COLORS.black500}
              size={15}
              mT={4}
              LineHeight={22}
            >
              {desc}
            </Typography>
          </View>
        </SlideInView>
        <Button
          label="Back To Home"
          onPress={() =>
            navigation.navigate('BottomTabs', {
              screen: 'MainTabs',
              params: { screen: 'Home', params: { isSucceed: true } },
            })
          }
          btnStyle={{
            position: 'absolute',
            bottom: Sizer.vSize(54),
            width: '100%',
          }}
        />
      </View>
    </Container>
  );
};

export default SavedScoredcardSuccessScreen;

const styles = StyleSheet.create({});
