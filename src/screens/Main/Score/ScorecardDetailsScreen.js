import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
//----
import { Container, Flex, Typography } from '../../../atomComponents';
import { Button, Header, Label, TextField } from '../../../components';
import Sizer from '../../../helpers/Sizer';
import { COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
import StationsList from '../../../components/Round/StationsList';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { getRound } from '../../../api/roundService';
import AppLoader from '../../../atomComponents/AppLoader';
import { useCustomMutation } from '../../../query/useCustomMutation';
import { sendToClayMaster } from '../../../api/stationService';
import { queryClient } from '../../../api/api';
import TableRow from '../../_partials/Round/TableRow';

const ScorescoreCardDetailsScreen = ({ route, navigation }) => {
  const roundId = route.params?.roundId;
  // console.log('🚀 ~ ScorescoreCardDetailsScreen ~ roundId:', roundId);

  //Fetching Round by id query:
  const { data: scoreCardDetails, isLoading } = useCustomQuery({
    queryKey: ['round', roundId],
    queryFn: ({ queryKey }) => getRound(queryKey[1]),
  });

  //Send to ClayMaster:
  const { mutateAsync: requestSend, isPending } = useCustomMutation({
    mutationFn: sendToClayMaster,
  });

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

  const isFileDownloadable =
    scoreCardDetails?.sent_status && scoreCardDetails?.download_url;

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
            <StationsList
              data={scoreCardDetails?.stations}
              isEuropeanRoration={scoreCardDetails?.european_rotation || false}
            />
            <View style={styles.tableCont}>
              <TableRow
                label={'Total Dead'}
                value={scoreCardDetails?.stats?.dead}
              />
              <TableRow
                label={'Total Lost'}
                value={scoreCardDetails?.stats?.lost}
              />
              <TableRow
                label={'Total Targets'}
                value={scoreCardDetails?.stats?.total}
                isLast={true}
              />
            </View>
            <Button
              label={'Send to Clay Master'}
              loader={isPending}
              onPress={() => {
                navigation.navigate('SavedScoredcardSuccessScreen', {
                  status: 'Scorecard Sent!',
                  desc: 'Your new scorecard has been sent to ClayMaster for Analytics processing',
                });
              }}
              mt={24}
            />
            <Button
              label={
                isFileDownloadable ? 'Download File' : 'Send to Clay Master'
              }
              loader={isPending}
              onPress={() => {
                if (isFileDownloadable) {
                  Linking.openURL(scoreCardDetails?.download_url);
                  // Linking.openURL('https://demoappprojects.com/Sample.xls');
                } else {
                  requestSend(roundId).then(() => {
                    queryClient.invalidateQueries({ queryKey: ['rounds'] });
                    navigation.navigate('SavedScoredcardSuccessScreen', {
                      status: 'Scorecard Sent!',
                      desc: 'Your new scorecard has been sent to ClayMaster for Analytics processing',
                    });
                  });
                }
              }}
              mt={16}
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
    height: Sizer.hSize(27),
    paddingHorizontal: Sizer.hSize(8),
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Sizer.hSize(5),
  },
  tableCont: {
    backgroundColor: COLORS.white100,
    borderRadius: Sizer.hSize(10),
    borderWidth: Sizer.hSize(1),
    borderColor: COLORS.primary,
    overflow: 'hidden',
  },
});

export default ScorescoreCardDetailsScreen;
