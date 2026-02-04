import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import {Images} from '@/assets/images';
import Button from '@/components/Button';
import {GeneralStyle} from '@/constants/GeneralStyle';
import AnimatedHandIcon from '@/components/AnimatedHandIcon';
import IconComponent from '@/components/IconComponent';
import {
  getAsyncExploreInfo,
  setAsyncExploreInfo,
} from '@/utils/common/useAsyncFunctions';
import {LayoutInfo} from '@/hooks/useCustomWalkthrough';

interface InfoStepTwoProps {
  next: () => void;
  previous?: () => void;
  stop?: () => void;
  selectedLevelIndex?: number;
  layout?: LayoutInfo;
}
const InfoStepTwo = ({
  next,
  previous,
  stop = () => {},
  selectedLevelIndex,
  layout,
}: InfoStepTwoProps) => {
  const overlayStyle = layout
    ? {
        top: layout.y - getFontSize(20), // Position above the button .y - getFontSize(20)
        left: layout.x + getFontSize(3.5),
      }
    : {
        top: getFontSize(12.5), // Fallback
        left: getFontSize(5),
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
          Select your daily{'\n'}challenge goal
        </Text>

        <View style={[GeneralStyle.btnRow, {marginBottom: 20}]}>
          {/* {previous && (
            <Button
              title="Previous"
              type="outline"
              onPress={previous}
              style={GeneralStyle.btnStyle}
              textStyle={GeneralStyle.btnTextStyle}
            />
          )} */}
          {(selectedLevelIndex || selectedLevelIndex == 0) && (
            <Button
              title="Next"
              onPress={next}
              style={GeneralStyle.btnStyle}
              textStyle={GeneralStyle.btnTextStyle}
              disabled={selectedLevelIndex === null}
            />
          )}
        </View>
        {selectedLevelIndex === undefined && (
          <AnimatedHandIcon type="upDown" containerStyle={styles.handIcon} />
        )}
      </View>
    </ImageBackground>
  );
};

export default InfoStepTwo;

const styles = StyleSheet.create({
  overlay: {
    width: getFontSize(30),
    height: getFontSize(20),
    position: 'absolute', // ✅ Important for overlay
    // top: getFontSize(8), // Show above home indicator
    // left: getFontSize(4),
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
  handIcon: {
    height: getFontSize(15),
    position: 'absolute',
    top: getFontSize(18),
    left: getFontSize(5),
    transform: [{rotate: '-20deg'}],
  },
  close: {
    right: getFontSize(1.5),
    alignSelf: 'flex-end',
    zIndex: 9999,
    top: 10,
  },
});
