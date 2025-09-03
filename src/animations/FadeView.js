import React, {useEffect} from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const FadeInView = ({children, duration = 500}) => {
  // Initialize a shared value for opacity
  const opacity = useSharedValue(0); // Start invisible

  useEffect(() => {
    // Animate opacity to 1 on mount
    opacity.value = withTiming(1, {duration});
  }, []);

  // Define the animated style for the fade-in effect
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

export default FadeInView;
