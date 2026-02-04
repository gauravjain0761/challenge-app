import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import {Images} from '@/assets/images';
import {GeneralStyle} from '@/constants/GeneralStyle';
import Button from '@/components/Button';

const ExploreStepThree = ({
  next,
  previous,
  onLayout,
  step: {mask},
  personalizedCategories,
}: any) => {
  console.log('personalizedCategories===>', personalizedCategories);

  const overlayStyle = {
    top: mask.y + getFontSize(5), // place above the highlighted element
    left: mask.x + mask.width / 2 - getFontSize(1), // center horizontally
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
          {`Personal challenges =\nYour chance to test yourself 'You vs You' or challenge your mates 'You vs Friends'`}
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

export default ExploreStepThree;

const styles = StyleSheet.create({
  overlay: {
    width: getFontSize(37),
    height: getFontSize(22),
    position: 'absolute', // ✅ Important for overlay
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999, // ✅ Ensure it's above everything
    alignSelf: 'center',
    padding: getFontSize(1),
  },
  imageStyle: {
    transform: [{rotateY: '180deg'}],
  },
  mainContainer: {
    paddingTop: getFontSize(6),
    paddingHorizontal: getFontSize(2),
  },
  overlayText: {
    color: Colors.white,
    fontWeight: '500',
    fontSize: getFontSize(1.8),
    marginBottom: 10,
    textAlign: 'center',
  },
});
