import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '@/constants/Colors';
import {getFontSize, isIphoneX} from '@/utils/responsiveFn';
import {Images} from '@/assets/images';
import Button from '@/components/Button';
import {GeneralStyle} from '@/constants/GeneralStyle';
import IconComponent from '@/components/IconComponent';
import {setAsyncExploreInfo} from '@/utils/common/useAsyncFunctions';

interface InfoStepFourProps {
  next: () => void;
  previous: () => void;
  stop: () => void;
}

const InfoStepFour = ({next, previous, stop}: InfoStepFourProps) => {
  const overlayStyle = {
    top: isIphoneX() ? getFontSize(50) : getFontSize(39), // Fixed position for step 4
    left: getFontSize(5), // Fixed left position
  };

  const close = async () => {
    await setAsyncExploreInfo();
    stop();
  };
  return (
    <ImageBackground
      source={Images.speechBubble_icons}
      resizeMode="contain"
      imageStyle={styles.imageStyle}
      style={[styles.overlay, overlayStyle]} // ✅ Merge dynamic style
    >
      <IconComponent
        name="close"
        size={getFontSize(3)}
        onPress={close}
        color={Colors.white}
        style={styles.close}
      />
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

export default InfoStepFour;

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
  close: {
    right: getFontSize(1),
    alignSelf: 'flex-end',
    zIndex: 9999,
    top: 15,
    position: 'absolute',
  },
});
