import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../atomComponents';
import Icon from '../../helpers/Icon';
import { COLORS, GLOBALSTYLE, SHADOWS, SPACING } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';

const BookingHistoryCard = ({
  booking,
  variant,
  onJoin,
  onReschedule,
}) => {
  const isCompleted = booking.status === 'Completed';
  const isCancelled = booking.status === 'Cancelled';

  return (
    <View
      style={[
        GLOBALSTYLE.screenCard,
        styles.card,
        booking.isNew && styles.cardNew,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.coachRow}>
          <View style={styles.avatar}>
            <Typography fFamily="barlowSemiBold600" size={12} color={COLORS.white100}>
              {booking.initials}
            </Typography>
          </View>
          <View>
            <Typography fFamily="barlowSemiBold600" size={14} color={COLORS.textPrimary}>
              {booking.coach}
            </Typography>
            <Typography size={12} color={COLORS.textSecondary} mT={2}>
              {booking.type} · {booking.focus}
            </Typography>
          </View>
        </View>
        <View style={styles.badges}>
          <View style={styles.statusBadge}>
            <Typography size={12} color={COLORS.primary} fFamily="barlowMedium500">
              {booking.status}
            </Typography>
          </View>
          {booking.isNew ? (
            <View style={styles.newBadge}>
              <Typography size={12} color={COLORS.textPrimary} fFamily="barlowMedium500">
                New
              </Typography>
            </View>
          ) : null}
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

      {booking.notes ? (
        <Typography size={12} color={COLORS.textSecondary} mB={12}>
          {booking.notes}
        </Typography>
      ) : null}

      {variant === 'upcoming' ? (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.joinBtn}
            onPress={() => onJoin?.(booking)}
            activeOpacity={0.88}
          >
            <Typography fFamily="barlowSemiBold600" size={14} color={COLORS.white100}>
              Join Session
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rescheduleBtn}
            onPress={() => onReschedule?.(booking)}
            activeOpacity={0.88}
          >
            <Typography fFamily="barlowSemiBold600" size={14} color={COLORS.textPrimary}>
              Reschedule
            </Typography>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.pastStatus}>
          <Icon
            name={isCompleted ? 'checkmark-circle' : 'close-circle'}
            iconFamily="Ionicons"
            size={16}
            color={isCancelled ? COLORS.destructive : isCompleted ? COLORS.primary : COLORS.textSecondary}
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
  cardNew: {
    borderWidth: 1,
    borderColor: 'rgba(235, 108, 15, 0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Sizer.vSize(12),
  },
  coachRow: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(8), flex: 1 },
  avatar: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    borderRadius: Sizer.hSize(20),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badges: { alignItems: 'flex-end', gap: Sizer.hSize(8) },
  statusBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: Sizer.hSize(10),
    paddingVertical: Sizer.vSize(4),
    borderRadius: Sizer.hSize(20),
  },
  newBadge: {
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
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
