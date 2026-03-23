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

  // console.log('scoreCardDetails: ', scoreCardDetails);

  //Send to ClayMaster:
  const { mutateAsync: requestSend, isPending } = useCustomMutation({
    mutationFn: sendToClayMaster,
  });
  const isSentToClayMaster = scoreCardDetails?.sent_status;

  const cardType = isSentToClayMaster ? 'Card Sent' : 'Saved Card';

  const cardStatus = scoreCardDetails?.status !== 'sent' && (
    <Flex
      jusContent={'space-between'}
      mT={24}
      mB={16}
      extraStyle={styles.cardStatusContainer}
    >
      <View style={styles.horLine} />
      <Typography fFamily="barlowBold700" color={COLORS.black300}>
        Card is ready to send to ClayMaster{' '}
      </Typography>
      <View />
    </Flex>
  );

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
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
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View>
            {cardStatus}
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
            <View style={{ marginTop: Sizer.vSize(32), marginBottom: Sizer.vSize(16) }}>
                <Label title="Round Summary" size={20} fFamily="barlowBold700" color={COLORS.black300} />
            </View>
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

            {scoreCardDetails?.download_url && (
              <Button
                label={'Download File'}
                mt={24}
                type="secondary"
                onPress={() => {
                  Linking.openURL(scoreCardDetails?.download_url);
                }}
              />
            )}
            <Button
              label={
                isSentToClayMaster
                  ? 'Already Sent to ClayMaster!'
                  : 'Send to ClayMaster'
              }
              disabled={isSentToClayMaster}
              loader={isPending}
              textStyle={{ textTransform: 'none' }}
              onPress={() => {
                if (!isSentToClayMaster) {
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
      <Typography fFamily="barlowBold700" color={COLORS.white100} size={14}>
        {name}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  cardStatusContainer: {
    paddingVertical: Sizer.vSize(12),
    paddingHorizontal: Sizer.hSize(16),
    backgroundColor: COLORS.white100,
    borderLeftWidth: Sizer.hSize(4),
    borderLeftColor: COLORS.orange400 || COLORS.primary,
    borderRadius: Sizer.hSize(8),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  nscaClassContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: Sizer.vSize(8),
  },
  box: {
    paddingVertical: Sizer.vSize(6),
    paddingHorizontal: Sizer.hSize(16),
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Sizer.hSize(8),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tableCont: {
    backgroundColor: COLORS.white100,
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    marginTop: Sizer.vSize(16),
  },
  horLine: {
      display: 'none',
  }
});

export default ScorescoreCardDetailsScreen;
