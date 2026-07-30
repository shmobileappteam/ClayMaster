import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../atomComponents';
import Icon from '../../helpers/Icon';
import { COLORS, GLOBALSTYLE, SHADOWS, SPACING } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';

const BookingHistoryCard = ({ booking, variant, onJoin, onBookAgain }) => {
  const isCompleted = booking.status === 'Completed';
  const isCancelled = booking.status === 'Cancelled';
  const canJoin = Boolean(booking.joinUrl);

  return (
    <View style={[GLOBALSTYLE.screenCard, styles.card]}>
      <View style={styles.header}>
        <View style={styles.coachRow}>
          <View style={styles.avatar}>
            <Typography fFamily="barlowSemiBold600" size={12} color={COLORS.white100}>
              {booking.initials}
            </Typography>
          </View>
          <View style={{ flex: 1 }}>
            <Typography fFamily="barlowSemiBold600" size={14} color={COLORS.textPrimary}>
              {booking.coach}
            </Typography>
            {booking.name ? (
              <Typography size={12} color={COLORS.textSecondary} mT={2}>
                {booking.name}
              </Typography>
            ) : null}
          </View>
        </View>
        <View style={styles.statusBadge}>
          <Typography size={12} color={COLORS.primary} fFamily="barlowMedium500">
            {booking.status}
          </Typography>
        </View>
      </View>

      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Icon name="calendar-outline" iconFamily="Ionicons" size={14} color={COLORS.textSecondary} />
          <Typography size={12} color={COLORS.textPrimary} mL={6}>
            {booking.date}
          </Typography>
        </View>
        <View style={styles.metaItem}>
          <Icon name="time-outline" iconFamily="Ionicons" size={14} color={COLORS.textSecondary} />
          <Typography size={12} color={COLORS.textPrimary} mL={6}>
            {booking.time}
          </Typography>
        </View>
      </View>

      {variant === 'upcoming' ? (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.joinBtn, !canJoin && styles.joinBtnDisabled]}
            onPress={() => onJoin?.(booking)}
            activeOpacity={0.88}
            disabled={!canJoin}
          >
            <Typography fFamily="barlowSemiBold600" size={14} color={COLORS.white100}>
              {canJoin ? 'Join Session' : 'Link pending'}
            </Typography>
          </TouchableOpacity>
          {onBookAgain ? (
            <TouchableOpacity
              style={styles.rescheduleBtn}
              onPress={() => onBookAgain?.(booking)}
              activeOpacity={0.88}
            >
              <Typography fFamily="barlowSemiBold600" size={14} color={COLORS.textPrimary}>
                Book again
              </Typography>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : (
        <View style={styles.pastStatus}>
          <Icon
            name={isCompleted ? 'checkmark-circle' : 'close-circle'}
            iconFamily="Ionicons"
            size={16}
            color={
              isCancelled
                ? COLORS.destructive
                : isCompleted
                  ? COLORS.primary
                  : COLORS.textSecondary
            }
          />
          <Typography
            size={12}
            color={isCancelled ? COLORS.destructive : COLORS.textPrimary}
            fFamily="barlowMedium500"
            mL={6}
          >
            {booking.status}
          </Typography>
        </View>
      )}
    </View>
  );
};

export default BookingHistoryCard;

const styles = StyleSheet.create({
  card: {
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Sizer.vSize(12),
  },
  coachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(8),
    flex: 1,
    paddingRight: Sizer.hSize(8),
  },
  avatar: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    borderRadius: Sizer.hSize(20),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: Sizer.hSize(10),
    paddingVertical: Sizer.vSize(4),
    borderRadius: Sizer.hSize(20),
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizer.hSize(16),
    marginBottom: Sizer.vSize(12),
  },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  actions: { flexDirection: 'row', gap: Sizer.hSize(12) },
  joinBtn: {
    flex: 1,
    height: Sizer.vSize(40),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinBtnDisabled: {
    opacity: 0.55,
  },
  rescheduleBtn: {
    flex: 1,
    height: Sizer.vSize(40),
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  pastStatus: { flexDirection: 'row', alignItems: 'center' },
});
