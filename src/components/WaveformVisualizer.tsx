import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import React, {useEffect, useRef, useState} from 'react';
import {Animated, View, StyleSheet} from 'react-native';

interface Props {
  playing: boolean;
  barCount?: number;
  barColor?: string;
  barWidth?: number;
  barHeight?: number;
  duration?: number;
}

const WaveformVisualizer = ({
  playing,
  barCount = Math.floor(getFontSize(5.6)), // ensure integer count
  barColor = Colors._C05600,
  barWidth = 2,
  barHeight = 18,
  duration = 500,
}: Props) => {
  const animValues = useRef<Animated.Value[]>([]).current;
  const [staticHeights, setStaticHeights] = useState<number[]>([]);

  // Initialize bars only once
  useEffect(() => {
    if (animValues.length === 0) {
      for (let i = 0; i < barCount; i++) {
        animValues.push(new Animated.Value(Math.random()));
      }
    }
  }, []);

  useEffect(() => {
    if (playing) {
      const animations = animValues.map((val, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(val, {
              toValue: 1,
              duration: duration + i * 10,
              useNativeDriver: false,
            }),
            Animated.timing(val, {
              toValue: Math.random(),
              duration: duration + i * 10,
              useNativeDriver: false,
            }),
          ]),
        ),
      );
      Animated.stagger(100, animations).start();
    } else {
      // Stop all animations
      animValues.forEach(val => val.stopAnimation());

      // Generate static random values once when stopping
      setStaticHeights(Array.from({length: barCount}, () => Math.random()));
    }
  }, [playing]);

  return (
    <View style={styles.waveContainer}>
      {animValues.map((val, index) => {
        const interpolatedHeight = val.interpolate({
          inputRange: [0, 1],
          outputRange: [5, barHeight],
        });

        const heightStyle = playing
          ? interpolatedHeight
          : 5 + (barHeight - 5) * (staticHeights[index] || 0.5); // fallback value

        return (
          <Animated.View
            key={index}
            style={{
              width: barWidth,
              height: heightStyle,
              backgroundColor: barColor,
              marginHorizontal: 2,
              borderRadius: barWidth / 2,
            }}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flex: 1,
  },
});

export default WaveformVisualizer;
