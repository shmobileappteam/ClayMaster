import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import {
  Container,
  FormController,
  Typography,
} from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import ProfileField from '../../../components/profile/ProfileField';
import Icon from '../../../helpers/Icon';
import {
  COLORS,
  GLOBALSTYLE,
  SHADOWS,
  SPACING,
  TYPE,
} from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import {
  buildReviewStats,
  getReviewInitials,
  mapApiReview,
} from '../../../constants/reviews';
import { getReviews, submitReview } from '../../../api/reviewService';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { useCustomMutation } from '../../../query/useCustomMutation';
import authValidations from '../../../validations/authValidations';
import { showToast } from '../../../utils';

const StarRow = ({ filled, size = 14, onPressStar }) => (
  <View style={{ flexDirection: 'row', gap: 2 }}>
    {[1, 2, 3, 4, 5].map(s => {
      const icon = (
        <Icon
          name={s <= filled ? 'star' : 'star-outline'}
          iconFamily="Ionicons"
          size={size}
          color={COLORS.primary}
        />
      );
      if (!onPressStar) {
        return <View key={s}>{icon}</View>;
      }
      return (
        <TouchableOpacity
          key={s}
          onPress={() => onPressStar(s)}
          hitSlop={6}
          activeOpacity={0.8}
        >
          {icon}
        </TouchableOpacity>
      );
    })}
  </View>
);

const ReviewsScreen = ({ navigation }) => {
  const queryClient = useQueryClient();
  const { user } = useSelector(state => state.app);
  const [writeOpen, setWriteOpen] = useState(false);

  const {
    data: listData,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useCustomQuery({
    queryKey: ['reviews', { page: 1 }],
    queryFn: () => getReviews({ page: 1, per_page: 50 }),
  });

  const reviews = useMemo(() => {
    const mapped = (listData?.items || []).map(mapApiReview);
    return mapped.filter(r => r.isApproved);
  }, [listData?.items]);

  const stats = useMemo(() => buildReviewStats(reviews), [reviews]);

  const distribution = [
    { stars: 5, count: stats.five },
    { stars: 4, count: stats.four },
    { stars: 3, count: stats.three },
    { stars: 2, count: stats.two },
    { stars: 1, count: stats.one },
  ];

  const displayName =
    `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim() ||
    user?.username ||
    '';

  const initialFormValues = useMemo(
    () => ({
      title: __DEV__ ? 'Great improvement in my scores' : '',
      review: __DEV__
        ? "I started using ClayMaster's Detailed Analytics Tool and it completely changed how I practice."
        : '',
      name: displayName || (__DEV__ ? 'John Smith' : ''),
      email: user?.email || (__DEV__ ? 'jacksmith4557078@gmail.com' : ''),
      issue: __DEV__
        ? 'Missing quartering and trap-teal targets consistently'
        : '',
      difference_after: __DEV__
        ? 'Now breaking 85%+ of quartering targets with better hold points'
        : '',
      performance_change: __DEV__
        ? 'Event score improved from 65 to 85 over three tournaments'
        : '',
      rating: 5,
    }),
    [displayName, user?.email],
  );

  const invalidateReviews = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['reviews'] });
  }, [queryClient]);

  const { mutateAsync: postReview, isPending: isSubmitting } =
    useCustomMutation({
      mutationFn: submitReview,
      onSuccess: data => {
        if (data?.status) {
          setWriteOpen(false);
          invalidateReviews();
          showToast({
            title: 'Thank you!',
            description: data?.message || 'Your review was submitted.',
          });
        } else {
          showToast({
            title: 'Could not submit review',
            description: data?.message || 'Please try again.',
          });
        }
      },
      onError: response => {
        if (response?.status === 422) return;
        if (response?.status === 403) {
          Alert.alert(
            'Subscription required',
            response?.data?.message ||
              "You don't have an active subscription. Please subscribe first.",
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Subscribe',
                onPress: () => {
                  setWriteOpen(false);
                  navigation.navigate('SubscriptionScreen');
                },
              },
            ],
          );
          return;
        }
        showToast({
          title: 'Could not submit review',
          description: response?.data?.message || 'Please try again.',
        });
      },
    });

  const handleSubmitReview = async (values, { setErrors, resetForm }) => {
    try {
      const data = await postReview(values);
      if (data?.status) {
        resetForm({ values: initialFormValues });
      }
    } catch (err) {
      const errors = err?.response?.data?.errors;
      if (errors && typeof errors === 'object') {
        const next = {};
        Object.keys(errors).forEach(key => {
          next[key] = Array.isArray(errors[key]) ? errors[key][0] : errors[key];
        });
        setErrors(next);
      }
    }
  };

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Reviews"
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor={COLORS.primary}
          />
        }
      >
        <View style={[GLOBALSTYLE.screenCard, styles.summaryCard]}>
          <View style={styles.summaryLeft}>
            <Typography
              fFamily="barlowBold700"
              size={40}
              color={COLORS.textPrimary}
            >
              {stats.total ? stats.avg.toFixed(1) : '—'}
            </Typography>
            <StarRow filled={Math.round(stats.avg)} size={14} />
            <Typography
              size={TYPE.caption.size}
              color={COLORS.textSecondary}
              mT={4}
            >
              {stats.total} {stats.total === 1 ? 'review' : 'reviews'}
            </Typography>
          </View>
          <View style={styles.bars}>
            {distribution.map(row => (
              <View key={row.stars} style={styles.barRow}>
                <Typography
                  size={TYPE.caption.size}
                  color={COLORS.textSecondary}
                  style={styles.barLabel}
                >
                  {row.stars}
                </Typography>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: stats.total
                          ? `${(row.count / stats.total) * 100}%`
                          : '0%',
                      },
                    ]}
                  />
                </View>
                <Typography
                  size={TYPE.caption.size}
                  color={COLORS.textSecondary}
                  style={styles.barCount}
                >
                  {row.count}
                </Typography>
              </View>
            ))}
          </View>
        </View>

        <Typography
          fFamily={TYPE.h2.fFamily}
          size={TYPE.h2.size}
          color={COLORS.textPrimary}
          mB={SPACING.component}
        >
          Recent Reviews
        </Typography>

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={COLORS.primary} />
          </View>
        ) : isError ? (
          <View style={styles.centered}>
            <Typography color={COLORS.textSecondary} mB={12}>
              Could not load reviews.
            </Typography>
            <TouchableOpacity onPress={refetch} activeOpacity={0.88}>
              <Typography color={COLORS.primary} fFamily="barlowSemiBold600">
                Try again
              </Typography>
            </TouchableOpacity>
          </View>
        ) : reviews.length === 0 ? (
          <View style={styles.centered}>
            <Typography color={COLORS.textSecondary}>
              No reviews yet. Be the first to share your experience.
            </Typography>
          </View>
        ) : (
          <View style={styles.reviewList}>
            {reviews.map(review => (
              <View
                key={review.id}
                style={[GLOBALSTYLE.screenCard, styles.reviewCard]}
              >
                <View style={styles.reviewTop}>
                  <View style={styles.reviewAuthor}>
                    <View style={styles.avatar}>
                      <Typography
                        size={TYPE.caption.size}
                        color={COLORS.white100}
                        fFamily="barlowSemiBold600"
                      >
                        {getReviewInitials(review.name)}
                      </Typography>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Typography
                        fFamily="barlowSemiBold600"
                        size={TYPE.body.size}
                        color={COLORS.textPrimary}
                      >
                        {review.name}
                      </Typography>
                      <Typography
                        size={TYPE.caption.size}
                        color={COLORS.textSecondary}
                      >
                        {review.date}
                      </Typography>
                    </View>
                  </View>
                  <StarRow filled={review.rating} size={12} />
                </View>
                {review.title ? (
                  <Typography
                    fFamily="barlowSemiBold600"
                    size={TYPE.body.size}
                    color={COLORS.textPrimary}
                    mT={8}
                  >
                    {review.title}
                  </Typography>
                ) : null}
                <Typography
                  size={TYPE.body.size}
                  color={COLORS.textPrimary}
                  lineHeight={22}
                  mT={review.title ? 4 : 8}
                >
                  {review.text}
                </Typography>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.writeBtn}
          activeOpacity={0.88}
          onPress={() => setWriteOpen(true)}
        >
          <Typography
            fFamily="barlowSemiBold600"
            size={TYPE.body.size}
            color={COLORS.primary}
          >
            Write a Review
          </Typography>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={writeOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setWriteOpen(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalRoot}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <LibraryHeader
            title="Write a Review"
            showBack
            showNotification={false}
            onBack={() => setWriteOpen(false)}
          />
          <FormController
            initialValues={initialFormValues}
            enableReinitialize
            validationSchema={authValidations.submitReviewSchema}
            onSubmit={handleSubmitReview}
          >
            {({
              values,
              errors,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
            }) => (
              <ScrollView
                contentContainerStyle={styles.formScroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.ratingBlock}>
                  <Typography
                    fFamily="barlowMedium500"
                    size={TYPE.body.size}
                    color={COLORS.textPrimary}
                    mB={8}
                  >
                    Rating
                  </Typography>
                  <StarRow
                    filled={values.rating}
                    size={28}
                    onPressStar={s => setFieldValue('rating', s)}
                  />
                  {errors.rating ? (
                    <Typography
                      size={TYPE.caption.size}
                      color={COLORS.destructive}
                      mT={4}
                    >
                      {errors.rating}
                    </Typography>
                  ) : null}
                </View>

                <ProfileField
                  label="Title"
                  value={values.title}
                  onChangeText={handleChange('title')}
                  onBlur={handleBlur('title')}
                  placeholder="Great improvement in my scores"
                  error={errors.title}
                />
                <ProfileField
                  label="Your name"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  placeholder="John Smith"
                  error={errors.name}
                />
                <ProfileField
                  label="Email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  placeholder="you@email.com"
                  keyboardType="email-address"
                  error={errors.email}
                />
                <ProfileField
                  label="What issue were you facing?"
                  value={values.issue}
                  onChangeText={handleChange('issue')}
                  onBlur={handleBlur('issue')}
                  placeholder="Missing quartering targets..."
                  multiline
                  error={errors.issue}
                />
                <ProfileField
                  label="What difference did you notice?"
                  value={values.difference_after}
                  onChangeText={handleChange('difference_after')}
                  onBlur={handleBlur('difference_after')}
                  placeholder="Now breaking 85%+ of quartering targets..."
                  multiline
                  error={errors.difference_after}
                />
                <ProfileField
                  label="Performance change"
                  value={values.performance_change}
                  onChangeText={handleChange('performance_change')}
                  onBlur={handleBlur('performance_change')}
                  placeholder="Event score improved from 65 to 85..."
                  multiline
                  error={errors.performance_change}
                />
                <ProfileField
                  label="Your review"
                  value={values.review}
                  onChangeText={handleChange('review')}
                  onBlur={handleBlur('review')}
                  placeholder="Share your ClayMaster experience..."
                  multiline
                  numberOfLines={5}
                  error={errors.review}
                />

                <TouchableOpacity
                  style={[
                    styles.submitBtn,
                    isSubmitting && styles.submitBtnDisabled,
                  ]}
                  activeOpacity={0.88}
                  disabled={isSubmitting}
                  onPress={handleSubmit}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color={COLORS.white100} />
                  ) : (
                    <Typography
                      fFamily="barlowSemiBold600"
                      size={TYPE.body.size}
                      color={COLORS.white100}
                    >
                      Submit Review
                    </Typography>
                  )}
                </TouchableOpacity>
              </ScrollView>
            )}
          </FormController>
        </KeyboardAvoidingView>
      </Modal>
    </Container>
  );
};

export default ReviewsScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(100),
    gap: Sizer.vSize(SPACING.section),
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Sizer.hSize(SPACING.cardP),
    gap: Sizer.hSize(20),
    ...SHADOWS.card,
  },
  summaryLeft: {
    alignItems: 'center',
  },
  bars: {
    flex: 1,
    gap: Sizer.vSize(6),
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(8),
  },
  barLabel: {
    width: Sizer.hSize(12),
  },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  barCount: {
    width: Sizer.hSize(28),
    textAlign: 'right',
  },
  reviewList: {
    gap: Sizer.vSize(SPACING.component),
  },
  reviewCard: {
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
  reviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  reviewAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(8),
    flex: 1,
    paddingRight: Sizer.hSize(8),
  },
  avatar: {
    width: Sizer.hSize(36),
    height: Sizer.hSize(36),
    borderRadius: Sizer.hSize(18),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  writeBtn: {
    height: Sizer.vSize(48),
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  centered: {
    paddingVertical: Sizer.vSize(32),
    alignItems: 'center',
  },
  modalRoot: {
    flex: 1,
    backgroundColor: COLORS.mainBg,
  },
  formScroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(12),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(4),
  },
  ratingBlock: {
    marginBottom: Sizer.vSize(12),
  },
  submitBtn: {
    marginTop: Sizer.vSize(16),
    height: Sizer.vSize(48),
    borderRadius: Sizer.hSize(12),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
});
