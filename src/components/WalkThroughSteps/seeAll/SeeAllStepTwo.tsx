import {StyleSheet, Text} from 'react-native';
import React from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

interface SeeAllStepTwoProps {
  next: () => void;
}

const SeeAllStepTwo = (props: SeeAllStepTwoProps) => {
  const {next} = props;
  const insets = useSafeAreaInsets();
  const overlayStyle = {
    top: insets.top - getFontSize(0.5), // Fixed position for step 2
  };

  return (
    <LinearGradient
      style={[styles.overlay, overlayStyle]}
      colors={[Colors.orangeOpacity, Colors.black]}>
      <Text style={[styles.overlayText]}>
        {'Select a challenge from the list'}
      </Text>
    </LinearGradient>
  );
};

export default SeeAllStepTwo;

const styles = StyleSheet.create({
  overlay: {
    width: getFontSize(45),
    height: getFontSize(7),
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors._1A1A1A,
    alignSelf: 'center',
    borderRadius: getFontSize(2),
    zIndex: 9999, // Above backdrop (backdrop is 9998)
  },
  overlayText: {
    color: Colors.white,
    fontWeight: '500',
    fontSize: getFontSize(2.2),
    textAlign: 'center',
  },
});
