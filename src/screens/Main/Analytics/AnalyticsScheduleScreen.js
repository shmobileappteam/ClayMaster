import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Container, Typography, AppLoader } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import BookingForm from '../../../components/coaching/BookingForm';
import BookingHistoryCard from '../../../components/coaching/BookingHistoryCard';
import Icon from '../../../helpers/Icon';
import { getCoaches, getSessions } from '../../../api/coachingService';
import {
  openExternalUrl,
  splitAppointments,
} from '../../../constants/coaching';
import { COLORS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { showMessage } from '../../../utils';
import { useRequireLibraryMode } from '../../../hooks/useRequireLibraryMode';

const TABS = [
  { key: 'book', label: 'Book New' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'History' },
];

/**
 * On-line Coaching sessions — coaches (Calendly) + appointments from GET /api/sessions
 */
const AnalyticsScheduleScreen = ({ navigation, route }) => {
  const blocked = useRequireLibraryMode();

  const initialTab = route?.params?.tab;
  const [activeTab, setActiveTab] = useState(
    TABS.some(t => t.key === initialTab) ? initialTab : 'book',
  );

  useEffect(() => {
    if (route?.params?.tab && TABS.some(t => t.key === route.params.tab)) {
      setActiveTab(route.params.tab);
    }
  }, [route?.params?.tab]);

  const {
    data: coachesData,
    isLoading: loadingCoaches,
    isError: coachesError,
    isFetching: fetchingCoaches,
    refetch: refetchCoaches,
  } = useCustomQuery({
    queryKey: ['coaches'],
    queryFn: getCoaches,
  });

  const {
    data: sessions,
    isLoading: loadingSessions,
    isError: sessionsError,
    isFetching: fetchingSessions,
    refetch: refetchSessions,
  } = useCustomQuery({
    queryKey: ['sessions'],
    queryFn: getSessions,
  });

  useFocusEffect(
    useCallback(() => {
      refetchSessions();
    }, [refetchSessions, route?.params?.refreshSessions]),
  );

  const coaches = coachesData?.items || [];
  const { upcoming, past } = useMemo(
    () => splitAppointments(sessions?.appointments),
    [sessions?.appointments],
  );

  if (blocked) {
    return null;
  }

  const findCoachBookingUrl = coachName => {
    if (!coachName) return null;
    const match = coaches.find(
      c => c.name?.toLowerCase() === String(coachName).toLowerCase(),
    );
    return match?.booking_url || coaches[0]?.booking_url || null;
  };

  const openCalendly = (url, coachName) => {
    if (!url) {
      showMessage({
        type: 'danger',
        message: 'No booking link available for this coach.',
      });
      return;
    }
    navigation.navigate('CalendlyBookingScreen', {
      url,
      title: coachName ? `Book with ${coachName}` : 'Book Session',
    });
  };

  const handleBookCoach = coach => {
    openCalendly(coach?.booking_url, coach?.name);
  };

  const handleJoinSession = booking => {
    openExternalUrl(booking?.joinUrl, Linking, showMessage);
  };

  const handleBookAgain = booking => {
    const url = findCoachBookingUrl(booking?.coach);
    if (!url) {
      setActiveTab('book');
      showMessage({
        type: 'success',
        message: 'Pick a coach below to schedule another session.',
      });
      return;
    }
    openCalendly(url, booking?.coach);
  };

  const refreshLists = () => {
    refetchSessions();
    refetchCoaches();
  };

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="On-line Coaching"
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
              coaches={coaches}
              canBook={sessions?.canBookSession !== false}
              remainingSessions={sessions?.summary?.remainingSessions ?? 0}
              isLoading={loadingCoaches}
              isError={coachesError}
              onRetry={refetchCoaches}
              onBookCoach={handleBookCoach}
              refreshing={fetchingCoaches && !loadingCoaches}
              onRefresh={refreshLists}
            />
          ) : null}

          {activeTab === 'upcoming' ? (
            <ScrollView
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={fetchingSessions && !loadingSessions}
                  onRefresh={refetchSessions}
                  tintColor={COLORS.primary}
                />
              }
            >
              {loadingSessions ? (
                <AppLoader />
              ) : sessionsError ? (
                <TouchableOpacity onPress={refetchSessions}>
                  <Typography color={COLORS.primary} fFamily="barlowSemiBold600">
                    Could not load sessions. Tap to retry.
                  </Typography>
                </TouchableOpacity>
              ) : upcoming.length === 0 ? (
                <View style={styles.empty}>
                  <Icon
                    name="calendar-outline"
                    iconFamily="Ionicons"
                    size={40}
                    color={COLORS.textSecondary}
                  />
                  <Typography size={14} color={COLORS.textSecondary} mT={12} textAlign="center">
                    No upcoming sessions yet
                  </Typography>
                  <Typography
                    size={12}
                    color={COLORS.textSecondary}
                    mT={8}
                    textAlign="center"
                  >
                    After you book, pull to refresh — confirmation can take a moment.
                  </Typography>
                </View>
              ) : (
                upcoming.map(booking => (
                  <BookingHistoryCard
                    key={booking.id}
                    booking={booking}
                    variant="upcoming"
                    onJoin={handleJoinSession}
                    onBookAgain={handleBookAgain}
                  />
                ))
              )}
            </ScrollView>
          ) : null}

          {activeTab === 'past' ? (
            <ScrollView
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={fetchingSessions && !loadingSessions}
                  onRefresh={refetchSessions}
                  tintColor={COLORS.primary}
                />
              }
            >
              {loadingSessions ? (
                <AppLoader />
              ) : sessionsError ? (
                <TouchableOpacity onPress={refetchSessions}>
                  <Typography color={COLORS.primary} fFamily="barlowSemiBold600">
                    Could not load sessions. Tap to retry.
                  </Typography>
                </TouchableOpacity>
              ) : past.length === 0 ? (
                <View style={styles.empty}>
                  <Icon
                    name="time-outline"
                    iconFamily="Ionicons"
                    size={40}
                    color={COLORS.textSecondary}
                  />
                  <Typography size={14} color={COLORS.textSecondary} mT={12}>
                    No past sessions
                  </Typography>
                </View>
              ) : (
                past.map(booking => (
                  <BookingHistoryCard
                    key={booking.id}
                    booking={booking}
                    variant="past"
                  />
                ))
              )}
            </ScrollView>
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
  empty: {
    alignItems: 'center',
    paddingVertical: Sizer.vSize(48),
    paddingHorizontal: Sizer.hSize(16),
  },
});
