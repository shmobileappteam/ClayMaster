import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { Typography } from '../atomComponents';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../globalStyle/Theme';
import Icon from '../helpers/Icon';
import Sizer from '../helpers/Sizer';
import { MENU_SECTIONS, filterMenuSections } from './menuSections';
import { navigateFromMenuItem } from './navigationHelpers';

export function navigateFromDrawer(drawerNav, item) {
  if (typeof drawerNav.closeDrawer === 'function') {
    drawerNav.closeDrawer();
  }
  const go = () => navigateFromMenuItem(drawerNav, item);
  if (Platform.OS === 'ios') {
    requestAnimationFrame(go);
  } else {
    setTimeout(go, 50);
  }
}

const MenuRow = ({ item, isLast, navigation }) => (
  <TouchableOpacity
    style={[styles.menuRow, !isLast && styles.menuRowBorder]}
    activeOpacity={0.88}
    onPress={() => navigateFromDrawer(navigation, item)}
    accessibilityRole="button"
  >
    <View style={styles.menuIconCircle}>
      <Icon name={item.icon} iconFamily="Ionicons" size={18} color={COLORS.primary} />
    </View>
    <Typography
      fFamily="barlowMedium500"
      size={14}
      lineHeight={21}
      color={COLORS.textPrimary}
      style={styles.menuLabel}
    >
      {item.label}
    </Typography>
    <Icon
      name="chevron-forward"
      iconFamily="Ionicons"
      size={18}
      color={COLORS.textSecondary}
    />
  </TouchableOpacity>
);

/**
 * Side drawer — parity with ClayMaster-App-UI `AppMenuSheet.tsx` (light card sheet).
 */
const CustomDrawerContent = props => {
  const { navigation } = props;
  const insets = useSafeAreaInsets();
  const subscriptionEnabled = useSelector(state => state.app.subscriptionEnabled);
  const sections = useMemo(
    () => filterMenuSections(MENU_SECTIONS, subscriptionEnabled),
    [subscriptionEnabled],
  );

  return (
    <View style={styles.shell}>
      <View style={[styles.header, { paddingTop: insets.top + Sizer.vSize(32) }]}>
        <Typography size={12} lineHeight={17} color={COLORS.textSecondary}>
          Quick navigation
        </Typography>
        <Typography
          fFamily="barlowSemiBold600"
          size={20}
          lineHeight={26}
          color={COLORS.textPrimary}
          mT={4}
        >
          ClayMaster Menu
        </Typography>
        <Typography size={12} lineHeight={17} color={COLORS.textSecondary} mT={4}>
          Jump into training, scoring, shopping, and account tools.
        </Typography>
      </View>

      <DrawerContentScrollView
        {...props}
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, Sizer.vSize(24)) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {sections.map(section => (
          <View key={section.title} style={styles.section}>
            <Typography
              fFamily="barlowSemiBold600"
              size={20}
              lineHeight={26}
              color={COLORS.textPrimary}
              mB={12}
            >
              {section.title}
            </Typography>
            <View style={styles.sectionCard}>
              {section.items.map((item, index) => (
                <MenuRow
                  key={item.label}
                  item={item}
                  isLast={index === section.items.length - 1}
                  navigation={navigation}
                />
              ))}
            </View>
          </View>
        ))}
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: COLORS.mainBg,
  },
  header: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingBottom: Sizer.vSize(16),
    backgroundColor: COLORS.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.borderMuted,
  },
  scroll: {
    flex: 1,
    backgroundColor: COLORS.mainBg,
  },
  scrollContent: {
    paddingHorizontal: Sizer.hSize(16),
    paddingTop: Sizer.vSize(16),
  },
  section: {
    marginBottom: Sizer.vSize(SPACING.section),
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: Sizer.hSize(RADIUS.md),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderMuted,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizer.hSize(SPACING.cardP),
    paddingVertical: Sizer.vSize(14),
    gap: Sizer.hSize(12),
  },
  menuRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.borderMuted,
  },
  menuIconCircle: {
    width: Sizer.hSize(36),
    height: Sizer.hSize(36),
    borderRadius: Sizer.hSize(18),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    minWidth: 0,
  },
});
