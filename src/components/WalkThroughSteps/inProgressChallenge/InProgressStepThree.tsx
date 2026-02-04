import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {Images} from '@/assets/images';
import Button from '../../Button';
import {GeneralStyle} from '@/constants/GeneralStyle';
import AnimatedHandIcon from '@/components/AnimatedHandIcon';

interface InProgressStepThreeProps {
  next: () => void;
  previous: () => void;
}

const InProgressStepThree = ({next}: InProgressStepThreeProps) => {
  const overlayStyle = {
    top: getFontSize(-3), // Fixed position for step 2
    left: getFontSize(7), // Fixed left position
  };

  return (
    <ImageBackground
      source={Images.speechBubble_icons}
      resizeMode="contain"
      imageStyle={{
        transform: [{rotateY: '180deg'}, {rotateX: '180deg'}],
      }}
      style={[styles.overlay, overlayStyle]}>
      <View style={[styles.mainContainer]}>
        <Text style={GeneralStyle.overlayText}>
          {'You can move right to left to undo your action'}
        </Text>
        <View style={GeneralStyle.btnRow}>
          <Button
            title={'Done'}
            onPress={next}
            style={GeneralStyle.btnStyle}
            textStyle={GeneralStyle.btnTextStyle}
          />
        </View>

        {/* <AnimatedHandIcon type="leftRight" containerStyle={styles.handIcon} /> */}
      </View>
    </ImageBackground>
  );
};

export default InProgressStepThree;

const styles = StyleSheet.create({
  overlay: {
    width: getFontSize(30),
    height: getFontSize(20),
    position: 'absolute',
    top: getFontSize(8),
    left: getFontSize(4),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  mainContainer: {
    padding: getFontSize(2),
  },
  handIcon: {
    height: getFontSize(15),
    position: 'absolute',
    top: getFontSize(23),
    // backgroundColor: 'red',
    transform: [{rotate: '0deg'}],
  },
});
