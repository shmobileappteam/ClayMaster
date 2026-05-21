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
import { navigateFromTabToStack } from '../../../navigation/navigationHelpers';

const RECENT = [
  { date: 'Apr 5, 2026', score: '22/25', pct: '88%' },
  { date: 'Apr 1, 2026', score: '19/25', pct: '76%' },
  { date: 'Mar 28, 2026', score: '20/25', pct: '80%' },
];

/** ClayMaster-App-UI `Scoring.tsx` — web path /scoring, title "My Scores" */
const ScoringScreen = ({ navigation }) => (
  <Container isPadding={false} backgroundColor={COLORS.mainBg}>
    <LibraryHeader
      title="My Scores"
      showBack
      showNotification={false}
      onBack={() => navigation.goBack()}
    />
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.statsRow}>
        <View style={[GLOBALSTYLE.screenCard, styles.statCard]}>
          <View style={styles.statIcon}>
            <Icon name="locate-outline" iconFamily="Ionicons" size={22} color={COLORS.primary} />
          </View>
          <Typography fFamily="barlowBold700" size={TYPE.h1.size} color={COLORS.textPrimary} mT={8}>
            25
          </Typography>
          <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mT={2}>
            Total Rounds
          </Typography>
        </View>
        <View style={[GLOBALSTYLE.screenCard, styles.statCard]}>
          <View style={styles.statIcon}>
            <Icon name="trending-up-outline" iconFamily="Ionicons" size={22} color={COLORS.primary} />
          </View>
          <Typography fFamily="barlowBold700" size={TYPE.h1.size} color={COLORS.primary} mT={8}>
            78%
          </Typography>
          <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mT={2}>
            Avg Score
          </Typography>
        </View>
      </View>

      <TouchableOpacity
        style={styles.addBtn}
        activeOpacity={0.88}
        onPress={() => navigateFromTabToStack(navigation, 'NewRoundScreen')}
      >
        <Icon name="add" iconFamily="Ionicons" size={22} color={COLORS.white100} />
        <Typography fFamily="barlowSemiBold600" size={TYPE.h3.size} color={COLORS.white100} mL={8}>
          Add New Score
        </Typography>
      </TouchableOpacity>

      <Typography
        fFamily={TYPE.h2.fFamily}
        size={TYPE.h2.size}
        color={COLORS.textPrimary}
        mT={SPACING.section}
        mB={SPACING.component}
      >
        Recent Scores
      </Typography>

      <View style={styles.recentList}>
        {RECENT.map(item => (
          <View key={item.date} style={[GLOBALSTYLE.screenCard, styles.recentCard]}>
            <View>
              <Typography fFamily="barlowSemiBold600" size={TYPE.body.size} color={COLORS.textPrimary}>
                {item.score}
              </Typography>
              <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mT={2}>
                {item.date}
              </Typography>
            </View>
            <Typography fFamily="barlowBold700" size={TYPE.h2.size} color={COLORS.primary}>
              {item.pct}
            </Typography>
          </View>
        ))}
      </View>
    </ScrollView>
  </Container>
);

export default ScoringScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
  },
  statsRow: {
    flexDirection: 'row',
    gap: Sizer.hSize(SPACING.component),
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
  statIcon: {
    width: Sizer.hSize(44),
    height: Sizer.hSize(44),
    borderRadius: Sizer.hSize(22),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    height: Sizer.vSize(48),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizer.vSize(SPACING.section),
  },
  recentList: {
    gap: Sizer.vSize(SPACING.component),
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
});
