import React, { useMemo } from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Typography, AppLoader } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
import CourseHeader from '../../../components/course/CourseHeader';
import Icon from '../../../helpers/Icon';
import { COLORS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { navigateFromFieldToStack } from '../../../navigation/navigationHelpers';
import { showMessage } from '../../../utils';
import { useCustomQuery } from '../../../query/useCustomQuery';
import { getPracticeDrills } from '../../../api/academyService';
import { mapPracticeDrill, openRemoteFile } from '../../../constants/academy';

/**
 * Field Practice Drills — list with View (in-app PDF) + Download (system open).
 */
const CourseTrainScreen = ({ navigation }) => {
  const { data, isLoading, isError, refetch } = useCustomQuery({
    queryKey: ['practiceDrills'],
    queryFn: getPracticeDrills,
  });

  const drills = useMemo(
    () => (data?.items || []).map(mapPracticeDrill).filter(Boolean),
    [data?.items],
  );

  const openDrillDetail = drill => {
    if (!drill.fileUrl) {
      showMessage({
        type: 'danger',
        title: 'Unavailable',
        message: 'No PDF is available for this drill.',
        duration: 3000,
      });
      return;
    }
    navigateFromFieldToStack(navigation, 'DrillDetailScreen', {
      drill,
      fieldMode: true,
    });
  };

  const downloadDrill = drill => {
    openRemoteFile(drill.fileUrl, Linking, showMessage);
  };

  return (
    <CourseLayout showModeIndicator>
      <CourseHeader title="Practice Drills" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.previewDoc}>
          <View style={styles.previewDocIcon}>
            <Icon
              name="document-text-outline"
              iconFamily="Ionicons"
              size={28}
              color={COLORS.primary}
            />
          </View>
          <View style={styles.previewDocText}>
            <Typography fFamily="barlowBold700" size={16} color={COLORS.white100}>
              Practice drills
            </Typography>
            <Typography size={12} lineHeight={17} color={COLORS.courseTextMuted} mT={4}>
              {drills.length
                ? `${drills.length} drills available. View or download a PDF.`
                : 'No drills loaded yet.'}
            </Typography>
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
            Select a drill
          </Typography>
          {isLoading ? (
            <AppLoader />
          ) : isError ? (
            <TouchableOpacity onPress={refetch}>
              <Typography color={COLORS.primary}>
                Could not load drills. Tap to retry.
              </Typography>
            </TouchableOpacity>
          ) : drills.length === 0 ? (
            <Typography color={COLORS.courseTextMuted}>
              No practice drills yet.
            </Typography>
          ) : (
            <View style={styles.rowGroup}>
              {drills.map(drill => (
                <View key={drill.id} style={styles.previewRow}>
                  <View style={styles.previewBody}>
                    <View style={styles.drillIconBox}>
                      <Icon
                        name="document-outline"
                        iconFamily="Ionicons"
                        size={22}
                        color={COLORS.primary}
                      />
                    </View>
                    <View style={styles.rowText}>
                      <Typography
                        fFamily="barlowSemiBold600"
                        size={15}
                        color={COLORS.white100}
                      >
                        {drill.title}
                      </Typography>
                      {drill.desc ? (
                        <Typography
                          size={12}
                          color="#888"
                          mT={2}
                          numberOfLines={2}
                        >
                          {drill.desc}
                        </Typography>
                      ) : null}
                    </View>
                  </View>
                  <View style={styles.previewActions}>
                    <TouchableOpacity
                      style={styles.viewBtn}
                      activeOpacity={0.88}
                      onPress={() => openDrillDetail(drill)}
                    >
                      <Icon
                        name="eye-outline"
                        iconFamily="Ionicons"
                        size={14}
                        color={COLORS.white100}
                      />
                      <Typography
                        fFamily="barlowSemiBold600"
                        size={11}
                        color={COLORS.white100}
                        mL={4}
                      >
                        View
                      </Typography>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.downloadBtn}
                      activeOpacity={0.88}
                      onPress={() => downloadDrill(drill)}
                    >
                      <Icon
                        name="download-outline"
                        iconFamily="Ionicons"
                        size={14}
                        color={COLORS.white100}
                      />
                      <Typography
                        fFamily="barlowSemiBold600"
                        size={11}
                        color={COLORS.white100}
                        mL={4}
                      >
                        Download
                      </Typography>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
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
  section: {},
  rowGroup: { gap: Sizer.vSize(8) },
  previewRow: {
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
    overflow: 'hidden',
  },
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
    flex: 1,
    height: Sizer.vSize(34),
    borderRadius: Sizer.hSize(10),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
    backgroundColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
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
  rowText: { flex: 1, minWidth: 0 },
});
