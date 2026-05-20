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
} from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { navigateFromTabToStack } from '../../../navigation/navigationHelpers';

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
 * CONTENT INVENTORY — ClayMaster-App-UI `Tournament.tsx`
 * Action grid (2), Leaderboard table (5 rows)
 */
const VirtualTournamentScreen = ({ navigation }) => {
  const go = screen => navigateFromTabToStack(navigation, screen);

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader title="Virtual Tournament" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={[GLOBALSTYLE.screenCard, styles.actionCard]}
            onPress={() => go('TournamentGuidelinesScreen')}
            activeOpacity={0.88}
          >
            <View style={styles.actionIcon}>
              <Icon name="document-text-outline" iconFamily="Ionicons" size={22} color={COLORS.primary} />
            </View>
            <Typography fFamily="barlowMedium500" size={14} color={COLORS.textPrimary}>
              Guidelines
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            style={[GLOBALSTYLE.screenCard, styles.actionCard]}
            onPress={() => go('TournamentEntryScreen')}
            activeOpacity={0.88}
          >
            <View style={styles.actionIcon}>
              <Icon name="cloud-upload-outline" iconFamily="Ionicons" size={22} color={COLORS.primary} />
            </View>
            <Typography fFamily="barlowMedium500" size={14} color={COLORS.textPrimary}>
              Submit Entry
            </Typography>
          </TouchableOpacity>
        </View>

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
  actionGrid: {
    flexDirection: 'row',
    gap: Sizer.hSize(SPACING.component),
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    padding: Sizer.hSize(SPACING.cardP),
    gap: Sizer.vSize(8),
    ...SHADOWS.card,
  },
  actionIcon: {
    width: Sizer.hSize(44),
    height: Sizer.hSize(44),
    borderRadius: Sizer.hSize(22),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
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
