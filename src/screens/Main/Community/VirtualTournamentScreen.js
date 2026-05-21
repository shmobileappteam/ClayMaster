import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import {
  COLORS,
  GLOBALSTYLE,
  SHADOWS,
  SPACING,
} from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useRequireLibraryMode } from '../../../hooks/useRequireLibraryMode';

const LEADERBOARD = [
  { rank: 1, name: 'John Smith', score: 96 },
  { rank: 2, name: 'Sarah Johnson', score: 94 },
  { rank: 3, name: 'Mike Williams', score: 91 },
  { rank: 4, name: 'Emily Davis', score: 89 },
  { rank: 5, name: 'Chris Brown', score: 87 },
];

const rankBadgeColor = rank => {
  if (rank === 1) return COLORS.primary;
  if (rank === 2) return COLORS.textSecondary;
  return COLORS.textPrimary;
};

/**
 * PAGE 15 — Virtual Tournament (Full Library only; requires stable internet).
 * Guidelines and Submit Entry removed (PAGE 16–17).
 */
const VirtualTournamentScreen = () => {
  if (useRequireLibraryMode()) {
    return null;
  }

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader title="Virtual Tournament" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Typography size={14} color={COLORS.textSecondary} lineHeight={21} mB={4}>
          Full Library Mode — live leaderboard and portal features need a reliable connection.
        </Typography>

        <View>
          <Typography
            fFamily="barlowSemiBold600"
            size={20}
            lineHeight={26}
            color={COLORS.textPrimary}
            mB={12}
          >
            Leaderboard
          </Typography>
          <View style={[GLOBALSTYLE.screenCard, styles.table]}>
            <View style={styles.tableHeader}>
              <Typography size={12} color={COLORS.textSecondary} style={styles.colRank}>
                Rank
              </Typography>
              <Typography size={12} color={COLORS.textSecondary} style={styles.colName}>
                Name
              </Typography>
              <Typography size={12} color={COLORS.textSecondary} style={styles.colScore}>
                Score
              </Typography>
            </View>
            {LEADERBOARD.map((entry, i) => (
              <View
                key={entry.rank}
                style={[styles.tableRow, i < LEADERBOARD.length - 1 && styles.tableRowBorder]}
              >
                <View style={styles.colRank}>
                  {entry.rank <= 3 ? (
                    <View
                      style={[
                        styles.rankBadge,
                        { backgroundColor: rankBadgeColor(entry.rank) },
                      ]}
                    >
                      <Typography size={12} color={COLORS.white100} fFamily="barlowBold700">
                        {entry.rank}
                      </Typography>
                    </View>
                  ) : (
                    <Typography fFamily="barlowMedium500" size={14} color={COLORS.textPrimary} mL={8}>
                      {entry.rank}
                    </Typography>
                  )}
                </View>
                <Typography fFamily="barlowRegular400" size={14} color={COLORS.textPrimary} style={styles.colName}>
                  {entry.name}
                </Typography>
                <Typography
                  fFamily="barlowSemiBold600"
                  size={14}
                  color={COLORS.textPrimary}
                  style={styles.colScore}
                >
                  {entry.score}
                </Typography>
              </View>
            ))}
          </View>
        </View>
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
  table: { padding: 0, overflow: 'hidden' },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizer.hSize(16),
    paddingVertical: Sizer.vSize(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.borderMuted,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizer.hSize(16),
    paddingVertical: Sizer.vSize(12),
  },
  tableRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.borderMuted,
  },
  colRank: { width: Sizer.hSize(48) },
  colName: { flex: 1 },
  colScore: { width: Sizer.hSize(60), textAlign: 'right' },
  rankBadge: {
    width: Sizer.hSize(28),
    height: Sizer.hSize(28),
    borderRadius: Sizer.hSize(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
