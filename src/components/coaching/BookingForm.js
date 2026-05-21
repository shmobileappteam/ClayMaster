import React from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../atomComponents';
import Icon from '../../helpers/Icon';
import {
  coachInfo,
  focusOptions,
  timeSlots,
} from '../../constants/bookingData';
import { COLORS, GLOBALSTYLE, SHADOWS, SPACING } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import { showMessage } from '../../utils';

const SESSION_TYPES = [
  { type: 'Virtual', icon: 'videocam-outline', label: 'Virtual', helper: 'Video call' },
  { type: 'In-Person', icon: 'location-outline', label: 'In-Person', helper: 'At the range' },
];

const BookingForm = ({
  sessionType,
  selectedDate,
  selectedDateLabel,
  selectedTime,
  focusArea,
  notes,
  isEditing,
  onSessionTypeChange,
  onDateChange,
  onTimeChange,
  onFocusAreaChange,
  onNotesChange,
  onSubmit,
}) => {
  const isSubmitDisabled = !selectedDate || !selectedTime;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
    >
      {isEditing ? (
        <View style={styles.editBanner}>
          <Typography fFamily="barlowSemiBold600" size={14} color={COLORS.textPrimary}>
            Rescheduling booking
          </Typography>
          <Typography size={12} color={COLORS.textSecondary} mT={4} lineHeight={18}>
            Update the date, time, or focus area, then save your new session slot.
          </Typography>
        </View>
      ) : null}

      <View style={[GLOBALSTYLE.screenCard, styles.coachCard]}>
        <View style={styles.coachAvatar}>
          <Typography fFamily="barlowSemiBold600" size={20} color={COLORS.white100}>
            {coachInfo.initials}
          </Typography>
        </View>
        <View>
          <Typography fFamily="barlowSemiBold600" size={20} color={COLORS.textPrimary}>
            {coachInfo.name}
          </Typography>
          <Typography size={14} color={COLORS.textSecondary} mT={2}>
            {coachInfo.experience}
          </Typography>
        </View>
      </View>

      <Typography fFamily="barlowSemiBold600" size={20} color={COLORS.textPrimary} mB={12}>
        Session Type
      </Typography>
      <View style={styles.typeGrid}>
        {SESSION_TYPES.map(option => {
          const isSelected = sessionType === option.type;
          return (
            <TouchableOpacity
              key={option.type}
              style={[
                styles.typeCard,
                isSelected ? styles.typeCardActive : styles.typeCardIdle,
              ]}
              onPress={() => onSessionTypeChange(option.type)}
              activeOpacity={0.88}
            >
              <Icon
                name={option.icon}
                iconFamily="Ionicons"
                size={22}
                color={isSelected ? COLORS.white100 : COLORS.primary}
              />
              <Typography
                fFamily="barlowSemiBold600"
                size={14}
                color={isSelected ? COLORS.white100 : COLORS.textPrimary}
                mT={8}
              >
                {option.label}
              </Typography>
              <Typography
                size={12}
                color={isSelected ? 'rgba(255,255,255,0.8)' : COLORS.textSecondary}
                mT={4}
              >
                {option.helper}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </View>

      <Typography fFamily="barlowSemiBold600" size={20} color={COLORS.textPrimary} mT={24} mB={12}>
        Select Date
      </Typography>
      <TextInput
        value={selectedDate}
        onChangeText={onDateChange}
        placeholder="YYYY-MM-DD"
        placeholderTextColor={COLORS.textSecondary}
        style={styles.dateInput}
        keyboardType="numbers-and-punctuation"
      />

      <Typography fFamily="barlowSemiBold600" size={20} color={COLORS.textPrimary} mT={24} mB={12}>
        Available Times
      </Typography>
      <View style={styles.timeGrid}>
        {timeSlots.map(time => {
          const isSelected = selectedTime === time;
          return (
            <TouchableOpacity
              key={time}
              style={[styles.timeSlot, isSelected && styles.timeSlotActive]}
              onPress={() => onTimeChange(time)}
              activeOpacity={0.88}
            >
              <Typography
                fFamily="barlowMedium500"
                size={14}
                color={isSelected ? COLORS.white100 : COLORS.textPrimary}
              >
                {time}
              </Typography>
            </TouchableOpacity>
          );
        })}
      </View>

      <Typography fFamily="barlowMedium500" size={14} color={COLORS.textPrimary} mT={24} mB={6}>
        Focus Area
      </Typography>
      <View style={styles.focusWrap}>
        {focusOptions.map(opt => (
          <TouchableOpacity
            key={opt}
            style={[styles.focusChip, focusArea === opt && styles.focusChipActive]}
            onPress={() => onFocusAreaChange(opt)}
          >
            <Typography
              size={13}
              color={focusArea === opt ? COLORS.white100 : COLORS.textPrimary}
              fFamily="barlowMedium500"
            >
              {opt}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      <Typography fFamily="barlowMedium500" size={14} color={COLORS.textPrimary} mT={24} mB={6}>
        Notes for Coach
      </Typography>
      <TextInput
        value={notes}
        onChangeText={onNotesChange}
        placeholder="Any specific areas you want to work on..."
        placeholderTextColor={COLORS.textSecondary}
        multiline
        numberOfLines={3}
        style={styles.notesInput}
        textAlignVertical="top"
      />

      <View style={[GLOBALSTYLE.screenCard, styles.summary]}>
        <View style={styles.summaryRow}>
          <View style={{ flex: 1 }}>
            <Typography fFamily="barlowSemiBold600" size={14} color={COLORS.textPrimary}>
              Session Summary
            </Typography>
            <Typography size={12} color={COLORS.textSecondary} mT={4} lineHeight={18}>
              {selectedDateLabel && selectedTime
                ? `${selectedDateLabel} · ${selectedTime} · ${sessionType}`
                : 'Choose a date and time to confirm your coaching session.'}
            </Typography>
            <Typography size={12} color={COLORS.textSecondary} mT={2}>
              Focus: {focusArea}
            </Typography>
          </View>
          <Typography fFamily="barlowSemiBold600" size={20} color={COLORS.primary}>
            $75
          </Typography>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.submitBtn, isSubmitDisabled && styles.submitDisabled]}
        onPress={() => {
          if (isSubmitDisabled) {
            showMessage({
              type: 'danger',
              message: 'Choose a date and time before confirming.',
            });
            return;
          }
          onSubmit();
        }}
        activeOpacity={0.88}
        disabled={isSubmitDisabled}
      >
        <Typography fFamily="barlowSemiBold600" size={16} color={COLORS.white100}>
          {isEditing ? 'Update Booking' : 'Confirm Booking'}
        </Typography>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BookingForm;

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: Sizer.vSize(32),
    gap: 0,
  },
  editBanner: {
    backgroundColor: 'rgba(255, 239, 227, 0.5)',
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    padding: Sizer.hSize(SPACING.cardP),
    marginBottom: Sizer.vSize(SPACING.section),
  },
  coachCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
    padding: Sizer.hSize(SPACING.cardP),
    marginBottom: Sizer.vSize(SPACING.section),
    ...SHADOWS.card,
  },
  coachAvatar: {
    width: Sizer.hSize(56),
    height: Sizer.hSize(56),
    borderRadius: Sizer.hSize(28),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeGrid: {
    flexDirection: 'row',
    gap: Sizer.hSize(SPACING.component),
  },
  typeCard: {
    flex: 1,
    borderRadius: Sizer.hSize(12),
    padding: Sizer.hSize(SPACING.cardP),
    alignItems: 'center',
  },
  typeCardActive: {
    backgroundColor: COLORS.primary,
  },
  typeCardIdle: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    ...SHADOWS.card,
  },
  dateInput: {
    height: Sizer.vSize(48),
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    borderRadius: Sizer.hSize(12),
    paddingHorizontal: Sizer.hSize(16),
    fontSize: Sizer.fS(14),
    fontFamily: 'Barlow-Regular',
    color: COLORS.textPrimary,
    backgroundColor: COLORS.surface,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizer.hSize(SPACING.component),
  },
  timeSlot: {
    width: '30%',
    minWidth: Sizer.hSize(96),
    height: Sizer.vSize(48),
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.soft,
  },
  timeSlotActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  focusWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizer.hSize(8),
  },
  focusChip: {
    paddingHorizontal: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(8),
    borderRadius: Sizer.hSize(20),
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    backgroundColor: COLORS.surface,
  },
  focusChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  notesInput: {
    minHeight: Sizer.vSize(88),
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    borderRadius: Sizer.hSize(12),
    paddingHorizontal: Sizer.hSize(16),
    paddingVertical: Sizer.vSize(12),
    fontSize: Sizer.fS(14),
    fontFamily: 'Barlow-Regular',
    color: COLORS.textPrimary,
    backgroundColor: COLORS.surface,
  },
  summary: {
    padding: Sizer.hSize(SPACING.cardP),
    marginTop: Sizer.vSize(SPACING.section),
    marginBottom: Sizer.vSize(SPACING.section),
    ...SHADOWS.card,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Sizer.hSize(12),
  },
  submitBtn: {
    height: Sizer.vSize(48),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitDisabled: {
    opacity: 0.6,
  },
});
