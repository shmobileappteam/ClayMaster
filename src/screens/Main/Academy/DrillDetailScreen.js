import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import CourseLayout from '../../../components/course/CourseLayout';
import CourseHeader from '../../../components/course/CourseHeader';
import Icon from '../../../helpers/Icon';
import { COLORS, GLOBALSTYLE, SHADOWS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { estimateDrillSizeMb } from '../../../constants/practiceDrills';
import {
  isDrillDownloaded,
  removeDownloadedDrill,
  saveDownloadedDrill,
} from '../../../utils/downloadedDrills';
import { useModeSwitch } from '../../../hooks/useModeSwitch';
import { showMessage } from '../../../utils';

const STEPS = [
  { step: 1, title: 'Review PDF', desc: 'Read the 2–4 page drill sheet (saved on device when downloaded).' },
  { step: 2, title: 'Set Up Station', desc: 'Position yourself with a clear view of the target line.' },
  { step: 3, title: 'Run the Sequence', desc: 'Follow each step on the PDF at the range.' },
  { step: 4, title: 'Execute Shots', desc: 'Apply the drill with live targets or dry mounts.' },
  { step: 5, title: 'Review & Repeat', desc: 'Note hits/misses and repeat as needed.' },
];

const DrillDetailScreen = ({ navigation, route }) => {
  const fieldMode = route?.params?.fieldMode === true;
  const drill = route?.params?.drill;
  const { canUseLibrary } = useModeSwitch();
  const [saved, setSaved] = useState(() => (drill ? isDrillDownloaded(drill.id) : false));

  useFocusEffect(
    useCallback(() => {
      if (drill?.id) {
        setSaved(isDrillDownloaded(drill.id));
      }
    }, [drill?.id]),
  );

  if (!drill) {
    return null;
  }

  const sizeMb = drill.sizeMb ?? estimateDrillSizeMb(drill.pages);
  const savedOnDevice = saved;

  const handleDownload = () => {
    if (savedOnDevice) {
      removeDownloadedDrill(drill.id);
      setSaved(false);
      showMessage({
        type: 'default',
        title: 'Removed from device',
        message: `"${drill.title}" PDF removed from offline drills.`,
        duration: 3000,
      });
      return;
    }
    if (!canUseLibrary && !fieldMode) {
      showMessage({
        type: 'danger',
        title: 'Connection required',
        message: 'Download drill PDFs when you have a stable connection.',
        duration: 4000,
      });
      return;
    }
    saveDownloadedDrill(drill);
    setSaved(true);
    showMessage({
      type: 'success',
      title: 'PDF saved',
      message: `~${sizeMb} MB · Available offline in Field Mode → Practice Drills.`,
      duration: 3500,
    });
  };

  const handleViewPdf = () => {
    if (!savedOnDevice && !canUseLibrary) {
      showMessage({
        type: 'danger',
        title: 'Download first',
        message: 'Save this drill PDF while online to view it at the range.',
        duration: 4000,
      });
      return;
    }
    showMessage({
      type: 'default',
      title: 'PDF viewer',
      message: `Opening "${drill.title}" (${drill.pages} pages) when the document API is connected.`,
      duration: 3000,
    });
  };

  const handleStart = () => {
    const params = {
      drill: {
        title: drill.title,
        duration: drill.duration,
        level: drill.level,
      },
    };
    navigation.navigate('CourseTrainDetailScreen', params);
  };

  const body = (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={[GLOBALSTYLE.screenCard, fieldMode ? styles.headerCardField : styles.headerCard]}>
        <View style={styles.headerTop}>
          <View style={[styles.iconCircle, fieldMode && styles.iconCircleField]}>
            <Icon name="locate-outline" iconFamily="Ionicons" size={24} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Typography
              fFamily="barlowSemiBold600"
              size={20}
              lineHeight={26}
              color={fieldMode ? COLORS.white100 : COLORS.textPrimary}
            >
              {drill.title}
            </Typography>
            <Typography
              size={14}
              color={fieldMode ? COLORS.courseTextMuted : COLORS.textSecondary}
              lineHeight={21}
              mT={4}
            >
              {drill.desc}
            </Typography>
          </View>
        </View>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Icon name="document-text-outline" iconFamily="Ionicons" size={16} color={COLORS.textSecondary} />
            <Typography size={12} color={fieldMode ? COLORS.courseTextMuted : COLORS.textSecondary} mL={6}>
              {drill.pages} pages · ~{sizeMb} MB PDF
            </Typography>
          </View>
          <View style={styles.metaItem}>
            <Icon name="time-outline" iconFamily="Ionicons" size={16} color={COLORS.textSecondary} />
            <Typography size={12} color={fieldMode ? COLORS.courseTextMuted : COLORS.textSecondary} mL={6}>
              {drill.duration}
            </Typography>
          </View>
        </View>
        {savedOnDevice ? (
          <Typography size={12} color={COLORS.primary} mB={8}>
            Saved on this device — works offline
          </Typography>
        ) : null}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.startBtn} activeOpacity={0.88} onPress={handleStart}>
            <Icon name="play" iconFamily="Ionicons" size={18} color={COLORS.white100} />
            <Typography fFamily="barlowSemiBold600" size={14} color={COLORS.white100} mL={8}>
              Start Drill
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.88} onPress={handleDownload}>
            <Icon
              name={savedOnDevice ? 'checkmark-circle' : 'download-outline'}
              iconFamily="Ionicons"
              size={20}
              color={savedOnDevice ? COLORS.primary : COLORS.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.88} onPress={handleViewPdf}>
            <Icon name="print-outline" iconFamily="Ionicons" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <Typography
        fFamily="barlowSemiBold600"
        size={20}
        color={fieldMode ? COLORS.white100 : COLORS.textPrimary}
        mB={12}
      >
        Steps
      </Typography>
      <View style={styles.stepsGroup}>
        {STEPS.map(s => (
          <View
            key={s.step}
            style={[
              GLOBALSTYLE.screenCard,
              styles.stepCard,
              fieldMode && styles.stepCardField,
            ]}
          >
            <View style={styles.stepNum}>
              <Typography size={12} color={COLORS.white100} fFamily="barlowBold700">
                {s.step}
              </Typography>
            </View>
            <View style={{ flex: 1 }}>
              <Typography
                fFamily="barlowSemiBold600"
                size={14}
                color={fieldMode ? COLORS.white100 : COLORS.textPrimary}
              >
                {s.title}
              </Typography>
              <Typography
                size={12}
                color={fieldMode ? COLORS.courseTextMuted : COLORS.textSecondary}
                mT={2}
                lineHeight={17}
              >
                {s.desc}
              </Typography>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  if (fieldMode) {
    return (
      <CourseLayout showTabs={false}>
        <CourseHeader title="Drill" showBack onBack={() => navigation.goBack()} />
        {body}
      </CourseLayout>
    );
  }

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Drill Detail"
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
      />
      {body}
    </Container>
  );
};

export default DrillDetailScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(SPACING.section),
  },
  headerCard: { padding: Sizer.hSize(SPACING.cardP), ...SHADOWS.card },
  headerCardField: {
    padding: Sizer.hSize(SPACING.cardP),
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Sizer.hSize(12),
    marginBottom: Sizer.vSize(12),
  },
  iconCircle: {
    width: Sizer.hSize(48),
    height: Sizer.hSize(48),
    borderRadius: Sizer.hSize(24),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleField: {
    backgroundColor: 'rgba(235,108,15,0.2)',
  },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Sizer.hSize(12), marginBottom: Sizer.vSize(12) },
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
    backgroundColor: COLORS.surface,
  },
  stepsGroup: { gap: Sizer.vSize(SPACING.component) },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Sizer.hSize(SPACING.cardP),
    gap: Sizer.hSize(12),
    ...SHADOWS.card,
  },
  stepCardField: {
    backgroundColor: COLORS.courseSurface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
    shadowOpacity: 0,
    elevation: 0,
  },
  stepNum: {
    width: Sizer.hSize(32),
    height: Sizer.hSize(32),
    borderRadius: Sizer.hSize(16),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
