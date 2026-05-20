import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import Icon from '../../../helpers/Icon';
import { COLORS, GLOBALSTYLE, SHADOWS, SPACING } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';

const CHAPTERS = [
  { title: 'Introduction to Clay Shooting', pages: 12, completed: true },
  { title: 'Stance & Gun Mount Fundamentals', pages: 18, completed: true },
  { title: 'Eye Dominance & Visual Focus', pages: 14, completed: true },
  { title: 'Lead Techniques', pages: 22, completed: false },
  { title: 'Reading Target Lines', pages: 16, completed: false },
  { title: 'Station Strategy', pages: 20, completed: false },
  { title: 'Mental Game & Focus', pages: 10, completed: false },
];

const completedCount = CHAPTERS.filter(c => c.completed).length;
const progress = Math.round((completedCount / CHAPTERS.length) * 100);

const WorkbookDetailScreen = ({ navigation }) => (
  <Container isPadding={false} backgroundColor={COLORS.mainBg}>
    <LibraryHeader
      title="Classic Workbook"
      showBack
      showNotification={false}
      onBack={() => navigation.goBack()}
    />
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={[GLOBALSTYLE.screenCard, styles.overview]}>
        <View style={styles.overviewHeader}>
          <View style={styles.iconCircle}>
            <Icon name="book-outline" iconFamily="Ionicons" size={24} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Typography fFamily="barlowSemiBold600" size={20} color={COLORS.textPrimary}>
              Classic Workbook
            </Typography>
            <Typography size={12} color={COLORS.textSecondary} mT={2}>
              7 chapters · 112 pages
            </Typography>
          </View>
        </View>
        <View style={styles.progressBlock}>
          <View style={styles.progressLabels}>
            <Typography size={12} color={COLORS.textSecondary}>
              Progress
            </Typography>
            <Typography size={12} color={COLORS.primary} fFamily="barlowSemiBold600">
              {progress}%
            </Typography>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.continueBtn} activeOpacity={0.88}>
            <Typography fFamily="barlowSemiBold600" size={14} color={COLORS.white100}>
              Continue Reading
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.88}>
            <Icon name="download-outline" iconFamily="Ionicons" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.88}>
            <Icon name="share-outline" iconFamily="Ionicons" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <Typography fFamily="barlowSemiBold600" size={20} color={COLORS.textPrimary} mB={12}>
        Chapters
      </Typography>
      <View style={[GLOBALSTYLE.screenCard, styles.chapterList]}>
        {CHAPTERS.map((ch, i) => (
          <TouchableOpacity
            key={ch.title}
            style={[styles.chapterRow, i < CHAPTERS.length - 1 && styles.chapterBorder]}
            activeOpacity={0.88}
          >
            <Icon
              name={ch.completed ? 'checkmark-circle' : 'ellipse-outline'}
              iconFamily="Ionicons"
              size={20}
              color={ch.completed ? COLORS.primary : COLORS.textSecondary}
            />
            <View style={{ flex: 1, marginLeft: Sizer.hSize(12) }}>
              <Typography
                fFamily="barlowMedium500"
                size={14}
                color={ch.completed ? COLORS.textPrimary : COLORS.textSecondary}
              >
                {ch.title}
              </Typography>
              <Typography size={12} color={COLORS.textSecondary} mT={2}>
                {ch.pages} pages
              </Typography>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  </Container>
);

export default WorkbookDetailScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
    gap: Sizer.vSize(SPACING.section),
  },
  overview: { padding: Sizer.hSize(SPACING.cardP), ...SHADOWS.card },
  overviewHeader: { flexDirection: 'row', alignItems: 'center', gap: Sizer.hSize(12), marginBottom: Sizer.vSize(16) },
  iconCircle: {
    width: Sizer.hSize(48),
    height: Sizer.hSize(48),
    borderRadius: Sizer.hSize(24),
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBlock: { marginBottom: Sizer.vSize(16) },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Sizer.vSize(6) },
  progressTrack: {
    height: 8,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  actions: { flexDirection: 'row', gap: Sizer.hSize(12) },
  continueBtn: {
    flex: 1,
    height: Sizer.vSize(48),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    width: Sizer.hSize(48),
    height: Sizer.vSize(48),
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterList: { padding: 0, overflow: 'hidden' },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizer.hSize(SPACING.cardP),
    paddingVertical: Sizer.vSize(16),
  },
  chapterBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.borderMuted,
  },
});
