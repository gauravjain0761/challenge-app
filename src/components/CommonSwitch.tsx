import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import React, {useEffect, useState, useRef, memo} from 'react';
import {View, TouchableOpacity, Animated, StyleSheet} from 'react-native';

interface Props {
  isToggleOn?: boolean;
  onToggleSwitch?: () => void;
}
const CustomSwitch = ({
  isToggleOn = false,
  onToggleSwitch = () => {},
}: Props) => {
  const togglePosition = useRef(new Animated.Value(isToggleOn ? 1 : 0));

  useEffect(() => {
    togglePosition.current.setValue(isToggleOn ? 1 : 0);
  }, [isToggleOn]);

  const toggleSwitch = () => {
    Animated.timing(togglePosition.current, {
      toValue: isToggleOn ? 0 : 1,
      duration: 100,
      useNativeDriver: false,
    }).start();
    onToggleSwitch();
  };

  const interpolatedBackgroundColor = togglePosition.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['#dddddd', Colors._C05600],
  });

  const interpolatedTranslateX = togglePosition.current.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 18],
  });

  return (
    <TouchableOpacity onPress={toggleSwitch} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.switchContainer,
          {backgroundColor: interpolatedBackgroundColor},
        ]}>
        <Animated.View
          style={[
            styles.circle,
            {
              borderColor: isToggleOn ? Colors.white : Colors.black,
            },
            {transform: [{translateX: interpolatedTranslateX}]},
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: getFontSize(6),
    height: getFontSize(3.5),
    borderRadius: getFontSize(3),
    padding: 4,
    justifyContent: 'center',
  },
  circle: {
    width: getFontSize(2.8),
    height: getFontSize(2.8),
    borderRadius: 13,
    backgroundColor: Colors.white,
    borderWidth: 1,
    shadowColor: Colors.white,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default memo(CustomSwitch);
