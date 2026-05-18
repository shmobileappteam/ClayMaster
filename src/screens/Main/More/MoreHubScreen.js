import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';
import { MENU_SECTIONS } from '../../../navigation/menuSections';
import { navigateFromTabToStack } from '../../../navigation/navigationHelpers';
import { useAppMode } from '../../../context/AppModeContext';

/**
 * CONTENT INVENTORY — ClayMaster-App-UI `MoreMenu.tsx`
 * Header: 1 (title "More", showBack, no notification)
 * Section labels: 4 (Training, Analytics & Scoring, Compete & Shop, Account)
 * Menu rows: 18 (6+4+5+3 from menuSections)
 * Bottom CTA: 1 ("Switch to On the Course")
 */
const MoreHubScreen = ({ navigation }) => {
  const { setMode } = useAppMode();

  const go = item => {
    if (item.action === 'tab') {
      navigation.navigate(item.tab);
      return;
    }
    if (item.screen) {
      navigateFromTabToStack(navigation, item.screen);
    }
  };

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader title="More" showBack showNotification={false} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {MENU_SECTIONS.map(section => (
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
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.menuRow,
                    index < section.items.length - 1 && styles.menuRowBorder,
                  ]}
                  activeOpacity={0.88}
                  onPress={() => go(item)}
                >
                  <View style={styles.menuIconCircle}>
                    <Icon
                      name={item.icon}
                      iconFamily="Ionicons"
                      size={18}
                      color={COLORS.primary}
                    />
                  </View>
                  <Typography
                    fFamily="barlowMedium500"
                    size={14}
                    lineHeight={21}
                    color={COLORS.textPrimary}
                    style={{ flex: 1 }}
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
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={styles.courseBtn}
          activeOpacity={0.88}
          onPress={() => {
            setMode('course');
            navigateFromTabToStack(navigation, 'CourseHomeScreen');
          }}
        >
          <Icon name="locate" iconFamily="Ionicons" size={18} color={COLORS.white100} />
          <Typography
            fFamily="barlowSemiBold600"
            size={14}
            lineHeight={21}
            color={COLORS.white100}
            mL={8}
          >
            Switch to On the Course
          </Typography>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
};

export default MoreHubScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(100),
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
  courseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: Sizer.vSize(48),
    backgroundColor: COLORS.textPrimary,
    borderRadius: Sizer.hSize(RADIUS.md),
    marginTop: Sizer.vSize(8),
  },
});
