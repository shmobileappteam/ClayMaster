import React from 'react';
import { TouchableOpacity, View } from 'react-native';
//-----
import { Typography, Flex } from '../../atomComponents';
import { BASEOPACITY, COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import { ScorecardSvg } from '../../assets/svgs';
import Icon from '../../helpers/Icon';
import { scorecardData } from '../../constants/dummydata';

const ScorecardItem = ({ item, onPress }) => {
  const isFileDownloadable = item?.download_url;
  return (
    <TouchableOpacity
      activeOpacity={BASEOPACITY}
      onPress={() => onPress?.(item)}
      style={{
        backgroundColor: COLORS.white100,
        borderRadius: Sizer.hSize(10),
        padding: Sizer.hSize(16),
        marginBottom: Sizer.vSize(12),
        position: 'relative',
      }}
    >
      {item?.download_url && (
        <View
          style={{
            width: Sizer.hSize(9),
            height: Sizer.hSize(9),
            backgroundColor: COLORS.primary,
            borderRadius: Sizer.hSize(4),
            position: 'absolute',
            top: 0,
            right: 0,
          }}
        />
      )}
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
              textTransform={"capitalize"}
            >
              {item?.course_name}
            </Typography>
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
              {new Date(item.created_at).toISOString().split('T')[0]}
            </Typography>
          </Flex>
        </Flex>

        <Flex direction="column" algItems="flex-end" gap={8}>
          {/* Action Button */}
          <View
            disabled={!item?.download_url}
            style={{
              backgroundColor: item?.download_url
                ? 'rgba(235, 108, 15, 1)'
                : 'rgba(235, 108, 15, .1)',
              paddingHorizontal: Sizer.hSize(12),
              paddingVertical: Sizer.vSize(6),
              borderRadius: Sizer.hSize(5),
              minWidth: Sizer.hSize(65),
              alignItems: 'center',
            }}
          >
            <Typography
              size={12}
              color={
                isFileDownloadable ? COLORS.white100 : 'rgba(235, 108, 15, 1)'
              }
              fFamily="barlowSemiBold600"
            >
              {isFileDownloadable
                ? 'Download'
                : item?.complete_status
                ? 'Completed'
                : 'Pending'}
            </Typography>
          </View>

          <View
            style={{
              backgroundColor: item?.sent_status
                ? 'rgba(9, 190, 48, .1)'
                : 'rgba(0, 39, 237, .1)',
              paddingHorizontal: Sizer.hSize(12),
              paddingVertical: Sizer.vSize(4),
              borderRadius: Sizer.hSize(6),
              minWidth: Sizer.hSize(70),
              alignItems: 'center',
            }}
          >
            <Typography
              size={12}
              color={
                item.sent_status ? 'rgba(9, 190, 48, 1)' : 'rgba(0, 39, 237, 1)'
              }
              fFamily="barlowSemiBold600"
            >
              {/* {item.statusLabel} */}
              {item?.sent_status ? 'Sent' : 'Saved'}
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
    onItemPress?.(item);
  };

  const handleActionPress = item => {
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
