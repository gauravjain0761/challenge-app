import React, {useMemo} from 'react';
import {View, Text, StyleSheet, AccessibilityProps} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {Colors} from '@/constants/Colors';
import {formatToHMS} from '@/utils/common/commonFunction';
import {getFontSize} from '@/utils/responsiveFn';

const BOX_SIZE = getFontSize(25);
const STROKE_WIDTH = 4;
const HALF = STROKE_WIDTH / 2;
const INNER_SIZE = BOX_SIZE - STROKE_WIDTH;
const CORNER_RADIUS = getFontSize(1.5);

function getRoundedRectPath(
  x: number,
  y: number,
  width: number,
  height: number,
  r: number,
) {
  return `
    M ${x + r},${y}
    H ${x + width - r}
    Q ${x + width},${y} ${x + width},${y + r}
    V ${y + height - r}
    Q ${x + width},${y + height} ${x + width - r},${y + height}
    H ${x + r}
    Q ${x},${y + height} ${x},${y + height - r}
    V ${y + r}
    Q ${x},${y} ${x + r},${y}
    Z
  `;
}

interface Props extends AccessibilityProps {
  remainingTime: number;
  totalTime: number;
}

const TimerBoxWithSvgProgress: React.FC<Props> = ({
  remainingTime,
  totalTime,
  accessibilityLabel,
  accessibilityHint,
  ...rest
}) => {
  // Prevent division by zero or negative values
  const safeTotalTime = Math.max(totalTime, 1);

  const progress = useMemo(() => {
    return Math.max(0, Math.min(1, 1 - remainingTime / safeTotalTime));
  }, [remainingTime, safeTotalTime]);

  // Approximate total length of path: 4 straight lines + 4 quarter circles
  const TOTAL_LENGTH = useMemo(() => {
    // straight sides: length without corners
    const straightLength = 4 * (INNER_SIZE - 2 * CORNER_RADIUS);
    // corners: 4 quarter circles = full circle circumference
    const cornerLength = 2 * Math.PI * CORNER_RADIUS;
    return straightLength + cornerLength;
  }, []); // this will error outside component, so move inside component

  const strokeDashoffset = useMemo(() => {
    return TOTAL_LENGTH * (1 - progress);
  }, [progress]);

  const path = useMemo(() => {
    return getRoundedRectPath(
      HALF,
      HALF,
      INNER_SIZE,
      INNER_SIZE,
      CORNER_RADIUS,
    );
  }, []);

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel || 'Timer'}
      accessibilityHint={accessibilityHint || 'Shows remaining time in minutes'}
      accessibilityValue={{
        now: totalTime - remainingTime,
        min: 0,
        max: totalTime,
        text: formatToHMS(remainingTime),
      }}
      {...rest}>
      <Svg width={BOX_SIZE} height={BOX_SIZE}>
        {/* Background path */}
        <Path
          d={path}
          stroke={Colors._363636}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />

        {/* Progress path */}
        <Path
          d={path}
          stroke={Colors.orange}
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={TOTAL_LENGTH}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>

      {/* Timer Text Overlay */}
      <View style={styles.textContainer} pointerEvents="none">
        <Text style={styles.timerText}>{formatToHMS(remainingTime)}</Text>
        <Text style={styles.minText}>Minutes</Text>
      </View>
    </View>
  );
};

export default TimerBoxWithSvgProgress;

const styles = StyleSheet.create({
  container: {
    height: BOX_SIZE,
    width: BOX_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: CORNER_RADIUS,
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: getFontSize(3.5),
    color: Colors.white,
    fontWeight: 'bold',
  },
  minText: {
    fontSize: getFontSize(1.8),
    color: Colors.white,
    fontWeight: '400',
    opacity: 0.6,
    textTransform: 'capitalize',
    marginTop: getFontSize(0.5),
  },
});
