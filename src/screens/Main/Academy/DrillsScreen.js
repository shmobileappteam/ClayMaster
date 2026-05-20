import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import Icon from '../../../helpers/Icon';
import { COLORS, GLOBALSTYLE, SHADOWS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';

/** ClayMaster-App-UI `Drills.tsx` — Practice Drills list (4 items) */
const DRILLS = [
  { title: 'Advanced Shot Analysis', desc: 'Break down complex shot patterns' },
  { title: 'Lead Methods Drill', desc: 'Master pull-away and maintained lead' },
  { title: 'Stance & Mount Basics', desc: 'Foundation for consistent shooting' },
  { title: 'Eye Dominance Training', desc: 'Optimize your visual focus' },
];

const DrillsScreen = ({ navigation }) => (
  <Container isPadding={false} backgroundColor={COLORS.mainBg}>
    <LibraryHeader
      title="Practice Drills"
      showBack
      showNotification={false}
      onBack={() => navigation.goBack()}
    />
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      {DRILLS.map(drill => (
        <TouchableOpacity
          key={drill.title}
          style={[GLOBALSTYLE.screenCard, styles.drillCard]}
          activeOpacity={0.88}
          onPress={() => navigation.navigate('DrillDetailScreen')}
        >
          <View style={styles.drillHeader}>
            <View style={styles.iconCircle}>
              <Icon name="locate-outline" iconFamily="Ionicons" size={22} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Typography fFamily="barlowSemiBold600" size={14} color={COLORS.textPrimary}>
                {drill.title}
              </Typography>
              <Typography size={12} color={COLORS.textSecondary} mT={2}>
                {drill.desc}
              </Typography>
            </View>
          </View>
          <View style={styles.drillActions}>
            <View style={styles.viewBtn}>
              <Icon name="eye-outline" iconFamily="Ionicons" size={16} color={COLORS.white100} />
              <Typography fFamily="barlowSemiBold600" size={12} color={COLORS.white100} mL={4}>
                View
              </Typography>
            </View>
            <View style={styles.secondaryBtn}>
              <Icon name="download-outline" iconFamily="Ionicons" size={16} color={COLORS.textSecondary} />
              <Typography size={12} color={COLORS.textSecondary} mL={4}>
                Download
              </Typography>
            </View>
            <View style={styles.secondaryBtn}>
              <Icon name="print-outline" iconFamily="Ionicons" size={16} color={COLORS.textSecondary} />
              <Typography size={12} color={COLORS.textSecondary} mL={4}>
                Print
              </Typography>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </Container>
);

export default DrillsScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(SPACING.component),
  },
  drillCard: { padding: Sizer.hSize(SPACING.cardP), ...SHADOWS.card },
  drillHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizer.hSize(12),
    marginBottom: Sizer.vSize(12),
  },
  iconCircle: {
    width: Sizer.hSize(44),
    height: Sizer.hSize(44),
    borderRadius: Sizer.hSize(22),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drillActions: { flexDirection: 'row', gap: Sizer.hSize(8) },
  viewBtn: {
    flex: 1,
    height: Sizer.vSize(36),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtn: {
    height: Sizer.vSize(36),
    paddingHorizontal: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    borderRadius: Sizer.hSize(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
