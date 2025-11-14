import {
  BackHandler,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  disableStation,
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
import {
  formatBackendErrors,
  formatDate,
  formatUsDate,
  showMessage,
} from '../../../utils';
import { postStations, sendToClayMaster } from '../../../api/stationService';

const NewRoundScreen = ({ navigation, route }) => {
  const roundDetails = route.params?.roundDetails;
  const scrollRef = useRef();

  const [sectionNumber, setSectionNumber] = useState(1);
  const [addStation, setAddStation] = useState([initialStation]);
  const [isEuropeanRotation, setIsEuropeanRotation] = useState(false);
  const [stationSequence, setStationSequence] = useState([]);
  const [maxStations, setMaxStations] = useState(16);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [backPressModalVisible, setBackPressModalVisible] = useState(false);

  console.log('🚀 ~ NewRoundScreen ~ addStation:', roundDetails);

  //Check if Active/Last Staion shots are fullfiled or not:
  const lastStation = addStation[addStation?.length - 1];
  const IsAllFilled = lastStation?.shots.every(
    shot => shot.result !== '' && shot.result !== 'empty',
  );
  const totalSelectedShots =
    // 100;
    (addStation?.reduce((acc, st) => acc + (st?.selectedTargetPairs || 0), 0) ||
      0) * 2;

  // Calculate current score (dead shots count)
  const currentScore = addStation?.reduce((total, station) => {
    const count =
      station?.shots?.filter(
        shot => shot.result === 'dead' || shot.result === 'lost',
      ).length || 0;

    return total + count;
  }, 0);

  // Check if at least one station has been played (has at least one shot filled)
  const hasPlayedAtLeastOneStation = addStation.some(station =>
    station?.shots?.some(shot => shot.result !== '' && shot.result !== 'empty'),
  );

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

  const [selectedClass, setSelectedClass] = useState(classes?.data?.[0]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [noOfPeople, setNoOfPeople] = useState({ label: '1', value: '3' });
  const [squadSequence, setSquadSequence] = useState({
    label: '1',
    value: '1',
  });

  // European Rotation controls
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

  useEffect(() => {
    if (roundDetails) {
      setRoundId(roundDetails?.id);
      setSectionNumber(2);

      const hasEuropeanRotationFields =
        roundDetails?.european_rotation &&
        roundDetails?.starting_station &&
        roundDetails?.total_stations &&
        Array.isArray(roundDetails?.station_sequence) &&
        roundDetails?.station_sequence?.length > 0;

      if (hasEuropeanRotationFields) {
        // Initialize European rotation flow
        setIsEuropeanRotation(roundDetails?.european_rotation);
        setStartingStation({
          label: String(roundDetails?.starting_station),
          value: String(roundDetails?.starting_station),
        });
        setTotalStations({
          label: String(roundDetails?.total_stations),
          value: String(roundDetails?.total_stations),
        });
        setStationSequence(roundDetails?.station_sequence);
        setMaxStations(
          roundDetails?.total_stations ||
            roundDetails?.station_sequence?.length,
        );

        const firstStationNumber = roundDetails?.station_sequence?.[0];
        setAddStation([
          {
            ...initialStation,
            station_number: firstStationNumber,
            name: `Station ${firstStationNumber}`,
          },
        ]);
        setExpandedStations(prev => ({
          ...prev,
          [firstStationNumber]: true,
        }));
      } else {
        // Normal flow - no European rotation
        setAddStation([
          {
            ...initialStation,
            station_number: 1,
            name: 'Station 1',
          },
        ]);
        setExpandedStations(prev => ({
          ...prev,
          1: true,
        }));
      }
    }
  }, [roundDetails]);

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

    toggleStation(lastStation?.station_number);
    setAddStation(prev => {
      const nextIndex = prev.length;
      const nextStationNumber =
        Array.isArray(stationSequence) && stationSequence.length > 0
          ? stationSequence[nextIndex]
          : nextIndex + 1;

      // Respect total stations limit if provided
      if (
        (Array.isArray(stationSequence) &&
          stationSequence.length > 0 &&
          nextIndex >= (maxStations || stationSequence.length)) ||
        ((!Array.isArray(stationSequence) || stationSequence.length === 0) &&
          typeof maxStations === 'number' &&
          nextIndex >= maxStations)
      ) {
        showMessage({
          message: 'All stations for this round have been added.',
          bgColor: COLORS.primary,
        });
        return prev;
      }

      const newStation = {
        ...initialStation,
        station_number: nextStationNumber,
        name: `Station ${nextStationNumber}`,
      };
      return [...prev, newStation];
    });
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
    //   starting_station: isEuropeanRotation ? startingStation?.value : null,
    //   total_stations: isEuropeanRotation ? totalStations?.value : null,
    // });

    createRound({
      course_name: selectedCourse,
      ncsca_class: selectedClass,
      squad_sequence: squadSequence?.value,
      people_in_squad: noOfPeople?.value,
      european_rotation: isEuropeanRotation,
      starting_station: isEuropeanRotation ? startingStation?.value : null,
      total_stations: isEuropeanRotation ? totalStations?.value : null,
    })
      .then(res => {
        const round = res?.round || {};
        console.log('res: ', res);
        console.log(round);

        setSectionNumber(2);
        setRoundId(round?.id);

        // If backend provides a station sequence and total stations, adopt them
        if (
          Array.isArray(round?.station_sequence) &&
          round?.station_sequence?.length
        ) {
          setStationSequence(round.station_sequence);
          setMaxStations(
            round?.total_stations || round.station_sequence.length,
          );

          // Initialize the first station to the provided starting station
          const firstStationNumber = round.station_sequence[0];
          setAddStation([
            {
              ...initialStation,
              station_number: firstStationNumber,
              name: `Station ${firstStationNumber}`,
            },
          ]);
          setExpandedStations(prev => ({
            ...prev,
            [firstStationNumber]: true,
          }));
        }
        queryClient.invalidateQueries({ queryKey: ['rounds'] });

        // else {
        //   // Default non-European flow
        //   setStationSequence([]);
        //   setMaxStations(16);
        //   // Ensure we start at Station 1
        //   setAddStation([
        //     {
        //       ...initialStation,
        //       station_number: 1,
        //       name: 'Station 1',
        //     },
        //   ]);
        //   setExpandedStations(prev => ({
        //     ...prev,
        //     1: true,
        //   }));
        // }
      })
      .catch(err => {
        showMessage({
          message: err?.response?.data?.message || 'Something went wrong!',
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

  // Handle back navigation
  const handleBackNavigation = useCallback(() => {
    if (hasPlayedAtLeastOneStation && sectionNumber === 2) {
      setBackPressModalVisible(true);
      return true; // Prevent default back action
    }
    navigation.goBack();
    return false;
  }, [hasPlayedAtLeastOneStation, sectionNumber, navigation]);

  useEffect(() => {
    const onBackPress = () => {
      return handleBackNavigation();
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    return () => backHandler.remove();
  }, [handleBackNavigation]);

  return (
    <Container isPadding={false}>
      <Header type="app" title="New Round" onPresBack={handleBackNavigation} />
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
                    isDisabled={disableStation(
                      index,
                      addStation,
                      isEuropeanRotation,
                    )}
                    // isDisabled={station?.station_number !== addStation?.length}
                    totalSelectedShots={totalSelectedShots}
                    maxStations={maxStations}
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

      <ConfirmModal
        visible={backPressModalVisible}
        setVisibility={setBackPressModalVisible}
        title="Leave Round?"
        message={`Your current score is ${currentScore} shot${
          currentScore !== 1 ? 's' : ''
        }. If you leave now, your progress won't be saved.`}
        confirmText="Stay"
        cancelText="Leave"
        handleCancel={() => {
          navigation.goBack();
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
