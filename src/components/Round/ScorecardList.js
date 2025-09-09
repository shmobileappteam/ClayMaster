import React from 'react';
import { TouchableOpacity, View } from 'react-native';
//-----
import { Typography, Flex } from '../../atomComponents';
import { BASEOPACITY, COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import { ScorecardSvg } from '../../assets/svgs';
import Icon from '../../helpers/Icon';
import { scorecardData } from '../../constants/dummydata';

const ScorecardItem = ({ item, onPress, onActionPress }) => {
  const getStatusColor = status => {
    switch (status) {
      case 'sent':
        return 'rgba(47, 237, 0, .1)'; // Green
      case 'completed':
        return COLORS.primary; // Orange
      case 'saved':
        return COLORS.primary; // Blue
      default:
        return COLORS.grey200;
    }
  };

  const getActionButtonColor = action => {
    switch (action) {
      case 'download':
        return COLORS.primary;
      case 'saved':
        return 'rgba(0, 39, 237, .1)';
      default:
        return COLORS.grey200;
    }
  };

  const getActionButtonTextColor = action => {
    switch (action) {
      case 'download':
        return COLORS.white100;
      case 'saved':
        return '#0027ED';
      default:
        return COLORS.white100;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={BASEOPACITY}
      onPress={() => onPress?.(item)}
      style={{
        backgroundColor: COLORS.white100,
        borderRadius: Sizer.hSize(10),
        padding: Sizer.hSize(16),
        marginBottom: Sizer.vSize(12),
      }}
    >
      <Flex direction="row" algItems="center" gap={16}>
        {/* Icon */}
        <View
          style={{
            width: Sizer.hSize(46),
            height: Sizer.hSize(46),
            backgroundColor: COLORS.primary,
            borderRadius: Sizer.hSize(8),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ScorecardSvg />
        </View>

        <Flex flex={1} direction="column" gap={8}>
          <Flex direction="row" algItems="center" jusContent="space-between">
            <Typography
              fFamily="barlowSemiBold600"
              numberOfLines={1}
              style={{ flex: 1 }}
            >
              {item.title}
            </Typography>
            {item.hasNotification && (
              <View
                style={{
                  width: Sizer.hSize(8),
                  height: Sizer.hSize(8),
                  backgroundColor: COLORS.primary,
                  borderRadius: Sizer.hSize(4),
                  marginLeft: Sizer.hSize(8),
                }}
              />
            )}
          </Flex>

          <Flex direction="row" algItems="center" gap={6}>
            <Icon
              name="calendar"
              size={Sizer.hSize(14)}
              color={COLORS.primary}
            />
            <Typography
              size={14}
              color={COLORS.grey200}
              fFamily="barlowRegular400"
            >
              {item.date}
            </Typography>
          </Flex>
        </Flex>

        <Flex direction="column" algItems="flex-end" gap={8}>
          {/* Action Button */}
          <TouchableOpacity
            onPress={() => onActionPress?.(item)}
            style={{
              backgroundColor: getActionButtonColor(item.action),
              paddingHorizontal: Sizer.hSize(12),
              paddingVertical: Sizer.vSize(6),
              borderRadius: Sizer.hSize(5),
              minWidth: Sizer.hSize(65),
              alignItems: 'center',
            }}
          >
            <Typography
              size={12}
              color={getActionButtonTextColor(item.action)}
              fFamily="barlowSemiBold600"
            >
              {item.actionLabel}
            </Typography>
          </TouchableOpacity>

          <View
            style={{
              backgroundColor: getStatusColor(item.status),
              paddingHorizontal: Sizer.hSize(12),
              paddingVertical: Sizer.vSize(4),
              borderRadius: Sizer.hSize(5),
              minWidth: Sizer.hSize(70),
              alignItems: 'center',
            }}
          >
            <Typography
              size={12}
              color={item.status == 'sent' ? '#09BE30' : COLORS.orange200}
              fFamily="barlowSemiBold600"
            >
              {item.statusLabel}
            </Typography>
          </View>
        </Flex>
      </Flex>
    </TouchableOpacity>
  );
};

const ScorecardList = ({
  data = scorecardData,
  onItemPress,
  onActionPress,
  containerStyle = {},
}) => {
  const handleItemPress = item => {
    console.log('Scorecard pressed:', item.title);
    onItemPress?.(item);
  };

  const handleActionPress = item => {
    console.log(`${item.action} pressed for:`, item.title);
    onActionPress?.(item);
  };

  return (
    <View style={{ flex: 1, ...containerStyle }}>
      {data.map(item => (
        <ScorecardItem
          key={item.id}
          item={item}
          onPress={handleItemPress}
          onActionPress={handleActionPress}
        />
      ))}
    </View>
  );
};

export default ScorecardList;
