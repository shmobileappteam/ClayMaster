import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Typography } from '../../../atomComponents';
import CourseLayout from '../../../components/course/CourseLayout';
import CourseHeader from '../../../components/course/CourseHeader';
import Icon from '../../../helpers/Icon';
import { COLORS } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { MISS_CATEGORIES } from '../../../constants/missCategories';
import { navigateFromFieldToStack } from '../../../navigation/navigationHelpers';

/**
 * CONTENT INVENTORY — ClayMaster-App-UI `CourseMissDiagnosis.tsx`
 * Header: 1 (no back, showAudio — root tab)
 * Unselected: 1 prompt card + 6 category grid cells
 * Selected: 1 back link + 1 header card + 3 fix rows
 * Category count must match MISS_CATEGORIES.length (6)
 */
const CourseMissDiagnosisScreen = ({ navigation }) => {
  const [selected, setSelected] = useState(null);
  const selectedCat = MISS_CATEGORIES.find(c => c.id === selected);

  return (
    <CourseLayout>
      <CourseHeader title="Miss Diagnostics" showAudio />
      <ScrollView contentContainerStyle={styles.scroll}>
        {!selected ? (
          <>
            <View style={styles.prompt}>
              <Icon name="warning" iconFamily="Ionicons" size={32} color={COLORS.primary} />
              <Typography fFamily="barlowBold700" size={20} color={COLORS.white100} mT={12}>
                How did you miss?
              </Typography>
              <Typography size={14} color={COLORS.courseTextMuted} mT={4}>
                Select a category to get the fix
              </Typography>
            </View>
            <View style={styles.grid}>
              {MISS_CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.catCard, { backgroundColor: cat.colorBg, borderColor: cat.colorBorder }]}
                  onPress={() => setSelected(cat.id)}
                  activeOpacity={0.9}
                >
                  <Icon name={cat.icon} iconFamily="Ionicons" size={24} color={cat.accent} />
                  <Typography fFamily="barlowBold700" size={16} color={cat.accent} mT={8}>
                    {cat.short}
                  </Typography>
                  <Typography size={12} color="rgba(255,255,255,0.6)" mT={4}>
                    {cat.desc}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => setSelected(null)} style={styles.backRow}>
              <Icon name="arrow-back" iconFamily="Ionicons" size={20} color={COLORS.courseTextMuted} />
              <Typography size={14} color={COLORS.courseTextMuted} mL={8}>
                All Categories
              </Typography>
            </TouchableOpacity>
            <View
              style={[
                styles.prompt,
                styles.selectedHeader,
                { borderColor: selectedCat.colorBorder, backgroundColor: selectedCat.colorBg },
              ]}
            >
              <Typography fFamily="barlowBold700" size={24} color={selectedCat.accent} textAlign="center">
                {selectedCat.name}
              </Typography>
              <Typography size={14} color="rgba(255,255,255,0.7)" mT={8} textAlign="center">
                {selectedCat.desc}
              </Typography>
              <Typography
                size={12}
                lineHeight={17}
                color="rgba(255,255,255,0.5)"
                mT={8}
                textAlign="center"
                style={{ fontStyle: 'italic' }}
              >
                Field cue: "{selectedCat.cue}"
              </Typography>
            </View>
            {[
              {
                label: 'Watch: Why It Happens',
                sub: 'Video explanation · 2-3 min',
                icon: 'play',
                screen: 'CourseMissFixVideoScreen',
                iconBg: 'rgba(235,108,15,0.2)',
              },
              {
                label: 'Listen: How to Fix It',
                sub: 'Audio coaching tip · 1-2 min',
                icon: 'volume-high',
                screen: 'CourseMissFixAudioScreen',
                iconBg: COLORS.courseBorder,
              },
              {
                label: 'Drill: Reinforce the Fix',
                sub: 'Practice exercise · 5 min',
                icon: 'barbell-outline',
                screen: 'CourseMissFixDrillScreen',
                iconBg: 'rgba(235,108,15,0.2)',
              },
            ].map(item => (
              <TouchableOpacity
                key={item.screen}
                style={styles.fixCard}
                onPress={() =>
                  navigateFromFieldToStack(navigation, item.screen, {
                    categoryId: selected,
                  })
                }
                activeOpacity={0.9}
              >
                <View style={[styles.fixIcon, { backgroundColor: item.iconBg }]}>
                  <Icon name={item.icon} iconFamily="Ionicons" size={28} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Typography fFamily="barlowBold700" size={18} lineHeight={25} color={COLORS.white100}>
                    {item.label}
                  </Typography>
                  <Typography size={12} color="#666" mT={4}>
                    {item.sub}
                  </Typography>
                </View>
                <Icon name="chevron-forward" iconFamily="Ionicons" size={20} color="#444" />
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </CourseLayout>
  );
};

export default CourseMissDiagnosisScreen;

const styles = StyleSheet.create({
  scroll: { padding: Sizer.hSize(16), paddingBottom: Sizer.vSize(32) },
  prompt: {
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.courseBorder,
    padding: Sizer.hSize(20),
    alignItems: 'center',
    marginBottom: Sizer.vSize(20),
  },
  selectedHeader: {
    borderWidth: 2,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Sizer.hSize(12), justifyContent: 'space-between' },
  catCard: {
    width: '47%',
    borderRadius: Sizer.hSize(12),
    borderWidth: 2,
    padding: Sizer.hSize(16),
  },
  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Sizer.vSize(16) },
  fixCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.courseSurface,
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.courseBorder,
    padding: Sizer.hSize(16),
    marginBottom: Sizer.vSize(12),
    gap: Sizer.hSize(12),
  },
  fixIcon: {
    width: Sizer.hSize(56),
    height: Sizer.hSize(56),
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
