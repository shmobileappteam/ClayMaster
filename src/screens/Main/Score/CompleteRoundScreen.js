import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
//----
import { Container, Flex, Typography } from '../../../atomComponents';
import { Button, Header, Label } from '../../../components';
import StationsList from '../../../components/Round/StationsList';
import { COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import TableRow from '../../_partials/Round/TableRow';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { getRound } from '../../../api/roundService';
import AppLoader from '../../../atomComponents/AppLoader';
import { sendToClayMaster } from '../../../api/stationService';
import { useCustomMutation } from '../../../query/useCustomMutation';
import { queryClient } from '../../../api/api';

const CompleteRoundScreen = ({ navigation, route }) => {
  const roundId = route.params?.roundId;
  // console.log('🚀 ~ CompleteRoundScreen ~ roundId:', roundId);

  //Fetching Round Details by id query:
  const { data: stationsDetails, isLoading } = useCustomQuery({
    queryKey: ['round', roundId],
    queryFn: ({ queryKey }) => getRound(queryKey[1]),
  });
  console.log('🚀 ~ CompleteRoundScreen ~ stationsDetails:', stationsDetails);

  //Send to ClayMaster:
  const { mutateAsync: requestSend, isPending } = useCustomMutation({
    mutationFn: sendToClayMaster,
  });

  const isFileDownloadable =
    stationsDetails?.sent_status && stationsDetails?.download_url;

  return (
    <Container isPadding={false}>
      <Header type="app" title="Round Completed" />
      <View style={[GLOBALSTYLE.paddingHor, { flex: 1 }]}>
        <Label title="Round Summary" fFamily={'barlowBold700'} size={20} />
        {isLoading ? (
          <AppLoader />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: Sizer.hSize(50) }}
          >
            <StationsList
              data={stationsDetails?.stations}
              isEuropeanRoration={stationsDetails?.european_rotation || false}
            />
            <View style={styles.tableCont}>
              {/* {statsData.map((item, index) => ( */}
              <TableRow
                label={'Total Dead'}
                value={stationsDetails?.stats?.dead}
              />
              <TableRow
                label={'Total Lost'}
                value={stationsDetails?.stats?.lost}
              />
              <TableRow
                label={'Total Targets'}
                value={stationsDetails?.stats?.total}
                isLast={true}
              />
              {/* ))} */}
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
              mt={16}
              disabled={isPending}
              loader={isPending}
              onPress={() => {
                if (isFileDownloadable) {
                  Linking.openURL(stationsDetails?.download_url);
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
            />
          </ScrollView>
        )}
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
