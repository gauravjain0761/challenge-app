import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import React, {useMemo} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Svg, {Circle} from 'react-native-svg';

const SIZE = 70; // diameter of the circle
const STROKE_WIDTH = 5;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const CircularProgress = ({
  remaining,
  total,
}: {
  remaining: number;
  total: number;
}) => {
  const percentage = useMemo(() => {
    const value = remaining / total;
    return value > 1 ? 1 : value;
  }, [remaining, total]);
  const strokeDashoffset = useMemo(
    () => CIRCUMFERENCE - CIRCUMFERENCE * percentage,
    [percentage],
  );

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE}>
        {/* Background circle */}
        <Circle
          stroke="#333" // background color
          fill="none"
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          strokeWidth={STROKE_WIDTH}
        />
        {/* Progress circle */}
        <Circle
          stroke="#D35400" // orange
          fill="none"
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${SIZE / 2}, ${SIZE / 2}`}
        />
      </Svg>
      {/* Text inside circle */}
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          {remaining}
          <Text style={styles.total}>/{total}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: getFontSize(2.5),
    fontWeight: '700',
    color: Colors.white,
  },
  total: {
    color: Colors._7f7d7c,
    fontSize: getFontSize(2),
    fontWeight: '400',
  },
});

export default CircularProgress;
