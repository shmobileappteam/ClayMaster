import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Video from 'react-native-video';
import Icon from '../../helpers/Icon';
import { Typography } from '../../atomComponents';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';

/**
 * Inline library player — keeps existing detail layout (16:9 block).
 */
const LibraryVideoPlayer = ({
  uri,
  locked = false,
  lockedMessage = 'Upgrade your plan to unlock this video.',
  poster,
  style,
}) => {
  const ref = useRef(null);
  const [paused, setPaused] = useState(true);
  const [loading, setLoading] = useState(Boolean(uri) && !locked);
  const [error, setError] = useState(false);

  if (locked || !uri) {
    return (
      <View style={[styles.player, style]}>
        <Icon
          name="lock-closed"
          iconFamily="Ionicons"
          size={28}
          color={COLORS.white100}
        />
        <Typography
          size={13}
          color={COLORS.white100}
          mT={10}
          textAlign="center"
          style={styles.lockText}
        >
          {lockedMessage}
        </Typography>
      </View>
    );
  }

  return (
    <View style={[styles.player, style]}>
      <Video
        ref={ref}
        source={{ uri }}
        style={styles.video}
        resizeMode="contain"
        paused={paused}
        controls={!paused}
        poster={poster || undefined}
        ignoreSilentSwitch="ignore"
        onLoadStart={() => {
          setLoading(true);
          setError(false);
        }}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
          setPaused(true);
        }}
        onEnd={() => setPaused(true)}
      />

      {paused && !error ? (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={0.9}
          onPress={() => setPaused(false)}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white100} size="large" />
          ) : (
            <View style={styles.playBtn}>
              <Icon
                name="play"
                iconFamily="Ionicons"
                size={28}
                color={COLORS.white100}
                style={styles.playIcon}
              />
            </View>
          )}
        </TouchableOpacity>
      ) : null}

      {error ? (
        <View style={styles.overlay}>
          <Typography size={13} color={COLORS.white100} textAlign="center">
            Unable to play this video.
          </Typography>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => {
              setError(false);
              setPaused(false);
            }}
          >
            <Typography size={13} color={COLORS.white100} fFamily="barlowSemiBold600">
              Retry
            </Typography>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default LibraryVideoPlayer;

const styles = StyleSheet.create({
  player: {
    aspectRatio: 16 / 9,
    backgroundColor: COLORS.textPrimary,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,26,26,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Sizer.hSize(24),
  },
  playBtn: {
    width: Sizer.hSize(64),
    height: Sizer.hSize(64),
    borderRadius: Sizer.hSize(32),
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    marginLeft: 4,
  },
  lockText: {
    paddingHorizontal: Sizer.hSize(24),
  },
  retryBtn: {
    marginTop: Sizer.vSize(12),
    paddingHorizontal: Sizer.hSize(16),
    paddingVertical: Sizer.vSize(8),
    borderRadius: Sizer.hSize(8),
    backgroundColor: COLORS.primary,
  },
});
