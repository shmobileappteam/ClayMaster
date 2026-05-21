import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import BookingForm from '../../../components/coaching/BookingForm';
import BookingHistoryCard from '../../../components/coaching/BookingHistoryCard';
import Icon from '../../../helpers/Icon';
import {
  formatSessionDate,
  getDefaultBookingDate,
  initialPastBookings,
  initialUpcomingBookings,
} from '../../../constants/bookingData';
import { COLORS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { showMessage } from '../../../utils';

const TABS = [
  { key: 'book', label: 'Book New' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'History' },
];

/**
 * ClayMaster-App-UI `/book-session` — opened from Analytics "Schedule Analytics Session"
 */
const AnalyticsScheduleScreen = ({ navigation, route }) => {
  const initialTab = route?.params?.tab;
  const [activeTab, setActiveTab] = useState(
    TABS.some(t => t.key === initialTab) ? initialTab : 'book',
  );
  const [upcomingBookings, setUpcomingBookings] = useState(initialUpcomingBookings);
  const [pastBookings] = useState(initialPastBookings);
  const [sessionType, setSessionType] = useState('Virtual');
  const [selectedDate, setSelectedDate] = useState(getDefaultBookingDate());
  const [selectedTime, setSelectedTime] = useState('');
  const [focusArea, setFocusArea] = useState('General Improvement');
  const [notes, setNotes] = useState('');
  const [editingBookingId, setEditingBookingId] = useState(null);

  useEffect(() => {
    if (route?.params?.tab && TABS.some(t => t.key === route.params.tab)) {
      setActiveTab(route.params.tab);
    }
  }, [route?.params?.tab]);

  const selectedDateLabel = selectedDate ? formatSessionDate(selectedDate) : null;
  const latestBooking = upcomingBookings.find(b => b.isNew);

  const resetForm = () => {
    setSessionType('Virtual');
    setSelectedDate(getDefaultBookingDate());
    setSelectedTime('');
    setFocusArea('General Improvement');
    setNotes('');
    setEditingBookingId(null);
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime) {
      showMessage({
        type: 'danger',
        message: 'Select an available slot before confirming your session.',
      });
      return;
    }

    const bookingId = editingBookingId ?? Date.now();
    const updatedBooking = {
      id: bookingId,
      coach: 'Kevin DeMichiel',
      initials: 'KD',
      sessionDate: selectedDate,
      date: formatSessionDate(selectedDate),
      time: selectedTime,
      type: sessionType,
      focus: focusArea,
      status: 'Confirmed',
      notes: notes.trim() || undefined,
      isNew: true,
    };

    setUpcomingBookings(current => {
      let replaced = false;
      const next = current.map(booking => {
        const clean = { ...booking, isNew: false };
        if (editingBookingId && booking.id === editingBookingId) {
          replaced = true;
          return updatedBooking;
        }
        return clean;
      });
      return replaced ? next : [updatedBooking, ...next];
    });

    showMessage({
      type: 'success',
      message: editingBookingId
        ? `${updatedBooking.date} at ${updatedBooking.time} — booking updated.`
        : `${updatedBooking.date} at ${updatedBooking.time} — booking confirmed.`,
    });

    resetForm();
    setActiveTab('upcoming');
  };

  const handleJoinSession = booking => {
    showMessage({
      type: 'success',
      message: `You're set for ${booking.date} at ${booking.time} with ${booking.coach}.`,
    });
  };

  const handleReschedule = booking => {
    setEditingBookingId(booking.id);
    setSessionType(booking.type);
    setSelectedDate(booking.sessionDate);
    setSelectedTime(booking.time);
    setFocusArea(booking.focus);
    setNotes(booking.notes ?? '');
    setActiveTab('book');
    showMessage({
      type: 'success',
      message: 'Update the booking details and save your new session time.',
    });
  };

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Coaching Sessions"
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
      />
      <View style={styles.body}>
        <View style={styles.tabBar}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, isActive && styles.tabActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.88}
              >
                <Typography
                  fFamily="barlowMedium500"
                  size={14}
                  color={isActive ? COLORS.white100 : COLORS.textSecondary}
                >
                  {tab.label}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.tabContent}>
          {activeTab === 'book' ? (
            <BookingForm
              sessionType={sessionType}
              selectedDate={selectedDate}
              selectedDateLabel={selectedDateLabel}
              selectedTime={selectedTime}
              focusArea={focusArea}
              notes={notes}
              isEditing={editingBookingId != null}
              onSessionTypeChange={setSessionType}
              onDateChange={setSelectedDate}
              onTimeChange={setSelectedTime}
              onFocusAreaChange={setFocusArea}
              onNotesChange={setNotes}
              onSubmit={handleConfirmBooking}
            />
          ) : null}

          {activeTab === 'upcoming' ? (
            <View style={styles.list}>
              {latestBooking ? (
                <View style={styles.confirmedBanner}>
                  <Typography fFamily="barlowSemiBold600" size={14} color={COLORS.textPrimary}>
                    Booking confirmed
                  </Typography>
                  <Typography size={12} color={COLORS.textSecondary} mT={4}>
                    {latestBooking.date} · {latestBooking.time} · {latestBooking.focus}
                  </Typography>
                </View>
              ) : null}
              {upcomingBookings.length === 0 ? (
                <View style={styles.empty}>
                  <Icon name="calendar-outline" iconFamily="Ionicons" size={40} color={COLORS.textSecondary} />
                  <Typography size={14} color={COLORS.textSecondary} mT={12}>
                    No upcoming sessions
                  </Typography>
                </View>
              ) : (
                upcomingBookings.map(booking => (
                  <BookingHistoryCard
                    key={booking.id}
                    booking={booking}
                    variant="upcoming"
                    onJoin={handleJoinSession}
                    onReschedule={handleReschedule}
                  />
                ))
              )}
            </View>
          ) : null}

          {activeTab === 'past' ? (
            <View style={styles.list}>
              {pastBookings.map(booking => (
                <BookingHistoryCard
                  key={booking.id}
                  booking={booking}
                  variant="past"
                />
              ))}
            </View>
          ) : null}
        </View>
      </View>
    </Container>
  );
};

export default AnalyticsScheduleScreen;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.grey600,
    borderRadius: Sizer.hSize(12),
    padding: Sizer.hSize(4),
    marginBottom: Sizer.vSize(SPACING.section),
  },
  tab: {
    flex: 1,
    height: Sizer.vSize(40),
    borderRadius: Sizer.hSize(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabContent: {
    flex: 1,
  },
  list: {
    gap: Sizer.vSize(SPACING.component),
    paddingBottom: Sizer.vSize(40),
  },
  confirmedBanner: {
    backgroundColor: COLORS.surface,
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    padding: Sizer.hSize(SPACING.cardP),
    marginBottom: Sizer.vSize(SPACING.component),
  },
  empty: {
    alignItems: 'center',
    paddingVertical: Sizer.vSize(48),
  },
});
