// import React, {memo, useState} from 'react';
// import {StyleSheet, TouchableOpacity, View} from 'react-native';
// import Animated, {
//   useAnimatedStyle,
//   useDerivedValue,
//   useSharedValue,
//   withTiming,
// } from 'react-native-reanimated';

// import Icon from '../../helpers/Icon';
// import Flex from '../../atomComponents/Flex';
// import Typography from '../../atomComponents/Typography';

// const Accordion = ({children, leftIcon = null, open}) => {
//   return (
//     <AccordionItem isExpanded={open.value} viewKey="Accordion">
//       {children}
//     </AccordionItem>
//     // <>
//     //   <TouchableOpacity>
//     //     <Flex algItems={'center'} gap={20}>
//     //       <View>
//     //         <Icon name={'eye'} size={18} />
//     //       </View>
//     //       <View style={styles.flex2}>
//     //         <Typography size={16} fFamily="medium">
//     //           Images Shared
//     //         </Typography>
//     //       </View>
//     //       <View>
//     //         <Icon
//     //           name={open.value ? 'chevron-down' : 'chevron-right'}
//     //           size={16}
//     //         />
//     //       </View>
//     //     </Flex>
//     //   </TouchableOpacity>
//     //   <AccordionItem isExpanded={open.value} viewKey="Accordion">
//     //     {children}
//     //   </AccordionItem>
//     // </>
//   );
// };

// const AccordionItem = ({
//   isExpanded,
//   children,
//   viewKey,
//   style,
//   duration = 300,
// }) => {
//   const height = useSharedValue(0);

//   const derivedHeight = useDerivedValue(() =>
//     withTiming(height.value * Number(isExpanded.value), {
//       duration,
//     }),
//   );
//   const bodyStyle = useAnimatedStyle(() => ({
//     height: derivedHeight.value,
//   }));

//   return (
//     <Animated.View
//       key={`accordionItem_${viewKey}`}
//       style={[styles.animatedView, bodyStyle, style]}>
//       <View
//         onLayout={e => {
//           height.value = e.nativeEvent.layout.height;
//         }}
//         style={styles.wrapper}>
//         {children}
//       </View>
//     </Animated.View>
//   );
// };

// const styles = StyleSheet.create({
//   wrapper: {
//     width: '100%',
//     backgroundColor: 'red',
//   },
//   animatedView: {
//     width: '100%',
//     overflow: 'hidden',
//   },

//   flex1: {
//     flex: 1,
//   },
//   flex2: {
//     flex: 2,
//   },
// });

// export default Accordion;

import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import Icon from '../../helpers/Icon';
import Flex from '../../atomComponents/Flex';
import Typography from '../../atomComponents/Typography';
import {COLORS} from '../../globalStyle/Theme';

function AccordionItem({isExpanded, children, viewKey, style, duration = 500}) {
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded.value), {
      duration,
    }),
  );
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  return (
    <Animated.View
      key={`accordionItem_${viewKey}`}
      style={[styles.animatedView, bodyStyle, style]}>
      <View
        onLayout={e => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={styles.wrapper}>
        {children}
      </View>
    </Animated.View>
  );
}

const Accordion = ({
  children,
  title = '',
  icon = '',
  iconF = '',
  itemStyle = null,
}) => {
  const open = useSharedValue(false);
  const progressRotate = useSharedValue(0);

  const onPress = () => {
    open.value = !open.value;
    if (!open.value) {
      progressRotate.value = withSpring(90);
    } else {
      progressRotate.value = withSpring(0);
    }
  };

  const reanimatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${progressRotate.value}deg`}],
    };
  }, []);

  return (
    <>
      <TouchableOpacity onPress={onPress}>
        <Flex algItems={'center'} gap={20} flexStyle={styles.header}>
          <View style={styles.leftIcon}>
            <Icon
              name={icon}
              iconFamily={iconF}
              size={20}
              color={COLORS.blueV1}
            />
          </View>
          <View style={styles.flex2}>
            <Typography size={16} fFamily="medium">
              {title}
            </Typography>
          </View>
          <Animated.View style={reanimatedIconStyle}>
            <Icon name={'chevron-right'} iconFamily={'Feather'} size={20} />
          </Animated.View>
        </Flex>
      </TouchableOpacity>
      <AccordionItem isExpanded={open} viewKey="Accordion" style={itemStyle}>
        {children}
      </AccordionItem>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    position: 'absolute',
  },
  animatedView: {
    width: '100%',
    overflow: 'hidden',
  },

  flex2: {
    flex: 2,
  },

  header: {
    paddingVertical: 12,
  },

  leftIcon: {
    width: 30,
    alignItems: 'center',
  },
});

export default Accordion;
