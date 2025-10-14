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
import StationCard from '../../../components/Round/StationCard';
import { CircleSvg, SlashSvg, UndoSvg } from '../../../assets/svgs';
import {
  expandedStationCardsObject,
  initialStation,
  pairOfTargets,
  validateLastStation,
} from '../../../constants/dummydata';
import { getClasses, getCourses, postRound } from '../../../api/roundService';
import { useCustomMutation } from '../../../query/useCustomMutation';
import { queryClient } from '../../../api/api';
import {
  formatBackendErrors,
  formatDate,
  showMessage,
} from '../../../utils';
import { postStations } from '../../../api/stationService';

const NewRoundScreen = ({ navigation, route }) => {
  const roundDetails = route.params?.roundDetails;
  console.log('🚀 ~ NewRoundScreen ~ roundDetails:', roundDetails);

  const [sectionNumber, setSectionNumber] = useState(1);
  const [addStation, setAddStation] = useState([initialStation]);

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
  const [roundId, setRoundId] = useState('1');

  // Post Round Mutation:
  const { mutateAsync: createRound, isPending } = useCustomMutation({
    mutationFn: postRound,
  });

  // Post Station Mutation:
  const { mutateAsync: postStationtoDb, isPending: isPendingPostStation } =
    useCustomMutation({
      mutationFn: postStations,
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
    const lastStation = addStation[addStation.length - 1];
    const message = validateLastStation(lastStation);

    if (message) {
      showMessage({
        type: 'danger',
        message,
        bgColor: COLORS.primary,
      });
      return;
    }

    // All good
    toggleStation(lastStation?.station_number);

    setAddStation(prev => {
      const newStation = {
        ...initialStation,
        station_number: prev.length + 1,
        name: `Station ${prev.length + 1}`,
      };
      return [...prev, newStation];
    });
  };

  //Request Create Round:
  const HandleContinue = () => {
    createRound({
      course_name: selectedCourse?.label,
      ncsca_class: selectedClass,
      squad_sequence: squadSequence,
    })
      .then(res => {
        setSectionNumber(2);
        setRoundId(res?.round?.id);
        queryClient.invalidateQueries({ queryKey: ['rounds'] });
      })
      .catch(err => {
        const response = err?.response;
        const parsedErrors = formatBackendErrors(response?.data?.errors);
        showMessage({
          message: parsedErrors?.squad_sequence,
          bgColor: COLORS.primary,
        });
      });
  };

  const handleSetPairType = pairType => {
    setAddStation(prev => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      updated[lastIndex] = { ...updated[lastIndex], pair_type: pairType };
      return updated;
    });
  };

  const HandleSelectedTrapsData = (data, trapId, type = 'id') => {
    setAddStation(prev => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      const lastStation = updated[lastIndex];
      const traps = [...lastStation.traps];

      if (type === 'id') {
        const exists = traps.some(trap => trap.trap_id === data.trap_id);
        if (!exists) {
          traps.push(data);
        }
      } else if (type === 'presentation') {
        const updatedTraps = traps.map(trap =>
          trap.trap_id === trapId ? { ...trap, presentation: data.slug } : trap,
        );
        updated.splice(lastIndex, 1, { ...lastStation, traps: updatedTraps });
        return updated;
      }

      updated[lastIndex] = {
        ...lastStation,
        traps,
      };

      return updated;
    });
  };

  const HandleSetShotsData = shotsData => {
    setAddStation(prev => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      updated[lastIndex] = {
        ...updated[lastIndex],
        shots: shotsData,
      };

      return updated;
    });
  };

  const handleSelectedTargetPairs = targetPair => {
    setAddStation(prev => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      // Deep copy pairOfTargets[targetPair] to avoid reference sharing
      const newShots = pairOfTargets[targetPair].map(shot => ({ ...shot }));
      updated[lastIndex] = {
        ...updated[lastIndex],
        selectedTargetPairs: targetPair,
        shots: newShots,
      };

      return updated;
    });
  };

  const handlePressDead = () => {
    setAddStation(prev => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      const lastStation = updated[lastIndex];
      const shots = [...lastStation.shots];

      const nextIndex = shots.findIndex(item => item.result === 'empty');
      if (nextIndex !== -1) {
        shots[nextIndex].result = 'dead';
      }

      updated[lastIndex] = { ...lastStation, shots };
      return updated;
    });
  };

  const handlePressLost = () => {
    setAddStation(prev => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      const lastStation = updated[lastIndex];
      const shots = [...lastStation.shots];

      const nextIndex = shots.findIndex(item => item.result === 'empty');
      if (nextIndex !== -1) {
        shots[nextIndex].result = 'lost';
      }

      updated[lastIndex] = { ...lastStation, shots };
      return updated;
    });
  };

  const handleUndo = () => {
    setAddStation(prev => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      const lastStation = updated[lastIndex];
      const shots = [...lastStation.shots];

      const lastFilledIndex = [...shots]
        .reverse()
        .findIndex(item => item.result !== 'empty');

      if (lastFilledIndex !== -1) {
        const realIndex = shots.length - 1 - lastFilledIndex;
        shots[realIndex].result = 'empty';
      }

      updated[lastIndex] = { ...lastStation, shots };
      return updated;
    });
  };

  //Handle Complete Round Post:
  const handleCompleteRound = () => {
    const lastStation = addStation[addStation.length - 1];
    const message = validateLastStation(lastStation);
    if (message) {
      showMessage({
        type: 'danger',
        message,
        bgColor: COLORS.primary,
      });
      return;
    }

    postStationtoDb({
      roundId: roundDetails?.id || roundId,
      payload: addStation,
    }).then(() => {
      queryClient.invalidateQueries({ queryKey: ['rounds'] });
      navigation.replace('CompleteRoundScreen', {
        roundId: roundDetails?.id || roundId,
      });
    });
  };
  return (
    <Container isPadding={false}>
      <Header
        type="app"
        title="New Round"
        onPresBack={() => {
          // sectionNumber == 2 ? setSectionNumber(1) :
          navigation.goBack();
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

                {addStation.map((station, index) => (
                  <StationCard
                    key={index}
                    station={station}
                    isExpanded={expandedStations[station?.station_number]}
                    onToggle={() => toggleStation(station?.station_number)}
                    onSetPairType={handleSetPairType}
                    onSetTrapsData={HandleSelectedTrapsData}
                    onSetShotsData={HandleSetShotsData}
                    onSetSelectedTargetPairs={handleSelectedTargetPairs}
                    isDisabled={station?.station_number !== addStation?.length}
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
                  disabled={isPendingPostStation}
                  loader={isPendingPostStation}
                  onPress={() => {
                    sectionNumber == 2
                      ? handleCompleteRound()
                      : setSectionNumber(2);
                  }}
                />
                <SlideInView slide="down" slideDuration={700}>
                  <Flex gap={10} mB={34}>
                    <TouchableOpacity
                      activeOpacity={BASEOPACITY}
                      onPress={handleUndo}
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
                      onPress={handlePressDead}
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
                      onPress={handlePressLost}
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
