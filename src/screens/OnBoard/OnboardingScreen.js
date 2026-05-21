import React, { useState } from 'react';
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Container, Typography } from '../../atomComponents';
import { onboarding1, onboarding2, onboarding3 } from '../../assets/images';
import { COLORS } from '../../globalStyle/Theme';
import Sizer from '../../helpers/Sizer';
import { storage } from '../../api/api';
import { KEYS } from '../../constants';
import { Button } from '../../components';

const SLIDES = [
  {
    image: onboarding1,
    tagline: 'Train Smarter. Shoot Better.',
    title: 'Analytics',
    text: 'Turn scorecards into performance trends and know exactly what to work on next.',
  },
  {
    image: onboarding2,
    title: 'Online Coaching',
    text: 'Book live sessions with top instructors and get personalized feedback between events.',
  },
  {
    image: onboarding3,
    title: 'Instructional Videos',
    text: 'Watch target-specific lessons from Kevin DeMichiel anytime — at home or on the range.',
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [current, setCurrent] = useState(0);
  const isLast = current === SLIDES.length - 1;
  const slide = SLIDES[current];

  const finish = () => {
    storage.set(KEYS.IS_ONBOARD, 'true');
    navigation.replace('LoginScreen');
  };

  return (
    <Container isPadding={false} backgroundColor={COLORS.black100}>
      <ImageBackground source={slide.image} style={styles.bg} resizeMode="cover">
        <View style={styles.overlay} />
        <View style={styles.content}>
          <View style={styles.topRow}>
            {!isLast ? (
              <TouchableOpacity onPress={finish} style={styles.skipBtn}>
                <Typography size={14} color="rgba(255,255,255,0.85)">
                  Skip
                </Typography>
              </TouchableOpacity>
            ) : (
              <View />
            )}
          </View>
          <View style={styles.bottom}>
            {slide.tagline ? (
              <Typography
                fFamily="barlowBold700"
                size={22}
                color={COLORS.primary}
                lineHeight={28}
              >
                {slide.tagline}
              </Typography>
            ) : null}
            <Typography
              fFamily="barlowBold700"
              size={28}
              color={COLORS.white100}
              lineHeight={34}
              mT={slide.tagline ? 10 : 0}
            >
              {slide.title}
            </Typography>
            <Typography
              size={15}
              color="rgba(255,255,255,0.8)"
              lineHeight={22}
              mT={12}
              style={{ maxWidth: 300 }}
            >
              {slide.text}
            </Typography>
            <View style={styles.dots}>
              {SLIDES.map((_, i) => (
                <View
                  key={i}
                  style={[styles.dot, i === current && styles.dotActive]}
                />
              ))}
            </View>
            <Button
              label={isLast ? 'Get Started' : 'Next'}
              onPress={() => (isLast ? finish() : setCurrent(c => c + 1))}
              btnStyle={styles.cta}
              fontSize={17}
            />
          </View>
        </View>
      </ImageBackground>
    </Container>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  bg: { flex: 1, width: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Sizer.hSize(16),
    paddingBottom: Sizer.vSize(40),
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: Sizer.vSize(56),
  },
  skipBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: Sizer.hSize(16),
    paddingVertical: Sizer.vSize(6),
    borderRadius: Sizer.hSize(20),
  },
  bottom: { gap: 0 },
  dots: {
    flexDirection: 'row',
    gap: Sizer.hSize(8),
    marginVertical: Sizer.vSize(24),
  },
  dot: {
    width: 8,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    width: 32,
    backgroundColor: COLORS.primary,
  },
  cta: {
    height: Sizer.vSize(56),
    borderRadius: Sizer.hSize(12),
  },
});
