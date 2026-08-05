import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Container, FormController, Typography, AppLoader } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import { ScreenOverlayLoader } from '../../../components';
import ProfileField from '../../../components/profile/ProfileField';
import CustomDropdown from '../../../components/customFields/CustomDropDown';
import Icon from '../../../helpers/Icon';
import { COLORS, GLOBALSTYLE, SHADOWS, SPACING, TYPE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useRequireLibraryMode } from '../../../hooks/useRequireLibraryMode';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { useCustomMutation } from '../../../query/useCustomMutation';
import { getClasses } from '../../../api/roundService';
import { submitTournamentEntry } from '../../../api/tournamentService';
import {
  formatDisplayDate,
  mapClassOptions,
  parseIsoDate,
  toIsoDate,
} from '../../../constants/tournament';
import validatoinSchema from '../../../validations';
import { showToast } from '../../../utils';

const SectionLabel = ({ step, title, subtitle }) => (
  <View style={styles.sectionLabel}>
    <View style={styles.stepBadge}>
      <Typography fFamily="barlowBold700" size={12} color={COLORS.white100}>
        {step}
      </Typography>
    </View>
    <View style={{ flex: 1 }}>
      <Typography fFamily="barlowSemiBold600" size={16} color={COLORS.textPrimary}>
        {title}
      </Typography>
      {subtitle ? (
        <Typography size={12} color={COLORS.textSecondary} mT={2}>
          {subtitle}
        </Typography>
      ) : null}
    </View>
  </View>
);

/** Submit tournament entry — FormController + Yup (same pattern as login). */
const TournamentEntryScreen = ({ navigation }) => {
  const blocked = useRequireLibraryMode();
  const queryClient = useQueryClient();
  const { user } = useSelector(state => state.app);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { data: classesRaw, isLoading: classesLoading } = useCustomQuery({
    queryKey: ['classes'],
    queryFn: getClasses,
  });

  const classOptions = useMemo(
    () => mapClassOptions(classesRaw),
    [classesRaw],
  );

  const competitorDefault = useMemo(() => {
    const first = user?.first_name || user?.firstName || '';
    const last = user?.last_name || user?.lastName || '';
    const full = `${first} ${last}`.trim();
    return full || user?.name || user?.username || '';
  }, [user]);

  const { mutate, isPending } = useCustomMutation({
    mutationFn: submitTournamentEntry,
    onSuccess: body => {
      queryClient.invalidateQueries({ queryKey: ['tournamentLeaderboard'] });
      showToast({
        title: body?.message || 'Tournament entry submitted successfully!',
        type: 'success',
      });
      navigation.goBack();
    },
    onError: res => {
      const msg =
        res?.data?.message ||
        (typeof res?.data === 'string' ? res.data : null) ||
        'Could not submit entry. Please try again.';
      showToast({ title: msg, type: 'danger' });
    },
  });

  if (blocked) {
    return null;
  }

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Submit Score"
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FormController
          initialValues={{
            nsca_class: classOptions[0]?.value || '',
            competitor_name: competitorDefault,
            event_score: '',
            adj_factor: '',
            tournament_name: '',
            tournament_date: toIsoDate(new Date()),
          }}
          enableReinitialize
          validationSchema={
            validatoinSchema.tournamentValidations.TournamentEntrySchema
          }
          onSubmit={values => mutate(values)}
        >
          {({
            values,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
          }) => {
            const eventNum = Number(values.event_score);
            const adjNum = Number(values.adj_factor);
            const hasPreview =
              Number.isFinite(eventNum) && Number.isFinite(adjNum);
            const previewTotal = hasPreview ? eventNum + adjNum : null;
            const selectedDate = parseIsoDate(values.tournament_date);

            const onDateChange = (event, date) => {
              if (Platform.OS === 'android') {
                setShowDatePicker(false);
              }
              if (event?.type === 'dismissed') {
                return;
              }
              if (date) {
                setFieldValue('tournament_date', toIsoDate(date));
                setFieldTouched('tournament_date', true, false);
              }
            };

            return (
              <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={[GLOBALSTYLE.screenCard, styles.introCard]}>
                  <Icon
                    name="ribbon-outline"
                    iconFamily="Ionicons"
                    size={22}
                    color={COLORS.primary}
                  />
                  <View style={{ flex: 1, marginLeft: Sizer.hSize(12) }}>
                    <Typography
                      fFamily="barlowSemiBold600"
                      size={15}
                      color={COLORS.textPrimary}
                    >
                      Post to the monthly board
                    </Typography>
                    <Typography
                      size={13}
                      color={COLORS.textSecondary}
                      mT={4}
                      lineHeight={19}
                    >
                      Enter competitor details, scores, then the event. Your
                      adjusted total ranks on the leaderboard.
                    </Typography>
                  </View>
                </View>

                <View style={[GLOBALSTYLE.screenCard, styles.formCard]}>
                  <SectionLabel
                    step="1"
                    title="Competitor"
                    subtitle="Who shot this round"
                  />
                  <View style={styles.fieldGroup}>
                    <Typography
                      fFamily="barlowMedium500"
                      size={TYPE.body.size}
                      color={COLORS.textPrimary}
                      mB={6}
                    >
                      NSCA Class
                    </Typography>
                    {classesLoading ? (
                      <AppLoader />
                    ) : (
                      <CustomDropdown
                        data={classOptions}
                        defaultValue={values.nsca_class}
                        placeholder="Select class"
                        onChange={item =>
                          setFieldValue('nsca_class', item?.value ?? item)
                        }
                      />
                    )}
                    {errors.nsca_class ? (
                      <Typography size={12} color={COLORS.destructive} mT={4}>
                        {errors.nsca_class}
                      </Typography>
                    ) : null}
                  </View>
                  <ProfileField
                    label="Competitor Name"
                    value={values.competitor_name}
                    onChangeText={handleChange('competitor_name')}
                    onBlur={handleBlur('competitor_name')}
                    placeholder="Full name"
                    error={errors.competitor_name}
                  />
                </View>

                <View style={[GLOBALSTYLE.screenCard, styles.formCard]}>
                  <SectionLabel
                    step="2"
                    title="Scores"
                    subtitle="Event score + adjustment factor"
                  />
                  <View style={styles.scoreRow}>
                    <View style={styles.scoreField}>
                      <ProfileField
                        label="Event Score"
                        value={String(values.event_score)}
                        onChangeText={handleChange('event_score')}
                        onBlur={handleBlur('event_score')}
                        placeholder="85"
                        keyboardType="number-pad"
                        error={errors.event_score}
                      />
                    </View>
                    <View style={styles.scoreField}>
                      <ProfileField
                        label="Adj. Factor"
                        value={String(values.adj_factor)}
                        onChangeText={handleChange('adj_factor')}
                        onBlur={handleBlur('adj_factor')}
                        placeholder="5"
                        keyboardType="numbers-and-punctuation"
                        error={errors.adj_factor}
                      />
                    </View>
                  </View>

                  <View
                    style={[
                      styles.totalCard,
                      hasPreview ? styles.totalCardReady : null,
                    ]}
                  >
                    <View>
                      <Typography size={12} color={COLORS.textSecondary}>
                        Adjusted total
                      </Typography>
                      <Typography
                        fFamily="barlowBold700"
                        size={28}
                        color={hasPreview ? COLORS.primary : COLORS.textMuted}
                        mT={2}
                      >
                        {hasPreview ? previewTotal : '—'}
                      </Typography>
                    </View>
                    <Typography size={12} color={COLORS.textSecondary}>
                      {hasPreview
                        ? `${eventNum} + ${adjNum}`
                        : 'Fill both scores'}
                    </Typography>
                  </View>
                </View>

                <View style={[GLOBALSTYLE.screenCard, styles.formCard]}>
                  <SectionLabel
                    step="3"
                    title="Event"
                    subtitle="Where and when you shot"
                  />
                  <ProfileField
                    label="Tournament Name"
                    value={values.tournament_name}
                    onChangeText={handleChange('tournament_name')}
                    onBlur={handleBlur('tournament_name')}
                    placeholder="Event name & location"
                    error={errors.tournament_name}
                  />

                  <View style={styles.fieldGroup}>
                    <Typography
                      fFamily="barlowMedium500"
                      size={TYPE.body.size}
                      color={COLORS.textPrimary}
                      mB={6}
                    >
                      Tournament Date
                    </Typography>
                    <TouchableOpacity
                      style={[
                        styles.dateField,
                        errors.tournament_date ? styles.dateFieldError : null,
                      ]}
                      activeOpacity={0.88}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <View>
                        <Typography
                          size={14}
                          color={
                            values.tournament_date
                              ? COLORS.textPrimary
                              : COLORS.textSecondary
                          }
                        >
                          {values.tournament_date
                            ? formatDisplayDate(values.tournament_date)
                            : 'Select date'}
                        </Typography>
                      </View>
                      <Icon
                        name="calendar-outline"
                        iconFamily="Ionicons"
                        size={20}
                        color={COLORS.primary}
                      />
                    </TouchableOpacity>
                    {errors.tournament_date ? (
                      <Typography size={12} color={COLORS.destructive} mT={4}>
                        {errors.tournament_date}
                      </Typography>
                    ) : null}
                  </View>
                </View>

                {showDatePicker && Platform.OS === 'android' ? (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    maximumDate={new Date()}
                  />
                ) : null}

                {Platform.OS === 'ios' ? (
                  <Modal
                    visible={showDatePicker}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowDatePicker(false)}
                  >
                    <View style={styles.modalBackdrop}>
                      <View style={styles.modalSheet}>
                        <View style={styles.modalHeader}>
                          <TouchableOpacity
                            onPress={() => setShowDatePicker(false)}
                          >
                            <Typography
                              fFamily="barlowSemiBold600"
                              size={15}
                              color={COLORS.textSecondary}
                            >
                              Cancel
                            </Typography>
                          </TouchableOpacity>
                          <Typography
                            fFamily="barlowSemiBold600"
                            size={16}
                            color={COLORS.textPrimary}
                          >
                            Select date
                          </Typography>
                          <TouchableOpacity
                            onPress={() => setShowDatePicker(false)}
                          >
                            <Typography
                              fFamily="barlowSemiBold600"
                              size={15}
                              color={COLORS.primary}
                            >
                              Done
                            </Typography>
                          </TouchableOpacity>
                        </View>
                        <DateTimePicker
                          value={selectedDate}
                          mode="date"
                          display="spinner"
                          onChange={onDateChange}
                          maximumDate={new Date()}
                          style={styles.iosPicker}
                        />
                      </View>
                    </View>
                  </Modal>
                ) : null}

                <TouchableOpacity
                  style={[styles.submitBtn, isPending && styles.submitDisabled]}
                  activeOpacity={0.88}
                  disabled={isPending}
                  onPress={handleSubmit}
                >
                  <Icon
                    name="trophy-outline"
                    iconFamily="Ionicons"
                    size={18}
                    color={COLORS.white100}
                  />
                  <Typography
                    fFamily="barlowSemiBold600"
                    size={16}
                    color={COLORS.white100}
                    mL={8}
                  >
                    Post to leaderboard
                  </Typography>
                </TouchableOpacity>
              </ScrollView>
            );
          }}
        </FormController>
      </KeyboardAvoidingView>

      <ScreenOverlayLoader visible={isPending} />
    </Container>
  );
};

export default TournamentEntryScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(SPACING.component),
  },
  introCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
  formCard: {
    padding: Sizer.hSize(SPACING.cardP),
    gap: Sizer.vSize(4),
    ...SHADOWS.card,
  },
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(10),
    marginBottom: Sizer.vSize(12),
  },
  stepBadge: {
    width: Sizer.hSize(26),
    height: Sizer.hSize(26),
    borderRadius: Sizer.hSize(13),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldGroup: {
    marginBottom: Sizer.vSize(8),
  },
  scoreRow: {
    flexDirection: 'row',
    gap: Sizer.hSize(10),
  },
  scoreField: { flex: 1 },
  totalCard: {
    marginTop: Sizer.vSize(4),
    marginBottom: Sizer.vSize(4),
    padding: Sizer.hSize(14),
    borderRadius: Sizer.hSize(12),
    backgroundColor: COLORS.surfaceMuted,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalCardReady: {
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: 'rgba(235,108,15,0.25)',
  },
  dateField: {
    height: Sizer.vSize(48),
    paddingHorizontal: Sizer.hSize(16),
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    borderRadius: Sizer.hSize(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateFieldError: {
    borderColor: COLORS.destructive,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalSheet: {
    backgroundColor: COLORS.mainBg,
    borderTopLeftRadius: Sizer.hSize(16),
    borderTopRightRadius: Sizer.hSize(16),
    paddingBottom: Sizer.vSize(24),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Sizer.hSize(16),
    paddingVertical: Sizer.vSize(14),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.borderMuted,
  },
  iosPicker: {
    height: Sizer.vSize(200),
  },
  submitBtn: {
    marginTop: Sizer.vSize(4),
    height: Sizer.vSize(52),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(14),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  submitDisabled: { opacity: 0.7 },
});
