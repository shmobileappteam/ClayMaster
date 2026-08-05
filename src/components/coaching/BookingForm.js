import React from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Typography, AppLoader } from '../../atomComponents';
import Icon from '../../helpers/Icon';
import { coachInitials } from '../../constants/coaching';
import { COLORS, GLOBALSTYLE, SHADOWS, SPACING } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';

/** Book via coach Calendly URLs from GET /api/coaches */
const BookingForm = ({
  coaches = [],
  canBook = true,
  remainingSessions = 0,
  isLoading,
  isError,
  onRetry,
  onBookCoach,
  refreshing,
  onRefresh,
}) => (
  <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={styles.scroll}
    refreshControl={
      onRefresh ? (
        <RefreshControl
          refreshing={Boolean(refreshing)}
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
        />
      ) : undefined
    }
  >
    <View style={[GLOBALSTYLE.screenCard, styles.infoCard]}>
      <Typography fFamily="barlowSemiBold600" size={16} color={COLORS.textPrimary}>
        Book with a coach
      </Typography>
      <Typography size={13} color={COLORS.textSecondary} mT={6} lineHeight={18}>
        Choose a coach to schedule in-app. You have{' '}
        {remainingSessions} session{remainingSessions === 1 ? '' : 's'} remaining.
      </Typography>
      {!canBook ? (
        <Typography size={13} color={COLORS.destructive} mT={8}>
          Booking is currently unavailable for your account.
        </Typography>
      ) : null}
    </View>

    {isLoading ? (
      <AppLoader />
    ) : isError ? (
      <TouchableOpacity onPress={onRetry}>
        <Typography color={COLORS.primary} fFamily="barlowSemiBold600">
          Could not load coaches. Tap to retry.
        </Typography>
      </TouchableOpacity>
    ) : coaches.length === 0 ? (
      <View style={styles.empty}>
        <Icon name="people-outline" iconFamily="Ionicons" size={40} color={COLORS.textSecondary} />
        <Typography size={14} color={COLORS.textSecondary} mT={12}>
          No coaches available
        </Typography>
      </View>
    ) : (
      coaches.map(coach => (
        <View key={coach.key || coach.name} style={[GLOBALSTYLE.screenCard, styles.coachCard]}>
          <View style={styles.coachRow}>
            <View style={styles.avatar}>
              <Typography fFamily="barlowSemiBold600" size={16} color={COLORS.white100}>
                {coachInitials(coach.name)}
              </Typography>
            </View>
            <View style={{ flex: 1 }}>
              <Typography fFamily="barlowSemiBold600" size={16} color={COLORS.textPrimary}>
                {coach.name}
              </Typography>
              <Typography size={12} color={COLORS.textSecondary} mT={2}>
                Online coaching
              </Typography>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.bookBtn, !canBook && styles.bookBtnDisabled]}
            activeOpacity={0.88}
            disabled={!canBook || !coach.booking_url}
            onPress={() => onBookCoach?.(coach)}
          >
            <Icon name="calendar-outline" iconFamily="Ionicons" size={16} color={COLORS.white100} />
            <Typography
              fFamily="barlowSemiBold600"
              size={14}
              color={COLORS.white100}
              mL={8}
            >
              Schedule
            </Typography>
          </TouchableOpacity>
        </View>
      ))
    )}
  </ScrollView>
);

export default BookingForm;

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(SPACING.component),
  },
  infoCard: {
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
  coachCard: {
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
  coachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
    marginBottom: Sizer.vSize(14),
  },
  avatar: {
    width: Sizer.hSize(44),
    height: Sizer.hSize(44),
    borderRadius: Sizer.hSize(22),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookBtn: {
    height: Sizer.vSize(44),
    borderRadius: Sizer.hSize(12),
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookBtnDisabled: {
    opacity: 0.5,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: Sizer.vSize(40),
  },
});
