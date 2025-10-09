import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
//----
import { Container, Flex, Typography } from '../../../atomComponents';
import { Button, Header, Label, TextField } from '../../../components';
import Sizer from '../../../helpers/Sizer';
import { BASEOPACITY, COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
import StationsList from '../../../components/Round/StationsList';
import { stationsDataList } from '../../../constants/dummydata';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { getRound } from '../../../api/roundService';
import AppLoader from '../../../atomComponents/AppLoader';
import { downloadFile } from '../../../utils/downloadFile';

const ScorescoreCardDetailsScreen = ({ route, navigation }) => {
  const roundId = route.params?.roundId;

  //Fetching Round by id query:
  const { data: scoreCardDetails, isLoading } = useCustomQuery({
    queryKey: ['round', roundId],
    queryFn: ({ queryKey }) => getRound(queryKey[1]),
  });
  console.log(
    '🚀 ~ ScorescoreCardDetailsScreen ~ scoreCardDetails:',
    scoreCardDetails,
  );

  const cardType = scoreCardDetails?.download_url ? 'Card Sent' : 'Saved Card';
  const cardStatus =
    scoreCardDetails?.status == 'sent' ? (
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
      <Header
        type="app"
        title={isLoading ? 'Fetching ScoreCard..' : cardType}
      />
      {isLoading ? (
        <AppLoader />
      ) : (
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
              value={String(scoreCardDetails?.squad_sequence)}
              disable={false}
            />
            <Label title="Course Name" />
            <TextField
              placeholder="Enter course name"
              value={scoreCardDetails?.course_name || '- -'}
              disable={false}
            />
            <Label title="Selected NSCA Class" />
            <View style={styles.nscaClassContainer}>
              <Box name={scoreCardDetails?.ncsca_class} />
            </View>
            <Label title="Round Summary" size={20} fFamily="barlowBold700" />
            <StationsList data={stationsDataList} />
            <Button
              label={
                scoreCardDetails?.download_url
                  ? 'Download File'
                  : 'Send to ClayMaster'
              }
              onPress={() => {
                if (scoreCardDetails?.download_url) {
                  downloadFile(scoreCardDetails.download_url, 'Scoresheet');
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
      )}
    </Container>
  );
};

const Box = ({ name }) => {
  return (
    <View style={styles.box}>
      <Typography fFamily="barlowMedium500" color={COLORS.white100}>
        {name}
      </Typography>
    </View>
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
    backgroundColor: COLORS.primary,
  },
});

export default ScorescoreCardDetailsScreen;
