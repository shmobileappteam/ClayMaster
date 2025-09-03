import React, {useEffect} from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const SlideInView = ({
  children,
  slide = 'left',
  slideDuration = 500,
  fadeDuration = 500,
}) => {
  // Initialize shared values for x, y axis, and opacity
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0); // Start with invisible

  useEffect(() => {
    // Set the initial position based on the slide direction
    switch (slide) {
      case 'left':
        translateX.value = -300; // Start off-screen to the left
        break;
      case 'right':
        translateX.value = 300; // Start off-screen to the right
        break;
      case 'up':
        translateY.value = -300; // Start off-screen to the top
        break;
      case 'down':
        translateY.value = 300; // Start off-screen to the bottom
        break;
    }

    // Animate to position 0 (on-screen) on mount
    translateX.value = withTiming(0, {duration: slideDuration});
    translateY.value = withTiming(0, {duration: slideDuration});

    // Fade in the opacity to fully visible
    opacity.value = withTiming(1, {duration: fadeDuration});
  }, [slide]);

  // Define the animated style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
      ],
      opacity: opacity.value, // Add fade-in effect
    };
  });

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

export default SlideInView;
