import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import {Images} from '@/assets/images';
import Button from '@/components/Button';
import {GeneralStyle} from '@/constants/GeneralStyle';

const MyChallengeStepOne = ({next, previous, step: {mask}, challenge}: any) => {
  const overlayStyle = {
    top: mask.y - getFontSize(18), // place above the highlighted element
    left: mask.x + mask.width / 2 - getFontSize(15), // center horizontally
  };
  const getName = () => {
    const counts = challenge?.counts;
    if (counts?.inProgressCount > 0) {
      return 'In Progress';
    } else if (counts?.scheduledCount > 0) {
      return 'Scheduled';
    }
  };
  return (
    <ImageBackground
      source={Images.speechBubble_icons}
      resizeMode="contain"
      imageStyle={styles.imageStyle}
      style={[styles.overlay, overlayStyle]} // ✅ Merge dynamic style
    >
      <View style={styles.mainContainer}>
        <Text style={GeneralStyle.overlayText}>
          This is your {getName()} Challenges
        </Text>
      </View>
    </ImageBackground>
  );
};

export default MyChallengeStepOne;

const styles = StyleSheet.create({
  overlay: {
    width: getFontSize(25),
    height: getFontSize(25),
    position: 'absolute', // ✅ Important for overlay
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999, // ✅ Ensure it's above everything
  },
  mainContainer: {
    padding: getFontSize(2),
    alignItems: 'center',
  },
  imageStyle: {
    transform: [{rotateY: '180deg'}, {rotateX: '180deg'}],
  },
});
