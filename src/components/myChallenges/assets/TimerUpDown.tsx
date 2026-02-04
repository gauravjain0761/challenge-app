import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import React, {memo} from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import IconComponent from '@/components/IconComponent';

interface Props {
  title: string;
  value?: number | string;
  unit?: string;
  onPressUp?: () => void;
  onPressDown?: () => void;
  containerStyle?: ViewStyle;
}

const TimerUpDown = memo(
  ({
    title,
    value = 1,
    unit = 'min',
    onPressDown,
    onPressUp,
    containerStyle,
  }: Props) => {
    return (
      <View style={{...styles.container, ...containerStyle}}>
        <Text style={styles.title}>{title}</Text>
        <IconComponent
          name="up"
          size={getFontSize(2.5)}
          color={Colors.orange}
          onPress={onPressUp}
        />
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.title}>{unit}</Text>
        <IconComponent
          name="down"
          size={getFontSize(2.5)}
          color={Colors.orange}
          onPress={onPressDown}
        />
      </View>
    );
  },
);

export default TimerUpDown;

const styles = StyleSheet.create({
  container: {
    // height: getFontSize(),
    width: getFontSize(8),
    backgroundColor: Colors._2a2a2a,
    alignItems: 'center',
    borderRadius: getFontSize(1),
    gap: getFontSize(0.5),
    paddingVertical: getFontSize(1),
  },
  title: {
    color: Colors.white,
    fontSize: getFontSize(1.8),
    fontWeight: '400',
    opacity: 0.6,
  },
  value: {
    color: Colors.white,
    fontSize: getFontSize(2.2),
    fontWeight: '600',
  },
});
