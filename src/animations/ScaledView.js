import React, {useEffect} from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const ScaledView = ({children, duration = 1000}) => {
  // Initialize a shared value for scale
  const scale = useSharedValue(0); // Start with scale 0

  useEffect(() => {
    // Animate scale to 2 on mount
    scale.value = withTiming(1, {duration});
  }, []);

  // Define the animated style for the scaling effect
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}], // Apply the scale transformation
    };
  });

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};

export default ScaledView;
