import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import {Images} from '@/assets/images';
import Button from '@/components/Button';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {LayoutInfo} from '@/hooks/useCustomWalkthrough';

interface InfoStepThreeProps {
  next: () => void;
  previous: () => void;
  layout?: LayoutInfo;
}

const InfoStepThree = ({
  next,
  previous,
  layout,
}: InfoStepThreeProps) => {
  const overlayStyle = layout
    ? {
        top: layout.y - getFontSize(20), // Position above the button
        left: layout.x + getFontSize(3),
      }
    : {
        top: getFontSize(21), // Fallback
        left: getFontSize(5),
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
          Select your challenge start date{'\n'} (Every challenge is 7 days)
        </Text>
        <View style={GeneralStyle.btnRow}>
          <Button
            title="Previous"
            type="outline"
            onPress={previous}
            style={GeneralStyle.btnStyle}
            textStyle={GeneralStyle.btnTextStyle}
          />
          <Button
            title="Next"
            onPress={next}
            style={GeneralStyle.btnStyle}
            textStyle={GeneralStyle.btnTextStyle}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default InfoStepThree;

const styles = StyleSheet.create({
  overlay: {
    width: getFontSize(35),
    height: getFontSize(20),
    position: 'absolute', // ✅ Important for overlay
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999, // ✅ Ensure it's above everything
  },
  mainContainer: {
    padding: getFontSize(2),
  },
  imageStyle: {
    transform: [{rotateY: '180deg'}, {rotateX: '180deg'}],
  },
});
