import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import Icon from '../../../helpers/Icon';
import { COLORS, GLOBALSTYLE, SHADOWS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';

const SERVICES = [
  {
    icon: 'document-text-outline',
    title: 'Custom Analysis Report',
    desc: 'Detailed breakdown of your shooting patterns',
    status: 'Completed',
    date: 'Mar 28, 2026',
    statusColor: '#16A34A',
  },
  {
    icon: 'stats-chart-outline',
    title: 'Performance Review',
    desc: 'Monthly performance evaluation by coach',
    status: 'In Progress',
    date: 'Apr 5, 2026',
    statusColor: COLORS.primary,
  },
  {
    icon: 'calendar-outline',
    title: 'Training Plan',
    desc: 'Personalized 8-week improvement plan',
    status: 'Scheduled',
    date: 'Apr 15, 2026',
    statusColor: COLORS.textSecondary,
  },
];

const FEATURES = [
  'Monthly performance reports',
  'Personalized training plans',
  'Priority coaching access',
  'Video analysis feedback',
  'Competition preparation',
];

const ManagedServiceScreen = ({ navigation }) => (
  <Container isPadding={false} backgroundColor={COLORS.mainBg}>
    <LibraryHeader
      title="Managed Service"
      showBack
      showNotification={false}
      onBack={() => navigation.goBack()}
    />
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.heroHeader}>
          <View style={styles.heroIcon}>
            <Icon name="headset-outline" iconFamily="Ionicons" size={22} color={COLORS.white100} />
          </View>
          <View>
            <Typography fFamily="barlowSemiBold600" size={20} color={COLORS.white100}>
              Pro Managed Service
            </Typography>
            <Typography size={14} color="rgba(255,255,255,0.8)" mT={2}>
              Personalized coaching & analytics
            </Typography>
          </View>
        </View>
        <Typography size={14} color="rgba(255,255,255,0.8)" lineHeight={22} mT={8}>
          Our experts analyze your performance data and provide tailored recommendations to
          accelerate your improvement.
        </Typography>
      </View>

      <Typography fFamily="barlowSemiBold600" size={20} color={COLORS.textPrimary} mB={12}>
        Your Services
      </Typography>
      <View style={styles.servicesGroup}>
        {SERVICES.map(svc => (
          <View key={svc.title} style={[GLOBALSTYLE.screenCard, styles.serviceCard]}>
            <View style={styles.serviceRow}>
              <View style={styles.listIcon}>
                <Icon name={svc.icon} iconFamily="Ionicons" size={20} color={COLORS.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Typography fFamily="barlowSemiBold600" size={14} color={COLORS.textPrimary}>
                  {svc.title}
                </Typography>
                <Typography size={12} color={COLORS.textSecondary} mT={2}>
                  {svc.desc}
                </Typography>
                <View style={styles.serviceMeta}>
                  <Typography size={12} color={COLORS.textSecondary}>
                    {svc.date}
                  </Typography>
                  <Typography size={12} color={svc.statusColor} fFamily="barlowMedium500">
                    {svc.status}
                  </Typography>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      <Typography fFamily="barlowSemiBold600" size={20} color={COLORS.textPrimary} mB={12}>
        What's Included
      </Typography>
      <View style={[GLOBALSTYLE.screenCard, styles.featureList]}>
        {FEATURES.map((feat, i) => (
          <View
            key={feat}
            style={[styles.featureRow, i < FEATURES.length - 1 && styles.featureBorder]}
          >
            <Icon name="checkmark-circle" iconFamily="Ionicons" size={18} color={COLORS.primary} />
            <Typography size={14} color={COLORS.textPrimary} mL={12}>
              {feat}
            </Typography>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.cta}
        onPress={() => navigation.navigate('AnalyticsScheduleScreen', { tab: 'book' })}
        activeOpacity={0.88}
      >
        <Typography fFamily="barlowSemiBold600" size={16} color={COLORS.white100}>
          Request New Service
        </Typography>
      </TouchableOpacity>
    </ScrollView>
  </Container>
);

export default ManagedServiceScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(SPACING.section),
  },
  hero: {
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
  heroHeader: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(12) },
  heroIcon: {
    width: Sizer.hSize(44),
    height: Sizer.hSize(44),
    borderRadius: Sizer.hSize(22),
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  servicesGroup: { gap: Sizer.vSize(SPACING.component) },
  serviceCard: { padding: Sizer.hSize(SPACING.cardP), ...SHADOWS.card },
  serviceRow: { flexDirection: 'row', alignItems: 'flex-start' },
  listIcon: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    borderRadius: Sizer.hSize(20),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Sizer.hSize(12),
  },
  serviceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Sizer.vSize(8),
  },
  featureList: { padding: 0, overflow: 'hidden' },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizer.hSize(SPACING.cardP),
    paddingVertical: Sizer.vSize(14),
  },
  featureBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.borderMuted,
  },
  cta: {
    height: Sizer.vSize(48),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
