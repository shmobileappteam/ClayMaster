import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
//----
import { Container, Flex, Typography } from '../../../atomComponents';
import {
  Button,
  CustomDropdown,
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
import { CircleSvg, SlashSvg, UndoSvg } from '../../../assets/svgs';
import {
  expandedStationCardsObject,
  stationsData,
} from '../../../constants/dummydata';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { getClasses, getCourses, postRound } from '../../../api/roundService';
import { useCustomMutation } from '../../../query/useCustomMutation';
import { queryClient } from '../../../api/api';
import { formatDate } from '../../../utils';

const NewRoundScreen = ({ navigation, route }) => {
  const roundDetails = route.params?.roundDetails;
  console.log('🚀 ~ NewRoundScreen ~ roundDetails:', roundDetails);

  const [sectionNumber, setSectionNumber] = useState(1);
  const [addStation, setAddStation] = useState([stationsData[0]]);

  // Feetching Queries for Courses and Classes:
  const responses = useQueries({
    queries: [
      {
        queryKey: ['courses'],
        queryFn: getCourses,
      },
      {
        queryKey: ['classes'],
        queryFn: getClasses,
      },
    ],
  });

  const [courses, classes] = responses;
  const coursesData = courses?.data
    ? courses?.data.map(item => ({ label: item, value: item }))
    : [];

  const [selectedClass, setSelectedClass] = useState(classes?.data?.[0]);
  const [selectedCourse, setSelectedCourse] = useState(coursesData?.[0]);
  const [squadSequence, setSquadSequence] = useState('1');

  // Post Round Mutation:
  const { mutateAsync: createRound, isPending } = useCustomMutation({
    mutationFn: postRound,
    onSuccess: res => {
      console.log('🚀 ~ NewRoundScreen ~ res:', res);
    },
  });

  const [expandedStations, setExpandedStations] = useState(
    expandedStationCardsObject,
  );

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

  //Request Create Round:
  const HandleContinue = () => {
    createRound({
      course_name: selectedCourse?.label,
      squad_sequence: selectedClass,
      squad_sequence: squadSequence,
    }).then(() => {
      setSectionNumber(2);
      queryClient.invalidateQueries({ queryKey: ['rounds'] });
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
        {!roundDetails && sectionNumber == 1 ? (
          <View style={styles.container}>
            <View>
              <Label title="Squad Sequence" />
              <TextField
                placeholder="Enter sequence"
                defaultValue="2"
                handleChange={text => {
                  setSquadSequence(text);
                }}
                value={squadSequence}
              />
              <Label title="Course Name" />

              <CustomDropdown
                data={coursesData}
                placeholder="Course Name"
                defaultValue={selectedCourse}
                onChange={item => {
                  console.log('🚀 ~ item:', item);
                  setSelectedCourse(item);
                }}
              />
              <Label title="Your Current NSCA Class" />
              <View style={styles.nscaClassContainer}>
                {classes?.data &&
                  classes?.data.map((item, index) => (
                    <Box
                      item={item}
                      key={index}
                      onSelectClass={setSelectedClass}
                      selectedClass={selectedClass}
                    />
                  ))}
              </View>
            </View>
            <Button
              mb={54}
              label="Continue"
              onPress={HandleContinue}
              disabled={isPending}
              loader={isPending}
              // onPress={() => setSectionNumber(2)}
            />
          </View>
        ) : roundDetails || sectionNumber == 2 ? (
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
                  title={`${
                    roundDetails?.course_name || 'Course'
                  } - ${formatDate(roundDetails?.created_at)} Scorecard`}
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
                        { backgroundColor: COLORS.grey100, flex: 0.6 },
                      ]}
                    >
                      <UndoSvg color={COLORS.black100} />
                      <Typography
                        color={COLORS.black100}
                        fFamily="barlowSemiBold600"
                        mT={5}
                        size={18}
                      >
                        Undo
                      </Typography>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={BASEOPACITY}
                      style={styles.actionBxo}
                    >
                      <SlashSvg />
                      <Typography
                        color={COLORS.white100}
                        fFamily="barlowSemiBold600"
                        size={18}
                        mT={5}
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
                      <CircleSvg />
                      <Typography
                        color={COLORS.white100}
                        fFamily="barlowSemiBold600"
                        size={18}
                        mT={5}
                      >
                        Lost
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

const Box = ({ item, selectedClass, onSelectClass }) => {
  console.log('🚀 ~ Box ~ selectedClass:', selectedClass);
  return (
    <TouchableOpacity
      activeOpacity={BASEOPACITY}
      style={[
        styles.box,
        item == selectedClass && { backgroundColor: COLORS.primary },
      ]}
      onPress={() => {
        onSelectClass(item);
      }}
    >
      <Typography
        fFamily="barlowMedium500"
        color={item == selectedClass ? COLORS.white100 : COLORS.black100}
      >
        {item}
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
    // width: Sizer.hSize(27),
    height: Sizer.hSize(27),
    paddingHorizontal: Sizer.hSize(8),
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
