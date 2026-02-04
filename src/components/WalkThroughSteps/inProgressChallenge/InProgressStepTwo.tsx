import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {getFontSize, isIphoneX} from '@/utils/responsiveFn';
import {Images} from '@/assets/images';
import {GeneralStyle} from '@/constants/GeneralStyle';
import AnimatedHandIcon from '@/components/AnimatedHandIcon';
import {LayoutInfo} from '@/hooks/useCustomWalkthrough';
import IconComponent from '@/components/IconComponent';
import {Colors} from '@/constants/Colors';

interface InProgressStepTwoProps {
  next: () => void;
  previous?: () => void;
  stop?: () => void;
  layoutInfo?: LayoutInfo;
}

const InProgressStepTwo = ({
  layoutInfo,
  stop = () => {},
}: InProgressStepTwoProps) => {
  const overlayStyle = {
    // top: isIphoneX() ? getFontSize(0) : getFontSize(-1), // Fixed position for step 1

    top: (layoutInfo?.y || 0) - getFontSize(19),
    left: (layoutInfo?.x || 0) - getFontSize(27), // Fixed left position
    // left: isIphoneX() ? getFontSize(12) : getFontSize(17), // Fixed left position
  };
  // console.log('layoutInfo?.y', layoutInfo?.y * 2.3);

  return (
    <ImageBackground
      source={Images.speechBubble_icons}
      resizeMode="contain"
      imageStyle={{
        transform: [{rotateY: '0deg'}, {rotateX: '180deg'}],
      }}
      style={[styles.overlay, overlayStyle]}>
      <IconComponent
        name="close"
        size={getFontSize(3)}
        onPress={stop}
        color={Colors.white}
        style={styles.close}
      />
      <View style={[styles.mainContainer]}>
        <Text style={GeneralStyle.overlayText}>
          {'You can complete/view your action by clicking on it'}
        </Text>

        <View style={[styles.handIcon]}>
          <AnimatedHandIcon type="upDown" />
        </View>
      </View>
    </ImageBackground>
  );
};

export default InProgressStepTwo;

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
    position: 'absolute',
    top: getFontSize(19),
    right: -getFontSize(5),
    transform: [{rotate: '400deg'}],
  },
  close: {
    right: getFontSize(1.5),
    alignSelf: 'flex-end',
    zIndex: 9999,
  },
});
