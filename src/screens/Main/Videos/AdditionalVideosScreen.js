import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
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
import { ADDITIONAL_VIDEOS } from '../../../constants/libraryContent';
import { navigateFromTabToStack } from '../../../navigation/navigationHelpers';

/** ClayMaster-App-UI `AdditionalVideos.tsx` */
const AdditionalVideosScreen = ({ navigation }) => (
  <Container isPadding={false} backgroundColor={COLORS.mainBg}>
    <LibraryHeader
      title="Additional Videos"
      showBack
      showNotification={false}
      onBack={() => navigation.goBack()}
    />
    <ScrollView
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <Typography size={TYPE.body.size} color={COLORS.textSecondary} mB={SPACING.component}>
        Bonus training content & supplementary material
      </Typography>
      {ADDITIONAL_VIDEOS.map(video => (
        <TouchableOpacity
          key={video.id}
          style={[GLOBALSTYLE.screenCard, styles.videoRow]}
          activeOpacity={0.88}
          onPress={() => navigateFromTabToStack(navigation, 'VideoDetailScreen')}
        >
          <View style={styles.thumbWrap}>
            <Image source={video.image} style={styles.thumb} resizeMode="cover" />
            <View style={styles.thumbOverlay}>
              <View style={styles.playCircle}>
                <Icon name="play" iconFamily="Ionicons" size={14} color={COLORS.white100} />
              </View>
            </View>
          </View>
          <View style={styles.videoBody}>
            <Typography fFamily="barlowSemiBold600" size={TYPE.body.size} color={COLORS.textPrimary}>
              {video.title}
            </Typography>
            <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mT={2}>
              {video.coach}
            </Typography>
            <View style={styles.durationRow}>
              <Icon name="time-outline" iconFamily="Ionicons" size={12} color={COLORS.textSecondary} />
              <Typography size={TYPE.caption.size} color={COLORS.textSecondary} mL={4}>
                {video.duration}
              </Typography>
            </View>
          </View>
          <Icon name="chevron-forward" iconFamily="Ionicons" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  </Container>
);

export default AdditionalVideosScreen;

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: Sizer.hSize(SPACING.screenPx),
    paddingTop: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(100),
    gap: Sizer.vSize(SPACING.component),
  },
  videoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    padding: 0,
    ...SHADOWS.card,
  },
  thumbWrap: {
    width: Sizer.hSize(112),
    height: Sizer.hSize(80),
    position: 'relative',
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  thumbOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,26,26,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCircle: {
    width: Sizer.hSize(32),
    height: Sizer.hSize(32),
    borderRadius: Sizer.hSize(16),
    backgroundColor: 'rgba(235, 108, 15, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2,
  },
  videoBody: {
    flex: 1,
    paddingHorizontal: Sizer.hSize(12),
    paddingVertical: Sizer.vSize(12),
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Sizer.vSize(6),
  },
});
