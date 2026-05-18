import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
import CourseHeader from '../../../components/course/CourseHeader';
import Icon from '../../../helpers/Icon';
import { COLORS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useAppMode } from '../../../context/AppModeContext';

/**
 * CONTENT INVENTORY — ClayMaster-App-UI `CourseTrain.tsx`
 * Header: 1 (title "Train", no back — root tab)
 * Section labels: 2 ("Quick Drills", "Audio Tips")
 * List rows: 3 drill rows + 2 audio rows = 5
 * Footer CTA: 1 ("Full Training Library")
 * Total interactive elements: 6 rows + 1 CTA = 7 (plus header)
 */

const QUICK_DRILLS = [
  { title: 'Follow-Through Focus', duration: '3 min', level: 'Beginner' },
  { title: 'Lead Adjustment', duration: '5 min', level: 'Intermediate' },
  { title: 'Mount & Move', duration: '4 min', level: 'All Levels' },
];

const QUICK_VIDEOS = [
  { title: 'Pre-Shot Routine', duration: '2:30' },
  { title: 'Reading the Target', duration: '4:15' },
];

const CourseTrainScreen = ({ navigation }) => {
  const { setMode } = useAppMode();

  return (
    <CourseLayout>
      <CourseHeader title="Train" />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Typography
            size={12}
            lineHeight={17}
            color="#999999"
            fFamily="barlowBold700"
            style={styles.sectionLabel}
            mB={12}
          >
            Quick Drills
          </Typography>
          <View style={styles.rowGroup}>
            {QUICK_DRILLS.map(drill => (
              <TouchableOpacity
                key={drill.title}
                style={styles.row}
                activeOpacity={0.88}
                onPress={() =>
                  navigation.navigate('CourseTrainDetailScreen', { drill })
                }
              >
                <View style={styles.drillIconBox}>
                  <Icon name="fitness-outline" iconFamily="Ionicons" size={24} color={COLORS.primary} />
                </View>
                <View style={styles.rowText}>
                  <Typography fFamily="barlowBold700" size={18} lineHeight={25} color={COLORS.white100}>
                    {drill.title}
                  </Typography>
                  <Typography size={12} lineHeight={17} color="#666666" mT={4}>
                    {drill.duration} · {drill.level}
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
            Audio Tips
          </Typography>
          <View style={styles.rowGroup}>
            {QUICK_VIDEOS.map(tip => (
              <TouchableOpacity
                key={tip.title}
                style={styles.row}
                activeOpacity={0.88}
                onPress={() =>
                  navigation.navigate('CourseAudioTipScreen', { tip })
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

        <TouchableOpacity
          style={styles.libraryCta}
          activeOpacity={0.88}
          onPress={() => {
            setMode('library');
            navigation.navigate('BottomTabs');
          }}
        >
          <Icon name="book-outline" iconFamily="Ionicons" size={22} color={COLORS.primary} />
          <View style={styles.rowText}>
            <Typography fFamily="barlowSemiBold600" size={14} lineHeight={21} color={COLORS.white100}>
              Full Training Library
            </Typography>
            <Typography size={12} lineHeight={17} color="#666666" mT={4}>
              Access all videos, coaching & content
            </Typography>
          </View>
          <Icon name="chevron-forward" iconFamily="Ionicons" size={20} color={COLORS.primary} />
        </TouchableOpacity>
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
  section: {},
  // text-caption text-[#999] uppercase tracking-wider font-bold
  sectionLabel: {
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  rowGroup: { gap: Sizer.vSize(8) },
  // w-full bg-[#1A1A1A] rounded-xl p-4 border flex-row gap-4
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
  // w-12 h-12 rounded-xl bg-cm-orange/20
  drillIconBox: {
    width: Sizer.hSize(48),
    height: Sizer.hSize(48),
    borderRadius: Sizer.hSize(12),
    backgroundColor: 'rgba(235, 108, 15, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // w-12 h-12 rounded-xl bg-[#2A2A2A]
  audioIconBox: {
    width: Sizer.hSize(48),
    height: Sizer.hSize(48),
    borderRadius: Sizer.hSize(12),
    backgroundColor: COLORS.courseBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1, minWidth: 0 },
  libraryCta: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: 'rgba(235, 108, 15, 0.3)',
    padding: Sizer.hSize(16),
    gap: Sizer.hSize(12),
  },
});
