import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Container, Typography, Flex } from '../../../atomComponents';
import { Header, ScreenBanner } from '../../../components';
import { COLORS, GLOBALSTYLE, SHADOWS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';
import {
  navigateFromTabToStack,
  openDrawerFromTabNavigation,
} from '../../../navigation/navigationHelpers';

const QUICK_LINKS = [
  {
    label: 'Account settings',
    screen: 'ProfileDetailsScreen',
    icon: 'person-outline',
    desc: 'Profile, photo & password',
    color: '#3498db',
    bg: 'rgba(52, 152, 219, 0.12)'
  },
  {
    label: 'Subscription & billing',
    screen: 'SubscriptionScreen',
    icon: 'card-outline',
    desc: 'Plan & payment methods',
    color: '#9b59b6',
    bg: 'rgba(155, 89, 182, 0.12)'
  },
  {
    label: 'Shop',
    screen: 'ShopScreen',
    icon: 'storefront-outline',
    desc: 'Apparel & gear',
    color: '#e67e22',
    bg: 'rgba(230, 126, 34, 0.12)'
  },
  {
    label: 'Analytics',
    screen: 'AnalyticsDashboard',
    icon: 'stats-chart-outline',
    desc: 'Tutorials & workbooks',
    color: '#2ecc71',
    bg: 'rgba(46, 204, 113, 0.12)'
  },
  {
    label: 'Help & support',
    screen: 'HelpAndSupportScreen',
    icon: 'help-circle-outline',
    desc: 'FAQs & contact',
    color: '#f1c40f',
    bg: 'rgba(241, 196, 15, 0.12)'
  },
  {
    label: 'Notifications',
    screen: 'NotificationScreen',
    icon: 'notifications-outline',
    desc: 'Alerts & updates',
    color: '#e74c3c',
    bg: 'rgba(231, 76, 60, 0.12)'
  },
];

const MoreHubScreen = ({ navigation }) => {
  const openFullMenu = () => openDrawerFromTabNavigation(navigation);

  const go = screenName => {
    navigateFromTabToStack(navigation, screenName);
  };

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <Header type="app" title="More" isBackVisible={false} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Sizer.vSize(120) }}
      >
        <ScreenBanner 
            title="Shortcuts & settings"
            subtitle="Quick access to common areas. Open the full menu for training, tournaments, documents and performance tracking."
        />

        <View style={[GLOBALSTYLE.paddingHor, { marginTop: Sizer.vSize(24), paddingHorizontal: Sizer.hSize(20) }]}>
          
          <TouchableOpacity
            style={styles.fullMenuCard}
            onPress={openFullMenu}
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel="Open full navigation menu"
          >
            <View style={styles.fullMenuIconWrap}>
              <Icon name="grid" iconFamily="Ionicons" size={28} color={COLORS.white100} />
            </View>
            <View style={styles.fullMenuText}>
              <Typography
                color={COLORS.white100}
                fFamily="barlowBold700"
                size={18}
                lineHeight={24}
              >
                Launch full menu
              </Typography>
              <Typography
                color="rgba(255,255,255,0.85)"
                size={13}
                lineHeight={20}
                mT={4}
              >
                Access all modules and training tools
              </Typography>
            </View>
            <View style={styles.arrowBox}>
                <Icon
                    name="chevron-forward"
                    iconFamily="Ionicons"
                    size={22}
                    color={COLORS.white100}
                />
            </View>
          </TouchableOpacity>

          <Typography
            color={COLORS.textPrimary}
            size={16}
            fFamily="barlowBold700"
            mT={32}
            mB={16}
          >
            QUICK ACCESS
          </Typography>

          <View style={styles.grid}>
            {QUICK_LINKS.map(item => (
                <TouchableOpacity
                    key={item.screen}
                    style={styles.gridItem}
                    onPress={() => go(item.screen)}
                    activeOpacity={0.88}
                >
                    <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                        <Icon name={item.icon} iconFamily="Ionicons" size={24} color={item.color} />
                    </View>
                    <Typography
                        color={COLORS.textPrimary}
                        fFamily="barlowBold700"
                        size={15}
                        mT={12}
                    >
                        {item.label}
                    </Typography>
                    <Typography color={COLORS.textMuted} size={11} mT={4} lineHeight={16}>
                        {item.desc}
                    </Typography>
                </TouchableOpacity>
            ))}
          </View>

          {/* Legal Section */}
          <Typography
            color={COLORS.textPrimary}
            size={16}
            fFamily="barlowBold700"
            mT={32}
            mB={16}
          >
            LEGAL & INFO
          </Typography>

          <View style={styles.legalBox}>
                <LegalRow title="Terms & Conditions" onPress={() => go('TermsAndConditionsScreen')} />
                <LegalRow title="Privacy Policy" onPress={() => go('TermsAndConditionsScreen')} />
                <LegalRow title="About ClayMaster" onPress={() => go('AboutUsScreen')} last />
          </View>

        </View>
      </ScrollView>
    </Container>
  );
};

const LegalRow = ({ title, onPress, last }) => (
    <TouchableOpacity 
        style={[styles.legalRow, last && { borderBottomWidth: 0 }]} 
        onPress={onPress}
        activeOpacity={0.88}
    >
        <Typography size={14} color={COLORS.textSecondary} fFamily="barlowMedium500">{title}</Typography>
        <Icon name="chevron-forward" iconFamily="Ionicons" size={18} color={COLORS.textMuted} />
    </TouchableOpacity>
)

export default MoreHubScreen;

const styles = StyleSheet.create({
  fullMenuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: Sizer.hSize(20),
    padding: Sizer.hSize(20),
    marginTop: Sizer.vSize(20),
    ...SHADOWS.banner,
  },
  fullMenuIconWrap: {
    width: Sizer.hSize(60),
    height: Sizer.hSize(60),
    borderRadius: Sizer.hSize(15),
    backgroundColor: 'rgba(232, 93, 4, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(232, 93, 4, 0.3)',
  },
  fullMenuText: {
    flex: 1,
    marginLeft: Sizer.hSize(18),
    marginRight: Sizer.hSize(8),
    minWidth: 0,
  },
  arrowBox: {
    width: Sizer.hSize(36),
    height: Sizer.hSize(36),
    borderRadius: Sizer.hSize(18),
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: Sizer.hSize(16),
    padding: Sizer.hSize(16),
    marginBottom: Sizer.hSize(14),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.card,
  },
  iconBox: {
    width: Sizer.hSize(44),
    height: Sizer.hSize(44),
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  legalBox: {
    backgroundColor: COLORS.surface,
    borderRadius: Sizer.hSize(16),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderSubtle,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Sizer.hSize(18),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.borderSubtle,
  }
});
