import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Typography } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
import CourseHeader from '../../../components/course/CourseHeader';
import Icon from '../../../helpers/Icon';
import { COLORS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { navigateFromFieldToStack } from '../../../navigation/navigationHelpers';
import { FIELD_CONTINUE_TRAINING, FIELD_DRILL_ACCESS } from '../../../constants/modeSections';
import { useDrillAccess } from '../../../hooks/useDrillAccess';
import { useModeSwitch } from '../../../hooks/useModeSwitch';
import { PRACTICE_DRILLS } from '../../../constants/practiceDrills';
import {
  getDrillStorageSummary,
  isDrillDownloaded,
  removeDownloadedDrill,
  saveDownloadedDrill,
} from '../../../utils/downloadedDrills';
import { showMessage } from '../../../utils';

const QUICK_VIDEOS = [
  { title: 'Pre-Shot Routine', duration: '2:30' },
  { title: 'Reading the Target', duration: '4:15' },
];

/**
 * PAGE 13–14 — Field Practice Drills: preview list + explicit View for detail (portal parity).
 */
const CourseTrainScreen = ({ navigation }) => {
  const { isPro, classicCount, proCount, canAccessDrill } = useDrillAccess();
  const { canUseLibrary } = useModeSwitch();
  const [savedIds, setSavedIds] = useState([]);

  useFocusEffect(
    useCallback(() => {
      setSavedIds(PRACTICE_DRILLS.filter(d => isDrillDownloaded(d.id)).map(d => d.id));
    }, []),
  );

  const storage = getDrillStorageSummary();
  const drillCount = isPro ? proCount : classicCount;

  const openDrillDetail = drill => {
    if (!canAccessDrill(drill)) {
      showMessage({
        type: 'default',
        title: 'Pro drill',
        message: `Classic includes ${classicCount} drills. Upgrade to Pro for all ${proCount} PDFs.`,
        duration: 4000,
      });
      return;
    }
    navigateFromFieldToStack(navigation, 'DrillDetailScreen', { drill, fieldMode: true });
  };

  const toggleDownload = drill => {
    if (!canAccessDrill(drill)) {
      return;
    }
    if (savedIds.includes(drill.id)) {
      removeDownloadedDrill(drill.id);
      setSavedIds(prev => prev.filter(id => id !== drill.id));
      return;
    }
    if (!canUseLibrary) {
      showMessage({
        type: 'danger',
        title: 'Save while online',
        message: 'Download drill PDFs in Full Library Mode or when you have a stable connection.',
        duration: 4000,
      });
      return;
    }
    saveDownloadedDrill(drill);
    setSavedIds(prev => [...prev, drill.id]);
    showMessage({
      type: 'success',
      title: 'PDF saved',
      message: `"${drill.title}" is ready offline.`,
      duration: 3000,
    });
  };

  return (
    <CourseLayout>
      <CourseHeader title="Practice Drills" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.previewDoc}>
          <View style={styles.previewDocIcon}>
            <Icon name="document-text-outline" iconFamily="Ionicons" size={28} color={COLORS.primary} />
          </View>
          <View style={styles.previewDocText}>
            <Typography fFamily="barlowBold700" size={16} color={COLORS.white100}>
              Drill library preview
            </Typography>
            <Typography size={12} lineHeight={17} color={COLORS.courseTextMuted} mT={4}>
              {drillCount} small PDFs ({FIELD_DRILL_ACCESS.avgPdfPages} pages each) included in your plan.
              Select a drill and tap View for steps, download, and playback.
            </Typography>
            {storage.count > 0 ? (
              <Typography size={12} color={COLORS.primary} mT={6}>
                {storage.count} saved on device (~{storage.totalMb} MB)
              </Typography>
            ) : null}
          </View>
        </View>

        <View style={styles.section}>
          <Typography
            size={12}
            lineHeight={17}
            color="#999999"
            fFamily="barlowBold700"
            style={styles.sectionLabel}
            mB={12}
          >
            Continue Training
          </Typography>
          <View style={styles.rowGroup}>
            {FIELD_CONTINUE_TRAINING.map(item => (
              <TouchableOpacity
                key={item.label}
                style={styles.row}
                activeOpacity={0.88}
                onPress={() =>
                  navigateFromFieldToStack(navigation, item.screen, item.params)
                }
              >
                <View style={styles.drillIconBox}>
                  <Icon
                    name={item.icon}
                    iconFamily="Ionicons"
                    size={24}
                    color={COLORS.primary}
                  />
                </View>
                <View style={styles.rowText}>
                  <Typography fFamily="barlowBold700" size={18} lineHeight={25} color={COLORS.white100}>
                    {item.label}
                  </Typography>
                  <Typography size={12} lineHeight={17} color="#666666" mT={4}>
                    {item.desc}
                  </Typography>
                </View>
                <Icon name="chevron-forward" iconFamily="Ionicons" size={20} color="#444444" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Typography
            size={12}
            lineHeight={17}
            color="#999999"
            fFamily="barlowBold700"
            style={styles.sectionLabel}
            mB={12}
          >
            Select a drill ({isPro ? 'Pro 13' : `Classic ${classicCount}`})
          </Typography>
          <View style={styles.rowGroup}>
            {PRACTICE_DRILLS.map(drill => {
              const locked = !canAccessDrill(drill);
              const saved = savedIds.includes(drill.id);
              return (
                <View key={drill.id} style={[styles.previewRow, locked && styles.rowLocked]}>
                  <View style={styles.previewBody}>
                    <View style={styles.drillIconBox}>
                      <Icon
                        name={locked ? 'lock-closed-outline' : 'document-outline'}
                        iconFamily="Ionicons"
                        size={22}
                        color={locked ? COLORS.courseTextMuted : COLORS.primary}
                      />
                    </View>
                    <View style={styles.rowText}>
                      <Typography fFamily="barlowSemiBold600" size={15} color={COLORS.white100}>
                        {drill.title}
                      </Typography>
                      <Typography size={12} color="#888" mT={2} numberOfLines={2}>
                        {drill.desc}
                      </Typography>
                      <Typography size={11} color={COLORS.courseTextMuted} mT={4}>
                        {drill.pages} pages · {drill.duration}
                        {saved ? ' · Saved' : ''}
                      </Typography>
                    </View>
                  </View>
                  {!locked ? (
                    <View style={styles.previewActions}>
                      <TouchableOpacity
                        style={styles.viewBtn}
                        activeOpacity={0.88}
                        onPress={() => openDrillDetail(drill)}
                      >
                        <Icon name="eye-outline" iconFamily="Ionicons" size={14} color={COLORS.white100} />
                        <Typography fFamily="barlowSemiBold600" size={11} color={COLORS.white100} mL={4}>
                          View
                        </Typography>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.downloadBtn}
                        activeOpacity={0.88}
                        onPress={() => toggleDownload(drill)}
                      >
                        <Icon
                          name={saved ? 'checkmark-circle' : 'download-outline'}
                          iconFamily="Ionicons"
                          size={18}
                          color={saved ? COLORS.primary : COLORS.courseTextMuted}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Typography
            size={12}
            lineHeight={17}
            color="#999999"
            fFamily="barlowBold700"
            style={styles.sectionLabel}
            mB={12}
          >
            Audio Tips
          </Typography>
          <View style={styles.rowGroup}>
            {QUICK_VIDEOS.map(tip => (
              <TouchableOpacity
                key={tip.title}
                style={styles.row}
                activeOpacity={0.88}
                onPress={() =>
                  navigateFromFieldToStack(navigation, 'CourseAudioTipScreen', { tip })
                }
              >
                <View style={styles.audioIconBox}>
                  <Icon name="volume-high" iconFamily="Ionicons" size={24} color={COLORS.primary} />
                </View>
                <View style={styles.rowText}>
                  <Typography fFamily="barlowBold700" size={18} lineHeight={25} color={COLORS.white100}>
                    {tip.title}
                  </Typography>
                  <Typography size={12} lineHeight={17} color="#666666" mT={4}>
                    {tip.duration}
                  </Typography>
                </View>
                <Icon name="play" iconFamily="Ionicons" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </CourseLayout>
  );
};

export default CourseTrainScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingVertical: Sizer.vSize(20),
    paddingBottom: Sizer.vSize(100),
    gap: Sizer.vSize(24),
  },
  previewDoc: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizer.hSize(14),
    padding: Sizer.hSize(16),
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
  },
  previewDocIcon: {
    width: Sizer.hSize(52),
    height: Sizer.hSize(52),
    borderRadius: Sizer.hSize(10),
    backgroundColor: 'rgba(235,108,15,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewDocText: { flex: 1 },
  sectionLabel: {
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  rowGroup: { gap: Sizer.vSize(8) },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
    padding: Sizer.hSize(16),
    gap: Sizer.hSize(16),
  },
  previewRow: {
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
    overflow: 'hidden',
  },
  rowLocked: { opacity: 0.6 },
  previewBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Sizer.hSize(14),
    gap: Sizer.hSize(12),
  },
  previewActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizer.hSize(12),
    paddingBottom: Sizer.hSize(12),
    gap: Sizer.hSize(8),
  },
  viewBtn: {
    flex: 1,
    height: Sizer.vSize(34),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadBtn: {
    width: Sizer.hSize(44),
    height: Sizer.vSize(34),
    borderRadius: Sizer.hSize(10),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drillIconBox: {
    width: Sizer.hSize(44),
    height: Sizer.hSize(44),
    borderRadius: Sizer.hSize(10),
    backgroundColor: 'rgba(235, 108, 15, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioIconBox: {
    width: Sizer.hSize(48),
    height: Sizer.hSize(48),
    borderRadius: Sizer.hSize(12),
    backgroundColor: COLORS.courseBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1, minWidth: 0 },
});
