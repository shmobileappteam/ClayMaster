import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import Icon from '../../../helpers/Icon';
import { COLORS, GLOBALSTYLE, SHADOWS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useRequireLibraryMode } from '../../../hooks/useRequireLibraryMode';
import { useDrillAccess } from '../../../hooks/useDrillAccess';
import { useModeSwitch } from '../../../hooks/useModeSwitch';
import { PRACTICE_DRILLS, estimateDrillSizeMb } from '../../../constants/practiceDrills';
import {
  getDrillStorageSummary,
  isDrillDownloaded,
  removeDownloadedDrill,
  saveDownloadedDrill,
} from '../../../utils/downloadedDrills';
import { showMessage } from '../../../utils';

/**
 * PAGE 13–14 — Full Library practice drills (Classic 9 / Pro 13 PDFs).
 * List = preview cards; open detail only via View (portal parity).
 */
const DrillsScreen = ({ navigation }) => {
  const { isPro, drills, classicCount, proCount, canAccessDrill } = useDrillAccess();
  const { canUseLibrary } = useModeSwitch();
  const [savedIds, setSavedIds] = useState([]);

  useFocusEffect(
    useCallback(() => {
      setSavedIds(PRACTICE_DRILLS.filter(d => isDrillDownloaded(d.id)).map(d => d.id));
    }, []),
  );

  if (useRequireLibraryMode()) {
    return null;
  }

  const storage = getDrillStorageSummary();

  const openDrill = drill => {
    if (!canAccessDrill(drill)) {
      showMessage({
        type: 'default',
        title: 'Pro drill',
        message: 'Upgrade to Pro for 13 practice drill PDFs (Classic includes 9).',
        duration: 4000,
      });
      return;
    }
    navigation.navigate('DrillDetailScreen', { drill });
  };

  const toggleDownload = drill => {
    if (!canAccessDrill(drill)) {
      return;
    }
    if (!canUseLibrary) {
      showMessage({
        type: 'danger',
        title: 'Connection required',
        message: 'Download drill PDFs while you have full internet or strong Wi‑Fi.',
        duration: 4000,
      });
      return;
    }
    if (savedIds.includes(drill.id)) {
      removeDownloadedDrill(drill.id);
      setSavedIds(prev => prev.filter(id => id !== drill.id));
      return;
    }
    saveDownloadedDrill(drill);
    setSavedIds(prev => [...prev, drill.id]);
    showMessage({
      type: 'success',
      title: 'Saved for Field Mode',
      message: `~${estimateDrillSizeMb(drill.pages)} MB PDF ready offline.`,
      duration: 3000,
    });
  };

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Practice Drills"
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Typography size={14} color={COLORS.textSecondary} mB={12}>
          {isPro
            ? `Pro membership — ${proCount} drill PDFs (2–4 pages each).`
            : `Classic membership — ${classicCount} drill PDFs. Upgrade for ${proCount - classicCount} more.`}
        </Typography>

        <View style={[GLOBALSTYLE.screenCard, styles.downloadSection]}>
          <Typography fFamily="barlowSemiBold600" size={14} color={COLORS.textPrimary}>
            Download for Field Mode
          </Typography>
          <Typography size={12} color={COLORS.textSecondary} mT={6} lineHeight={18}>
            Small PDFs store quickly on your phone. Save drills here, then open them offline at the range
            under Field Mode → Practice Drills.
          </Typography>
          <Typography size={12} color={COLORS.textPrimary} fFamily="barlowMedium500" mT={10}>
            {storage.count} PDFs saved · ~{storage.totalMb} MB total
          </Typography>
        </View>

        {PRACTICE_DRILLS.map(drill => {
          const locked = !canAccessDrill(drill);
          const saved = savedIds.includes(drill.id);
          return (
            <View
              key={drill.id}
              style={[GLOBALSTYLE.screenCard, styles.drillCard, locked && styles.drillCardLocked]}
            >
              <View style={styles.drillHeader}>
                <View style={styles.iconCircle}>
                  <Icon name="locate-outline" iconFamily="Ionicons" size={22} color={COLORS.primary} />
                </View>
                <View style={styles.drillText}>
                  <Typography fFamily="barlowSemiBold600" size={14} color={COLORS.textPrimary}>
                    {drill.title}
                    {drill.tier === 'pro' ? ' · Pro' : ''}
                  </Typography>
                  <Typography size={12} color={COLORS.textSecondary} mT={2} numberOfLines={2}>
                    {drill.desc}
                  </Typography>
                  <Typography size={12} color={COLORS.textSecondary} mT={4}>
                    {drill.pages}-page PDF preview · tap View for full drill
                  </Typography>
                  {saved ? (
                    <Typography size={12} color={COLORS.primary} mT={4}>
                      On device
                    </Typography>
                  ) : null}
                </View>
              </View>
              <View style={styles.drillActions}>
                <TouchableOpacity
                  style={[styles.viewBtn, locked && styles.btnDisabled]}
                  activeOpacity={0.88}
                  onPress={() => openDrill(drill)}
                  disabled={locked}
                >
                  <Icon name="eye-outline" iconFamily="Ionicons" size={16} color={COLORS.white100} />
                  <Typography fFamily="barlowSemiBold600" size={12} color={COLORS.white100} mL={4}>
                    View
                  </Typography>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.secondaryBtn, locked && styles.btnDisabled]}
                  activeOpacity={0.88}
                  onPress={() => toggleDownload(drill)}
                  disabled={locked}
                >
                  <Icon
                    name={saved ? 'checkmark-circle' : 'download-outline'}
                    iconFamily="Ionicons"
                    size={16}
                    color={saved ? COLORS.primary : COLORS.textSecondary}
                  />
                  <Typography size={12} color={saved ? COLORS.primary : COLORS.textSecondary} mL={4}>
                    {saved ? 'Saved' : 'Download'}
                  </Typography>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.secondaryBtn, locked && styles.btnDisabled]}
                  activeOpacity={0.88}
                  onPress={() => openDrill(drill)}
                  disabled={locked}
                >
                  <Icon name="print-outline" iconFamily="Ionicons" size={16} color={COLORS.textSecondary} />
                  <Typography size={12} color={COLORS.textSecondary} mL={4}>
                    Print
                  </Typography>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </Container>
  );
};

export default DrillsScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(SPACING.component),
  },
  downloadSection: {
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
  drillCard: { padding: Sizer.hSize(SPACING.cardP), ...SHADOWS.card },
  drillCardLocked: { opacity: 0.55 },
  drillHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizer.hSize(12),
    marginBottom: Sizer.vSize(12),
  },
  drillText: { flex: 1 },
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
  btnDisabled: {
    opacity: 0.5,
  },
});
