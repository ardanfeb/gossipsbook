import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

const EMPTY_COLOR = '#ffffff70';
const PROGRESS_COLOR = '#ffffff50';

export default function CircularProgress({ progress = 0, size = 50 }) {
  const animatedProgress = useRef(new Animated.Value(0)).current;

  const animateProgress = useRef((toValue) => {
    Animated.spring(animatedProgress, {
      toValue,
      useNativeDriver: true,
    }).start();
  }).current;

  useEffect(() => {
    animateProgress(progress);
  }, [animateProgress, progress]);

  const firstIndicatorRotate = animatedProgress.interpolate({
    inputRange: [0, 50],
    outputRange: ['0deg', '180deg'],
    extrapolate: 'clamp',
  });

  const secondIndicatorRotate = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0deg', '360deg'],
    extrapolate: 'clamp',
  });

  const secondIndictorVisibility = animatedProgress.interpolate({
    inputRange: [0, 49, 50, 100],
    outputRange: [0, 0, 1, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: size / 10,
        borderColor: EMPTY_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ rotate: '-45deg' }],
      }}>
      {/* <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: size / 10,
          position: 'absolute',
          borderLeftColor: PROGRESS_COLOR,
          borderTopColor: PROGRESS_COLOR,
          borderRightColor: 'transparent',
          borderBottomColor: 'transparent',
          transform: [{ rotate: firstIndicatorRotate }],
        }}
      /> */}
      {/* <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: size / 10,
          position: 'absolute',
          borderLeftColor: EMPTY_COLOR,
          borderTopColor: EMPTY_COLOR,
          borderRightColor: 'transparent',
          borderBottomColor: 'transparent',
        }}
      /> */}
      {/* <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: size / 10,
          position: 'absolute',
          borderLeftColor: PROGRESS_COLOR,
          borderTopColor: PROGRESS_COLOR,
          borderRightColor: 'transparent',
          borderBottomColor: 'transparent',
          transform: [{ rotate: secondIndicatorRotate }],
          opacity: secondIndictorVisibility,
        }}
      /> */}
    </Animated.View>
  );
}
