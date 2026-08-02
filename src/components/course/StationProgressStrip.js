import React, { useRef, useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../atomComponents';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import { scoreFromShots } from '../../constants/rounds';

const stationFilled = st => {
  const shots = st?.shots || [];
  return (
    shots.length > 0 &&
    shots.every(s => s.result === 'dead' || s.result === 'lost')
  );
};

/**
 * Horizontal strip — past + current only (no future).
 * Past stations are view-only; selecting one notifies parent (no editing).
 */
const StationProgressStrip = ({
  stations = [],
  currentStationNumber,
  viewingStationNumber = null,
  onSelectStation,
}) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const idx = Math.max(
      0,
      stations.findIndex(s => s.station_number === currentStationNumber),
    );
    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({
        x: Math.max(0, idx * Sizer.hSize(46) - Sizer.hSize(24)),
        animated: true,
      });
    }, 80);
    return () => clearTimeout(timer);
  }, [currentStationNumber, stations.length]);

  if (!stations.length) return null;

  return (
    <View style={styles.wrap}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {stations.map((st, index) => {
          const num = st.station_number ?? index + 1;
          const active = num === currentStationNumber;
          const done = stationFilled(st) && !active;
          const selected = viewingStationNumber === num;
          const { hits, taken } = scoreFromShots(st?.shots);
          const scoreLabel = `${hits}/${taken || 0}`;

          const pill = (
            <View
              style={[
                styles.pill,
                active && !selected && styles.pillActive,
                done && styles.pillDone,
                selected && styles.pillSelected,
              ]}
            >
              <Typography
                size={10}
                fFamily="barlowBold700"
                color={
                  selected || active
                    ? COLORS.white100
                    : done
                      ? COLORS.primary
                      : COLORS.courseTextMuted
                }
              >
                S{num}
              </Typography>
              <Typography
                fFamily="barlowBold700"
                size={12}
                color={
                  selected || active
                    ? COLORS.white100
                    : done
                      ? COLORS.primary
                      : COLORS.courseTextMuted
                }
                mT={2}
              >
                {scoreLabel}
              </Typography>
            </View>
          );

          // Past (done) — view only. Current — return to play.
          if (done || active) {
            return (
              <TouchableOpacity
                key={`s-${num}`}
                onPress={() => {
                  if (active) {
                    onSelectStation?.(null);
                    return;
                  }
                  // Toggle past view; never opens edit
                  onSelectStation?.(
                    viewingStationNumber === num ? null : num,
                  );
                }}
                activeOpacity={0.85}
              >
                {pill}
              </TouchableOpacity>
            );
          }

          return <View key={`s-${num}`}>{pill}</View>;
        })}
      </ScrollView>
    </View>
  );
};

export default StationProgressStrip;

const styles = StyleSheet.create({
  wrap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.courseBorder,
    paddingTop: Sizer.vSize(8),
    paddingBottom: Sizer.vSize(8),
  },
  row: {
    paddingHorizontal: Sizer.hSize(16),
    gap: Sizer.hSize(6),
    alignItems: 'center',
  },
  pill: {
    minWidth: Sizer.hSize(40),
    paddingHorizontal: Sizer.hSize(8),
    paddingVertical: Sizer.vSize(6),
    borderRadius: Sizer.hSize(8),
    borderWidth: 1,
    borderColor: COLORS.courseBorder,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pillDone: {
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
  },
  pillSelected: {
    backgroundColor: 'rgba(232, 93, 4, 0.35)',
    borderColor: COLORS.primary,
  },
});
