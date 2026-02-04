import React, {memo} from 'react';
import {View, Animated, StyleSheet} from 'react-native';

const Waveform = memo(({animationRefs}: {animationRefs: Animated.Value[]}) => {
  return (
    <View style={styles.waveformContainer}>
      <Animated.View style={styles.waveformBarsContainer}>
        {animationRefs.map((anim, index) => {
          const height = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [4 + Math.random() * 120, 10 + Math.random() * 40],
          });

          return (
            <Animated.View key={index} style={[styles.waveformBar, {height}]} />
          );
        })}
      </Animated.View>
    </View>
  );
});

export default Waveform;

const styles = StyleSheet.create({
  waveformContainer: {
    marginTop: 30,
    justifyContent: 'center',
    overflow: 'hidden',
    flex: 0.8,
  },
  waveformBarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 10,
  },
  waveformBar: {
    width: 2,
    backgroundColor: '#974908',
    borderRadius: 10,
    marginHorizontal: 1,
  },
});
