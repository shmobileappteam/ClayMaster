import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
//--------
import { Flex, Typography } from '../../atomComponents';
import { BASEOPACITY, COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import Icon from '../../helpers/Icon';
import SlideInView from '../../animations/SlideView';

const Header = ({
  titleLeft = '',
  titleRight = '',
  isExpanded,
  onToggle,
  isTargetPairSelected,
}) => {
  return (
    <TouchableOpacity
      onPress={isTargetPairSelected ? onToggle : () => {}}
      activeOpacity={BASEOPACITY}
    >
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
            {titleLeft}
          </Typography>
        </Flex>
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
            />
          )}
        </Flex>
      </Flex>
    </TouchableOpacity>
  );
};

const ShotCircle = ({ status }) => {
  const getCircleColor = () => {
    switch (status) {
      case 'hit':
        return COLORS.primary;
      case 'missed':
        return COLORS.grey900;
      case 'empty':
        return COLORS.white100;
      default:
        return COLORS.white100;
    }
  };

  const getBorderColor = () => {
    return status === 'empty' ? COLORS.grey300 : 'transparent';
  };

  return (
    <View
      style={[
        styles.shotBox,
        {
          backgroundColor: getCircleColor(),
          borderWidth: status === 'empty' ? Sizer.fS(1) : 0,
          borderColor: getBorderColor(),
        },
      ]}
    >
      {status !== 'empty' && (
        <Icon
          name={status == 'hit' ? 'circle' : 'slash'}
          iconFamily={'Lucide'}
          size={18}
          color={COLORS.white100}
        />
      )}
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

const TargetSelection = ({
  station,
  hitCount,
  missedCount,
  isTargetPairSelected,
  onSetIsTargetPairSelected,
}) => {
  return (
    <>
      {isTargetPairSelected ? (
        <SlideInView slide="right" slideDuration={500}>
          <Flex
            direction="row"
            jusContent="space-between"
            algItems="center"
            flexWrap="wrap"
            gap={4}
            mT={16}
          >
            {station.shots.map(shot => (
              <ShotCircle key={shot.id} status={shot.status} />
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
                  backgroundColor: hitCount ? COLORS.orange300 : COLORS.grey400,
                },
              ]}
            >
              <Typography
                size={14}
                color={hitCount ? COLORS.primary : COLORS.grey500}
                Family="barlowMedium500"
              >
                Dead {station.hits}
              </Typography>
            </View>

            <View
              style={[
                styles.shotsInfoBox,
                {
                  backgroundColor: missedCount ? COLORS.red100 : COLORS.grey400,
                },
              ]}
            >
              <Typography
                size={14}
                fFamily="barlowMedium500"
                color={missedCount ? COLORS.primary : COLORS.grey500}
              >
                Lost {station.missed}
              </Typography>
            </View>
          </Flex>
        </SlideInView>
      ) : (
        <View style={{ marginTop: Sizer.hSize(15) }}>
          <SlideInView slide="down" slideDuration={500}>
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
                onPress={() => {
                  onSetIsTargetPairSelected(true);
                }}
                style={[
                  styles.shotsInfoBox,
                  {
                    backgroundColor: '#F0F0F0',
                  },
                ]}
              >
                <Typography size={14} Family="barlowMedium500">
                  3 Target Pair{' '}
                </Typography>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={BASEOPACITY}
                onPress={() => {
                  onSetIsTargetPairSelected(true);
                }}
                style={[
                  styles.shotsInfoBox,
                  {
                    backgroundColor: '#F0F0F0',
                  },
                ]}
              >
                <Typography size={14} fFamily="barlowMedium500">
                  5 Target Pair{' '}
                </Typography>
              </TouchableOpacity>
            </Flex>
          </SlideInView>
        </View>
      )}
    </>
  );
};
// ---------------- Main Card ----------------

const StationCard = ({ station, isExpanded, onToggle }) => {
  const [reportPair, setReportPair] = useState(station.reportPair);
  const [isTargetPairSelected, setIsTargetPairSelected] = useState(
    station?.isPairSelected || false,
  );

  const hitCount = station.shots.filter(item => item.status == 'hit')?.length;
  const missedCount = station.shots.filter(
    item => item.status == 'missed',
  )?.length;

  return (
    <View style={styles.stationCard}>
      {/* Header */}
      <Header
        titleLeft={station.name}
        isExpanded={isExpanded}
        onToggle={onToggle}
        isTargetPairSelected={isTargetPairSelected}
      />

      {/* Shots Grid */}
      <TargetSelection
        station={station}
        hitCount={hitCount}
        missedCount={missedCount}
        isTargetPairSelected={isTargetPairSelected}
        onSetIsTargetPairSelected={setIsTargetPairSelected}
      />

      {/* Expanded Content */}
      {isExpanded && (
        <View style={styles.expandedContainer}>
          {/* Report Pair Selection */}
          <Flex direction="row" algItems="center" gap={20} mT={15} mB={20}>
            <RadioButton
              selected={reportPair === 'TP'}
              onPress={() => setReportPair('TP')}
              label="Report Pair"
            />
            <RadioButton
              selected={reportPair === 'RP'}
              onPress={() => setReportPair('RP')}
              label="True Pair"
            />
          </Flex>

          {/* Traps Section */}
          <Header
            titleLeft="Traps / Target Presentations"
            titleRight="Trap 01"
            isExpanded={isExpanded}
            isTargetPairSelected={isTargetPairSelected}
          />

          {/* Trap Details */}
          <View style={{ marginTop: Sizer.hSize(15) }}>
            {Object.entries(station.traps).map(([key, value], index) => (
              <Flex
                key={key}
                direction="row"
                algItems="center"
                mB={Object.entries(station.traps).length == index + 1 ? 0 : 10}
              >
                <View style={{ flex: 1 }}>
                  <View style={styles.bottomRectangle}>
                    <Typography
                      size={14}
                      color={COLORS.black200}
                      fFamily="barlowMedium500"
                      textTransform="capitalize"
                    >
                      {key
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, str => str.toUpperCase())}
                    </Typography>
                  </View>
                </View>

                <View style={{ width: '60%' }}>
                  <View
                    style={[
                      styles.bottomRectangle,
                      value == 'Quartering' && {
                        backgroundColor: COLORS.primary,
                      },
                    ]}
                  >
                    <Typography
                      size={14}
                      color={
                        value == 'Quartering'
                          ? COLORS.white100
                          : COLORS.black200
                      }
                      fFamily="barlowMedium500"
                    >
                      {value}
                    </Typography>
                  </View>
                </View>
              </Flex>
            ))}
          </View>
        </View>
      )}
    </View>
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
    borderTopWidth: Sizer.hSize(1),
    borderTopColor: COLORS.grey600,
    marginTop: Sizer.hSize(15),
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
