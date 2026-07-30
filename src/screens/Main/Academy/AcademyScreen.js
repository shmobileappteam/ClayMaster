import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Container, Flex, Typography } from '../../../atomComponents';
import { Header, ScreenBanner } from '../../../components';
import {
  COLORS,
  GLOBALSTYLE,
  SHADOWS,
} from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import Icon from '../../../helpers/Icon';
import { useCustomQuery } from '../../../query/useCustomQuery';
import {
  getAdditionalVideos,
  getInstructionalVideos,
  getMonthlyWebcasts,
  getPracticeDrills,
} from '../../../api/academyService';
import {
  flattenAdditionalVideos,
  mapInstructionalVideo,
  mapPracticeDrill,
  mapWebcast,
} from '../../../constants/academy';

const QUICK_LINKS = [
  {
    label: 'Practice Drills',
    icon: 'document-text-outline',
    route: 'DrillsScreen',
    countKey: 'drills',
    unit: 'Drills',
  },
  {
    label: 'Webcasts',
    icon: 'videocam-outline',
    route: 'WebcastScreen',
    countKey: 'webcasts',
    unit: 'Items',
  },
  {
    label: 'All Videos',
    icon: 'play-circle-outline',
    route: 'InstructionalVideosScreen',
    countKey: 'videos',
    unit: 'Videos',
  },
  {
    label: 'Extras',
    icon: 'film-outline',
    route: 'AdditionalVideosScreen',
    countKey: 'extras',
    unit: 'Videos',
  },
];

const AcademyScreen = ({ navigation }) => {
  const { data: videoData, isLoading: videosLoading } = useCustomQuery({
    queryKey: ['instructionalVideos'],
    queryFn: getInstructionalVideos,
  });
  const { data: drillData } = useCustomQuery({
    queryKey: ['practiceDrills'],
    queryFn: getPracticeDrills,
  });
  const { data: webcastData } = useCustomQuery({
    queryKey: ['monthlyWebcasts'],
    queryFn: getMonthlyWebcasts,
  });
  const { data: additionalData } = useCustomQuery({
    queryKey: ['additionalVideos'],
    queryFn: getAdditionalVideos,
  });

  const videos = useMemo(
    () => (videoData?.items || []).map(mapInstructionalVideo).filter(Boolean),
    [videoData?.items],
  );
  const drills = useMemo(
    () => (drillData?.items || []).map(mapPracticeDrill).filter(Boolean),
    [drillData?.items],
  );
  const webcasts = useMemo(
    () => (webcastData?.items || []).map(mapWebcast).filter(Boolean),
    [webcastData?.items],
  );
  const extras = useMemo(
    () => flattenAdditionalVideos(additionalData?.items || []),
    [additionalData?.items],
  );

  const counts = {
    drills: drills.length,
    videos: videos.length,
    webcasts: webcasts.length,
    extras: extras.length,
  };

  const presentations = useMemo(
    () =>
      videos.map(v => ({
        key: v.title || String(v.id),
        icon: 'play-circle-outline',
        video: v,
      })),
    [videos],
  );

  const [selectedKey, setSelectedKey] = useState(null);
  const selected =
    presentations.find(p => p.key === selectedKey) || presentations[0];
  const selectedVideo = selected?.video || null;

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <Header type="app" title="Academy" isBackVisible={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Sizer.vSize(110) }}
      >
        <ScreenBanner
          title="Academy"
          subtitle="Videos, drills, and webcasts from your ClayMaster library."
        />

        <View
          style={[
            GLOBALSTYLE.paddingHor,
            { paddingHorizontal: Sizer.hSize(20) },
          ]}
        >
          <SectionTitle title="Target presentations" />
        </View>

        {videosLoading ? (
          <ActivityIndicator
            color={COLORS.primary}
            style={{ marginVertical: 20 }}
          />
        ) : presentations.length === 0 ? (
          <Typography
            size={13}
            color={COLORS.textMuted}
            style={{ marginHorizontal: Sizer.hSize(20), marginTop: 14 }}
          >
            No instructional videos yet.
          </Typography>
        ) : (
          <FlatList
            data={presentations}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={i => String(i.key)}
            contentContainerStyle={styles.hScroll}
            renderItem={({ item }) => {
              const active =
                (selectedKey || presentations[0]?.key) === item.key;
              return (
                <TouchableOpacity
                  activeOpacity={0.88}
                  style={[styles.presChip, active && styles.presChipActive]}
                  onPress={() => setSelectedKey(item.key)}
                >
                  <Icon
                    name={item.icon}
                    iconFamily="Ionicons"
                    size={16}
                    color={active ? COLORS.white100 : COLORS.primary}
                  />
                  <Typography
                    mL={6}
                    size={13}
                    lineHeight={18}
                    color={active ? COLORS.white100 : COLORS.textPrimary}
                    fFamily={active ? 'barlowBold700' : 'barlowMedium500'}
                  >
                    {item.key}
                  </Typography>
                </TouchableOpacity>
              );
            }}
          />
        )}

        {selectedVideo ? (
          <TouchableOpacity
            style={[styles.videoCard, { marginHorizontal: Sizer.hSize(20) }]}
            activeOpacity={0.88}
            onPress={() =>
              navigation.navigate('VideoDetailScreen', {
                video: selectedVideo,
              })
            }
          >
            <View style={styles.videoThumb}>
              <View style={styles.playBtn}>
                <Icon
                  name={selectedVideo.locked ? 'lock-closed' : 'play'}
                  iconFamily="Ionicons"
                  size={24}
                  color={COLORS.primary}
                  style={{ marginLeft: selectedVideo.locked ? 0 : 2 }}
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
                  {selectedVideo.locked ? 'LOCKED' : 'VIDEO'}
                </Typography>
              </View>
            </View>
            <View style={styles.videoMeta}>
              <Typography
                fFamily="barlowBold700"
                size={17}
                color={COLORS.textPrimary}
              >
                {selectedVideo.title}
              </Typography>
              {selectedVideo.description ? (
                <Typography
                  size={13}
                  color={COLORS.textMuted}
                  mT={4}
                  numberOfLines={2}
                >
                  {selectedVideo.description}
                </Typography>
              ) : null}
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
              </Flex>
            </View>
          </TouchableOpacity>
        ) : null}

        <View
          style={[
            GLOBALSTYLE.paddingHor,
            { paddingHorizontal: Sizer.hSize(20) },
          ]}
        >
          <SectionTitle title="Academy modules" mT={32} />
          <View style={styles.quickGrid}>
            {QUICK_LINKS.map((ql, i) => {
              const n = counts[ql.countKey] || 0;
              const count = n > 0 ? `${n} ${ql.unit}` : '';
              return (
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
                  {count ? (
                    <Typography size={12} color={COLORS.textMuted} mT={4}>
                      {count}
                    </Typography>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

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
          {drills.slice(0, 8).map(d => (
            <TouchableOpacity
              key={d.id}
              activeOpacity={0.88}
              style={styles.drillChip}
              onPress={() =>
                navigation.navigate('DrillDetailScreen', { drill: d })
              }
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
                numberOfLines={2}
              >
                {d.title}
              </Typography>
              {d.fileType ? (
                <Typography size={12} color={COLORS.textMuted} mT={4}>
                  {d.fileType.toUpperCase()}
                </Typography>
              ) : null}
            </TouchableOpacity>
          ))}
          {!drills.length ? (
            <TouchableOpacity
              activeOpacity={0.88}
              style={styles.drillChip}
              onPress={() => navigation.navigate('DrillsScreen')}
            >
              <Typography size={14} color={COLORS.textSecondary}>
                Browse practice drills
              </Typography>
            </TouchableOpacity>
          ) : null}
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
