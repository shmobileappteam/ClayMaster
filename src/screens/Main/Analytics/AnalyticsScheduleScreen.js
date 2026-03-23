import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header } from '../../../components';
import { BASEOPACITY, COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';

// SOW §2.1: Managed Services – Analytics Scheduling (Calendly Integration)
const ANALYTICS_DOCS = [
  { title: 'ClayMaster Managed Services – Analytics Process Flow', type: 'PDF' },
  { title: 'Managed Services – Analytics Reports', type: 'PDF' },
];

const AnalyticsScheduleScreen = ({ navigation }) => {
  const [activePlan] = useState('Classic'); // Will come from Redux in final integration

  const sessionData = {
    total:     activePlan === 'Pro' ? 2 : 1,
    used:      0,
    remaining: activePlan === 'Pro' ? 2 : 1,
  };

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <Header type="app" title="Analytics Sessions" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Session Credits */}
        <View style={[styles.panel, GLOBALSTYLE.marginHor]}>
          <Typography color={COLORS.white100} fFamily="barlowSemiBold600" size={15}>Session Credits</Typography>
          <Flex direction="row" jContent="space-between" mT={18}>
            <StatBox label="Total"    value={sessionData.total}     color={COLORS.primary} />
            <StatBox label="Used"     value={sessionData.used}      color={COLORS.orange400 || '#FF8A65'} />
            <StatBox label="Remaining" value={sessionData.remaining} color={COLORS.white100} />
          </Flex>
          <View style={styles.planBadge}>
            <Typography size={12} color={COLORS.black300} fFamily="barlowBold700">
              {activePlan} Plan — {sessionData.total} session{sessionData.total > 1 ? 's' : ''}/month
            </Typography>
          </View>
        </View>

        {/* Schedule CTA */}
        <View style={GLOBALSTYLE.paddingHor}>
          <Typography fFamily="barlowBold700" size={18} color={COLORS.black300} mT={32}>Schedule a Session</Typography>
          <Typography size={14} color={COLORS.black500} mT={8}>
            Book your analytics session with our coaching team via Calendly.
          </Typography>
          <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8}>
            <Icon name="calendar-outline" iconFamily="Ionicons" size={24} color={COLORS.white100} />
            <Typography color={COLORS.white100} mL={10} fFamily="barlowBold700" size={15}>Open Calendly Booking</Typography>
          </TouchableOpacity>

          {/* View Past Sessions */}
          <Typography fFamily="barlowBold700" size={18} color={COLORS.black300} mT={32}>Past Sessions</Typography>
          <View style={styles.emptyBox}>
            <Icon name="clipboard-outline" iconFamily="Ionicons" size={32} color={COLORS.primary} />
            <Typography mT={16} color={COLORS.black500} textAlign="center" fFamily="barlowSemiBold600">No sessions recorded yet.</Typography>
          </View>

          {/* Analytics Reports */}
          <Typography fFamily="barlowBold700" size={18} color={COLORS.black300} mT={32} mB={8}>Analytics Documents</Typography>
          {ANALYTICS_DOCS.map((doc, i) => (
            <DocRow key={i} title={doc.title} type={doc.type} />
          ))}
        </View>
      </ScrollView>
    </Container>
  );
};

const StatBox = ({ label, value, color }) => (
  <View style={styles.statBox}>
    <Typography size={24} fFamily="barlowBold700" color={color}>{value}</Typography>
    <Typography size={11} color={COLORS.black500} mT={4} fFamily="barlowBold700">{label}</Typography>
  </View>
);

const DocRow = ({ title, type }) => (
  <View style={styles.docCard}>
    <Flex direction="row" algItems="center">
      <View style={styles.docIcon}>
        <Icon name="document-text" iconFamily="Ionicons" size={24} color={COLORS.secondary} />
      </View>
      <View style={{ flex: 1, marginLeft: Sizer.hSize(16), marginRight: Sizer.hSize(12) }}>
        <Typography fFamily="barlowBold700" size={14} color={COLORS.black300} lineHeight={18}>{title}</Typography>
        <Typography size={12} color={COLORS.black500} mT={4}>{type} Document</Typography>
      </View>
      <Flex direction="row" gap={12}>
        <TouchableOpacity style={styles.actionBtn}><Icon name="eye-outline" iconFamily="Ionicons" size={20} color={COLORS.primary} /></TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}><Icon name="download-outline" iconFamily="Ionicons" size={20} color={COLORS.primary} /></TouchableOpacity>
      </Flex>
    </Flex>
  </View>
);

export default AnalyticsScheduleScreen;

const styles = StyleSheet.create({
  panel: {
    marginTop: Sizer.vSize(24),
    backgroundColor: COLORS.secondary,
    borderRadius: Sizer.hSize(16),
    padding: Sizer.hSize(24),
    elevation: 4,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  statBox: {
    backgroundColor: COLORS.white100,
    width: '30%',
    borderRadius: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(16),
    alignItems: 'center',
  },
  planBadge: {
    marginTop: Sizer.vSize(24),
    backgroundColor: COLORS.white100,
    borderRadius: Sizer.hSize(8),
    paddingHorizontal: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(8),
    alignSelf: 'flex-start',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    height: Sizer.vSize(56),
    borderRadius: Sizer.hSize(12),
    marginTop: Sizer.vSize(20),
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  emptyBox: {
    padding: Sizer.hSize(32),
    backgroundColor: COLORS.white100,
    borderRadius: Sizer.hSize(12),
    marginTop: Sizer.vSize(16),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderStyle: 'dashed',
  },
  docCard: {
    backgroundColor: COLORS.white100,
    borderRadius: Sizer.hSize(12),
    padding: Sizer.hSize(16),
    marginTop: Sizer.vSize(16),
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  docIcon: {
    width: Sizer.hSize(48),
    height: Sizer.hSize(48),
    backgroundColor: '#FAFAFA',
    borderRadius: Sizer.hSize(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  actionBtn: {
    width: Sizer.hSize(36),
    height: Sizer.hSize(36),
    borderRadius: Sizer.hSize(18),
    backgroundColor: COLORS.orange300,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
