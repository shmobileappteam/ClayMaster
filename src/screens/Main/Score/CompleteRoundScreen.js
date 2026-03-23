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

  // const isFileDownloadable =
  //   stationsDetails?.sent_status && stationsDetails?.download_url;

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <Header type="app" title="Round Completed" />
      <View style={[GLOBALSTYLE.paddingHor, { flex: 1 }]}>
        <View style={{ marginTop: Sizer.vSize(24), marginBottom: Sizer.vSize(16) }}>
            <Label title="Round Summary" fFamily={'barlowBold700'} size={20} color={COLORS.black300} />
        </View>
        
        {isLoading ? (
          <AppLoader />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: Sizer.vSize(120) }}
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
            {stationsDetails?.download_url && (
              <Button
                label={'Download File'}
                mt={24}
                type="secondary"
                onPress={() => {
                  Linking.openURL(stationsDetails?.download_url);
                }}
              />
            )}
            <Button
              label={'Send to ClayMaster'}
              loader={isPending}
              onPress={() => {
                requestSend(roundId).then(() => {
                  queryClient.invalidateQueries({ queryKey: ['rounds'] });
                  navigation.navigate('SavedScoredcardSuccessScreen', {
                    status: 'Scorecard Sent!',
                    desc: 'Your new scorecard has been sent to ClayMaster for Analytics processing',
                  });
                });
                
              }}
              mt={16}
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
});

export default CompleteRoundScreen;
