import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from '../../atomComponents';
import Icon from '../../helpers/Icon';
import { COLORS, SHADOWS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import {
  navigateFromTabToStack,
  openDrawerFromTabNavigation,
} from '../../navigation/navigationHelpers';
import ModeIndicatorBar from './ModeIndicatorBar';

/**
 * Web AppHeader parity — sticky library-mode header with menu + notifications.
 */
const LibraryHeader = ({
  title,
  showBack,
  showMenu,
  showNotification = true,
  showModeIndicator = true,
  onBack,
  rightSlot,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        <View style={styles.side}>
          {showBack ? (
            <TouchableOpacity
              onPress={onBack || (() => navigation.goBack())}
              hitSlop={12}
              activeOpacity={0.88}
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
            size={18}
            color={COLORS.textPrimary}
            textAlign="center"
            style={styles.title}
          >
            {title}
          </Typography>
          <View style={[styles.side, styles.sideRight]}>
            {rightSlot}
            {showNotification ? (
              <TouchableOpacity
                onPress={() => navigateFromTabToStack(navigation, 'NotificationScreen')}
                hitSlop={12}
                activeOpacity={0.88}
                style={styles.bellWrap}
              >
                <Icon
                  name="notifications-outline"
                  iconFamily="Ionicons"
                  size={24}
                  color={COLORS.textPrimary}
                />
                <View style={styles.bellDot} />
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
    height: Sizer.vSize(56),
    paddingHorizontal: Sizer.hSize(16),
  },
  side: {
    minWidth: Sizer.hSize(40),
    alignItems: 'flex-start',
  },
  sideRight: {
    minWidth: Sizer.hSize(40),
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Sizer.hSize(8),
  },
  title: {
    flex: 1,
  },
  bellWrap: {
    position: 'relative',
  },
  bellDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
});
