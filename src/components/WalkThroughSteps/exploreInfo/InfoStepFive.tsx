import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {Images} from '@/assets/images';
import Button from '@/components/Button';
import {GeneralStyle} from '@/constants/GeneralStyle';

const InfoStepFive = ({next, previous, step: {mask}}: any) => {
  const overlayStyle = {
    top: mask.y - getFontSize(20), // place above the highlighted element
    left: mask.x + mask.width / 2 - getFontSize(15), // center horizontally
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
          Join the challenge and{'\n'}take action
        </Text>
        <Button
          title="Previous"
          type="outline"
          onPress={previous}
          style={GeneralStyle.btnStyle}
          textStyle={GeneralStyle.btnTextStyle}
        />
      </View>
    </ImageBackground>
  );
};

export default InfoStepFive;

const styles = StyleSheet.create({
  overlay: {
    width: getFontSize(30),
    height: getFontSize(20),
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
