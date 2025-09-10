import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
//----
import { Container, Flex, Typography } from '../../../atomComponents';
import { Button, Header, Label, TextField } from '../../../components';
import Sizer from '../../../helpers/Sizer';
import { BASEOPACITY, COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
import StationsList from '../../../components/Round/StationsList';
import { stationsData } from '../../../constants/dummydata';
import { ScrollView } from 'react-native-gesture-handler';

const nscaClasses = [{ name: 'D', selected: true }];
const ScorecardDetailsScreen = ({ route, navigation }) => {
  const cardDetails = route.params?.cardDetails;
  console.log('🚀 ~ ScorecardDetailsScreen ~ cardDetails:', cardDetails);
  const cardType = cardDetails?.status == 'sent' ? 'Card Sent' : 'Saved Card';
  const cardStatus =
    cardDetails?.status == 'sent' ? (
      <Typography fFamily="barlowMedium500">
        Analytics file is ready to{' '}
        <Typography fFamily="barlowBold700">download</Typography>
      </Typography>
    ) : (
      <Typography fFamily="barlowMedium500">
        Card is ready to send to ClayMaster{' '}
      </Typography>
    );

  return (
    <Container isPadding={false}>
      <Header type="app" title={cardType} />
      <ScrollView
        style={GLOBALSTYLE.paddingHor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Flex
          jusContent={'space-between'}
          mT={35}
          extraStyle={styles.cardStatusContainer}
        >
          <View style={styles.horLine} />
          {cardStatus}
          <View />
        </Flex>
        <View>
          <Label title="Squad Sequence" />
          <TextField
            placeholder="Enter sequence"
            defaultValue="2"
            disable={false}
          />
          <Label title="Course Name" />
          <TextField
            placeholder="Enter course name"
            defaultValue={cardDetails.title}
            disable={false}
          />
          <Label title="Selected NSCA Class" />
          <View style={styles.nscaClassContainer}>
            {nscaClasses.map((item, index) => (
              <Box item={item} key={index} />
            ))}
          </View>
          <Label title="Round Summary" size={20} fFamily="barlowBold700" />
          <StationsList data={stationsData} />
          <Button
            label={
              cardDetails?.status == 'sent'
                ? 'Download File'
                : 'Send to ClayMaster'
            }
            onPress={() => {
              if (cardDetails?.status === 'sent') {
                navigation.goBack();
              } else {
                navigation.navigate('SavedScoredcardSuccessScreen', {
                  status: 'Scorecard Sent!',
                  desc: 'Your new scorecard has been sent to ClayMaster for Analytics processing',
                });
              }
            }}
            mt={24}
          />
        </View>
      </ScrollView>
    </Container>
  );
};

const Box = ({ item }) => {
  return (
    <TouchableOpacity
      activeOpacity={BASEOPACITY}
      style={[styles.box, item.selected && { backgroundColor: COLORS.primary }]}
    >
      <Typography
        fFamily="barlowMedium500"
        color={item.selected ? COLORS.white100 : COLORS.black100}
      >
        {item.name}
      </Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardStatusContainer: {
    paddingVertical: Sizer.hSize(6),
    backgroundColor: COLORS.orange300,
    borderLeftWidth: Sizer.hSize(3),
    borderLeftColor: COLORS.primary,
    borderRightWidth: Sizer.hSize(3),
    borderRightColor: COLORS.primary,
  },
  nscaClassContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  box: {
    width: Sizer.hSize(27),
    height: Sizer.hSize(27),
    backgroundColor: COLORS.white100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Sizer.hSize(5),
  },
});

export default ScorecardDetailsScreen;
