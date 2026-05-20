import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import Icon from '../../../helpers/Icon';
import { COLORS, GLOBALSTYLE, SHADOWS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';

const RULES = [
  'All participants must be registered ClayMaster members.',
  'Scores must be submitted within 48 hours of completion.',
  'Each round consists of 25 targets across 5 stations.',
  'Official scorecards must be signed by a witness.',
  'Video proof may be requested for top 10 finishers.',
  'Ties will be broken by a shoot-off round.',
  'Entry fee is non-refundable after submission.',
  'Unsportsmanlike conduct results in disqualification.',
];

const DATES = [
  { label: 'Registration Opens', date: 'Apr 1, 2026' },
  { label: 'Entry Deadline', date: 'Apr 20, 2026' },
  { label: 'Tournament Starts', date: 'Apr 25, 2026' },
  { label: 'Results Announced', date: 'May 5, 2026' },
];

const TournamentGuidelinesScreen = ({ navigation }) => (
  <Container isPadding={false} backgroundColor={COLORS.mainBg}>
    <LibraryHeader
      title="Guidelines"
      showBack
      showNotification={false}
      onBack={() => navigation.goBack()}
    />
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={[GLOBALSTYLE.screenCard, styles.headerCard]}>
        <View style={styles.headerRow}>
          <View style={styles.iconCircle}>
            <Icon name="document-text-outline" iconFamily="Ionicons" size={24} color={COLORS.primary} />
          </View>
          <View>
            <Typography fFamily="barlowSemiBold600" size={20} color={COLORS.textPrimary}>
              Tournament Rules
            </Typography>
            <Typography size={12} color={COLORS.textSecondary} mT={2}>
              Virtual Tournament 2026
            </Typography>
          </View>
        </View>
        <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.88}>
          <Icon name="download-outline" iconFamily="Ionicons" size={18} color={COLORS.textPrimary} />
          <Typography fFamily="barlowSemiBold600" size={14} color={COLORS.textPrimary} mL={8}>
            Download PDF
          </Typography>
        </TouchableOpacity>
      </View>

      <Typography fFamily="barlowSemiBold600" size={20} color={COLORS.textPrimary} mB={12}>
        Rules & Regulations
      </Typography>
      <View style={styles.rulesGroup}>
        {RULES.map(rule => (
          <View key={rule} style={[GLOBALSTYLE.screenCard, styles.ruleCard]}>
            <Icon name="checkmark-circle" iconFamily="Ionicons" size={18} color={COLORS.primary} />
            <Typography size={14} color={COLORS.textPrimary} lineHeight={21} style={{ flex: 1, marginLeft: 12 }}>
              {rule}
            </Typography>
          </View>
        ))}
      </View>

      <Typography fFamily="barlowSemiBold600" size={20} color={COLORS.textPrimary} mB={12}>
        Important Dates
      </Typography>
      <View style={[GLOBALSTYLE.screenCard, styles.datesList]}>
        {DATES.map((item, i) => (
          <View
            key={item.label}
            style={[styles.dateRow, i < DATES.length - 1 && styles.dateBorder]}
          >
            <Typography fFamily="barlowMedium500" size={14} color={COLORS.textPrimary}>
              {item.label}
            </Typography>
            <Typography fFamily="barlowSemiBold600" size={14} color={COLORS.primary}>
              {item.date}
            </Typography>
          </View>
        ))}
      </View>
    </ScrollView>
  </Container>
);

export default TournamentGuidelinesScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(SPACING.section),
  },
  headerCard: { padding: Sizer.hSize(SPACING.cardP), ...SHADOWS.card },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(12), marginBottom: Sizer.vSize(12) },
  iconCircle: {
    width: Sizer.hSize(48),
    height: Sizer.hSize(48),
    borderRadius: Sizer.hSize(24),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: Sizer.vSize(48),
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    borderRadius: Sizer.hSize(12),
  },
  rulesGroup: { gap: Sizer.vSize(SPACING.component) },
  ruleCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
  datesList: { padding: 0, overflow: 'hidden' },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Sizer.hSize(SPACING.cardP),
    paddingVertical: Sizer.vSize(16),
  },
  dateBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.borderMuted,
  },
});
