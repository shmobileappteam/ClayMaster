import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Typography } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
import { navigateToFieldMode } from '../../../navigation/navigationHelpers';
import CourseHeader from '../../../components/course/CourseHeader';
import Icon from '../../../helpers/Icon';
import { COLORS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';

/**
 * CONTENT INVENTORY — ClayMaster-App-UI `CourseAddScore.tsx`
 * Header: 1 (Log Score, showBack)
 * Hero score card: 1 (icon, title, 2 inputs, slash)
 * Section labels: 4 (Discipline, Location, Date, Station Breakdown)
 * Discipline buttons: 4
 * Station input tiles: 5
 * Submit CTA: 1
 */

const DISCIPLINES = ['Sporting Clays', 'Skeet', 'Trap', '5-Stand'];
const STATIONS = [1, 2, 3, 4, 5];

const CourseAddScoreScreen = ({ navigation }) => {
  const [hits, setHits] = useState('');
  const [total, setTotal] = useState('');
  const [location, setLocation] = useState('');
  const [stationScores, setStationScores] = useState(
    STATIONS.reduce((acc, n) => ({ ...acc, [n]: '' }), {}),
  );

  return (
    <CourseLayout showTabs={false}>
      <CourseHeader title="Log Score" showBack onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero — bg-[#1A1A1A] rounded-xl p-6 border text-center */}
        <View style={styles.heroCard}>
          <Icon name="disc-outline" iconFamily="Ionicons" size={36} color={COLORS.primary} />
          <Typography fFamily="barlowBold700" size={20} lineHeight={26} color={COLORS.white100} mT={16} mB={20}>
            Enter Your Score
          </Typography>
          <View style={styles.scoreRow}>
            <TextInput
              style={styles.scoreInput}
              placeholder="0"
              placeholderTextColor="#444444"
              keyboardType="number-pad"
              value={hits}
              onChangeText={setHits}
            />
            <Typography fFamily="barlowBold700" size={24} color="#444444">
              /
            </Typography>
            <TextInput
              style={styles.scoreInput}
              placeholder="25"
              placeholderTextColor="#444444"
              keyboardType="number-pad"
              value={total}
              onChangeText={setTotal}
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Typography
            size={12}
            lineHeight={17}
            color="#999999"
            fFamily="barlowBold700"
            style={styles.sectionLabel}
            mB={8}
          >
            Discipline
          </Typography>
          <View style={styles.disciplineGrid}>
            {DISCIPLINES.map(d => (
              <TouchableOpacity key={d} style={styles.disciplineBtn} activeOpacity={0.88}>
                <Typography fFamily="barlowSemiBold600" size={14} lineHeight={21} color={COLORS.white100} textAlign="center">
                  {d}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Icon name="location-outline" iconFamily="Ionicons" size={14} color="#999999" />
            <Typography
              size={12}
              lineHeight={17}
              color="#999999"
              fFamily="barlowBold700"
              style={styles.sectionLabel}
              mL={6}
            >
              Location
            </Typography>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Range name"
            placeholderTextColor="#444444"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View style={styles.fieldGroup}>
          <View style={styles.labelRow}>
            <Icon name="calendar-outline" iconFamily="Ionicons" size={14} color="#999999" />
            <Typography
              size={12}
              lineHeight={17}
              color="#999999"
              fFamily="barlowBold700"
              style={styles.sectionLabel}
              mL={6}
            >
              Date
            </Typography>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#444444"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Typography
            size={12}
            lineHeight={17}
            color="#999999"
            fFamily="barlowBold700"
            style={styles.sectionLabel}
            mB={8}
          >
            Station Breakdown
          </Typography>
          <View style={styles.stationGrid}>
            {STATIONS.map(station => (
              <View key={station} style={styles.stationTile}>
                <Typography size={11} lineHeight={15} color="#666666" mB={4}>
                  St. {station}
                </Typography>
                <TextInput
                  style={styles.stationInput}
                  placeholder="0"
                  placeholderTextColor="#444444"
                  keyboardType="number-pad"
                  value={stationScores[station]}
                  onChangeText={v =>
                    setStationScores(prev => ({ ...prev, [station]: v }))
                  }
                />
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.saveBtn}
          activeOpacity={0.88}
          onPress={() => navigateToFieldMode(navigation, 'CourseHomeScreen')}
        >
          <Typography fFamily="barlowBold700" size={20} lineHeight={26} color={COLORS.white100}>
            Save Score
          </Typography>
        </TouchableOpacity>
      </ScrollView>
    </CourseLayout>
  );
};

export default CourseAddScoreScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingVertical: Sizer.vSize(20),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(20),
  },
  sectionLabel: {
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  heroCard: {
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
    padding: Sizer.hSize(24),
    alignItems: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Sizer.hSize(16),
  },
  scoreInput: {
    width: Sizer.hSize(96),
    height: Sizer.vSize(80),
    backgroundColor: COLORS.courseBg,
    borderWidth: 2,
    borderColor: COLORS.courseBorder,
    borderRadius: Sizer.hSize(12),
    textAlign: 'center',
    fontSize: Sizer.fS(36),
    fontFamily: 'Barlow-Bold',
    color: COLORS.white100,
  },
  fieldGroup: {},
  labelRow: { flexDirection: 'row', alignItems: 'center' },
  disciplineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizer.hSize(8),
  },
  disciplineBtn: {
    width: '48%',
    height: Sizer.vSize(56),
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Sizer.hSize(8),
  },
  textInput: {
    width: '100%',
    height: Sizer.vSize(56),
    backgroundColor: COLORS.courseSurface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
    borderRadius: Sizer.hSize(12),
    paddingHorizontal: Sizer.hSize(16),
    fontSize: Sizer.fS(14),
    fontFamily: 'Barlow-Regular',
    color: COLORS.white100,
  },
  stationGrid: {
    flexDirection: 'row',
    gap: Sizer.hSize(8),
  },
  stationTile: {
    flex: 1,
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.courseBorder,
    padding: Sizer.hSize(8),
    alignItems: 'center',
  },
  stationInput: {
    width: '100%',
    height: Sizer.vSize(48),
    backgroundColor: COLORS.courseBg,
    borderWidth: 1,
    borderColor: COLORS.courseBorder,
    borderRadius: Sizer.hSize(8),
    textAlign: 'center',
    fontSize: Sizer.fS(18),
    fontFamily: 'Barlow-Medium',
    color: COLORS.white100,
  },
  saveBtn: {
    width: '100%',
    height: Sizer.vSize(64),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
