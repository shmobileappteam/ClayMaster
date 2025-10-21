import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
//--------
import { Flex, Typography } from '../../atomComponents';
import { BASEOPACITY, COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import SlideInView from '../../animations/SlideView';
import { CircleSvg, SlashSvg } from '../../assets/svgs';
import TrapsList from './TrapsList';
import { useCustomQuery } from '../../query/useCustomQuery';
import { getTraps } from '../../api/stationService';
import { queryClient } from '../../api/api';

const trapsData = [
  {
    trap_id: 1,
    presentation: '',
    title: 'Trap 1',
  },
  {
    trap_id: 2,
    presentation: '',
    title: 'Trap 2',
  },
];

const TrapSelector = ({
  traps = [],
  selectedTrap,
  onSelect,
  onSetTrapId,
  trapId = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectTrap = trapData => {
    onSetTrapId(trapData?.trap_id);

    onSelect(trapData, 'id');
    setIsOpen(false);
  };

  return (
    <View>
      {/* Selected Trap */}
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: COLORS.grey700,
          borderRadius: Sizer.hSize(5),
          paddingHorizontal: Sizer.hSize(6),
          paddingVertical: Sizer.hSize(4),
          gap: 5,
        }}
        onPress={() => setIsOpen(!isOpen)}
        hitSlop={10}
      >
        <Typography fFamily="barlowMedium500" size={14}>
          {selectedTrap?.trap_id == 1 ? 'Trap 1' : 'Trap 2'}
        </Typography>
        <Icon
          name="play-arrow"
          size={Sizer.hSize(18)}
          color={COLORS.black100}
          iconFamily="MaterialIcons"
          style={{
            transform: [{ rotate: isOpen ? '90deg' : '0deg' }],
          }}
        />
      </TouchableOpacity>

      {/* Dropdown */}
      {isOpen && (
        <View
          style={{
            position: 'absolute',
            top: Sizer.hSize(30),
            right: 0,
            left: 0,
            zIndex: 100,
            backgroundColor: '#F8F8F8',
            borderRadius: Sizer.hSize(5),
            // OLD CODE
            // paddingHorizontal: Sizer.hSize(6),
            // paddingVertical: Sizer.hSize(4),
            overflow: 'hidden',
          }}
        >
          {traps.map((trapData, index) => (
            <TouchableOpacity
              key={index}
              style={{
                paddingVertical: Sizer.hSize(5),
                paddingHorizontal: Sizer.hSize(6),
                backgroundColor:
                  trapId == trapData?.trap_id ? COLORS.primary : undefined,
              }}
              onPress={handleSelectTrap.bind(this, trapData)}
            >
              <Typography
                fFamily="barlowMedium500"
                color={
                  trapId == trapData?.trap_id ? COLORS.white100 : undefined
                }
              >
                {/* {trapData?.trap_id == 1 ? 'Trap 1' : 'Trap 2'}  OLD CODE*/}
                {trapData?.title}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const Header = ({
  titleLeft = '',
  titleRight = '',
  isExpanded,
  onToggle,
  isTargetPairSelected,
  isDropDown = false,
  selectedTrapsData,
  onSetSelectedTrapsData,
  onSetTrapId,
  trapId = null,
}) => {
  return (
    <TouchableOpacity
      onPress={isTargetPairSelected ? onToggle : () => {}}
      activeOpacity={BASEOPACITY}
    >
      <View pointerEvents="">
        <Flex direction="row" jusContent="space-between" algItems="center">
          <Flex gap={8}>
            <View style={styles.stationLine} />
            <Typography
              size={14}
              fFamily="barlowMedium500"
              color={COLORS.black100}
              numberOfLines={1}
              ellipsizeMode="tail"
              flexShrink={1}
            >
              {`${titleLeft}`}
            </Typography>
          </Flex>

          {isDropDown ? (
            <TrapSelector
              traps={trapsData}
              // traps={['Trap 1', 'T rap 2']}
              selectedTrap={selectedTrapsData}
              onSelect={onSetSelectedTrapsData}
              onSetTrapId={onSetTrapId}
              trapId={trapId}
            />
          ) : (
            <Flex
              gap={12}
              {...(titleRight && {
                extraStyle: {
                  paddingVertical: Sizer.hSize(4),
                  paddingHorizontal: Sizer.hSize(5),
                  backgroundColor: COLORS.grey700,
                  borderRadius: Sizer.fS(5),
                },
              })}
            >
              {titleRight && (
                <Typography fFamily="barlowMedium500" size={13}>
                  {titleRight}
                </Typography>
              )}
              {isTargetPairSelected && (
                <Icon
                  name={isExpanded ? 'play-arrow' : 'play-arrow'}
                  size={Sizer.hSize(18)}
                  color={COLORS.black100}
                  iconFamily={'MaterialIcons'}
                  {...(!titleRight
                    ? {
                        style: {
                          transform: [
                            { rotate: isExpanded ? '90deg' : '0deg' },
                          ],
                        },
                      }
                    : {})}
                />
              )}
            </Flex>
          )}
        </Flex>
      </View>
    </TouchableOpacity>
  );
};

const ShotCircle = ({ result, shotNumber }) => {
  const getCircleColor = () => {
    switch (result) {
      case 'dead':
        return COLORS.primary;
      case 'lost':
        return COLORS.grey900;
      case 'empty':
        return COLORS.white100;
      default:
        return COLORS.white100;
    }
  };

  const getBorderColor = () => {
    return result === 'empty' ? COLORS.grey300 : 'transparent';
  };

  return (
    <View>
      <Typography size={12} mB={4} fFamily="barlowMedium500" textAlign="center">
        {shotNumber}
      </Typography>

      <View
        style={[
          styles.shotBox,
          {
            backgroundColor: getCircleColor(),
            borderWidth: result === 'empty' ? Sizer.fS(1) : 0,
            borderColor: getBorderColor(),
          },
        ]}
      >
        {result !== 'empty' &&
          (result == 'dead' ? (
            <SlashSvg height={Sizer.hSize(15)} width={Sizer.hSize(15)} />
          ) : (
            <CircleSvg height={Sizer.hSize(15)} width={Sizer.hSize(15)} />
          ))}
      </View>
    </View>
  );
};

const RadioButton = ({ selected, onPress, label }) => (
  <TouchableOpacity
    activeOpacity={BASEOPACITY}
    onPress={onPress}
    style={[
      styles.radioContainer,
      {
        backgroundColor: COLORS.grey700,
      },
    ]}
  >
    <Typography size={14} color={COLORS.black100} fFamily="barlowMedium500">
      {label}
    </Typography>
    <Icon
      iconFamily={'Octicons'}
      name={selected ? 'check-circle-fill' : 'circle'}
      color={selected ? COLORS.primary : COLORS.black100}
      size={20}
    />
  </TouchableOpacity>
);

const TargetPairSelection = ({
  onSetIsTargetPairSelected,
  onSelectTargetPair,
}) => {
  const handleTarhetPairSelection = pair => {
    onSelectTargetPair(pair);
    onSetIsTargetPairSelected(true);
  };

  return (
    <>
      <View style={{ marginTop: Sizer.hSize(15) }}>
        <SlideInView slideDuration={500}>
          <Flex
            jusContent={'space-between'}
            extraStyle={{
              backgroundColor: COLORS.orange300,
            }}
          >
            <View style={[styles.stationLine, { height: Sizer.hSize(25) }]} />
            <Typography fFamily="barlowMedium500">
              Select Pair of Targets
            </Typography>
            <View style={[styles.stationLine, { height: Sizer.hSize(25) }]} />
          </Flex>
          <Flex
            direction="row"
            jusContent="space-between"
            algItems="center"
            mT={15}
            gap={9}
          >
            <TouchableOpacity
              activeOpacity={BASEOPACITY}
              onPress={handleTarhetPairSelection.bind(this, 3)}
              style={[
                styles.shotsInfoBox,
                {
                  backgroundColor: '#F0F0F0',
                },
              ]}
            >
              <Typography Family="barlowMedium500">3 Target Pair </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={BASEOPACITY}
              onPress={handleTarhetPairSelection.bind(this, 4)}
              style={[
                styles.shotsInfoBox,
                {
                  backgroundColor: '#F0F0F0',
                },
              ]}
            >
              <Typography fFamily="barlowMedium500">4 Target Pair </Typography>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={BASEOPACITY}
              onPress={handleTarhetPairSelection.bind(this, 5)}
              style={[
                styles.shotsInfoBox,
                {
                  backgroundColor: '#F0F0F0',
                },
              ]}
            >
              <Typography fFamily="barlowMedium500">5 Target Pair </Typography>
            </TouchableOpacity>
          </Flex>
        </SlideInView>
      </View>
      {/* )} */}
    </>
  );
};

const ShotsPresentation = ({ shotsData = [], deadCount, lostCount }) => {
  return (
    <SlideInView slide="right" slideDuration={500}>
      <Flex
        direction="row"
        jusContent="space-between"
        algItems="center"
        flexWrap="wrap"
        gap={4}
        mT={16}
      >
        {shotsData.map((shot, index) => (
          <ShotCircle
            key={shot.sequence}
            result={shot.result}
            shotNumber={index + 1}
          />
        ))}
      </Flex>
      <Flex
        direction="row"
        jusContent="space-between"
        algItems="center"
        mT={15}
        gap={9}
      >
        <View
          style={[
            styles.shotsInfoBox,
            {
              backgroundColor: deadCount ? COLORS.orange300 : COLORS.grey400,
            },
          ]}
        >
          <Typography
            size={14}
            color={deadCount ? COLORS.primary : COLORS.grey500}
            Family="barlowMedium500"
          >
            Dead {deadCount}
          </Typography>
        </View>

        <View
          style={[
            styles.shotsInfoBox,
            {
              // backgroundColor: lostCount ? COLORS.red100 : COLORS.grey400, // OLD CODE
              backgroundColor: COLORS.grey400,
            },
          ]}
        >
          <Typography
            size={14}
            fFamily="barlowMedium500"
            // color={lostCount ? COLORS.primary : COLORS.grey500} // OLD CODE
            color={COLORS.grey500} // OLD CODE
          >
            Lost {lostCount}
          </Typography>
        </View>
      </Flex>
    </SlideInView>
  );
};

///Main Card:
const StationCard = ({
  station,
  isExpanded,
  onToggle,
  onSetPairType = () => {},
  onSetTrapsData = () => {},
  onSetSelectedTargetPairs = () => {},
  isDisabled = false,
}) => {
  // console.log('🚀 ~ StationCard ~ station:', station);
  // const { data: trapsData } = useCustomQuery({
  //   queryKey: ['traps'],
  //   queryFn: getTraps,
  // });

  const trapsData = queryClient.getQueryData(['traps']);

  const [trapId, setTrapId] = useState(1);

  const filteredTrapData =
    (station?.traps &&
      station?.traps?.find(trapData => trapData?.trap_id == trapId)) ||
    {};

  const [isTargetPairSelected, setIsTargetPairSelected] = useState(
    station?.isPairSelected || false,
  );

  const handleSelectPresentation = presentation => {
    onSetTrapsData(presentation, trapId, 'presentation');
  };

  const deadCount =
    station?.dead ||
    station?.shots.filter(item => item?.result == 'dead')?.length;
  const lostCount =
    station?.lost ||
    station?.shots.filter(item => item?.result == 'lost')?.length;

  return (
    <SlideInView>
      <View style={styles.stationCard}>
        {/* Header */}
        <Header
          titleLeft={station.name}
          isExpanded={isExpanded}
          onToggle={onToggle}
          isTargetPairSelected={isTargetPairSelected}
        />

        <View pointerEvents={isDisabled ? 'none' : 'auto'}>
          {!isTargetPairSelected && (
            <TargetPairSelection
              onSetIsTargetPairSelected={setIsTargetPairSelected}
              onSelectTargetPair={onSetSelectedTargetPairs}
            />
          )}

          {isTargetPairSelected && (
            <Flex
              jusContent={'space-between'}
              extraStyle={{
                backgroundColor: COLORS.orange300,
              }}
              mT={15}
            >
              <View style={[styles.stationLine, { height: Sizer.hSize(25) }]} />
              <Typography fFamily="barlowMedium500">
                Selected Pair of {station?.selectedTargetPairs} Targets{' '}
              </Typography>
              <View style={[styles.stationLine, { height: Sizer.hSize(25) }]} />
            </Flex>
          )}
        </View>

        {/* Expanded Content */}
        {isExpanded && (
          <View style={styles.expandedContainer}>
            <View pointerEvents={isDisabled ? 'none' : 'auto'}>
              {/* PairType Selection */}
              <Flex direction="row" algItems="center" gap={20} mT={15} mB={20}>
                <RadioButton
                  selected={station?.pair_type === 'report_pair'}
                  onPress={() => onSetPairType('report_pair')}
                  label="Report Pair"
                />
                <RadioButton
                  selected={station?.pair_type === 'true_pair'}
                  onPress={() => onSetPairType('true_pair')}
                  label="True Pair"
                />
              </Flex>
            </View>

            {/* Traps Section */}
            <Header
              titleLeft="Traps / Target Presentations"
              isExpanded={isExpanded}
              isTargetPairSelected={isTargetPairSelected}
              isDropDown
              selectedTrapsData={filteredTrapData}
              onSetSelectedTrapsData={onSetTrapsData}
              onSetTrapId={setTrapId}
              trapId={trapId}
            />
            <View
              pointerEvents={isDisabled ? 'none' : 'auto'}
              style={{ zIndex: -1 }}
            >
              {/* Traps Presentation */}
              <TrapsList
                trapsData={trapsData}
                onSelectPresentation={handleSelectPresentation}
                selectedPresentation={filteredTrapData?.presentation}
              />
            </View>
          </View>
        )}

        {/* Shots Grid */}
        {isTargetPairSelected && (
          <View pointerEvents={isDisabled ? 'none' : 'auto'}>
            <ShotsPresentation
              shotsData={station?.shots}
              deadCount={deadCount}
              lostCount={lostCount}
            />
          </View>
        )}
      </View>
    </SlideInView>
  );
};

const styles = StyleSheet.create({
  stationCard: {
    backgroundColor: COLORS.white100,
    borderRadius: Sizer.hSize(10),
    borderWidth: Sizer.hSize(1),
    borderColor: COLORS.primary,
    overflow: 'hidden',
    padding: Sizer.hSize(15),
    marginBottom: Sizer.vSize(15),
  },
  stationLine: {
    width: Sizer.hSize(3),
    height: Sizer.hSize(21),
    backgroundColor: COLORS.primary,
  },
  shotBox: {
    width: Sizer.hSize(23),
    height: Sizer.hSize(23),
    borderRadius: Sizer.hSize(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  shotsInfoBox: {
    flex: 1,
    alignItems: 'center',
    borderRadius: Sizer.hSize(4),
    paddingVertical: Sizer.hSize(6),
  },
  expandedContainer: {
    // borderTopWidth: Sizer.hSize(1),
    // marginTop: Sizer.hSize(15),
    borderTopColor: COLORS.grey600,
  },
  radioContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: Sizer.hSize(6),
    borderRadius: Sizer.hSize(5),
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bottomRectangle: {
    backgroundColor: COLORS.grey800,
    paddingVertical: Sizer.hSize(6),
    paddingHorizontal: Sizer.hSize(8),
    borderRadius: Sizer.hSize(5),
    alignSelf: 'flex-start',
  },
});

export default StationCard;
