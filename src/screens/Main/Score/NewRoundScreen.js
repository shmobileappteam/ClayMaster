import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useRef, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
//----
import { Container, Flex, Typography } from '../../../atomComponents';
import {
  BooleanRadioSelector,
  Button,
  ConfirmModal,
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
  createRoundDropData,
  expandedStationCardsObject,
  handleStationChange,
  initialStation,
  pairOfTargets,
  validateLastStation,
  validateRoundData,
} from '../../../constants/dummydata';
import { getClasses, getCourses, postRound } from '../../../api/roundService';
import { useCustomMutation } from '../../../query/useCustomMutation';
import { queryClient } from '../../../api/api';
import { formatBackendErrors, formatDate, showMessage } from '../../../utils';
import { postStations, sendToClayMaster } from '../../../api/stationService';

const NewRoundScreen = ({ navigation, route }) => {
  const roundDetails = route.params?.roundDetails;

  const scrollRef = useRef();

  const [sectionNumber, setSectionNumber] = useState(1);
  const [addStation, setAddStation] = useState([initialStation]);
  // console.log('🚀 ~ NewRoundScreen ~ addStation:', addStation, roundDetails);

  const [confirmVisible, setConfirmVisible] = useState(false);

  //Check if Active/Last Staion shots are fullfiled or not:
  const lastStation = addStation[addStation?.length - 1];
  const IsAllFilled = lastStation?.shots.every(
    shot => shot.result !== '' && shot.result !== 'empty',
  );
  const totalSelectedShots =
    // 100;
    (addStation?.reduce((acc, st) => acc + (st?.selectedTargetPairs || 0), 0) ||
      0) * 2;

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
  const [selectedCourse, setSelectedCourse] = useState('');
  const [noOfPeople, setNoOfPeople] = useState({ label: '1', value: '3' });
  const [squadSequence, setSquadSequence] = useState({
    label: '1',
    value: '1',
  });

  // European Rotation controls
  const [isEuropeanRotation, setIsEuropeanRotation] = useState(false);
  const stationOptions = Array.from({ length: 16 }, (_, i) => {
    const v = String(i + 1);
    return { label: v, value: v };
  });
  const totalStationOptions = Array.from({ length: 7 }, (_, i) => {
    const v = String(10 + i);
    return { label: v, value: v };
  });
  const [startingStation, setStartingStation] = useState({
    label: '1',
    value: '1',
  });
  const [totalStations, setTotalStations] = useState({
    label: '16',
    value: '16',
  });

  const [roundId, setRoundId] = useState('1');

  // Post Round Mutation:
  const { mutateAsync: createRound, isPending } = useCustomMutation({
    mutationFn: postRound,
  });

  //Send to ClayMaster:
  const { mutateAsync: requestSend, isPending: isSendToClayMasterPending } =
    useCustomMutation({
      mutationFn: sendToClayMaster,
    });

  // Post Station Mutation:
  const { mutate: postStationtoDb, isPending: isPendingPostStation } =
    useCustomMutation({
      mutationFn: postStations,
      onSuccess: async () => {
        requestSend(roundDetails?.id || roundId).then(async () => {
          await queryClient
            .invalidateQueries({ queryKey: ['rounds'] })
            .then(() => {
              navigation.replace('CompleteRoundScreen', {
                roundId: roundDetails?.id || roundId,
              });
            });
        });
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
    if (totalSelectedShots == 100) {
      showMessage({
        type: 'danger',
        message:
          'You cannot add more stations because 100 targets have already been completed.',
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

  const formatUsDate = dateLike => {
    const d = dateLike ? new Date(dateLike) : new Date();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  //Request Create Round:
  const HandleContinue = () => {
    if (!selectedCourse) {
      showMessage({
        message: 'Course Name is required!',
        bgColor: COLORS.primary,
      });
      return;
    }
    // Validate Squad Sequence vs Squad Size
    const sequence = parseInt(squadSequence?.value, 10);
    const size = parseInt(noOfPeople?.value, 10);
    if (
      !Number.isFinite(sequence) ||
      !Number.isFinite(size) ||
      sequence < 1 ||
      size < 1
    ) {
      showMessage({
        message: 'Please select a valid Squad Sequence and Squad Size.',
        bgColor: COLORS.primary,
      });
      return;
    }
    if (sequence > size) {
      showMessage({
        message: 'Squad Sequence cannot exceed Squad Size.',
        bgColor: COLORS.primary,
      });
      return;
    }
    // console.log({
    //   course_name: selectedCourse,
    //   ncsca_class: selectedClass,
    //   squad_sequence: squadSequence?.value,
    //   people_in_squad: noOfPeople?.value,
    //   european_rotation: isEuropeanRotation,
    //   starting_station: isEuropeanRotation ? startingStation?.value : 1,
    //   total_stations: isEuropeanRotation ? totalStations?.value : 16,
    // });

    createRound({
      course_name: selectedCourse,
      ncsca_class: selectedClass,
      squad_sequence: squadSequence?.value,
      people_in_squad: noOfPeople?.value,
      european_rotation: !!isEuropeanRotation,
      starting_station: isEuropeanRotation
        ? parseInt(startingStation?.value, 10)
        : 1,
      total_stations: isEuropeanRotation
        ? parseInt(totalStations?.value, 10)
        : 16,
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
      handleStationChange(updated[lastIndex], scrollRef);
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
        handleStationChange({ ...lastStation, traps: updatedTraps }, scrollRef);
        return updated;
      }

      updated[lastIndex] = {
        ...lastStation,
        traps,
      };
      // handleStationChange(updated[lastIndex], scrollRef);
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

      handleStationChange(updated[lastIndex], scrollRef);
      return updated;
    });
  };

  //----
  const handlePressDead = () => {
    const lastStation = addStation[addStation.length - 1];
    const message = validateLastStation(lastStation, false);

    if (message) {
      showMessage({
        type: 'danger',
        message,
        bgColor: COLORS.primary,
      });
      return;
    }

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
    const lastStation = addStation[addStation.length - 1];
    const message = validateLastStation(lastStation, false);

    if (message) {
      showMessage({
        type: 'danger',
        message,
        bgColor: COLORS.primary,
      });
      return;
    }

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
    if (totalSelectedShots != 100) {
      showMessage({
        message: 'Please complete all 100 targets before Completing Round.',
        bgColor: COLORS.primary,
      });
      return;
    }

    setConfirmVisible(true);
  };
  return (
    <Container isPadding={false}>
      <Header
        type="app"
        title="New Round"
        onPresBack={() => {
          navigation.goBack();
        }}
      />
      <View style={[GLOBALSTYLE.paddingHor, { flex: 1 }]}>
        {!roundDetails && sectionNumber == 1 ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
              <Label title="Squad Sequence" />
              <CustomDropdown
                data={createRoundDropData}
                placeholder="Squad Sequence"
                defaultValue={squadSequence}
                onChange={item => {
                  setSquadSequence(item);
                }}
              />

              <Label title="Course Name" />
              <TextField
                placeholder="Course Name"
                handleChange={text => {
                  setSelectedCourse(text);
                }}
                value={selectedCourse}
              />

              <Label title="Squad Size" />
              <CustomDropdown
                data={createRoundDropData}
                placeholder="Squad Size"
                defaultValue={noOfPeople}
                onChange={item => {
                  setNoOfPeople(item);
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

              <Label title="European Rotation?" />

              <BooleanRadioSelector
                onSetBoleanValue={setIsEuropeanRotation}
                boleanValue={isEuropeanRotation}
              />

              {isEuropeanRotation && (
                <SlideInView slide="down">
                  <Label title="Starting Station #" />
                  <CustomDropdown
                    data={stationOptions}
                    placeholder="Starting Station"
                    defaultValue={startingStation}
                    onChange={item => setStartingStation(item)}
                  />

                  <Label title="Total number of stations" />
                  <CustomDropdown
                    data={totalStationOptions}
                    placeholder="Total Stations"
                    defaultValue={totalStations}
                    onChange={item => setTotalStations(item)}
                  />
                </SlideInView>
              )}
            </View>
            <Button
              mb={54}
              mt={24}
              label="Continue"
              onPress={HandleContinue}
              loader={isPending}
            />
          </ScrollView>
        ) : roundDetails || sectionNumber == 2 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            ref={scrollRef}
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
                    roundDetails?.course_name || selectedCourse || 'Course'
                  } ${formatUsDate(roundDetails?.created_at || new Date())}`}
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
                    totalSelectedShots={totalSelectedShots}
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
                  mt={60}
                  loader={isPendingPostStation || isSendToClayMasterPending}
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
                      disabled={IsAllFilled}
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
                      disabled={IsAllFilled}
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

      <ConfirmModal
        visible={confirmVisible}
        setVisibility={setConfirmVisible}
        handleComplete={() => {
          setConfirmVisible(false);
          postStationtoDb({
            roundId: roundDetails?.id || roundId,
            payload: addStation,
          });
        }}
      />
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
