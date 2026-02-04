import React, {useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import Svg, {Circle} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  cancelAnimation,
  runOnJS,
} from 'react-native-reanimated';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 200;
const STROKE_WIDTH = 8;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const HOLD_DURATION = 3000; // 3s hold

export default function HoldToCompleteButton({
  onCompleted = () => {},
}: {
  onCompleted: () => void;
}) {
  const progress = useSharedValue(0);
  const completed = useSharedValue(false);

  const onComplete = useCallback(() => {
    console.log('✅ Completed!');
    onCompleted();
  }, []);

  // Pan gesture → works like tap & hold
  const holdGesture = Gesture.Pan()
    .onBegin(() => {
      if (completed.value) return; // already finished
      progress.value = withTiming(1, {duration: HOLD_DURATION}, finished => {
        if (finished) {
          completed.value = true;
          runOnJS(onComplete)();
        }
      });
    })
    .onFinalize(() => {
      if (!completed.value) {
        cancelAnimation(progress);
        progress.value = withTiming(0, {duration: 300});
      }
    });

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
    };
  });
  const animatedPropsFill = useAnimatedProps(() => {
    // progress.value goes from 0 → 1
    return {
      fill: `rgba(192,86,0,${progress.value})`, // orange fill with opacity
    };
  });
  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={holdGesture}>
        <View style={styles.circleWrapper}>
          <Svg width={SIZE} height={SIZE}>
            {/* Background */}
            {/* Background circle */}
            <AnimatedCircle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke="#555"
              strokeWidth={STROKE_WIDTH}
              fill="rgba(255,255,255,0.05)" // base faint background
              animatedProps={animatedPropsFill} // animated fill
            />

            {/* Progress */}
            <AnimatedCircle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke={Colors.primary}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={CIRCUMFERENCE}
              animatedProps={animatedProps}
              strokeLinecap="round"
              fill="none"
              rotation="-90"
              originX={SIZE / 2}
              originY={SIZE / 2}
            />
          </Svg>

          <Text style={styles.text}>{'Hold\nTo Complete'}</Text>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleWrapper: {
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    position: 'absolute',
    color: Colors.white,
    fontSize: getFontSize(2.5),
    fontWeight: '600',
    textAlign: 'center',
  },
});
