import React, { useRef, useEffect, useState } from 'react';
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

const pairTypeLabel = pairType => {
  if (pairType === 'report_pair') return 'Report Pair';
  if (pairType === 'true_pair') return 'True Pair';
  return pairType || '—';
};

/**
 * Horizontal strip — past + current only (no future).
 * Past stations expand a detail row below the strip (no modal).
 */
const StationProgressStrip = ({ stations = [], currentStationNumber }) => {
  const scrollRef = useRef(null);
  const [detailNum, setDetailNum] = useState(null);

  useEffect(() => {
    setDetailNum(null);
  }, [currentStationNumber]);

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

  const detailStation =
    detailNum != null
      ? stations.find(s => s.station_number === detailNum)
      : null;

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
          const selected = detailNum === num;
          // Milestone: hits / taken only (ignore empty placeholders)
          const { hits, taken } = scoreFromShots(st?.shots);
          const scoreLabel = `${hits}/${taken || 0}`;

          const pill = (
            <View
              style={[
                styles.pill,
                active && styles.pillActive,
                done && styles.pillDone,
                selected && styles.pillSelected,
              ]}
            >
              <Typography
                size={10}
                fFamily="barlowBold700"
                color={
                  active
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
                  active
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

          if (done) {
            return (
              <TouchableOpacity
                key={`s-${num}`}
                onPress={() =>
                  setDetailNum(prev => (prev === num ? null : num))
                }
                activeOpacity={0.85}
              >
                {pill}
              </TouchableOpacity>
            );
          }

          return <View key={`s-${num}`}>{pill}</View>;
        })}
      </ScrollView>

      {detailStation ? (
        <StationDetailInline
          station={detailStation}
          onClose={() => setDetailNum(null)}
        />
      ) : null}
    </View>
  );
};

const StationDetailInline = ({ station, onClose }) => {
  const { hits, taken } = scoreFromShots(station?.shots);
  const shots = (station.shots || []).filter(
    s => s.result === 'dead' || s.result === 'lost',
  );
  const traps = station.traps || [];

  return (
    <View style={styles.detail}>
      <View style={styles.detailTop}>
        <View>
          <Typography
            size={10}
            color={COLORS.courseTextMuted}
            fFamily="barlowBold700"
            style={styles.uppercase}
          >
            Station {station.station_number}
          </Typography>
          <Typography
            fFamily="barlowBold700"
            size={18}
            color={COLORS.primary}
            mT={2}
          >
            {hits}/{taken || 0}
          </Typography>
        </View>
        <TouchableOpacity onPress={onClose} hitSlop={10} activeOpacity={0.7}>
          <Typography size={12} color={COLORS.courseTextMuted} fFamily="barlowSemiBold600">
            Close
          </Typography>
        </TouchableOpacity>
      </View>

      <View style={styles.dotsRow}>
        {shots.map((shot, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              shot.result === 'dead' && styles.dotHit,
              shot.result === 'lost' && styles.dotMiss,
            ]}
          />
        ))}
      </View>

      <View style={styles.metaRow}>
        <MetaChip
          label="Pairs"
          value={
            station.selectedTargetPairs
              ? `${station.selectedTargetPairs}`
              : '—'
          }
        />
        <MetaChip label="Type" value={pairTypeLabel(station.pair_type)} />
        {traps.map(t => (
          <MetaChip
            key={t.trap_id}
            label={`T${t.trap_id}`}
            value={t.presentation || '—'}
          />
        ))}
      </View>
    </View>
  );
};

const MetaChip = ({ label, value }) => (
  <View style={styles.chip}>
    <Typography size={9} color={COLORS.courseTextMuted} fFamily="barlowBold700">
      {label}
    </Typography>
    <Typography
      size={11}
      fFamily="barlowSemiBold600"
      color={COLORS.white100}
      textTransform="capitalize"
      mT={2}
    >
      {value}
    </Typography>
  </View>
);

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
    backgroundColor: 'rgba(232, 93, 4, 0.15)',
  },
  uppercase: { letterSpacing: 1.1, textTransform: 'uppercase' },
  detail: {
    marginTop: Sizer.vSize(8),
    marginHorizontal: Sizer.hSize(16),
    paddingTop: Sizer.vSize(10),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.courseBorder,
  },
  detailTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: Sizer.hSize(4),
    marginTop: Sizer.vSize(10),
  },
  dot: {
    flex: 1,
    height: Sizer.vSize(6),
    borderRadius: Sizer.vSize(3),
    backgroundColor: COLORS.courseBorder,
  },
  dotHit: { backgroundColor: COLORS.primary },
  dotMiss: { backgroundColor: '#EF4444' },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizer.hSize(6),
    marginTop: Sizer.vSize(10),
  },
  chip: {
    paddingHorizontal: Sizer.hSize(8),
    paddingVertical: Sizer.vSize(5),
    borderRadius: Sizer.hSize(6),
    borderWidth: 1,
    borderColor: COLORS.courseBorder,
  },
});

export default StationProgressStrip;
