import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
//----
import { Container, Flex, Typography } from '../../../atomComponents';
import { Button, Header, Label } from '../../../components';
import StationsList from '../../../components/Round/StationsList';
import { COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
import { stationsDataList, statsData } from '../../../constants/dummydata';
import Sizer from '../../../helpers/Sizer';

const CompleteRoundScreen = ({ navigation }) => {
  const totalHits = stationsDataList?.reduce(
    (sum, station) => sum + station.hits,
    0,
  );

  const totalMissed = stationsDataList?.reduce(
    (sum, station) => sum + station.missed,
    0,
  );
  const totalShots = stationsDataList?.reduce(
    (sum, station) => sum + station.totalShots,
    0,
  );

  const TableRow = ({ item, isLast = false }) => {
    return (
      <View>
        <Flex
          direction="row"
          jusContent="space-between"
          algItems="center"
          extraStyle={{
            paddingVertical: Sizer.vSize(10),
            paddingHorizontal: Sizer.hSize(20),
          }}
        >
          <Typography
            size={16}
            color={item.labelColor}
            fFamily="barlowSemiBold600"
          >
            {item.label}
          </Typography>

          <Typography
            size={16}
            color={item.labelColor}
            fFamily="barlowSemiBold600"
          >
            {item.value}
          </Typography>
        </Flex>

        {!isLast && (
          <View
            style={{
              height: Sizer.vSize(1),
              backgroundColor: COLORS.primary,
              marginHorizontal: Sizer.hSize(1),
            }}
          />
        )}
      </View>
    );
  };

  return (
    <Container isPadding={false}>
      <Header type="app" title="Round Completed" />
      <View style={[GLOBALSTYLE.paddingHor, { flex: 1 }]}>
        <Label title="Custom Score Card" fFamily={'barlowBold700'} size={20} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Sizer.hSize(50) }}
        >
          <StationsList data={stationsDataList} />
          <View style={styles.tableCont}>
            {statsData.map((item, index) => (
              <TableRow
                key={item.id}
                item={item}
                isLast={index === statsData.length - 1}
              />
            ))}
          </View>
          <Button
            label="Send to ClayMaster"
            mt={24}
            onPress={() =>
              navigation.navigate('SavedScoredcardSuccessScreen', {
                status: 'Scorecard Sent!',
                desc: 'Your new scorecard has been sent to ClayMaster for Analytics processing',
              })
            }
          />
          <Button
            label="Save and Download (DAT)"
            mt={15}
            onPress={() =>
              navigation.navigate('SavedScoredcardSuccessScreen', {
                status: 'Scorecard Saved!!',
                desc: 'Your new scorecard has been saved and is ready to be downloaded into the ClayMaster Detailed Analytics Tool',
              })
            }
          />
        </ScrollView>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  tableCont: {
    backgroundColor: COLORS.white100,
    borderRadius: Sizer.hSize(10),
    borderWidth: Sizer.hSize(1),
    borderColor: COLORS.primary,
    overflow: 'hidden',
  },
});

export default CompleteRoundScreen;
