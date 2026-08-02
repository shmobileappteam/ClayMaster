import {
  BackHandler,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Container, Typography } from '../../../atomComponents';
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
import {
  BASEOPACITY,
  COLORS,
  FONTS,
  GLOBALSTYLE,
} from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import SlideInView from '../../../animations/SlideView';
import StationCard from '../../../components/Round/StationCard';
import { UndoSvg } from '../../../assets/svgs';
import Icon from '../../../helpers/Icon';
import {
  createRoundDropData,
  disableStation,
  expandedStationCardsObject,
  handleStationChange,
  initialStation,
  pairOfTargets,
  validateLastStation,
} from '../../../constants/dummydata';
import {
  buildActiveDraft,
  buildStationsPayload,
} from '../../../constants/rounds';
import { getClasses, postRound } from '../../../api/roundService';
import { useCustomMutation } from '../../../query/useCustomMutation';
import { queryClient } from '../../../api/api';
import { formatUsDate, showMessage } from '../../../utils';
import { getTraps, postStations } from '../../../api/stationService';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { useAppMode } from '../../../context/AppModeContext';
import { resetToFieldMode } from '../../../navigation/navigationHelpers';
import CourseLayout from '../../../components/course/CourseLayout';

const NewRoundScreen = ({ navigation, route }) => {
  const roundDetails = route.params?.roundDetails;
  const fromDraft = route.params?.fromDraft;
  const { activeRound, setActiveDraft, updateDraftStations, clearRound } =
    useAppMode();

  const scrollRef = useRef();
  const stationLayoutsRef = useRef({});
  const pendingScrollRef = useRef(null);
  const hydratedRef = useRef(false);

  const [sectionNumber, setSectionNumber] = useState(1);
  const [addStation, setAddStation] = useState([initialStation]);
  const [isEuropeanRotation, setIsEuropeanRotation] = useState(false);
  const [stationSequence, setStationSequence] = useState([]);
  const [maxStations, setMaxStations] = useState(16);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [backPressModalVisible, setBackPressModalVisible] = useState(false);
  const [incompleteCompleteVisible, setIncompleteCompleteVisible] =
    useState(false);
  const [isLeaveGameModalVisible, setIsLeaveGameModalVisible] = useState(false);

  const lastStation = addStation[addStation?.length - 1];
  const IsAllFilled = lastStation?.shots?.every(
    shot => shot.result !== '' && shot.result !== 'empty',
  );
  const totalSelectedShots =
    (addStation?.reduce((acc, st) => acc + (st?.selectedTargetPairs || 0), 0) ||
      0) * 2;

  const hasPlayedAtLeastOneStation = addStation.some(station =>
    station?.shots?.some(shot => shot.result !== '' && shot.result !== 'empty'),
  );

  const { data: classes } = useCustomQuery({
    queryKey: ['classes'],
    queryFn: getClasses,
  });
  const { data: trapsData } = useCustomQuery({
    queryKey: ['traps'],
    queryFn: getTraps,
  });

  const [selectedClass, setSelectedClass] = useState(classes?.[0] || 'Master');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [noOfPeople, setNoOfPeople] = useState({ label: '1', value: '3' });
  const [squadSequence, setSquadSequence] = useState({
    label: '1',
    value: '1',
  });

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
  const [roundId, setRoundId] = useState(null);
  const [expandedStations, setExpandedStations] = useState(
    expandedStationCardsObject,
  );


  // Station play lives on dark Field CourseRoundScreen
  useEffect(() => {
    if ((fromDraft || roundDetails) && activeRound?.roundId) {
      navigation.replace('CourseRoundScreen');
    }
  }, [fromDraft, roundDetails, activeRound?.roundId, navigation]);

  const goToFieldHome = useCallback(() => {
    resetToFieldMode(navigation, 'CourseHomeScreen');
  }, [navigation]);

  // Hydrate from MMKV draft or route roundDetails
  useEffect(() => {
    if (hydratedRef.current) return;

    const draftMatches =
      fromDraft &&
      activeRound?.roundId &&
      (!roundDetails?.id || activeRound.roundId === roundDetails.id) &&
      Array.isArray(activeRound.stations) &&
      activeRound.stations.length;

    if (draftMatches) {
      hydratedRef.current = true;
      setRoundId(activeRound.roundId);
      setSectionNumber(2);
      setAddStation(activeRound.stations);
      setIsEuropeanRotation(!!activeRound.european_rotation);
      setStationSequence(activeRound.station_sequence || []);
      setMaxStations(
        activeRound.total_stations ||
          activeRound.station_sequence?.length ||
          16,
      );
      setSelectedCourse(activeRound.course_name || '');
      return;
    }

    if (roundDetails) {
      hydratedRef.current = true;
      setRoundId(roundDetails?.id);
      setSectionNumber(2);

      const hasEuropeanRotationFields =
        roundDetails?.european_rotation &&
        roundDetails?.starting_station &&
        roundDetails?.total_stations &&
        Array.isArray(roundDetails?.station_sequence) &&
        roundDetails?.station_sequence?.length > 0;

      if (hasEuropeanRotationFields) {
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
        const seeded = [
          {
            ...initialStation,
            station_number: firstStationNumber,
            name: `Station ${firstStationNumber}`,
          },
        ];
        setAddStation(seeded);
        setExpandedStations(prev => ({
          ...prev,
          [firstStationNumber]: true,
        }));
      } else {
        const seeded = [
          {
            ...initialStation,
            station_number: 1,
            name: 'Station 1',
          },
        ];
        setAddStation(seeded);
        setExpandedStations(prev => ({ ...prev, 1: true }));
      }
    }
  }, [roundDetails, fromDraft, activeRound]);

  // Persist stations to MMKV while playing
  useEffect(() => {
    if (sectionNumber !== 2 || !roundId) return;
    updateDraftStations(addStation);
  }, [addStation, sectionNumber, roundId, updateDraftStations]);

  useEffect(() => {
    if (pendingScrollRef.current !== null && scrollRef.current) {
      const stationNumber = pendingScrollRef.current;
      const layout = stationLayoutsRef.current[stationNumber];
      if (layout) {
        setTimeout(() => {
          scrollRef.current?.scrollTo({
            y: Math.max(0, layout.y - 10),
            animated: true,
          });
          pendingScrollRef.current = null;
        }, 300);
      }
    }
  }, [addStation.length]);

  const { mutateAsync: createRound, isPending } = useCustomMutation({
    mutationFn: postRound,
  });

  const { mutate: postStationtoDb, isPending: isPendingPostStation } =
    useCustomMutation({
      mutationFn: postStations,
      onSuccess: async () => {
        const completedRoundId = roundDetails?.id || roundId;
        await queryClient.invalidateQueries({ queryKey: ['rounds'] });
        navigation.replace('CompleteRoundScreen', {
          roundId: completedRoundId,
        });
        clearRound();
      },
      on422Error: error => {
        showMessage({
          message:
            Object.values(error || {})?.[0] || 'Error submitting round..',
          bgColor: COLORS.primary,
        });
      },
    });

  const toggleStation = stationId => {
    setExpandedStations(prev => ({
      ...prev,
      [stationId]: !prev[stationId],
    }));
  };

  const HandleAddStation = () => {
    const last = addStation[addStation.length - 1];
    const message = validateLastStation(last);
    if (message) {
      showMessage({ type: 'danger', message, bgColor: COLORS.primary });
      return;
    }
    if (totalSelectedShots >= 100) {
      showMessage({
        type: 'danger',
        message:
          'You cannot add more stations because 100 targets have already been completed.',
        bgColor: COLORS.primary,
      });
      return;
    }

    setAddStation(prev => {
      const nextIndex = prev.length;
      const nextStationNumber =
        Array.isArray(stationSequence) && stationSequence.length > 0
          ? stationSequence[nextIndex]
          : nextIndex + 1;

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
      toggleStation(last?.station_number);

      const newStation = {
        ...initialStation,
        station_number: nextStationNumber,
        name: `Station ${nextStationNumber}`,
      };
      pendingScrollRef.current = nextStationNumber;
      return [...prev, newStation];
    });
  };

  const HandleContinue = () => {
    if (!selectedCourse) {
      showMessage({
        message: 'Course Name is required!',
        bgColor: COLORS.primary,
      });
      return;
    }
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
        const id = round?.id;
        setSectionNumber(2);
        setRoundId(id);

        let stations = [
          {
            ...initialStation,
            station_number: 1,
            name: 'Station 1',
          },
        ];

        if (
          Array.isArray(round?.station_sequence) &&
          round?.station_sequence?.length
        ) {
          setStationSequence(round.station_sequence);
          setMaxStations(
            round?.total_stations || round.station_sequence.length,
          );
          const firstStationNumber = round.station_sequence[0];
          stations = [
            {
              ...initialStation,
              station_number: firstStationNumber,
              name: `Station ${firstStationNumber}`,
            },
          ];
          setAddStation(stations);
          setExpandedStations(prev => ({
            ...prev,
            [firstStationNumber]: true,
          }));
        } else {
          setAddStation(stations);
        }

        setActiveDraft({
          ...buildActiveDraft({
            round: {
              ...round,
              course_name: selectedCourse,
              ncsca_class: selectedClass,
              european_rotation: isEuropeanRotation,
              starting_station: isEuropeanRotation
                ? Number(startingStation?.value)
                : null,
              total_stations: isEuropeanRotation
                ? Number(totalStations?.value)
                : null,
            },
            stations,
            courseName: selectedCourse,
          }),
          playing: true,
        });
        queryClient.invalidateQueries({ queryKey: ['rounds'] });
        navigation.replace('CourseRoundScreen');
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
      const last = updated[lastIndex];
      const traps = [...last.traps];

      if (type === 'id') {
        const exists = traps.some(trap => trap.trap_id === data.trap_id);
        if (!exists) traps.push(data);
      } else if (type === 'presentation') {
        const updatedTraps = traps.map(trap =>
          trap.trap_id === trapId ? { ...trap, presentation: data.slug } : trap,
        );
        updated.splice(lastIndex, 1, { ...last, traps: updatedTraps });
        handleStationChange({ ...last, traps: updatedTraps }, scrollRef);
        return updated;
      }

      updated[lastIndex] = { ...last, traps };
      return updated;
    });
  };

  const HandleSetShotsData = shotsData => {
    setAddStation(prev => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      updated[lastIndex] = { ...updated[lastIndex], shots: shotsData };
      return updated;
    });
  };

  const handleSelectedTargetPairs = targetPair => {
    setAddStation(prev => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      const shotsCount = targetPair * 2;
      const priorShots =
        (addStation
          ?.slice(0, lastIndex)
          .reduce((acc, st) => acc + (st?.selectedTargetPairs || 0), 0) || 0) *
        2;
      if (shotsCount + priorShots > 100) {
        setIsLeaveGameModalVisible(true);
        return updated;
      }
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

  const applyShotResult = result => {
    const last = addStation[addStation.length - 1];
    const message = validateLastStation(last, false);
    if (message) {
      showMessage({ type: 'danger', message, bgColor: COLORS.primary });
      return;
    }
    setAddStation(prev => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      const st = updated[lastIndex];
      const shots = st.shots.map(s => ({ ...s }));
      const nextIndex = shots.findIndex(item => item.result === 'empty');
      if (nextIndex !== -1) shots[nextIndex].result = result;
      updated[lastIndex] = { ...st, shots };
      return updated;
    });
  };

  const handlePressHit = () => applyShotResult('dead');
  const handlePressMiss = () => applyShotResult('lost');

  const handleUndo = () => {
    setAddStation(prev => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      const st = updated[lastIndex];
      const shots = st.shots.map(s => ({ ...s }));
      const lastFilledIndex = [...shots]
        .reverse()
        .findIndex(item => item.result !== 'empty');
      if (lastFilledIndex !== -1) {
        const realIndex = shots.length - 1 - lastFilledIndex;
        shots[realIndex].result = 'empty';
      }
      updated[lastIndex] = { ...st, shots };
      return updated;
    });
  };

  const submitStations = () => {
    postStationtoDb({
      roundId: roundDetails?.id || roundId,
      payload: buildStationsPayload(addStation),
    });
  };

  const handleCompleteRound = () => {
    const last = addStation[addStation.length - 1];
    const message = validateLastStation(last);
    if (message) {
      showMessage({ type: 'danger', message, bgColor: COLORS.primary });
      return;
    }
    if (totalSelectedShots != 100) {
      setIncompleteCompleteVisible(true);
      return;
    }
    setConfirmVisible(true);
  };

  const handleBackNavigation = useCallback(() => {
    // Create-round form (section 1): always pop with goBack
    if (sectionNumber === 1) {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        goToFieldHome();
      }
      return true;
    }
    if (sectionNumber === 2 && (hasPlayedAtLeastOneStation || roundId)) {
      setBackPressModalVisible(true);
      return true;
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      goToFieldHome();
    }
    return true;
  }, [
    hasPlayedAtLeastOneStation,
    sectionNumber,
    roundId,
    goToFieldHome,
    navigation,
  ]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => handleBackNavigation(),
    );
    return () => backHandler.remove();
  }, [handleBackNavigation]);

  const fieldDropdownProps = {
    dropdownStyle: styles.fieldDropdown,
    selectedTextStyle: styles.fieldDropdownText,
    placeholderStyle: styles.fieldDropdownPlaceholder,
    containerStyle: styles.fieldDropdownList,
    itemTextStyle: styles.fieldDropdownItem,
    activeColor: COLORS.primary,
    iconColor: COLORS.courseTextMuted,
  };

  // Form only — play happens on CourseRoundScreen (field theme)
  if (!roundDetails && sectionNumber === 1) {
    return (
      <CourseLayout showTabs={false} showModeIndicator={false}>
        <View style={styles.fieldTopBar}>
          <TouchableOpacity
            style={styles.fieldBackBtn}
            onPress={handleBackNavigation}
            hitSlop={12}
          >
            <Icon
              name="arrow-back"
              iconFamily="Ionicons"
              size={22}
              color={COLORS.primary}
            />
          </TouchableOpacity>
          <Typography
            fFamily="barlowBold700"
            size={18}
            color={COLORS.white100}
            style={styles.fieldTitle}
          >
            New Round
          </Typography>
          <View style={styles.fieldBackBtn} />
        </View>

        <ScrollView
          style={styles.fieldScroll}
          contentContainerStyle={styles.fieldScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Label title="Squad Sequence" color={COLORS.courseTextMuted} size={13} fFamily="barlowBold700" />
          <CustomDropdown
            data={createRoundDropData}
            placeholder="Squad Sequence"
            defaultValue={squadSequence}
            onChange={item => setSquadSequence(item)}
            mode={'default'}
            {...fieldDropdownProps}
          />

          <Label title="Course Name" color={COLORS.courseTextMuted} size={13} fFamily="barlowBold700" />
          <TextField
            placeholder="Course Name"
            handleChange={text => setSelectedCourse(text)}
            value={selectedCourse}
            placeholderColor={COLORS.courseTextMuted}
            borderInactiveColor={COLORS.courseBorder}
            containerSt={styles.fieldInputContainer}
            inputStyle={styles.fieldInputText}
          />

          <Label title="Squad Size" color={COLORS.courseTextMuted} size={13} fFamily="barlowBold700" />
          <CustomDropdown
            data={createRoundDropData}
            placeholder="Squad Size"
            defaultValue={noOfPeople}
            onChange={item => setNoOfPeople(item)}
            mode={'default'}
            dropdownPosition={'top'}
            {...fieldDropdownProps}
          />

          <Label title="Your Current NSCA Class" color={COLORS.courseTextMuted} size={13} fFamily="barlowBold700" />
          <View style={styles.nscaClassContainer}>
            {classes?.length
              ? classes.map((item, index) => (
                  <Box
                    item={item}
                    key={index}
                    onSelectClass={setSelectedClass}
                    selectedClass={selectedClass}
                    field
                  />
                ))
              : null}
          </View>

          <Label title="European Rotation?" color={COLORS.courseTextMuted} size={13} fFamily="barlowBold700" />
          <BooleanRadioSelector
            variant="field"
            onSetBoleanValue={setIsEuropeanRotation}
            boleanValue={isEuropeanRotation}
          />

          {isEuropeanRotation ? (
            <SlideInView slide="down">
              <Label title="Starting Station #" color={COLORS.courseTextMuted} size={13} fFamily="barlowBold700" />
              <CustomDropdown
                data={stationOptions}
                placeholder="Starting Station"
                defaultValue={startingStation}
                onChange={item => setStartingStation(item)}
                mode="modal"
                {...fieldDropdownProps}
              />
              <Label title="Total number of stations" color={COLORS.courseTextMuted} size={13} fFamily="barlowBold700" />
              <CustomDropdown
                data={totalStationOptions}
                placeholder="Total Stations"
                defaultValue={totalStations}
                onChange={item => setTotalStations(item)}
                mode="modal"
                {...fieldDropdownProps}
              />
            </SlideInView>
          ) : null}

          <Button
            mb={54}
            mt={24}
            label="Continue"
            onPress={HandleContinue}
            loader={isPending}
          />
        </ScrollView>

        <ConfirmModal
          variant="field"
          visible={backPressModalVisible}
          setVisibility={setBackPressModalVisible}
          title="Leave Round?"
          message="Your progress is saved on this device. You can resume this round anytime from Field Mode."
          confirmText="Stay"
          cancelText="Leave"
          handleCancel={() => {
            goToFieldHome();
          }}
        />
      </CourseLayout>
    );
  }

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <Header type="app" title="New Round" onPresBack={handleBackNavigation} />
      <View style={[GLOBALSTYLE.paddingHor, { flex: 1 }]}>
        {roundDetails || sectionNumber == 2 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            ref={scrollRef}
          >
            <View style={{ justifyContent: 'space-between', flex: 1 }}>
              <View>
                <Label
                  title={`${
                    roundDetails?.course_name || selectedCourse || 'Course'
                  } ${formatUsDate(roundDetails?.created_at || new Date())}`}
                  fFamily={'barlowBold700'}
                  size={18}
                />

                {addStation.map((station, index) => (
                  <View
                    key={`${station?.station_number}-${index}`}
                    onLayout={event => {
                      const { y } = event.nativeEvent.layout;
                      stationLayoutsRef.current[station?.station_number] = {
                        y,
                      };
                      if (
                        pendingScrollRef.current === station?.station_number &&
                        scrollRef.current
                      ) {
                        setTimeout(() => {
                          scrollRef.current?.scrollTo({
                            y: Math.max(0, y - 10),
                            animated: true,
                          });
                          pendingScrollRef.current = null;
                        }, 100);
                      }
                    }}
                  >
                    <StationCard
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
                      totalSelectedShots={totalSelectedShots}
                      maxStations={maxStations}
                      trapsData={trapsData}
                    />
                  </View>
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

              <View style={{ marginTop: Sizer.vSize(24) }}>
                <Button
                  mb={13}
                  label="Complete Record"
                  loader={isPendingPostStation}
                  onPress={handleCompleteRound}
                />
                <SlideInView slide="down" slideDuration={700}>
                  <View style={styles.hitMissCol}>
                    <TouchableOpacity
                      activeOpacity={BASEOPACITY}
                      style={styles.hitZone}
                      onPress={handlePressHit}
                      disabled={IsAllFilled}
                    >
                      <Icon
                        name="checkmark"
                        iconFamily="Ionicons"
                        size={56}
                        color={COLORS.white100}
                      />
                      <Typography
                        color={COLORS.white100}
                        fFamily="barlowBold700"
                        size={28}
                        mT={4}
                        style={styles.hitMissLabel}
                      >
                        HIT
                      </Typography>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={BASEOPACITY}
                      style={styles.missZone}
                      onPress={handlePressMiss}
                      disabled={IsAllFilled}
                    >
                      <Icon
                        name="close"
                        iconFamily="Ionicons"
                        size={56}
                        color="#F87171"
                      />
                      <Typography
                        color="#F87171"
                        fFamily="barlowBold700"
                        size={28}
                        mT={4}
                        style={styles.hitMissLabel}
                      >
                        MISS
                      </Typography>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={BASEOPACITY}
                      onPress={handleUndo}
                      style={styles.undoBtn}
                    >
                      <UndoSvg color={COLORS.black100} />
                      <Typography
                        color={COLORS.black100}
                        fFamily="barlowSemiBold600"
                        mT={4}
                        size={16}
                      >
                        Undo
                      </Typography>
                    </TouchableOpacity>
                  </View>
                </SlideInView>
              </View>
            </View>
          </ScrollView>
        ) : null}
      </View>

      <ConfirmModal
        variant="field"
        visible={confirmVisible}
        setVisibility={setConfirmVisible}
        handleComplete={() => {
          setConfirmVisible(false);
          submitStations();
        }}
      />

      <ConfirmModal
        variant="field"
        visible={backPressModalVisible}
        setVisibility={setBackPressModalVisible}
        title="Leave Round?"
        message="Your progress is saved on this device. You can resume this round anytime from Field Mode."
        confirmText="Stay"
        cancelText="Leave"
        handleCancel={() => {
          goToFieldHome();
        }}
      />

      <ConfirmModal
        variant="field"
        visible={incompleteCompleteVisible}
        setVisibility={setIncompleteCompleteVisible}
        title="Leave Round?"
        message="You've shot less than 100 targets. Leave and keep progress on this device, or stay to finish."
        confirmText="Stay"
        cancelText="Leave"
        handleCancel={() => {
          goToFieldHome();
        }}
      />

      <ConfirmModal
        variant="field"
        title="Score Exceeded"
        message="Your total score has crossed the limit of 100. This round is invalid. Do you want to discard local progress?"
        visible={isLeaveGameModalVisible}
        setVisibility={setIsLeaveGameModalVisible}
        confirmText="Discard"
        cancelText="Cancel"
        handleComplete={() => {
          clearRound();
          goToFieldHome();
        }}
      />
    </Container>
  );
};

const Box = ({ item, selectedClass, onSelectClass, field = false }) => {
  const selected = item == selectedClass;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.box,
        field && styles.boxField,
        selected && {
          backgroundColor: COLORS.primary,
          borderColor: COLORS.primary,
        },
      ]}
      onPress={() => onSelectClass(item)}
    >
      <Typography
        fFamily="barlowBold700"
        size={14}
        color={
          selected
            ? COLORS.white100
            : field
              ? COLORS.courseTextMuted
              : COLORS.black300
        }
      >
        {item}
      </Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    paddingVertical: Sizer.vSize(6),
    paddingHorizontal: Sizer.hSize(16),
    backgroundColor: COLORS.white100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Sizer.hSize(8),
    borderWidth: 1,
    borderColor: '#D4D4D4',
  },
  nscaClassContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: Sizer.vSize(8),
    flexWrap: 'wrap',
  },
  hitMissCol: {
    gap: Sizer.vSize(10),
    marginBottom: Sizer.vSize(34),
  },
  hitZone: {
    minHeight: Sizer.vSize(110),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  missZone: {
    minHeight: Sizer.vSize(110),
    backgroundColor: COLORS.black500,
    borderRadius: Sizer.hSize(16),
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  undoBtn: {
    minHeight: Sizer.vSize(64),
    backgroundColor: COLORS.grey100,
    borderRadius: Sizer.hSize(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  hitMissLabel: { letterSpacing: 2 },
  text: {
    fontSize: 14,
    color: '#0E0E0E',
    fontFamily: FONTS.barlowMedium500,
    textAlign: 'center',
  },
  fieldTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Sizer.hSize(16),
    paddingVertical: Sizer.vSize(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.courseBorder,
  },
  fieldBackBtn: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldTitle: {
    textAlign: 'center',
  },
  fieldScroll: { flex: 1 },
  fieldScrollContent: {
    paddingHorizontal: Sizer.hSize(16),
    paddingBottom: Sizer.vSize(40),
  },
  fieldDropdown: {
    backgroundColor: COLORS.courseSurface,
    borderColor: COLORS.courseBorder,
    borderRadius: Sizer.hSize(10),
  },
  fieldDropdownText: {
    color: COLORS.white100,
    fontFamily: FONTS.barlowRegular400,
    fontSize: Sizer.fS(14),
    paddingLeft: Sizer.hSize(4),
  },
  fieldDropdownPlaceholder: {
    color: COLORS.courseTextMuted,
    fontFamily: FONTS.barlowRegular400,
    fontSize: Sizer.fS(14),
    paddingLeft: Sizer.hSize(4),
  },
  fieldDropdownList: {
    backgroundColor: COLORS.courseSurface,
    borderColor: COLORS.courseBorder,
    borderWidth: 1,
    borderRadius: 10,
  },
  fieldDropdownItem: {
    color: COLORS.white100,
    fontFamily: FONTS.barlowRegular400,
    fontSize: Sizer.fS(14),
  },
  fieldInputContainer: {
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(10),
  },
  fieldInputText: {
    color: COLORS.white100,
  },
  boxField: {
    backgroundColor: COLORS.courseSurface,
    borderColor: COLORS.courseBorder,
  },
});

export default NewRoundScreen;
