import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import React from 'react';
//--------------
import { Container, Typography } from '../../../atomComponents';
import { Header, IconButton } from '../../../components';
import Sizer from '../../../helpers/Sizer';
import { GLOBALSTYLE } from '../../../globalStyle/Theme';
import { downarrow, homebanner } from '../../../assets/images';
import ScorecardList from '../../../components/Round/ScorecardList';

const CustomScoreCard = ({ navigation }) => {
  const route = useRoute();
  const comeFromScoreCardSucceed = route.params?.isSucceed;

  return (
    <Container isPadding={false}>
      <Header type="home" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginTop: Sizer.hSize(30) }}
        contentContainerStyle={{
          paddingBottom: Sizer.vSize(20),
          // ...GLOBALSTYLE.paddingHor,
        }}
      >
        {comeFromScoreCardSucceed ? (
          <View
            style={{
              ...GLOBALSTYLE.paddingHor,
            }}
          >
            <ScorecardList
              onItemPress={item =>
                navigation.navigate('ScorecardDetailsScreen', {
                  cardDetails: item,
                })
              }
            />
          </View>
        ) : (
          <>
            <View style={GLOBALSTYLE.paddingHor}>
              <Image
                source={homebanner}
                style={styles.banneerimg}
                resizeMode="cover"
              />
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
                mB={2}
                fFamily="barlowMedium500"
              >
                Master your sporting clays skills and start your analytics
                process by using our custom ClayMaster scorecard.{' '}
              </Typography>
            </View>
          </>
        )}
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
  banneerimg: {
    height: Sizer.hSize(173),
    width: '100%',
    borderRadius: Sizer.hSize(10),
  },
});

export default CustomScoreCard;
