import React from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Typography } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
import Icon from '../../../helpers/Icon';
import { COLORS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useAppMode } from '../../../context/AppModeContext';

/**
 * CONTENT INVENTORY — ClayMaster-App-UI `CourseHome.tsx`
 * Top bar: 1 (Field Mode label + Library link — no back)
 * Conditional: 0–1 resume-round card
 * Hero CTA: 1 START ROUND button
 * Section label: 1 ("Recent Rounds")
 * Recent score rows: 3
 */
const RECENT_SCORES = [
  { date: 'Apr 8, 2026', discipline: 'Sporting Clays', score: '22/25', pct: 88 },
  { date: 'Apr 5, 2026', discipline: 'Skeet', score: '19/25', pct: 76 },
  { date: 'Apr 1, 2026', discipline: 'Trap', score: '20/25', pct: 80 },
];

const CourseHomeScreen = ({ navigation }) => {
  const { setMode, activeRound, startRound } = useAppMode();

  const handleStart = () => {
    startRound();
    navigation.navigate('CourseRoundScreen');
  };

  return (
    <CourseLayout>
      <View style={styles.topBar}>
        <View style={styles.fieldRow}>
          <Icon name="locate" iconFamily="Ionicons" size={20} color={COLORS.primary} />
          <Typography
            size={11}
            color={COLORS.courseTextMuted}
            fFamily="barlowBold700"
            mL={8}
            style={styles.uppercase}
          >
            Field Mode
          </Typography>
        </View>
        <TouchableOpacity
          onPress={() => {
            setMode('library');
            navigation.navigate('BottomTabs');
          }}
          style={styles.libraryBtn}
        >
          <Icon name="book-outline" iconFamily="Ionicons" size={14} color={COLORS.courseTextMuted} />
          <Typography size={12} color={COLORS.courseTextMuted} mL={4}>
            Library
          </Typography>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {activeRound && !activeRound.finished ? (
          <TouchableOpacity
            style={styles.resumeCard}
            onPress={() => navigation.navigate('CourseRoundScreen')}
            activeOpacity={0.9}
          >
            <View>
              <Typography size={11} color={COLORS.primary} fFamily="barlowBold700" style={styles.uppercase}>
                Round in progress
              </Typography>
              <Typography fFamily="barlowBold700" size={20} color={COLORS.white100} mT={4}>
                Resume Station {activeRound.currentStation}
              </Typography>
              <Typography size={12} color={COLORS.courseTextMuted} mT={4}>
                {activeRound.course} · {activeRound.discipline}
              </Typography>
            </View>
            <Icon name="chevron-forward" iconFamily="Ionicons" size={28} color={COLORS.primary} />
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity style={styles.startBtn} onPress={handleStart} activeOpacity={0.95}>
          <Icon name="play" iconFamily="Ionicons" size={40} color={COLORS.white100} />
          <Typography fFamily="barlowBold700" size={24} color={COLORS.white100} mT={8}>
            START ROUND
          </Typography>
          <Typography size={12} color="rgba(255,255,255,0.8)" mT={4}>
            Tap to begin scoring
          </Typography>
        </TouchableOpacity>

        <Typography
          size={11}
          color="#999"
          fFamily="barlowBold700"
          style={[styles.uppercase, { marginBottom: Sizer.vSize(12) }]}
        >
          Recent Rounds
        </Typography>
        {RECENT_SCORES.map(s => (
          <TouchableOpacity
            key={s.date}
            style={styles.roundCard}
            onPress={() => navigation.navigate('CourseScorecardScreen')}
            activeOpacity={0.9}
          >
            <View>
              <Typography fFamily="barlowBold700" size={18} color={COLORS.white100}>
                {s.score}
              </Typography>
              <View style={styles.roundMeta}>
                <Icon name="time-outline" iconFamily="Ionicons" size={12} color="#666" />
                <Typography size={11} color="#666" mL={4}>
                  {s.date} · {s.discipline}
                </Typography>
              </View>
            </View>
            <Typography
              fFamily="barlowBold700"
              size={20}
              color={s.pct >= 80 ? '#4ADE80' : s.pct >= 70 ? COLORS.primary : '#F87171'}
            >
              {s.pct}%
            </Typography>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </CourseLayout>
  );
};

export default CourseHomeScreen;

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Sizer.hSize(16),
    paddingVertical: Sizer.vSize(16),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.courseBorder,
    backgroundColor: COLORS.courseBg,
  },
  fieldRow: { flexDirection: 'row', alignItems: 'center' },
  libraryBtn: { flexDirection: 'row', alignItems: 'center' },
  uppercase: { letterSpacing: 1, textTransform: 'uppercase' },
  scroll: { padding: Sizer.hSize(16), paddingBottom: Sizer.vSize(32) },
  resumeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: Sizer.hSize(20),
    marginBottom: Sizer.vSize(24),
  },
  startBtn: {
    height: Sizer.vSize(128),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Sizer.vSize(24),
  },
  roundCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.courseBorder,
    padding: Sizer.hSize(16),
    marginBottom: Sizer.vSize(8),
  },
  roundMeta: { flexDirection: 'row', alignItems: 'center', marginTop: Sizer.vSize(4) },
});
