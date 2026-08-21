import React, { useMemo, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Container, Typography, AppLoader } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import Icon from '../../../helpers/Icon';
import {
  COLORS,
  GLOBALSTYLE,
  SHADOWS,
  SPACING,
} from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useRequireLibraryMode } from '../../../hooks/useRequireLibraryMode';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { getTournamentLeaderboard } from '../../../api/tournamentService';
import {
  formatMonthTitle,
  mapLeaderboardEntry,
  mapStanding,
  rankBadgeColor,
  shiftMonth,
} from '../../../constants/tournament';
import { navigateFromTabToStack } from '../../../navigation/navigationHelpers';

const openSubmit = navigation =>
  navigateFromTabToStack(navigation, 'TournamentEntryScreen');

/**
 * Virtual Tournament — period leaderboard → submit score flow.
 */
const VirtualTournamentScreen = ({ navigation }) => {
  const blocked = useRequireLibraryMode();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [mineOnly, setMineOnly] = useState(false);

  const { data, isLoading, isError, isFetching, refetch } = useCustomQuery({
    queryKey: ['tournamentLeaderboard', year, month, mineOnly],
    queryFn: () => getTournamentLeaderboard({ year, month, mine: mineOnly }),
  });

  const standings = useMemo(
    () => (data?.standings || []).map(mapStanding).filter(Boolean),
    [data?.standings],
  );
  const entries = useMemo(
    () => (data?.entries || []).map(mapLeaderboardEntry).filter(Boolean),
    [data?.entries],
  );

  const monthTitle = formatMonthTitle(year, month, data?.monthTitle);
  const topScore = entries[0]?.totalAdjScore;

  const goMonth = delta => {
    const next = shiftMonth(year, month, delta);
    setYear(next.year);
    setMonth(next.month);
  };

  if (blocked) {
    return null;
  }

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Virtual Tournament"
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
        <View style={[GLOBALSTYLE.screenCard, styles.hero]}>
          <View style={styles.heroTop}>
            <View style={styles.heroIcon}>
              <Icon
                name="trophy"
                iconFamily="Ionicons"
                size={26}
                color={COLORS.primary}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Typography
                size={12}
                color={COLORS.textSecondary}
                fFamily="barlowSemiBold600"
                style={styles.overline}
              >
                FULL LIBRARY · MONTHLY STANDINGS
              </Typography>
              <Typography size={12} color={COLORS.textMuted} mT={2} mB={2}>
                Online only — not available in Field Mode
              </Typography>
              <View style={styles.monthRow}>
                <TouchableOpacity
                  onPress={() => goMonth(-1)}
                  hitSlop={10}
                  style={styles.monthBtn}
                >
                  <Icon
                    name="chevron-back"
                    iconFamily="Ionicons"
                    size={20}
                    color={COLORS.textPrimary}
                  />
                </TouchableOpacity>
                <Typography
                  fFamily="barlowBold700"
                  size={20}
                  color={COLORS.textPrimary}
                  style={styles.monthTitle}
                >
                  {monthTitle}
                </Typography>
                <TouchableOpacity
                  onPress={() => goMonth(1)}
                  hitSlop={10}
                  style={styles.monthBtn}
                >
                  <Icon
                    name="chevron-forward"
                    iconFamily="Ionicons"
                    size={20}
                    color={COLORS.textPrimary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.heroStats}>
            <View style={styles.statBlock}>
              <Typography size={11} color={COLORS.textSecondary}>
                Entries
              </Typography>
              <Typography fFamily="barlowBold700" size={22} color={COLORS.textPrimary} mT={2}>
                {isLoading ? '—' : entries.length}
              </Typography>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <Typography size={11} color={COLORS.textSecondary}>
                Leading score
              </Typography>
              <Typography fFamily="barlowBold700" size={22} color={COLORS.primary} mT={2}>
                {isLoading || topScore == null ? '—' : topScore}
              </Typography>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBlock}>
              <Typography size={11} color={COLORS.textSecondary}>
                Awards
              </Typography>
              <Typography fFamily="barlowBold700" size={22} color={COLORS.textPrimary} mT={2}>
                {isLoading ? '—' : standings.length}
              </Typography>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitCta}
          activeOpacity={0.88}
          onPress={() => openSubmit(navigation)}
        >
          <View style={styles.submitCtaText}>
            <Typography fFamily="barlowBold700" size={16} color={COLORS.white100}>
              Submit your score
            </Typography>
            <Typography size={12} color="rgba(255,255,255,0.85)" mT={2}>
              Post an entry to this month’s leaderboard
            </Typography>
          </View>
          <View style={styles.submitArrow}>
            <Icon
              name="arrow-forward"
              iconFamily="Ionicons"
              size={18}
              color={COLORS.primary}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.segment}>
          <TouchableOpacity
            style={[styles.segmentBtn, !mineOnly && styles.segmentBtnActive]}
            onPress={() => setMineOnly(false)}
            activeOpacity={0.88}
          >
            <Typography
              fFamily="barlowSemiBold600"
              size={13}
              color={!mineOnly ? COLORS.white100 : COLORS.textPrimary}
            >
              Full board
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentBtn, mineOnly && styles.segmentBtnActive]}
            onPress={() => setMineOnly(true)}
            activeOpacity={0.88}
          >
            <Typography
              fFamily="barlowSemiBold600"
              size={13}
              color={mineOnly ? COLORS.white100 : COLORS.textPrimary}
            >
              My results
            </Typography>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <AppLoader />
        ) : isError ? (
          <TouchableOpacity
            style={[GLOBALSTYLE.screenCard, styles.emptyCard]}
            onPress={refetch}
            activeOpacity={0.88}
          >
            <Icon
              name="refresh-outline"
              iconFamily="Ionicons"
              size={22}
              color={COLORS.primary}
            />
            <Typography
              fFamily="barlowSemiBold600"
              size={15}
              color={COLORS.textPrimary}
              mT={10}
              textAlign="center"
            >
              Couldn’t load this month
            </Typography>
            <Typography size={13} color={COLORS.textSecondary} mT={6} textAlign="center">
              Tap to retry
            </Typography>
          </TouchableOpacity>
        ) : (
          <>
            {standings.length > 0 ? (
              <View>
                <Typography
                  fFamily="barlowSemiBold600"
                  size={18}
                  color={COLORS.textPrimary}
                  mB={10}
                >
                  Highlight awards
                </Typography>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.awardsScroll}
                >
                  {standings.map((s, i) => (
                    <View
                      key={`${s.award}-${s.competitorName}-${i}`}
                      style={styles.awardCard}
                    >
                      <View style={styles.awardIcon}>
                        <Icon
                          name={s.icon}
                          iconFamily="Ionicons"
                          size={22}
                          color={COLORS.primary}
                        />
                      </View>
                      <Typography
                        fFamily="barlowBold700"
                        size={13}
                        color={COLORS.primary}
                        mT={10}
                        numberOfLines={1}
                      >
                        {s.award || 'Award'}
                      </Typography>
                      <Typography
                        fFamily="barlowSemiBold600"
                        size={15}
                        color={COLORS.textPrimary}
                        mT={4}
                        numberOfLines={1}
                      >
                        {s.competitorName}
                      </Typography>
                      <Typography size={12} color={COLORS.textSecondary} mT={2}>
                        {s.nscaClass ? `Class ${s.nscaClass}` : '—'}
                      </Typography>
                      <Typography
                        fFamily="barlowBold700"
                        size={20}
                        color={COLORS.textPrimary}
                        mT={10}
                      >
                        {s.totalAdjScore}
                      </Typography>
                    </View>
                  ))}
                </ScrollView>
              </View>
            ) : null}

            <View>
              <View style={styles.sectionHead}>
                <Typography
                  fFamily="barlowSemiBold600"
                  size={18}
                  color={COLORS.textPrimary}
                >
                  Leaderboard
                </Typography>
                <Typography size={12} color={COLORS.textSecondary}>
                  Event + adj = total
                </Typography>
              </View>

              {entries.length === 0 ? (
                <View style={[GLOBALSTYLE.screenCard, styles.emptyCard]}>
                  <Icon
                    name="flag-outline"
                    iconFamily="Ionicons"
                    size={28}
                    color={COLORS.primary}
                  />
                  <Typography
                    fFamily="barlowSemiBold600"
                    size={16}
                    color={COLORS.textPrimary}
                    mT={12}
                    textAlign="center"
                  >
                    {mineOnly ? 'No results from you yet' : 'Board is open'}
                  </Typography>
                  <Typography
                    size={13}
                    color={COLORS.textSecondary}
                    mT={6}
                    textAlign="center"
                    lineHeight={19}
                  >
                    {mineOnly
                      ? 'Submit a score for this month to see your ranking here.'
                      : 'Be the first to post a competition practice score for this period.'}
                  </Typography>
                  <TouchableOpacity
                    style={styles.emptyBtn}
                    activeOpacity={0.88}
                    onPress={() => openSubmit(navigation)}
                  >
                    <Typography
                      fFamily="barlowSemiBold600"
                      size={14}
                      color={COLORS.white100}
                    >
                      Submit score
                    </Typography>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={[GLOBALSTYLE.screenCard, styles.table]}>
                  {entries.map((entry, i) => {
                    const isTop = entry.rank > 0 && entry.rank <= 3;
                    return (
                      <View
                        key={`${entry.rank}-${entry.competitorName}-${i}`}
                        style={[
                          styles.tableRow,
                          i < entries.length - 1 && styles.tableRowBorder,
                          isTop && styles.tableRowTop,
                        ]}
                      >
                        <View style={styles.colRank}>
                          {isTop ? (
                            <View
                              style={[
                                styles.rankBadge,
                                {
                                  backgroundColor: rankBadgeColor(
                                    entry.rank,
                                    COLORS,
                                  ),
                                },
                              ]}
                            >
                              <Typography
                                size={12}
                                color={COLORS.white100}
                                fFamily="barlowBold700"
                              >
                                {entry.rank}
                              </Typography>
                            </View>
                          ) : (
                            <Typography
                              fFamily="barlowSemiBold600"
                              size={14}
                              color={COLORS.textSecondary}
                              style={{ width: Sizer.hSize(28), textAlign: 'center' }}
                            >
                              {entry.rank || '—'}
                            </Typography>
                          )}
                        </View>

                        <View style={styles.colName}>
                          <Typography
                            fFamily="barlowSemiBold600"
                            size={15}
                            color={COLORS.textPrimary}
                            numberOfLines={1}
                          >
                            {entry.competitorName}
                          </Typography>
                          <Typography
                            size={12}
                            color={COLORS.textSecondary}
                            mT={3}
                            numberOfLines={1}
                          >
                            {[
                              entry.nscaClass ? `Class ${entry.nscaClass}` : null,
                              entry.tournamentName || null,
                            ]
                              .filter(Boolean)
                              .join(' · ') || '—'}
                          </Typography>
                          {entry.tournamentDate ? (
                            <Typography size={11} color={COLORS.textMuted} mT={2}>
                              {entry.tournamentDate}
                            </Typography>
                          ) : null}
                        </View>

                        <View style={styles.colScores}>
                          <Typography
                            fFamily="barlowBold700"
                            size={18}
                            color={COLORS.primary}
                          >
                            {entry.totalAdjScore}
                          </Typography>
                          <Typography size={11} color={COLORS.textSecondary} mT={2}>
                            {entry.eventScore}
                            {entry.adjFactor >= 0 ? '+' : ''}
                            {entry.adjFactor}
                          </Typography>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </Container>
  );
};

export default VirtualTournamentScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(100),
    gap: Sizer.vSize(SPACING.section),
  },
  overline: { letterSpacing: 0.8 },
  hero: {
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(12),
  },
  heroIcon: {
    width: Sizer.hSize(52),
    height: Sizer.hSize(52),
    borderRadius: Sizer.hSize(16),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Sizer.vSize(4),
  },
  monthBtn: {
    width: Sizer.hSize(32),
    height: Sizer.hSize(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: { flex: 1, textAlign: 'center' },
  heroStats: {
    flexDirection: 'row',
    marginTop: Sizer.vSize(18),
    paddingTop: Sizer.vSize(14),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.borderMuted,
  },
  statBlock: { flex: 1, alignItems: 'center' },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.borderMuted,
  },
  submitCta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Sizer.vSize(14),
    paddingHorizontal: Sizer.hSize(16),
    borderRadius: Sizer.hSize(14),
    backgroundColor: COLORS.primary,
    gap: Sizer.hSize(12),
    ...SHADOWS.card,
  },
  submitCtaText: { flex: 1 },
  submitArrow: {
    width: Sizer.hSize(36),
    height: Sizer.hSize(36),
    borderRadius: Sizer.hSize(18),
    backgroundColor: COLORS.white100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segment: {
    flexDirection: 'row',
    padding: Sizer.hSize(4),
    borderRadius: Sizer.hSize(12),
    backgroundColor: COLORS.surfaceMuted,
    gap: Sizer.hSize(4),
  },
  segmentBtn: {
    flex: 1,
    height: Sizer.vSize(38),
    borderRadius: Sizer.hSize(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: COLORS.primary,
  },
  awardsScroll: {
    gap: Sizer.hSize(10),
    paddingRight: Sizer.hSize(8),
  },
  awardCard: {
    width: Sizer.hSize(148),
    padding: Sizer.hSize(14),
    borderRadius: Sizer.hSize(14),
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    ...SHADOWS.card,
  },
  awardIcon: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    borderRadius: Sizer.hSize(12),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: Sizer.vSize(10),
  },
  emptyCard: {
    padding: Sizer.hSize(24),
    alignItems: 'center',
    ...SHADOWS.card,
  },
  emptyBtn: {
    marginTop: Sizer.vSize(16),
    height: Sizer.vSize(42),
    paddingHorizontal: Sizer.hSize(20),
    borderRadius: Sizer.hSize(12),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  table: { padding: 0, overflow: 'hidden', ...SHADOWS.card },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizer.hSize(14),
    paddingVertical: Sizer.vSize(14),
    gap: Sizer.hSize(10),
  },
  tableRowTop: {
    backgroundColor: COLORS.primaryLight,
  },
  tableRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.borderMuted,
  },
  colRank: { width: Sizer.hSize(36), alignItems: 'center' },
  colName: { flex: 1, minWidth: 0 },
  colScores: { alignItems: 'flex-end', minWidth: Sizer.hSize(56) },
  rankBadge: {
    width: Sizer.hSize(28),
    height: Sizer.hSize(28),
    borderRadius: Sizer.hSize(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
