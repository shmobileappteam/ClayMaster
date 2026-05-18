import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Container, Typography } from '../../../atomComponents';
import LibraryHeader from '../../../components/layout/LibraryHeader';
import Icon from '../../../helpers/Icon';
import { videoThumb1 } from '../../../assets/images';
import { COLORS, GLOBALSTYLE } from '../../../globalStyle/Theme';
import Sizer from '../../../helpers/Sizer';

const VideoDetailScreen = ({ navigation }) => {
  return (
    <Container isPadding={false} backgroundColor={COLORS.mainBg}>
      <LibraryHeader
        title="Tower Shot Mastery"
        showBack
        showNotification={false}
        onBack={() => navigation.goBack()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.player}>
          <Image source={videoThumb1} style={styles.thumb} resizeMode="cover" />
          <View style={styles.playOverlay}>
            <TouchableOpacity style={styles.playBtn} activeOpacity={0.9}>
              <Icon
                name="play"
                iconFamily="Ionicons"
                size={28}
                color={COLORS.white100}
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[GLOBALSTYLE.paddingHor, styles.body]}>
          <Typography fFamily="barlowBold700" size={24} color={COLORS.textPrimary}>
            Tower Shot Mastery
          </Typography>
          <View style={styles.metaRow}>
            <Icon
              name="person-outline"
              iconFamily="Ionicons"
              size={16}
              color={COLORS.textSecondary}
            />
            <Typography size={14} color={COLORS.textSecondary} mL={6}>
              Kevin DeMichiel
            </Typography>
            <Icon
              name="time-outline"
              iconFamily="Ionicons"
              size={16}
              color={COLORS.textSecondary}
              style={{ marginLeft: 16 }}
            />
            <Typography size={14} color={COLORS.textSecondary} mL={6}>
              12:30
            </Typography>
          </View>
          <Typography size={14} color={COLORS.textSecondary} lineHeight={22} mT={16}>
            Learn the fundamentals of the tower shot including proper stance, lead
            technique, and timing. This comprehensive guide covers everything from
            beginner to advanced positioning.
          </Typography>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.playPrimary} activeOpacity={0.9}>
              <Icon
                name="play"
                iconFamily="Ionicons"
                size={18}
                color={COLORS.white100}
              />
              <Typography
                fFamily="barlowSemiBold600"
                size={15}
                color={COLORS.white100}
                mL={8}
              >
                Play
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.88}>
              <Icon
                name="bookmark-outline"
                iconFamily="Ionicons"
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.88}>
              <Icon
                name="share-outline"
                iconFamily="Ionicons"
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

export default VideoDetailScreen;

const styles = StyleSheet.create({
  player: {
    aspectRatio: 16 / 9,
    backgroundColor: COLORS.textPrimary,
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,26,26,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: Sizer.hSize(64),
    height: Sizer.hSize(64),
    borderRadius: Sizer.hSize(32),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingVertical: Sizer.vSize(16),
    paddingBottom: Sizer.vSize(40),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Sizer.vSize(12),
    flexWrap: 'wrap',
  },
  actions: {
    flexDirection: 'row',
    gap: Sizer.hSize(12),
    marginTop: Sizer.vSize(24),
  },
  playPrimary: {
    flex: 1,
    height: Sizer.vSize(48),
    backgroundColor: COLORS.primary,
    borderRadius: Sizer.hSize(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    width: Sizer.hSize(48),
    height: Sizer.hSize(48),
    borderRadius: Sizer.hSize(12),
    borderWidth: 1,
    borderColor: COLORS.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
});
