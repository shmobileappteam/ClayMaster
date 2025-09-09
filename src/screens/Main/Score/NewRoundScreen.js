import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
//----
import { Container, Flex, Typography } from '../../../atomComponents';
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
import Icon from '../../../helpers/Icon';
import StationCard from '../../../components/Round/StationCard';

const nscaClasses = [
  { name: 'A', selected: false },
  { name: 'AA', selected: false },
  { name: 'A', selected: false },
  { name: 'B', selected: false },
  { name: 'C', selected: false },
  { name: 'D', selected: true },
  { name: 'N/A', selected: false },
];

const NewRoundScreen = ({ navigation }) => {
  const [sectionNumber, setSectionNumber] = useState(1);
  const [addStation, setAddStation] = useState([
    {
      id: 1,
      name: 'Station 01',
      hits: 6,
      missed: 4,
      totalShots: 10,
      shots: [
        { id: 1, status: 'hit' }, // orange
        { id: 2, status: 'hit' }, // orange
        { id: 3, status: 'missed' }, // grey
        { id: 4, status: 'hit' }, // orange
        { id: 5, status: 'missed' }, // grey
        { id: 6, status: 'missed' }, // grey
        { id: 7, status: 'empty' }, // orange
        { id: 8, status: 'missed' }, // grey
        { id: 9, status: 'hit' }, // orange
        { id: 10, status: 'hit' }, // orange
      ],
      reportPair: 'TP', // TP or RF
      traps: {
        chandelle: 'Crosser',
        incomer: 'Knuckleball/Off-Speed',
        overhead: 'Quartering',
        rabbit: 'Tee',
        tower: 'Rabbit',
        trapTee: 'Trap Shot',
      },
    },
  ]);

  const [expandedStations, setExpandedStations] = useState({});

  const toggleStation = stationId => {
    setExpandedStations(prev => ({
      ...prev,
      [stationId]: !prev[stationId],
    }));
  };

  const HandleAddStation = () => {
    setAddStation(prev => {
      const lastStation = prev[prev.length - 1];
      const newStation = {
        ...lastStation,
        id: prev.length + 1,
        name: `Station 0${prev.length + 1}`,
      };
      return [...prev, newStation];
    });
  };

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
              <TextField placeholder="Enter sequence" defaultValue="2" />
              <Label title="Course Name" />
              <TextField
                placeholder="Enter course name"
                defaultValue="Saltwaters Black Course"
              />
              <Label title="Your Current NSCA Class" />
              <View style={styles.nscaClassContainer}>
                {nscaClasses.map((item, index) => (
                  <Box item={item} key={index} />
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View
              style={{
                justifyContent: 'space-between',
                flex: 1,
              }}
            >
              <View style={{}}>
                <Label
                  title="Saltwaters Black Course - 9/4/25 Scorecard"
                  fFamily={'barlowBold700'}
                  size={18}
                />

                {addStation.map(station => (
                  <StationCard
                    key={station.id}
                    station={station}
                    isExpanded={expandedStations[station.id]}
                    onToggle={() => toggleStation(station.id)}
                  />
                ))}
                <View style={{ alignSelf: 'flex-start' }}>
                  <IconButton
                    text="Add Station"
                    contStyle={{
                      paddingVertical: Sizer.hSize(7),
                      paddingHorizontal: Sizer.hSize(9),
                      borderRadius: Sizer.hSize(5),
                    }}
                    iconStyle={{ size: Sizer.hSize(12) }}
                    textStyle={{ size: Sizer.hSize(14) }}
                    onPress={HandleAddStation}
                  />
                </View>
              </View>
              <View>
                <Button
                  mb={13}
                  label="Complete Record"
                  mt={100}
                  onPress={() => {
                    sectionNumber == 2
                      ? navigation.navigate('CompleteRoundScreen')
                      : setSectionNumber(2);
                  }}
                />
                <SlideInView slide="down" slideDuration={700}>
                  <Flex gap={10} mB={34}>
                    <TouchableOpacity
                      activeOpacity={BASEOPACITY}
                      style={[
                        styles.actionBxo,
                        { backgroundColor: COLORS.grey900, flex: 0.6 },
                      ]}
                    >
                      <Icon
                        name={'undo'}
                        iconFamily={'Lucide'}
                        color={COLORS.white100}
                        size={22}
                      />
                      <Typography
                        color={COLORS.white100}
                        fFamily="barlowSemiBold600"
                        size={18}
                      >
                        Undo
                      </Typography>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={BASEOPACITY}
                      style={styles.actionBxo}
                    >
                      <Icon
                        name={'slash'}
                        iconFamily={'Lucide'}
                        color={COLORS.white100}
                        size={22}
                      />
                      <Typography
                        color={COLORS.white100}
                        fFamily="barlowSemiBold600"
                        size={18}
                      >
                        Dead
                      </Typography>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={BASEOPACITY}
                      style={[
                        styles.actionBxo,
                        { backgroundColor: COLORS.black500 },
                      ]}
                    >
                      <Icon
                        name={'circle'}
                        iconFamily={'Lucide'}
                        color={COLORS.white100}
                        size={22}
                      />
                      <Typography
                        color={COLORS.white100}
                        fFamily="barlowSemiBold600"
                        size={18}
                      >
                        Undo
                      </Typography>
                    </TouchableOpacity>
                  </Flex>
                </SlideInView>
              </View>
            </View>
          </ScrollView>
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
  actionBxo: {
    height: Sizer.hSize(134),
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NewRoundScreen;
