import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Typography } from '../../atomComponents';
import Icon from '../../helpers/Icon';
import { COLORS, SHADOWS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import {
  navigateFromTabToStack,
  openDrawerFromTabNavigation,
} from '../../navigation/navigationHelpers';
import ModeIndicatorBar from './ModeIndicatorBar';
import { useCustomQuery } from '../../query/useCustomQuery';
import { getNotificationCounts } from '../../api/notificationService';
import { storage } from '../../api/api';
import { KEYS } from '../../constants';

/**
 * Web AppHeader parity — sticky library-mode header with menu + notifications.
 * Flex row: left actions | title (flex) | right actions — no absolute title clipping.
 */
const LibraryHeader = ({
  title,
  showBack,
  showMenu,
  showNotification = true,
  showModeIndicator = false,
  onBack,
  rightSlot,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isLogged } = useSelector(state => state.app);
  const hasToken = Boolean(storage.getString(KEYS.ACCESS_TOKEN));

  const { data: counts } = useCustomQuery({
    queryKey: ['notificationCounts'],
    queryFn: getNotificationCounts,
    enabled: Boolean(showNotification && (isLogged || hasToken)),
    staleTime: 30_000,
  });

  const unreadCount = Number(counts?.unread) || 0;

  return (
    <View style={[styles.wrap, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        <View style={styles.sideLeft}>
          {showBack ? (
            <TouchableOpacity
              onPress={onBack || (() => navigation.goBack())}
              hitSlop={12}
              activeOpacity={0.88}
              style={styles.iconBtn}
            >
              <Icon
                name="arrow-back"
                iconFamily="Ionicons"
                size={24}
                color={COLORS.textPrimary}
              />
            </TouchableOpacity>
          ) : null}
          {showMenu ? (
            <TouchableOpacity
              onPress={() => openDrawerFromTabNavigation(navigation)}
              hitSlop={12}
              activeOpacity={0.88}
              style={styles.iconBtn}
            >
              <Icon
                name="menu"
                iconFamily="Ionicons"
                size={24}
                color={COLORS.textPrimary}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        <Typography
          fFamily="barlowSemiBold600"
          size={17}
          color={COLORS.textPrimary}
          style={styles.title}
          numberOfLines={1}
        >
          {title}
        </Typography>

        <View style={styles.sideRight}>
          {rightSlot}
          {showNotification ? (
            <TouchableOpacity
              onPress={() =>
                navigateFromTabToStack(navigation, 'NotificationScreen')
              }
              hitSlop={8}
              activeOpacity={0.88}
              style={styles.iconBtn}
            >
              <Icon
                name="notifications-outline"
                iconFamily="Ionicons"
                size={24}
                color={COLORS.textPrimary}
              />
              {unreadCount > 0 ? <View style={styles.bellDot} /> : null}
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      {showModeIndicator ? <ModeIndicatorBar variant="library" /> : null}
    </View>
  );
};

export default LibraryHeader;

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.borderMuted,
    ...SHADOWS.header,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: Sizer.vSize(56),
    paddingHorizontal: Sizer.hSize(8),
    gap: Sizer.hSize(4),
  },
  sideLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  sideRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 0,
    gap: Sizer.hSize(4),
  },
  title: {
    flex: 1,
    minWidth: 0,
    textAlign: 'left',
    paddingHorizontal: Sizer.hSize(4),
  },
  iconBtn: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
});
