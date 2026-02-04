import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import React, {useRef, useState} from 'react';
import {View, Text, TouchableOpacity, Animated, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const FreeTrialToggle = ({isHellChallenge}: {isHellChallenge?: boolean}) => {
  const [isOn, setIsOn] = useState(true);
  const slideAnim = useRef(new Animated.Value(1)).current; // ON = right position

  const toggleSwitch = () => {
    const newValue = !isOn;
    setIsOn(newValue);

    Animated.timing(slideAnim, {
      toValue: newValue ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, getFontSize(21)], // amount of sliding
  });

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={toggleSwitch}>
      <LinearGradient
        colors={[
          '#D0CED3',
          isHellChallenge ? Colors._FE0D0D : '#E9A66E',
          '#D0CED3',
        ]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.gradientBg}>
        {/* Sliding Capsule */}
        <Animated.View style={[styles.slider, {transform: [{translateX}]}]} />

        {/* Labels */}
        <View style={styles.textContainer}>
          <Text style={[styles.text, !isOn && styles.activeText]}>
            30-Days Free Trial ON
          </Text>
          <Text style={[styles.text, isOn && styles.activeText]}>
            30-Days Free Trial OFF
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradientBg: {
    width: getFontSize(40),
    height: 45,
    borderRadius: 15,
    justifyContent: 'center',
    overflow: 'hidden',
    marginTop: 20,
    alignSelf: 'center',
  },
  slider: {
    position: 'absolute',
    width: getFontSize(19), // half width
    height: '100%',
    backgroundColor: Colors._555555,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FF7A00', // Orange border
  },
  textContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: getFontSize(1.7),
    fontWeight: '600',
    color: Colors.black,
  },
  activeText: {
    color: 'transparent', // bolder when active
  },
});

export default FreeTrialToggle;
