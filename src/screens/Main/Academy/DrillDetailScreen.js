import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import Icon from '../../../helpers/Icon';
import { COLORS, GLOBALSTYLE, SHADOWS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';

/** ClayMaster-App-UI `DrillDetail.tsx` — static drill detail (web uses same page for all drill links) */
const STEPS = [
  {
    step: 1,
    title: 'Set Up Station',
    desc: 'Position yourself at station 3 with a clear view of the high tower.',
  },
  {
    step: 2,
    title: 'Focus on Hold Point',
    desc: 'Place your muzzle at the correct hold point, 1/3 from the trap.',
  },
  {
    step: 3,
    title: 'Track the Target',
    desc: 'Follow the clay with smooth gun movement, maintain lead.',
  },
  {
    step: 4,
    title: 'Execute the Shot',
    desc: 'Pull trigger when sight picture aligns. Follow through.',
  },
  {
    step: 5,
    title: 'Review & Repeat',
    desc: 'Analyze your hit/miss and adjust accordingly.',
  },
];

const DrillDetailScreen = ({ navigation }) => (
  <Container isPadding={false} backgroundColor={COLORS.mainBg}>
    <LibraryHeader
      title="Drill Detail"
      showBack
      showNotification={false}
      onBack={() => navigation.goBack()}
    />
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={[GLOBALSTYLE.screenCard, styles.headerCard]}>
        <View style={styles.headerTop}>
          <View style={styles.iconCircle}>
            <Icon name="locate-outline" iconFamily="Ionicons" size={24} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Typography fFamily="barlowSemiBold600" size={20} lineHeight={26} color={COLORS.textPrimary}>
              Advanced Shot Analysis
            </Typography>
            <Typography size={14} color={COLORS.textSecondary} lineHeight={21} mT={4}>
              Break down complex shot patterns and improve consistency.
            </Typography>
          </View>
        </View>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Icon name="time-outline" iconFamily="Ionicons" size={16} color={COLORS.textSecondary} />
            <Typography size={12} color={COLORS.textSecondary} mL={6}>
              20 min
            </Typography>
          </View>
          <View style={styles.metaItem}>
            <Icon name="checkmark-circle-outline" iconFamily="Ionicons" size={16} color={COLORS.textSecondary} />
            <Typography size={12} color={COLORS.textSecondary} mL={6}>
              Intermediate
            </Typography>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.startBtn} activeOpacity={0.88}>
            <Icon name="play" iconFamily="Ionicons" size={18} color={COLORS.white100} />
            <Typography fFamily="barlowSemiBold600" size={14} color={COLORS.white100} mL={8}>
              Start Drill
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.88}>
            <Icon name="download-outline" iconFamily="Ionicons" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.88}>
            <Icon name="print-outline" iconFamily="Ionicons" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <Typography fFamily="barlowSemiBold600" size={20} color={COLORS.textPrimary} mB={12}>
        Steps
      </Typography>
      <View style={styles.stepsGroup}>
        {STEPS.map(s => (
          <View key={s.step} style={[GLOBALSTYLE.screenCard, styles.stepCard]}>
            <View style={styles.stepNum}>
              <Typography size={12} color={COLORS.white100} fFamily="barlowBold700">
                {s.step}
              </Typography>
            </View>
            <View style={{ flex: 1 }}>
              <Typography fFamily="barlowSemiBold600" size={14} color={COLORS.textPrimary}>
                {s.title}
              </Typography>
              <Typography size={12} color={COLORS.textSecondary} mT={2} lineHeight={17}>
                {s.desc}
              </Typography>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.tipCard}>
        <Typography fFamily="barlowSemiBold600" size={18} color={COLORS.textPrimary} mB={8}>
          💡 Pro Tip
        </Typography>
        <Typography size={14} color={COLORS.textSecondary} lineHeight={21}>
          Focus on smooth gun movement rather than speed. Consistent tempo leads to higher hit
          rates on complex targets.
        </Typography>
      </View>
    </ScrollView>
  </Container>
);

export default DrillDetailScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(SPACING.section),
  },
  headerCard: { padding: Sizer.hSize(SPACING.cardP), ...SHADOWS.card },
  headerTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Sizer.hSize(12), marginBottom: Sizer.vSize(12) },
  iconCircle: {
    width: Sizer.hSize(48),
    height: Sizer.hSize(48),
    borderRadius: Sizer.hSize(24),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: { flexDirection: 'row', gap: Sizer.hSize(16), marginBottom: Sizer.vSize(16) },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  actions: { flexDirection: 'row', gap: Sizer.hSize(8) },
  startBtn: {
    flex: 1,
    height: Sizer.vSize(48),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    width: Sizer.hSize(48),
    height: Sizer.hSize(48),
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepsGroup: { gap: Sizer.vSize(SPACING.component) },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Sizer.hSize(SPACING.cardP),
    gap: Sizer.hSize(12),
    ...SHADOWS.card,
  },
  stepNum: {
    width: Sizer.hSize(32),
    height: Sizer.hSize(32),
    borderRadius: Sizer.hSize(16),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipCard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: Sizer.hSize(12),
    padding: Sizer.hSize(SPACING.cardP),
  },
});
