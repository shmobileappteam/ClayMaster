import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import Icon from '../../../helpers/Icon';
import {
  COLORS,
  GLOBALSTYLE,
  SHADOWS,
  SPACING,
  TYPE,
} from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';
import { useRequireLibraryMode } from '../../../hooks/useRequireLibraryMode';
import { useCustomQuery } from '../../../query/useCustomQuery';
import {
  getInstructionalVideos,
  getTutorialVideos,
} from '../../../api/academyService';
import { mapInstructionalVideo, mapTutorialVideo } from '../../../constants/academy';

/** Full Library catalog. Requires stable internet. */
const InstructionalVideosScreen = ({ navigation, route }) => {
  const fieldOnlineAccess = route?.params?.fieldOnlineAccess === true;
  const catalog = route?.params?.catalog || 'instructional';
  const presentationName = route?.params?.presentation?.name;
  const isTutorial = catalog === 'tutorial';
  const blocked = useRequireLibraryMode({
    allowOnlineInField: fieldOnlineAccess,
  });

  const { data, isLoading, isError, isFetching, refetch } = useCustomQuery({
    queryKey: [isTutorial ? 'tutorialVideos' : 'instructionalVideos'],
    queryFn: isTutorial ? getTutorialVideos : getInstructionalVideos,
  });

  const videos = useMemo(() => {
    const mapper = isTutorial ? mapTutorialVideo : mapInstructionalVideo;
    let list = (data?.items || []).map(mapper).filter(Boolean);
    if (presentationName) {
      const needle = String(presentationName).toLowerCase();
      const filtered = list.filter(v =>
        String(v.title).toLowerCase().includes(needle),
      );
      if (filtered.length) list = filtered;
    }
    return list;
  }, [data?.items, isTutorial, presentationName]);

  const title = isTutorial ? 'Video Tutorials' : 'Training Videos';

  if (blocked) {
    return null;
  }

  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title={title}
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor={COLORS.primary}
          />
        }
      >
        <Typography
          size={TYPE.body.size}
          color={COLORS.textSecondary}
          lineHeight={TYPE.body.lineHeight}
          mB={16}
        >
          {presentationName
            ? `Showing videos for ${presentationName}`
            : 'Select a video to watch'}
        </Typography>

        {isLoading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 24 }} />
        ) : isError ? (
          <TouchableOpacity onPress={refetch} activeOpacity={0.88}>
            <Typography color={COLORS.primary} fFamily="barlowSemiBold600">
              Could not load videos. Tap to retry.
            </Typography>
          </TouchableOpacity>
        ) : videos.length === 0 ? (
          <Typography color={COLORS.textSecondary}>No videos available.</Typography>
        ) : (
          <View style={styles.list}>
            {videos.map(video => (
              <TouchableOpacity
                key={video.id}
                style={[GLOBALSTYLE.screenCard, styles.categoryCard]}
                onPress={() =>
                  navigation.navigate('VideoDetailScreen', {
                    fieldOnlineAccess,
                    video,
                  })
                }
                activeOpacity={0.88}
              >
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Typography
                    fFamily="barlowSemiBold600"
                    size={TYPE.body.size}
                    color={COLORS.textPrimary}
                  >
                    {video.title}
                  </Typography>
                  <Typography
                    size={TYPE.caption.size}
                    color={COLORS.textSecondary}
                    mT={2}
                  >
                    {video.locked ? 'Locked · upgrade to unlock' : 'Tap to watch'}
                  </Typography>
                </View>
                <Icon
                  name={video.locked ? 'lock-closed-outline' : 'chevron-forward'}
                  iconFamily="Ionicons"
                  size={20}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </Container>
  );
};

export default InstructionalVideosScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(100),
  },
  list: {
    gap: Sizer.vSize(SPACING.component),
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Sizer.hSize(SPACING.cardP),
    ...SHADOWS.card,
  },
});
