import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
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
  getReviewInitials,
  LIBRARY_REVIEWS,
  REVIEW_STATS,
} from '../../../constants/libraryContent';

const StarRow = ({ count, filled, size = 14 }) => (
  <View style={{ flexDirection: 'row', gap: 2 }}>
    {[1, 2, 3, 4, 5].map(s => (
      <Icon
        key={s}
        name={s <= filled ? 'star' : 'star-outline'}
        iconFamily="Ionicons"
        size={size}
        color={COLORS.primary}
      />
    ))}
  </View>
);

/** ClayMaster-App-UI `Reviews.tsx` */
const ReviewsScreen = ({ navigation }) => {
  const distribution = [
    { stars: 5, count: REVIEW_STATS.five },
    { stars: 4, count: REVIEW_STATS.four },
    { stars: 3, count: REVIEW_STATS.three },
    { stars: 2, count: REVIEW_STATS.two },
    { stars: 1, count: REVIEW_STATS.one },
  ];

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
      >
        <View style={[GLOBALSTYLE.screenCard, styles.summaryCard]}>
          <View style={styles.summaryLeft}>
            <Typography fFamily="barlowBold700" size={40} color={COLORS.textPrimary}>
              {REVIEW_STATS.avg}
            </Typography>
            <StarRow count={5} filled={Math.round(REVIEW_STATS.avg)} size={14} />
            <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mT={4}>
              {REVIEW_STATS.total} reviews
            </Typography>
          </View>
          <View style={styles.bars}>
            {distribution.map(row => (
              <View key={row.stars} style={styles.barRow}>
                <Typography size={TYPE.caption.size} color={COLORS.textSecondary} style={styles.barLabel}>
                  {row.stars}
                </Typography>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${(row.count / REVIEW_STATS.total) * 100}%` },
                    ]}
                  />
                </View>
                <Typography size={TYPE.caption.size} color={COLORS.textSecondary} style={styles.barCount}>
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

        <View style={styles.reviewList}>
          {LIBRARY_REVIEWS.map((review, i) => (
            <View key={i} style={[GLOBALSTYLE.screenCard, styles.reviewCard]}>
              <View style={styles.reviewTop}>
                <View style={styles.reviewAuthor}>
                  <View style={styles.avatar}>
                    <Typography size={TYPE.caption.size} color={COLORS.white100} fFamily="barlowSemiBold600">
                      {getReviewInitials(review.name)}
                    </Typography>
                  </View>
                  <View>
                    <Typography fFamily="barlowSemiBold600" size={TYPE.body.size} color={COLORS.textPrimary}>
                      {review.name}
                    </Typography>
                    <Typography size={TYPE.caption.size} color={COLORS.textSecondary}>
                      {review.date}
                    </Typography>
                  </View>
                </View>
                <StarRow count={5} filled={review.rating} size={12} />
              </View>
              <Typography size={TYPE.body.size} color={COLORS.textPrimary} lineHeight={22} mT={8}>
                {review.text}
              </Typography>
              <View style={styles.reviewActions}>
                <TouchableOpacity style={styles.reviewAction} activeOpacity={0.88}>
                  <Icon name="thumbs-up-outline" iconFamily="Ionicons" size={14} color={COLORS.textSecondary} />
                  <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mL={6}>
                    {review.likes}
                  </Typography>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reviewAction} activeOpacity={0.88}>
                  <Icon name="chatbubble-outline" iconFamily="Ionicons" size={14} color={COLORS.textSecondary} />
                  <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mL={6}>
                    Reply
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.writeBtn} activeOpacity={0.88}>
          <Typography fFamily="barlowSemiBold600" size={TYPE.body.size} color={COLORS.primary}>
            Write a Review
          </Typography>
        </TouchableOpacity>
      </ScrollView>
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
  },
  avatar: {
    width: Sizer.hSize(36),
    height: Sizer.hSize(36),
    borderRadius: Sizer.hSize(18),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewActions: {
    flexDirection: 'row',
    gap: Sizer.hSize(16),
    marginTop: Sizer.vSize(12),
  },
  reviewAction: {
    flexDirection: 'row',
    alignItems: 'center',
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
});
