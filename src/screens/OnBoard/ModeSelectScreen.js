import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Container, Typography } from '../../atomComponents';
import Icon from '../../helpers/Icon';
import { COLORS, GLOBALSTYLE, RADIUS, SHADOWS, SPACING, TYPE } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import {
  FIELD_MODE_SELECT_TAGS,
  LIBRARY_MODE_SELECT_TAGS,
  MODE_LABELS,
} from '../../constants/modeSections';
import { useModeSwitch } from '../../hooks/useModeSwitch';

/**
 * ClayMaster-App-UI `ModeSelect.tsx` — uses `px-screen-px` (16) like rest of app
 */
const ModeSelectScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { switchToFieldMode, switchToLibraryMode, canUseLibrary } = useModeSwitch();

  const selectMode = async mode => {
    if (mode === 'course') {
      switchToFieldMode('CourseHomeScreen');
      return;
    }
    await switchToLibraryMode('Home');
  };

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + Sizer.vSize(24) },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Icon
              name="disc-outline"
              iconFamily="Ionicons"
              size={32}
              color={COLORS.white100}
            />
          </View>
          <Typography
            fFamily="barlowBold700"
            size={TYPE.h1.size}
            color={COLORS.textPrimary}
          >
            What are you doing today?
          </Typography>
          <Typography
            size={TYPE.body.size}
            color={COLORS.textSecondary}
            mT={8}
            textAlign="center"
          >
            Choose your experience
          </Typography>
        </View>

        <TouchableOpacity
          style={styles.courseCard}
          activeOpacity={0.95}
          onPress={() => selectMode('course')}
        >
          <View style={styles.courseBody}>
            <View style={styles.cardTopRow}>
              <View style={styles.modeRow}>
                <View style={styles.orangeCircle}>
                  <Icon
                    name="locate"
                    iconFamily="Ionicons"
                    size={22}
                    color={COLORS.white100}
                  />
                </View>
                <Typography
                  size={TYPE.caption.size}
                  color={COLORS.primary}
                  fFamily="barlowSemiBold600"
                  style={styles.uppercase}
                >
                  {MODE_LABELS.field}
                </Typography>
              </View>
              <Icon
                name="chevron-forward"
                iconFamily="Ionicons"
                size={24}
                color="rgba(255,255,255,0.5)"
              />
            </View>
            <Typography
              fFamily="barlowBold700"
              size={TYPE.h1.size}
              color={COLORS.white100}
              mT={12}
            >
              {MODE_LABELS.field}
            </Typography>
            <Typography
              size={TYPE.body.size}
              color="rgba(255,255,255,0.7)"
              mT={8}
              lineHeight={TYPE.body.lineHeight}
            >
              Digital scorecard, miss diagnostics, practice drills, and downloaded videos —
              built for the range.
            </Typography>
            <View style={styles.tags}>
              {FIELD_MODE_SELECT_TAGS.map(tag => (
                <View key={tag} style={styles.tagDark}>
                  <Typography size={TYPE.caption.size} color="rgba(255,255,255,0.8)">
                    {tag}
                  </Typography>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.courseFooter}>
            <View style={styles.liveDot} />
            <Typography size={TYPE.caption.size} color="rgba(255,255,255,0.6)" style={{ flex: 1 }}>
              Optimized for outdoor use · High contrast · Big buttons
            </Typography>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            GLOBALSTYLE.screenCard,
            styles.libraryCard,
            !canUseLibrary && styles.libraryCardDisabled,
          ]}
          activeOpacity={0.95}
          onPress={() => selectMode('library')}
          disabled={!canUseLibrary}
        >
          <View style={styles.libraryBody}>
            <View style={styles.cardTopRow}>
              <View style={styles.modeRow}>
                <View style={styles.lightCircle}>
                  <Icon
                    name="library-outline"
                    iconFamily="Ionicons"
                    size={22}
                    color={COLORS.primary}
                  />
                </View>
                <Typography
                  size={TYPE.caption.size}
                  color={COLORS.primary}
                  fFamily="barlowSemiBold600"
                  style={styles.uppercase}
                >
                  {MODE_LABELS.library}
                </Typography>
              </View>
              <Icon
                name="chevron-forward"
                iconFamily="Ionicons"
                size={24}
                color={COLORS.textSecondary}
              />
            </View>
            <Typography
              fFamily="barlowBold700"
              size={TYPE.h1.size}
              color={COLORS.textPrimary}
              mT={12}
            >
              {MODE_LABELS.library}
            </Typography>
            <Typography
              size={TYPE.body.size}
              color={COLORS.textSecondary}
              mT={8}
              lineHeight={TYPE.body.lineHeight}
            >
              The full ClayMaster portal on your phone — same core training order, plus
              analytics, coaching, community, shop, and more.
            </Typography>
            <View style={styles.tags}>
              {LIBRARY_MODE_SELECT_TAGS.map(tag => (
                <View key={tag} style={styles.tagLight}>
                  <Typography size={TYPE.caption.size} color={COLORS.textSecondary}>
                    {tag}
                  </Typography>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.libraryFooter}>
            <Icon
              name={canUseLibrary ? 'book-outline' : 'cloud-offline-outline'}
              iconFamily="Ionicons"
              size={14}
              color={COLORS.textSecondary}
            />
            <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mL={8} style={{ flex: 1 }}>
              {canUseLibrary
                ? 'Content-rich · Structured learning · Full access'
                : 'Requires stable internet — connect to use Full Library Mode'}
            </Typography>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
};

export default ModeSelectScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.xs),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(SPACING.component),
  },
  header: {
    alignItems: 'center',
    marginBottom: Sizer.vSize(SPACING.section),
  },
  logoBox: {
    width: Sizer.hSize(64),
    height: Sizer.hSize(64),
    borderRadius: Sizer.hSize(RADIUS.md),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizer.vSize(SPACING.component),
  },
  courseCard: {
    borderRadius: Sizer.hSize(RADIUS.md),
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  courseBody: {
    backgroundColor: COLORS.textPrimary,
    paddingHorizontal: Sizer.hSize(SPACING.sm),
    paddingVertical: Sizer.vSize(SPACING.sm),
  },
  courseFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(8),
    backgroundColor: '#141414',
    paddingHorizontal: Sizer.hSize(SPACING.sm),
    paddingVertical: Sizer.vSize(12),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },
  libraryCard: {
    overflow: 'hidden',
    padding: 0,
    ...SHADOWS.card,
  },
  libraryCardDisabled: {
    opacity: 0.55,
  },
  libraryBody: {
    paddingHorizontal: Sizer.hSize(SPACING.sm),
    paddingVertical: Sizer.vSize(SPACING.sm),
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Sizer.hSize(8),
    flex: 1,
  },
  libraryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizer.hSize(SPACING.sm),
    paddingVertical: Sizer.vSize(12),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.borderMuted,
    backgroundColor: COLORS.surface,
  },
  orangeCircle: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    borderRadius: Sizer.hSize(20),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightCircle: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    borderRadius: Sizer.hSize(20),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uppercase: {
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizer.hSize(8),
    marginTop: Sizer.vSize(SPACING.component),
  },
  tagDark: {
    paddingHorizontal: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(4),
    borderRadius: Sizer.hSize(20),
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  tagLight: {
    paddingHorizontal: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(4),
    borderRadius: Sizer.hSize(20),
    backgroundColor: COLORS.primaryLight,
  },
});
