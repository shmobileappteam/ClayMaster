import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import React from 'react';
//--------------
import { Container, Typography } from '../../../atomComponents';
import { Header, IconButton } from '../../../components';
import Sizer from '../../../helpers/Sizer';
import { GLOBALSTYLE } from '../../../globalStyle/Theme';
import { downarrow, homebanner } from '../../../assets/images';
import ScorecardList from '../../../components/Round/ScorecardList';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { getRounds } from '../../../api/roundService';
import { getTraps } from '../../../api/stationService';
import ConfirmModal from '../../../components/modal/confirmModal';

const CustomScoreCard = ({ navigation }) => {
  const route = useRoute();

  const { data: roundsData } = useCustomQuery({
    queryKey: ['rounds'],
    queryFn: getRounds,
  });

  const [showNewRoundModal, setShowNewRoundModal] = React.useState(false);

  // console.log(roundsData);

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
        {roundsData?.length ? (
          <View
            style={{
              ...GLOBALSTYLE.paddingHor,
            }}
          >
            <ScorecardList
              data={roundsData || []}
              onItemPress={item => {
                item?.complete_status
                  ? // item?.complete_status
                    navigation.navigate('ScorecardDetailsScreen', {
                      roundId: item?.id,
                    })
                  : navigation.navigate('NewRoundScreen', {
                      roundDetails: {
                        ...item,
                        // european_rotation: false,
                        // starting_station: 3,
                        // total_stations: 10,
                        // station_sequence: [3, 4, 5, 6, 7, 8, 9, 10, 1, 2],
                      },
                    });
              }}
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
        <IconButton onPress={() => setShowNewRoundModal(true)} />
      </ScrollView>

      <ConfirmModal
        visible={showNewRoundModal}
        setVisibility={setShowNewRoundModal}
        title="Note"
        message={
          'Please note that the digital scorecard has been formatted to support a typical 100-target practice/tournament round with up to 16 stations and 3–5 target pairs per station. Any exception to this may cause an error.'
        }
        confirmText="Proceed"
        cancelText="Cancel"
        handleComplete={() => navigation.navigate('NewRoundScreen')}
      />
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
