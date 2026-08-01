import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../atomComponents';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';

const PAIR_OPTIONS = [3, 4, 5];
const STEP_LABELS = ['Pairs', 'Type', 'Traps'];

const trapsReady = station =>
  Array.isArray(station?.traps) &&
  station.traps.length === 2 &&
  station.traps.every(
    t => t.presentation && String(t.presentation).trim() !== '',
  );

const getAutoStep = station => {
  if (!station?.selectedTargetPairs) return 1;
  if (!station?.pair_type) return 2;
  if (!trapsReady(station)) return 3;
  return 4;
};

const presentationLabel = (catalog, slug) => {
  if (!slug) return '';
  const hit = (catalog || []).find(t => t.slug === slug);
  return hit?.label || slug;
};

/**
 * Sequential station setup — Field dark theme.
 * Steps 1–3 tappable; can reopen from HIT/MISS via parent.
 */
const StationSetupPanel = ({
  station,
  trapsCatalog = [],
  onSelectTargetPairs,
  onSelectPairType,
  onSelectPresentation,
  /** When set, show this step even if setup is already complete (revisit from HIT/MISS) */
  editStep = null,
  onContinueScoring,
}) => {
  const [trapId, setTrapId] = useState(1);
  const [viewStep, setViewStep] = useState(1);

  const autoStep = useMemo(() => getAutoStep(station), [station]);
  const revisiting = editStep != null;
  const maxStep = revisiting ? 3 : Math.min(autoStep, 3);
  const step = Math.min(viewStep, maxStep);

  useEffect(() => {
    const start = editStep != null ? editStep : Math.min(getAutoStep(station), 3);
    setViewStep(start);
    setTrapId(1);
  }, [station?.station_number, editStep]);

  useEffect(() => {
    if (revisiting) return;
    setViewStep(prev => {
      const next = Math.min(autoStep, 3);
      if (autoStep >= 4) return prev;
      if (prev < next) return next;
      return prev;
    });
  }, [autoStep, revisiting]);

  useEffect(() => {
    const t1 = station?.traps?.find(t => Number(t.trap_id) === 1);
    const t2 = station?.traps?.find(t => Number(t.trap_id) === 2);
    if (t1?.presentation && String(t1.presentation).trim() && !t2?.presentation) {
      setTrapId(2);
    } else if (!t1?.presentation || !String(t1.presentation).trim()) {
      setTrapId(1);
    } else if (t2?.presentation && String(t2.presentation).trim()) {
      setTrapId(2);
    }
  }, [station?.traps, station?.station_number]);

  const currentTrap =
    station?.traps?.find(t => Number(t.trap_id) === trapId) || {};
  const trap1 = station?.traps?.find(t => Number(t.trap_id) === 1);
  const trap2 = station?.traps?.find(t => Number(t.trap_id) === 2);

  const goStep = n => {
    if (n >= 1 && n <= maxStep) setViewStep(n);
  };

  // First-time complete: parent hides panel. Revisit: stay visible.
  if (autoStep >= 4 && !revisiting) return null;

  const setupStillComplete = autoStep >= 4;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <StepDots current={step} maxStep={maxStep} onSelectStep={goStep} />

      {/* Compact choices — tap to edit that step */}
      {(station?.selectedTargetPairs || station?.pair_type) && step === 3 ? (
        <View style={styles.summaryRow}>
          {station?.selectedTargetPairs ? (
            <SummaryChip
              label={`${station.selectedTargetPairs} Pair`}
              onPress={() => goStep(1)}
            />
          ) : null}
          {station?.pair_type ? (
            <SummaryChip
              label={
                station.pair_type === 'report_pair' ? 'Report Pair' : 'True Pair'
              }
              onPress={() => goStep(2)}
            />
          ) : null}
        </View>
      ) : null}

      {step === 1 ? (
        <View style={styles.stepBlock}>
          <SectionLabel text="Pair of targets" />
          <Typography size={13} color={COLORS.courseTextMuted} mB={14}>
            How many pairs at this station?
          </Typography>
          <View style={styles.row}>
            {PAIR_OPTIONS.map(n => {
              const selected = station?.selectedTargetPairs === n;
              return (
                <TouchableOpacity
                  key={n}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => {
                    onSelectTargetPairs(n);
                    setViewStep(2);
                  }}
                  activeOpacity={0.88}
                >
                  <Typography
                    fFamily="barlowBold700"
                    size={16}
                    color={COLORS.white100}
                  >
                    {n} Pair
                  </Typography>
                  <Typography
                    size={11}
                    color={selected ? 'rgba(255,255,255,0.8)' : COLORS.courseTextMuted}
                    mT={2}
                  >
                    {n * 2} shots
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : null}

      {step === 2 ? (
        <View style={styles.stepBlock}>
          <SectionLabel text="Pair type" />
          <Typography size={13} color={COLORS.courseTextMuted} mB={14}>
            Report Pair or True Pair for this station.
          </Typography>
          <View style={styles.row}>
            {[
              { value: 'report_pair', label: 'Report Pair' },
              { value: 'true_pair', label: 'True Pair' },
            ].map(opt => {
              const selected = station?.pair_type === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => {
                    onSelectPairType(opt.value);
                    setViewStep(3);
                  }}
                  activeOpacity={0.88}
                >
                  <Typography
                    fFamily="barlowBold700"
                    size={16}
                    color={COLORS.white100}
                  >
                    {opt.label}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : null}

      {step === 3 ? (
        <View style={styles.stepBlock}>
          <SectionLabel text="Target presentations" />
          <Typography size={13} color={COLORS.courseTextMuted} mB={12}>
            Trap {trapId} of 2 — pick a presentation
          </Typography>

          <View style={styles.trapProgress}>
            {[1, 2].map(id => {
              const selected = trapId === id;
              const filled =
                id === 1
                  ? !!(trap1?.presentation && String(trap1.presentation).trim())
                  : !!(trap2?.presentation && String(trap2.presentation).trim());
              const slug = id === 1 ? trap1?.presentation : trap2?.presentation;
              return (
                <View
                  key={id}
                  style={[
                    styles.trapSeg,
                    selected && styles.trapSegActive,
                    filled && !selected && styles.trapSegDone,
                  ]}
                >
                  <Typography
                    size={12}
                    fFamily="barlowBold700"
                    color={
                      selected || filled
                        ? COLORS.white100
                        : COLORS.courseTextMuted
                    }
                  >
                    Trap {id}
                    {filled ? ' ✓' : ''}
                  </Typography>
                  {filled ? (
                    <Typography
                      size={10}
                      numberOfLines={1}
                      color={
                        selected
                          ? 'rgba(255,255,255,0.85)'
                          : COLORS.primary
                      }
                      mT={2}
                    >
                      {presentationLabel(trapsCatalog, slug)}
                    </Typography>
                  ) : null}
                </View>
              );
            })}
          </View>

          <DarkTrapsList
            trapsData={trapsCatalog}
            selectedPresentation={currentTrap?.presentation || ''}
            onSelectPresentation={item =>
              onSelectPresentation(item, trapId, 'presentation')
            }
          />
        </View>
      ) : null}

      {revisiting && setupStillComplete && onContinueScoring ? (
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={onContinueScoring}
          activeOpacity={0.88}
        >
          <Typography fFamily="barlowBold700" size={16} color={COLORS.white100}>
            Continue scoring
          </Typography>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
};

export const SetupStepDots = ({ current = 3, maxStep = 3, onSelectStep, dimmed }) => (
  <StepDots
    current={current}
    maxStep={maxStep}
    onSelectStep={onSelectStep}
    dimmed={dimmed}
  />
);

const StepDots = ({ current, maxStep, onSelectStep, dimmed }) => (
  <View style={[styles.stepBar, dimmed && styles.stepBarDimmed]}>
    <View style={styles.stepTrack}>
      {[1, 2, 3].map((n, index) => {
        const scoringMode = current === 0 && maxStep >= 3;
        const active = !scoringMode && n === current;
        const done = scoringMode || (n < maxStep && !active);
        const unlocked = scoringMode || n <= maxStep;
        return (
          <React.Fragment key={n}>
            {index > 0 ? (
              <View
                style={[
                  styles.stepConnector,
                  (scoringMode || n <= maxStep) && styles.stepConnectorDone,
                ]}
              />
            ) : null}
            <TouchableOpacity
              style={styles.stepItem}
              disabled={!unlocked}
              onPress={() => onSelectStep?.(n)}
              activeOpacity={unlocked ? 0.75 : 1}
            >
              <View
                style={[
                  styles.stepCircle,
                  active && styles.stepCircleActive,
                  done && !active && styles.stepCircleDone,
                  !unlocked && styles.stepCircleLocked,
                ]}
              >
                <Typography
                  fFamily="barlowBold700"
                  size={13}
                  color={
                    active
                      ? COLORS.white100
                      : done || unlocked
                        ? COLORS.primary
                        : COLORS.courseTextMuted
                  }
                >
                  {done && !active ? '✓' : String(n)}
                </Typography>
              </View>
              <Typography
                size={11}
                fFamily={active ? 'barlowBold700' : 'barlowSemiBold600'}
                color={
                  active
                    ? COLORS.primary
                    : unlocked
                      ? COLORS.courseTextMuted
                      : '#555'
                }
                mT={6}
                textAlign="center"
              >
                {STEP_LABELS[index]}
              </Typography>
            </TouchableOpacity>
          </React.Fragment>
        );
      })}
    </View>
  </View>
);

const SummaryChip = ({ label, onPress }) => (
  <TouchableOpacity
    style={styles.summaryChip}
    onPress={onPress}
    activeOpacity={0.8}
    disabled={!onPress}
  >
    <Typography size={12} fFamily="barlowSemiBold600" color={COLORS.primary}>
      {label}
    </Typography>
  </TouchableOpacity>
);

const SectionLabel = ({ text }) => (
  <Typography
    size={11}
    color={COLORS.courseTextMuted}
    fFamily="barlowBold700"
    style={styles.sectionLabel}
    mB={8}
  >
    {text}
  </Typography>
);

const DarkTrapsList = ({
  trapsData = [],
  selectedPresentation = '',
  onSelectPresentation,
}) => {
  const mid = Math.ceil(trapsData.length / 2);
  const left = trapsData.slice(0, mid);
  const right = trapsData.slice(mid);

  const renderCol = (items, keyPrefix) => (
    <View style={styles.trapCol}>
      {items.map((item, index) => {
        const selected = item?.slug === selectedPresentation;
        return (
          <TouchableOpacity
            key={`${keyPrefix}-${index}`}
            style={[styles.trapChip, selected && styles.trapChipSelected]}
            onPress={() => onSelectPresentation(item)}
            activeOpacity={0.88}
          >
            <Typography
              size={13}
              fFamily={selected ? 'barlowBold700' : 'barlowMedium500'}
              textTransform="capitalize"
              numberOfLines={1}
              color={selected ? COLORS.white100 : COLORS.courseTextMuted}
            >
              {item?.label}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={styles.trapsRow}>
      {renderCol(left, 'l')}
      {renderCol(right, 'r')}
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Sizer.hSize(16),
    paddingBottom: Sizer.vSize(28),
    flexGrow: 1,
  },
  stepBar: {
    paddingHorizontal: Sizer.hSize(4),
    paddingTop: Sizer.vSize(6),
    paddingBottom: Sizer.vSize(10),
    marginBottom: Sizer.vSize(8),
  },
  stepBarDimmed: {
    opacity: 0.95,
  },
  continueBtn: {
    marginTop: Sizer.vSize(20),
    marginBottom: Sizer.vSize(8),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(14),
    alignItems: 'center',
  },
  stepTrack: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    width: Sizer.hSize(56),
  },
  stepCircle: {
    width: Sizer.hSize(32),
    height: Sizer.hSize(32),
    borderRadius: Sizer.hSize(16),
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.courseBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepCircleDone: {
    backgroundColor: 'transparent',
    borderColor: COLORS.primary,
  },
  stepCircleLocked: {
    opacity: 0.45,
  },
  stepConnector: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.courseBorder,
    marginTop: Sizer.vSize(15),
    marginHorizontal: Sizer.hSize(2),
    borderRadius: 1,
  },
  stepConnectorDone: {
    backgroundColor: COLORS.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizer.hSize(8),
    marginBottom: Sizer.vSize(14),
  },
  summaryChip: {
    paddingHorizontal: Sizer.hSize(10),
    paddingVertical: Sizer.vSize(6),
    borderRadius: Sizer.hSize(8),
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
  },
  stepBlock: {
    flex: 1,
  },
  sectionLabel: {
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    gap: Sizer.hSize(8),
    marginBottom: Sizer.vSize(8),
  },
  chip: {
    flex: 1,
    backgroundColor: COLORS.courseSurface,
    borderWidth: 1,
    borderColor: COLORS.courseBorder,
    borderRadius: Sizer.hSize(10),
    paddingVertical: Sizer.vSize(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  trapProgress: {
    flexDirection: 'row',
    gap: Sizer.hSize(8),
    marginBottom: Sizer.vSize(14),
  },
  trapSeg: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.courseBorder,
    borderRadius: Sizer.hSize(10),
    paddingVertical: Sizer.vSize(10),
    paddingHorizontal: Sizer.hSize(10),
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  trapSegActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  trapSegDone: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(235, 108, 15, 0.12)',
  },
  trapsRow: {
    flexDirection: 'row',
    gap: Sizer.hSize(8),
  },
  trapCol: {
    flex: 1,
    gap: Sizer.vSize(8),
  },
  trapChip: {
    backgroundColor: COLORS.courseSurface,
    borderWidth: 1,
    borderColor: COLORS.courseBorder,
    borderRadius: Sizer.hSize(8),
    paddingVertical: Sizer.vSize(10),
    paddingHorizontal: Sizer.hSize(8),
    alignItems: 'center',
  },
  trapChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
});

export default StationSetupPanel;
