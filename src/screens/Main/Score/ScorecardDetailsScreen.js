import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
import { Container, Typography, AppLoader } from '../../../atomComponents';
import { Button, Header, Label, TextField } from '../../../components';
import Sizer from '../../../helpers/Sizer';
import { COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
import StationsList from '../../../components/Round/StationsList';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { getRound } from '../../../api/roundService';
import TableRow from '../../_partials/Round/TableRow';

const ScorescoreCardDetailsScreen = ({ route, navigation }) => {
  const roundId = route.params?.roundId;

  const { data: scoreCardDetails, isLoading } = useCustomQuery({
    queryKey: ['round', roundId],
    queryFn: ({ queryKey }) => getRound(queryKey[1]),
  });

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <Header
        type="app"
        title={isLoading ? 'Fetching ScoreCard..' : 'Round Details'}
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
            <Label title="Squad Sequence" />
            <TextField
              placeholder="Enter sequence"
              value={String(scoreCardDetails?.squad_sequence ?? '')}
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
            <View
              style={{
                marginTop: Sizer.vSize(32),
                marginBottom: Sizer.vSize(16),
              }}
            >
              <Label
                title="Round Summary"
                size={20}
                fFamily="barlowBold700"
                color={COLORS.black300}
              />
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

            {scoreCardDetails?.download_url ? (
              <Button
                label={'Download File'}
                mt={24}
                type="secondary"
                onPress={() => Linking.openURL(scoreCardDetails?.download_url)}
              />
            ) : null}
            <Button
              label="Done"
              mt={16}
              onPress={() => navigation.goBack()}
            />
          </View>
        </ScrollView>
      )}
    </Container>
  );
};

const Box = ({ name }) => (
  <View style={styles.box}>
    <Typography fFamily="barlowBold700" color={COLORS.white100} size={14}>
      {name}
    </Typography>
  </View>
);

const styles = StyleSheet.create({
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
  },
  tableCont: {
    backgroundColor: COLORS.white100,
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
    marginTop: Sizer.vSize(16),
  },
});

export default ScorescoreCardDetailsScreen;
