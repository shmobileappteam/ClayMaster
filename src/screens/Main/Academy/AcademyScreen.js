import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header, ScreenBanner } from '../../../components';
import {
  BASEOPACITY,
  COLORS,
  GLOBALSTYLE,
  SHADOWS,
} from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';

const TARGET_PRESENTATIONS = [
  { key: 'Chandelle', icon: 'arrow-up-circle-outline' },
  { key: 'Crosser', icon: 'arrow-forward-circle-outline' },
  { key: 'Incomer', icon: 'arrow-down-circle-outline' },
  { key: 'Knuckleball', icon: 'cloudy-outline' },
  { key: 'Overhead', icon: 'chevron-up-circle-outline' },
  { key: 'Quartering', icon: 'git-branch-outline' },
  { key: 'Rabbit', icon: 'ellipse-outline' },
  { key: 'Rabbue', icon: 'radio-button-off-outline' },
  { key: 'Teal', icon: 'water-outline' },
  { key: 'Tower', icon: 'business-outline' },
  { key: 'Trap Shot', icon: 'flash-outline' },
  { key: 'Trap-Teal', icon: 'thunderstorm-outline' },
];

const QUICK_LINKS = [
  {
    label: 'Practice Drills',
    icon: 'document-text-outline',
    route: 'DrillsScreen',
    count: '11 Drills',
  },
  {
    label: 'Webcasts',
    icon: 'videocam-outline',
    route: 'WebcastScreen',
    count: 'Live & Recorded',
  },
  {
    label: 'All Videos',
    icon: 'play-circle-outline',
    route: 'InstructionalVideosScreen',
    count: '12 Presentations',
  },
  {
    label: 'Extras',
    icon: 'film-outline',
    route: 'AdditionalVideosScreen',
    count: '6+ Videos',
  },
];

const AcademyScreen = ({ navigation }) => {
  const [selected, setSelected] = useState('Chandelle');

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <Header type="app" title="Academy" isBackVisible={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Sizer.vSize(110) }}
      >
        <ScreenBanner
          title="Academy"
          subtitle="Videos, drills, and webcasts — all curated by World Champion Kevin DeMichiel."
        />

        {/* ── Target Presentations ────────────────────────── */}
        <View
          style={[
            GLOBALSTYLE.paddingHor,
            { paddingHorizontal: Sizer.hSize(20) },
          ]}
        >
          <SectionTitle title="Target presentations" />
        </View>

        <FlatList
          data={TARGET_PRESENTATIONS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={i => i.key}
          contentContainerStyle={styles.hScroll}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.88}
              style={[
                styles.presChip,
                selected === item.key && styles.presChipActive,
              ]}
              onPress={() => setSelected(item.key)}
            >
              <Icon
                name={item.icon}
                iconFamily="Ionicons"
                size={16}
                color={selected === item.key ? COLORS.white100 : COLORS.primary}
              />
              <Typography
                mL={6}
                size={13}
                lineHeight={18}
                color={
                  selected === item.key ? COLORS.white100 : COLORS.textPrimary
                }
                fFamily={
                  selected === item.key ? 'barlowBold700' : 'barlowMedium500'
                }
              >
                {item.key}
              </Typography>
            </TouchableOpacity>
          )}
        />

        {/* ── Selected Presentation Card ──────────────────── */}
        <TouchableOpacity
          style={[styles.videoCard, { marginHorizontal: Sizer.hSize(20) }]}
          activeOpacity={0.88}
          onPress={() =>
            navigation.navigate('InstructionalVideosScreen', {
              presentation: { name: selected },
            })
          }
        >
          <View style={styles.videoThumb}>
            <View style={styles.playBtn}>
              <Icon
                name="play"
                iconFamily="Ionicons"
                size={24}
                color={COLORS.primary}
                style={{ marginLeft: 2 }}
              />
            </View>
            <View style={styles.videoBadge}>
              <Icon
                name="videocam"
                iconFamily="Ionicons"
                size={11}
                color={COLORS.white100}
              />
              <Typography
                size={10}
                color={COLORS.white100}
                mL={4}
                fFamily="barlowBold700"
              >
                TUTORIAL + TRAILER
              </Typography>
            </View>
          </View>
          <View style={styles.videoMeta}>
            <Typography
              fFamily="barlowBold700"
              size={17}
              color={COLORS.textPrimary}
            >
              {selected}
            </Typography>
            <Typography size={13} color={COLORS.textMuted} mT={4}>
              By Kevin DeMichiel
            </Typography>
            <Flex direction="row" algItems="center" mT={10}>
              <View style={styles.tagChip}>
                <Typography
                  size={11}
                  color={COLORS.primary}
                  fFamily="barlowBold700"
                >
                  Video
                </Typography>
              </View>
              <View style={[styles.tagChip, { marginLeft: Sizer.hSize(8) }]}>
                <Typography
                  size={11}
                  color={COLORS.primary}
                  fFamily="barlowBold700"
                >
                  Illustrations
                </Typography>
              </View>
            </Flex>
          </View>
        </TouchableOpacity>

        {/* ── Quick Links ─────────────────────────────────── */}
        <View
          style={[
            GLOBALSTYLE.paddingHor,
            { paddingHorizontal: Sizer.hSize(20) },
          ]}
        >
          <SectionTitle title="Academy modules" mT={32} />
          <View style={styles.quickGrid}>
            {QUICK_LINKS.map((ql, i) => (
              <TouchableOpacity
                key={i}
                style={styles.quickCard}
                activeOpacity={0.88}
                onPress={() => navigation.navigate(ql.route)}
              >
                <View style={styles.quickIconBox}>
                  <Icon
                    name={ql.icon}
                    iconFamily="Ionicons"
                    size={24}
                    color={COLORS.primary}
                  />
                </View>
                <Typography
                  fFamily="barlowBold700"
                  color={COLORS.textPrimary}
                  size={15}
                  mT={12}
                >
                  {ql.label}
                </Typography>
                <Typography size={12} color={COLORS.textMuted} mT={4}>
                  {ql.count}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Recent Drills Preview ────────────────────────── */}
        <View
          style={[
            GLOBALSTYLE.paddingHor,
            { paddingHorizontal: Sizer.hSize(20) },
          ]}
        >
          <SectionTitle title="Expert practice drills" mT={32} />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScroll}
        >
          {[
            'Advanced Shot Analysis',
            'Dropper Drill',
            'Lead Methods',
            'True Pairs',
          ].map((d, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.88}
              style={styles.drillChip}
              onPress={() => navigation.navigate('DrillsScreen')}
            >
              <View style={styles.drillIconBox}>
                <Icon
                  name="document-text"
                  iconFamily="Ionicons"
                  size={22}
                  color={COLORS.primary}
                />
              </View>
              <Typography
                size={14}
                fFamily="barlowBold700"
                color={COLORS.textPrimary}
                mT={10}
              >
                {d}
              </Typography>
              <Typography size={12} color={COLORS.textMuted} mT={4}>
                PDF document
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </Container>
  );
};

const SectionTitle = ({ title, mT = 0 }) => (
  <Typography
    fFamily="barlowBold700"
    size={16}
    lineHeight={22}
    color={COLORS.textPrimary}
    style={{ marginTop: Sizer.vSize(mT) }}
  >
    {title}
  </Typography>
);

export default AcademyScreen;

const styles = StyleSheet.create({
  hScroll: {
    paddingLeft: Sizer.hSize(20),
    paddingRight: Sizer.hSize(8),
    paddingTop: Sizer.vSize(14),
  },
  presChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizer.hSize(16),
    paddingVertical: Sizer.vSize(10),
    borderRadius: Sizer.hSize(10),
    backgroundColor: COLORS.surface,
    marginRight: Sizer.hSize(10),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderSubtle,
    ...SHADOWS.soft,
  },
  presChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  videoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: Sizer.hSize(14),
    marginTop: Sizer.vSize(20),
    overflow: 'hidden',
    ...SHADOWS.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderSubtle,
  },
  videoThumb: {
    height: Sizer.vSize(180),
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {
    width: Sizer.hSize(60),
    height: Sizer.hSize(60),
    borderRadius: Sizer.hSize(30),
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#1A2332',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  videoBadge: {
    position: 'absolute',
    bottom: 12,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: Sizer.hSize(10),
    paddingVertical: Sizer.vSize(6),
    borderRadius: Sizer.hSize(8),
  },
  videoMeta: {
    padding: Sizer.hSize(16),
  },
  tagChip: {
    paddingHorizontal: Sizer.hSize(10),
    paddingVertical: Sizer.vSize(4),
    borderRadius: Sizer.hSize(6),
    backgroundColor: 'rgba(232, 93, 4, 0.12)',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: Sizer.vSize(14),
  },
  quickCard: {
    width: '48.5%',
    backgroundColor: COLORS.surface,
    borderRadius: Sizer.hSize(14),
    padding: Sizer.hSize(16),
    marginBottom: Sizer.vSize(12),
    ...SHADOWS.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderSubtle,
  },
  quickIconBox: {
    width: Sizer.hSize(48),
    height: Sizer.hSize(48),
    borderRadius: Sizer.hSize(12),
    backgroundColor: 'rgba(232, 93, 4, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drillChip: {
    width: Sizer.hSize(160),
    backgroundColor: COLORS.surface,
    borderRadius: Sizer.hSize(14),
    padding: Sizer.hSize(16),
    marginRight: Sizer.hSize(12),
    marginBottom: Sizer.vSize(16),
    ...SHADOWS.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.borderSubtle,
  },
  drillIconBox: {
    width: Sizer.hSize(40),
    height: Sizer.hSize(40),
    borderRadius: Sizer.hSize(10),
    backgroundColor: COLORS.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
