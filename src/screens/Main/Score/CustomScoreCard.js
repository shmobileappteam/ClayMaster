import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import React from 'react';
//--------------
import { Container, Typography } from '../../../atomComponents';
import { Header, IconButton } from '../../../components';
import { ReadytoShootSvg, TargetPartSvg } from '../../../assets/svgs';
import Sizer from '../../../helpers/Sizer';
import SlideInView from '../../../animations/SlideView';
import { GLOBALSTYLE } from '../../../globalStyle/Theme';
import { downarrow } from '../../../assets/images';

const CustomScoreCard = ({ navigation }) => {
  return (
    <Container isPadding={false}>
      <Header type="home" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View style={styles.svgImgContainer}>
          <SlideInView slideDuration={1000}>
            <TargetPartSvg />
          </SlideInView>
          <SlideInView slide="right" slideDuration={1000}>
            <ReadytoShootSvg
              style={{
                alignSelf: 'center',
                marginTop: -62,
              }}
            />
          </SlideInView>
        </View>
        <View style={GLOBALSTYLE.paddingHor}>
          <Typography
            size={28}
            textAlign="center"
            mT={20}
            fFamily="barlowBoldItalic700"
          >
            Ready To Shoot?{' '}
          </Typography>
          <Typography
            size={16}
            textAlign="center"
            mT={6}
            fFamily="barlowMedium500"
          >
            Make your practice more analytic with filling our custom scorecard.{' '}
          </Typography>
        </View>
        <Image
          source={downarrow}
          style={styles.downArrow}
          resizeMode="contain"
        />
        <View style={{ marginTop: Sizer.hSize(12) }} />
        <IconButton onPress={() => navigation.navigate('NewRoundScreen')} />
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  svgImgContainer: {
    width: Sizer.hSize(220),
    height: Sizer.hSize(199),
    alignSelf: 'center',
    marginTop: Sizer.hSize(57),
  },
  downArrow: {
    width: Sizer.hSize(49),
    height: Sizer.hSize(70),
    alignSelf: 'center',
  },
});

export default CustomScoreCard;
