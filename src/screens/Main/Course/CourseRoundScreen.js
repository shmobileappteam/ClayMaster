import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
import MissOverlay from '../../../components/course/MissOverlay';
import Icon from '../../../helpers/Icon';
import { COLORS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useAppMode } from '../../../context/AppModeContext';
import { navigateToFieldMode } from '../../../navigation/navigationHelpers';
import { MISS_CATEGORIES } from '../../../constants/missCategories';

const CourseRoundScreen = ({ navigation }) => {
  const {
    activeRound,
    startRound,
    recordShot,
    updateLastShotMiss,
    nextStation,
    finishRound,
  } = useAppMode();
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [showStationFeedback, setShowStationFeedback] = useState(false);

  useEffect(() => {
    if (!activeRound) startRound();
  }, [activeRound, startRound]);

  const round = activeRound;
  const totalShotsTaken = round?.stations.reduce((a, s) => a + s.shots.length, 0) ?? 0;
  const totalHits =
    round?.stations.reduce(
      (a, s) => a + s.shots.filter(sh => sh.hit).length,
      0,
    ) ?? 0;

  const currentStation = round?.stations.find(
    s => s.station === round.currentStation,
  );
  const stationFull =
    currentStation && round
      ? currentStation.shots.length >= round.shotsPerStation
      : false;
  const isLastStation = round
    ? round.currentStation >= round.totalStations
    : false;

  const stationMissFeedback = useMemo(() => {
    if (!currentStation) return null;
    const tally = {};
    currentStation.shots.forEach(s => {
      if (!s.hit && s.missCategory) {
        tally[s.missCategory] = (tally[s.missCategory] || 0) + 1;
      }
    });
    const top = Object.entries(tally).sort((a, b) => b[1] - a[1])[0];
    if (!top) return null;
    const cat = MISS_CATEGORIES.find(c => c.id === top[0]);
    const totalMisses = currentStation.shots.filter(s => !s.hit).length;
    return cat
      ? { cat, pct: Math.round((top[1] / Math.max(totalMisses, 1)) * 100) }
      : null;
  }, [currentStation]);

  useEffect(() => {
    if (stationFull && !showStationFeedback) setShowStationFeedback(true);
  }, [stationFull, showStationFeedback]);

  if (!round) return null;

  const onHit = () => recordShot(true);
  const onMiss = () => {
    recordShot(false);
    setOverlayOpen(true);
  };
  const onTagMiss = id => {
    updateLastShotMiss(id);
    setOverlayOpen(false);
  };

  const handleNextStation = () => {
    setShowStationFeedback(false);
    if (isLastStation) {
      finishRound();
      navigation.replace('CourseRoundSummaryScreen');
    } else {
      nextStation();
    }
  };

  const stationHits = currentStation?.shots.filter(s => s.hit).length ?? 0;
  const stationTotal = currentStation?.shots.length ?? 0;

  return (
    <CourseLayout showTabs={false}>
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Typography
            size={12}
            lineHeight={17}
            color={COLORS.courseTextMuted}
            fFamily="barlowBold700"
            style={styles.uppercase}
          >
            {round.course}
          </Typography>
          <Typography fFamily="barlowBold700" size={14} lineHeight={21} color={COLORS.white100}>
            Station {round.currentStation} / {round.totalStations}
          </Typography>
        </View>
        <View style={styles.topBarScore}>
          <Typography
            size={12}
            lineHeight={17}
            color={COLORS.courseTextMuted}
            fFamily="barlowBold700"
            style={styles.uppercase}
            textAlign="right"
          >
            Score
          </Typography>
          <Typography
            fFamily="barlowBold700"
            size={20}
            lineHeight={26}
            color={COLORS.primary}
            textAlign="right"
          >
            {totalHits}/{totalShotsTaken || 0}
          </Typography>
        </View>
        <TouchableOpacity
          style={styles.pauseBtn}
          onPress={() => navigateToFieldMode(navigation, 'CourseHomeScreen')}
          accessibilityLabel="Pause round"
        >
          <Icon name="pause" iconFamily="Ionicons" size={18} color={COLORS.white100} />
        </TouchableOpacity>
      </View>

      <View style={styles.dotsRow}>
        {Array.from({ length: round.shotsPerStation }).map((_, i) => {
          const shot = currentStation?.shots[i];
          return (
            <View
              key={i}
              style={[
                styles.dot,
                shot?.hit === true && styles.dotHit,
                shot?.hit === false && styles.dotMiss,
              ]}
            />
          );
        })}
      </View>

      {showStationFeedback ? (
        <View style={styles.feedbackWrap}>
          <View style={styles.stationDoneCard}>
            <Typography
              size={12}
              lineHeight={17}
              color={COLORS.courseTextMuted}
              fFamily="barlowBold700"
              style={styles.uppercase}
              textAlign="center"
            >
              Station {round.currentStation} Done
            </Typography>
            <Typography
              fFamily="barlowBold700"
              size={44}
              lineHeight={44}
              color={COLORS.white100}
              textAlign="center"
              mT={8}
            >
              {stationHits}/{stationTotal}
            </Typography>
          </View>

          {stationMissFeedback ? (
            <View
              style={[
                styles.missInsightCard,
                {
                  backgroundColor: stationMissFeedback.cat.colorBg,
                  borderColor: stationMissFeedback.cat.colorBorder,
                },
              ]}
            >
              <Typography
                size={12}
                lineHeight={17}
                color="rgba(255,255,255,0.6)"
                fFamily="barlowBold700"
                style={styles.uppercase}
              >
                Primary Issue
              </Typography>
              <Typography
                fFamily="barlowBold700"
                size={20}
                lineHeight={26}
                color={stationMissFeedback.cat.accent}
                mT={4}
              >
                {stationMissFeedback.pct}% due to {stationMissFeedback.cat.short}
              </Typography>
              <Typography size={14} lineHeight={21} color="rgba(255,255,255,0.7)" mT={8}>
                {stationMissFeedback.cat.cue}
              </Typography>
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.nextStationBtn}
            onPress={handleNextStation}
            activeOpacity={0.88}
          >
            <Typography fFamily="barlowBold700" size={20} lineHeight={26} color={COLORS.white100}>
              {isLastStation ? 'Finish Round' : `Station ${round.currentStation + 1}`}
            </Typography>
            <Icon
              name="chevron-forward"
              iconFamily="Ionicons"
              size={26}
              color={COLORS.white100}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.tapZones}>
          <TouchableOpacity style={styles.hitZone} onPress={onHit} activeOpacity={0.88}>
            <Icon name="checkmark" iconFamily="Ionicons" size={88} color={COLORS.white100} />
            <Typography
              fFamily="barlowBold700"
              size={40}
              lineHeight={44}
              color={COLORS.white100}
              mT={4}
              style={styles.hitMissLabel}
            >
              HIT
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.missZone} onPress={onMiss} activeOpacity={0.88}>
            <Icon name="close" iconFamily="Ionicons" size={88} color="#F87171" />
            <Typography
              fFamily="barlowBold700"
              size={40}
              lineHeight={44}
              color="#F87171"
              mT={4}
              style={styles.hitMissLabel}
            >
              MISS
            </Typography>
          </TouchableOpacity>
        </View>
      )}

      <MissOverlay
        visible={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        onSelect={onTagMiss}
      />
    </CourseLayout>
  );
};

export default CourseRoundScreen;

const styles = StyleSheet.create({
  // sticky top-0 → position handled by CourseLayout; bg-[#0D0D0D] → backgroundColor
  // border-b border-[#2A2A2A] → borderBottomWidth + borderBottomColor
  topBar: {
    backgroundColor: COLORS.courseBg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.courseBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingVertical: Sizer.vSize(12),
  },
  topBarLeft: { flex: 1 },
  topBarScore: { alignItems: 'flex-end', marginRight: Sizer.hSize(12) },
  // text-caption uppercase → fontSize 12, letterSpacing, textTransform
  uppercase: { letterSpacing: 1.2, textTransform: 'uppercase' },
  // w-10 h-10 rounded-full bg-[#1A1A1A] → 40×40 circle
  pauseBtn: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    borderRadius: Sizer.hSize(20),
    backgroundColor: COLORS.courseSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // px-screen-px pb-3 flex gap-2 justify-center → horizontal padding 16, gap 8
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Sizer.hSize(8),
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingBottom: Sizer.vSize(12),
  },
  // h-2 flex-1 rounded-full → height 8, flex 1
  dot: {
    flex: 1,
    height: Sizer.vSize(8),
    borderRadius: Sizer.vSize(4),
    backgroundColor: COLORS.courseBorder,
  },
  // bg-cm-orange → #EB6C0F; bg-red-500 → #EF4444
  dotHit: { backgroundColor: COLORS.primary },
  dotMiss: { backgroundColor: '#EF4444' },
  // px-screen-px py-4 space-y-3 flex flex-col → column, gap 12, flex 1
  tapZones: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingVertical: Sizer.vSize(16),
    gap: Sizer.vSize(12),
  },
  // flex-1 bg-cm-orange rounded-2xl flex-col center → full-width stacked zone
  hitZone: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  // flex-1 bg-[#1A1A1A] border-2 border-red-500/40 rounded-2xl
  missZone: {
    flex: 1,
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(16),
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hitMissLabel: { letterSpacing: 2 },
  // px-screen-px py-6 space-y-5 → padding 16/24, gap 20
  feedbackWrap: {
    flex: 1,
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingVertical: Sizer.vSize(24),
    gap: Sizer.vSize(20),
  },
  // bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A]
  stationDoneCard: {
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    padding: Sizer.hSize(24),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
    alignItems: 'center',
  },
  missInsightCard: {
    borderRadius: Sizer.hSize(12),
    padding: Sizer.hSize(20),
    borderWidth: 2,
  },
  // w-full h-16 bg-cm-orange rounded-xl flex-row center gap-2
  nextStationBtn: {
    width: '100%',
    height: Sizer.vSize(64),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizer.hSize(8),
  },
});
