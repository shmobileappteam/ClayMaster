import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
//----
import { Container, Typography } from '../../../atomComponents';
import {
  Button,
  Header,
  IconButton,
  Label,
  TextField,
} from '../../../components';
import { BASEOPACITY, COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import SlideInView from '../../../animations/SlideView';
import StationsList from '../../../components/Round/StationsList';
const nscaClasses = [
  { name: 'A', selected: false },
  { name: 'AA', selected: false },
  { name: 'A', selected: false },
  { name: 'B', selected: false },
  { name: 'C', selected: false },
  { name: 'D', selected: true },
];

const NewRoundScreen = ({navigation}) => {
  const [sectionNumber, setSectionNumber] = useState(1);

  return (
    <Container isPadding={false}>
      <Header
        type="app"
        title="New Round"
        onPresBack={() => {
          sectionNumber == 2 ? setSectionNumber(1) : navigation.goBack('');
        }}
      />
      <View style={[GLOBALSTYLE.paddingHor, { flex: 1 }]}>
        {sectionNumber == 1 ? (
          <View style={styles.container}>
            <View>
              <Label title="Squad Sequence" />
              <TextField placeholder="Enter sequence" />
              <Label title="Course Name" />
              <TextField placeholder="Enter course name" />
              <Label title="NSCA Class" />
              <View style={styles.nscaClassContainer}>
                {nscaClasses.map(item => (
                  <Box item={item} />
                ))}
              </View>
            </View>
            <Button
              mb={54}
              label="Continue"
              onPress={() => setSectionNumber(2)}
            />
          </View>
        ) : sectionNumber == 2 ? (
          <View
            style={{
              justifyContent: 'space-between',
              flex: 1,
            }}
          >
            <View style={{}}>
              <Label
                title="Custom Score Card"
                fFamily={'barlowBold700'}
                size={20}
              />
              <StationsList
                contStyle={{}}
                data={[
                  {
                    id: 5,
                    name: 'Station 05',
                    hits: 6,
                    missed: 4,
                    totalShots: 10,
                    shots: [
                      { id: 1, status: 'hit' },
                      { id: 2, status: 'hit' },
                      { id: 3, status: 'missed' },
                      { id: 4, status: 'hit' },
                      { id: 5, status: 'missed' },
                      { id: 6, status: 'missed' },
                      { id: 7, status: 'hit' },
                      { id: 8, status: 'missed' },
                      { id: 9, status: 'hit' },
                      { id: 10, status: 'hit' },
                    ],
                    reportPair: 'TP',
                    traps: {
                      chandelle: 'Crosser',
                      incomer: 'Knuckleball/Off-Speed',
                      overhead: 'Quartering',
                      rabbit: 'Tee',
                      tower: 'Rabbit',
                      trapTee: 'Trap Shot',
                    },
                  },
                ]}
              />
              <IconButton text="Add Station" />
            </View>
            <Button
              mb={54}
              label="Complete Record"
              onPress={() => {
                sectionNumber == 2 ? navigation.navigate("CompleteRoundScreen") :
                setSectionNumber(2);
              }}
            />
          </View>
        ) : null}
      </View>
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
  container: {
    justifyContent: 'space-between',
    flex: 1,
  },
  box: {
    width: Sizer.hSize(27),
    height: Sizer.hSize(27),
    backgroundColor: COLORS.white100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Sizer.hSize(5),
  },
  nscaClassContainer: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default NewRoundScreen;
