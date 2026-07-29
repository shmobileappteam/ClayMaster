import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
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
  mapApiNotification,
} from '../../../constants/notifications';
import { showToast } from '../../../utils';
import { navigateFromTabToStack } from '../../../navigation/navigationHelpers';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { useCustomMutation } from '../../../query/useCustomMutation';
import {
  deleteNotification,
  getNotificationCounts,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../../api/notificationService';

const NotificationScreen = ({ navigation }) => {
  const queryClient = useQueryClient();

  const {
    data: listData,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useCustomQuery({
    queryKey: ['notifications', { page: 1 }],
    queryFn: () => getNotifications({ page: 1, per_page: 50, unread_only: 0 }),
  });

  const { data: counts } = useCustomQuery({
    queryKey: ['notificationCounts'],
    queryFn: getNotificationCounts,
  });

  const notifications = useMemo(
    () => (listData?.items || []).map(mapApiNotification),
    [listData?.items],
  );

  const unreadCount =
    typeof counts?.unread === 'number'
      ? counts.unread
      : notifications.filter(n => n.unread).length;

  const invalidateNotifications = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
    queryClient.invalidateQueries({ queryKey: ['notificationCounts'] });
  }, [queryClient]);

  const { mutate: markRead } = useCustomMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => invalidateNotifications(),
  });

  const { mutate: markAllRead, isPending: isMarkingAll } = useCustomMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      invalidateNotifications();
      showToast({
        title: 'Notifications updated',
        description: 'All notifications are marked as read.',
      });
    },
  });

  const { mutate: removeNotification } = useCustomMutation({
    mutationFn: deleteNotification,
    onSuccess: data => {
      if (data?.status) {
        invalidateNotifications();
        showToast({ title: 'Notification removed' });
      } else {
        showToast({
          title: 'Could not remove notification',
          description: 'Please try again.',
        });
      }
    },
  });

  const openNotificationTarget = item => {
    if (item.downloadUrl) {
      Linking.openURL(item.downloadUrl).catch(() => {
        showToast({ title: 'Unable to open download link' });
      });
      return;
    }
    if (item.roundId) {
      navigateFromTabToStack(navigation, 'LibraryScorecardScreen', {
        round_id: item.roundId,
      });
    }
  };

  const handlePress = item => {
    if (item.unread) {
      markRead(item.id);
    }
    openNotificationTarget(item);
  };

  const handleLongPress = item => {
    Alert.alert('Delete notification', 'Remove this notification?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => removeNotification(item.id),
      },
    ]);
  };

  const handleMarkAllRead = () => {
    if (unreadCount === 0 || isMarkingAll) return;
    markAllRead();
  };

  const renderRow = (item, index) => {
    const icon = getNotificationIcon(item.iconType);
    const isLast = index === notifications.length - 1;

    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.row,
          !isLast && styles.rowBorder,
          item.unread && styles.rowUnreadBg,
        ]}
        activeOpacity={0.88}
        onPress={() => handlePress(item)}
        onLongPress={() => handleLongPress(item)}
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
          {item.desc ? (
            <Typography
              size={12}
              lineHeight={17}
              color={COLORS.textSecondary}
              numberOfLines={2}
              mT={2}
            >
              {item.desc}
            </Typography>
          ) : null}
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
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor={COLORS.primary}
          />
        }
      >
        <View style={styles.summaryBar}>
          <View style={styles.summaryText}>
            <Typography
              fFamily="barlowSemiBold600"
              size={14}
              lineHeight={21}
              color={COLORS.textPrimary}
            >
              {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}
            </Typography>
            <Typography
              size={12}
              lineHeight={17}
              color={COLORS.textSecondary}
              mT={2}
            >
              Tap to open · Long-press to delete
            </Typography>
          </View>
          <TouchableOpacity
            style={[
              styles.markAllBtn,
              (unreadCount === 0 || isMarkingAll) && styles.markAllBtnDisabled,
            ]}
            onPress={handleMarkAllRead}
            disabled={unreadCount === 0 || isMarkingAll}
            activeOpacity={0.88}
          >
            <Icon
              name="checkmark-done"
              iconFamily="Ionicons"
              size={16}
              color={COLORS.primary}
            />
            <Typography
              fFamily="barlowSemiBold600"
              size={12}
              lineHeight={17}
              color={COLORS.primary}
              mL={4}
            >
              {isMarkingAll ? 'Updating...' : 'Mark all read'}
            </Typography>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator color={COLORS.primary} size="large" />
          </View>
        ) : null}

        {isError && !isLoading ? (
          <View style={styles.emptyCard}>
            <Typography
              fFamily="barlowSemiBold600"
              size={16}
              color={COLORS.textPrimary}
              textAlign="center"
            >
              Could not load notifications
            </Typography>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => refetch()}
              activeOpacity={0.88}
            >
              <Typography
                fFamily="barlowSemiBold600"
                size={14}
                color={COLORS.primary}
              >
                Retry
              </Typography>
            </TouchableOpacity>
          </View>
        ) : null}

        {!isLoading && !isError && notifications.length === 0 ? (
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
              Updates about rounds, coaching, and account activity will appear
              here.
            </Typography>
          </View>
        ) : null}

        {!isLoading && !isError && notifications.length > 0 ? (
          <View style={styles.listCard}>
            {notifications.map((item, index) => renderRow(item, index))}
          </View>
        ) : null}
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
  centerState: {
    paddingVertical: Sizer.vSize(40),
    alignItems: 'center',
  },
  retryBtn: {
    marginTop: Sizer.vSize(12),
    paddingHorizontal: Sizer.hSize(16),
    paddingVertical: Sizer.vSize(8),
  },
});
