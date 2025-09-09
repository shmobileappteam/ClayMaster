import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
// --------
import { Container } from '../../atomComponents';
import SlideInView from '../../animations/SlideView';
import { AppIconSvg, AppLogoSvg } from '../../assets/svgs';

import Sizer from '../../helpers/Sizer';
import { COLORS } from '../../globalStyle/Theme';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('LoginScreen');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container conStyle={styles.container} isPaddingVertical={false}>
      <SlideInView slide="up" slideDuration={800}>
        <AppIconSvg />
      </SlideInView>
      <View style={styles.margin} />
      <SlideInView slide="down" slideDuration={800}>
        <AppLogoSvg textColor={COLORS.black100}/>
      </SlideInView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  margin: {
    marginTop: Sizer.vSize(8),
  },
});

export default SplashScreen;
