import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import Icon from '../../../helpers/Icon';
import {
  COLORS,
  RADIUS,
  SHADOWS,
  SPACING,
} from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import {
  getNotificationIcon,
  INITIAL_NOTIFICATIONS,
} from '../../../constants/notifications';
import { showToast } from '../../../utils';

/**
 * CONTENT INVENTORY — ClayMaster-App-UI `Notifications.tsx`
 * Header: 1 (Notifications, showBack, no bell)
 * Summary header bar: 1 (unread count + subtitle + "Mark all read")
 * List rows: 5 (each: dynamic icon, title, desc, time, unread dot?, chevron)
 * Icon types: trophy, message, calendar, shopping, bell (5 distinct — Rule 1)
 * Empty state: 1 (when list length === 0)
 */

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => n.unread).length;

  const handlePress = item => {
    setNotifications(current =>
      current.map(n => (n.id === item.id ? { ...n, unread: false } : n)),
    );
    if (item.screen) {
      navigation.navigate(item.screen);
    }
  };

  const handleMarkAllRead = () => {
    if (unreadCount === 0) return;
    setNotifications(current => current.map(n => ({ ...n, unread: false })));
    showToast({
      title: 'Notifications updated',
      description: 'All notifications are marked as read.',
    });
  };

  const renderRow = (item, index) => {
    const icon = getNotificationIcon(item.iconType);
    const isLast = index === notifications.length - 1;

    return (
      <TouchableOpacity
        style={[
          styles.row,
          !isLast && styles.rowBorder,
          item.unread && styles.rowUnreadBg,
        ]}
        activeOpacity={0.88}
        onPress={() => handlePress(item)}
      >
        <View
          style={[
            styles.iconCircle,
            item.unread ? styles.iconCircleUnread : styles.iconCircleRead,
          ]}
        >
          <Icon
            name={icon.name}
            iconFamily={icon.iconFamily}
            size={20}
            color={item.unread ? COLORS.white100 : COLORS.primary}
          />
        </View>

        <View style={styles.rowBody}>
          <Typography
            fFamily="barlowSemiBold600"
            size={14}
            lineHeight={21}
            color={item.unread ? COLORS.textPrimary : COLORS.textSecondary}
            numberOfLines={1}
          >
            {item.title}
          </Typography>
          <Typography
            size={12}
            lineHeight={17}
            color={COLORS.textSecondary}
            numberOfLines={1}
            mT={2}
          >
            {item.desc}
          </Typography>
          <Typography size={12} lineHeight={17} color={COLORS.textSecondary} mT={2}>
            {item.time}
          </Typography>
        </View>

        <View style={styles.rowRight}>
          {item.unread ? <View style={styles.unreadDot} /> : null}
          <Icon
            name="chevron-forward"
            iconFamily="Ionicons"
            size={18}
            color={COLORS.textSecondary}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader title="Notifications" showBack showNotification={false} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryBar}>
          <View style={styles.summaryText}>
            <Typography fFamily="barlowSemiBold600" size={14} lineHeight={21} color={COLORS.textPrimary}>
              {unreadCount} unread notifications
            </Typography>
            <Typography size={12} lineHeight={17} color={COLORS.textSecondary} mT={2}>
              Tap any update to open its screen.
            </Typography>
          </View>
          <TouchableOpacity
            style={[styles.markAllBtn, unreadCount === 0 && styles.markAllBtnDisabled]}
            onPress={handleMarkAllRead}
            disabled={unreadCount === 0}
            activeOpacity={0.88}
          >
            <Icon name="checkmark-done" iconFamily="Ionicons" size={16} color={COLORS.primary} />
            <Typography
              fFamily="barlowSemiBold600"
              size={12}
              lineHeight={17}
              color={COLORS.primary}
              mL={4}
            >
              Mark all read
            </Typography>
          </TouchableOpacity>
        </View>

        {notifications.length === 0 ? (
          <View style={styles.emptyCard}>
            <Icon
              name="notifications-off-outline"
              iconFamily="Ionicons"
              size={40}
              color={COLORS.textSecondary}
            />
            <Typography
              fFamily="barlowSemiBold600"
              size={16}
              lineHeight={22}
              color={COLORS.textPrimary}
              mT={16}
              textAlign="center"
            >
              No notifications yet
            </Typography>
            <Typography
              size={14}
              lineHeight={21}
              color={COLORS.textSecondary}
              mT={8}
              textAlign="center"
            >
              Updates about tournaments, coaching, and orders will appear here.
            </Typography>
          </View>
        ) : (
          <View style={styles.listCard}>
            {notifications.map((item, index) => renderRow(item, index))}
          </View>
        )}
      </ScrollView>
    </Container>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(SPACING.component),
  },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: Sizer.hSize(RADIUS.md),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderMuted,
    paddingHorizontal: Sizer.hSize(SPACING.cardP),
    paddingVertical: Sizer.vSize(12),
    ...SHADOWS.card,
  },
  summaryText: {
    flex: 1,
    minWidth: 0,
    paddingRight: Sizer.hSize(12),
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(8),
    borderRadius: Sizer.hSize(RADIUS.md),
  },
  markAllBtnDisabled: {
    opacity: 0.5,
  },
  listCard: {
    backgroundColor: COLORS.surface,
    borderRadius: Sizer.hSize(RADIUS.md),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderMuted,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: Sizer.hSize(SPACING.cardP),
    paddingVertical: Sizer.vSize(16),
    gap: Sizer.hSize(12),
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.borderMuted,
  },
  rowUnreadBg: {
    backgroundColor: 'rgba(255, 239, 227, 0.5)',
  },
  iconCircle: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    borderRadius: Sizer.hSize(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleUnread: {
    backgroundColor: COLORS.primary,
  },
  iconCircleRead: {
    backgroundColor: COLORS.primaryLight,
  },
  rowBody: {
    flex: 1,
    minWidth: 0,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(8),
    paddingTop: Sizer.vSize(2),
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: Sizer.hSize(RADIUS.md),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderMuted,
    padding: Sizer.hSize(32),
    alignItems: 'center',
    ...SHADOWS.card,
  },
});
