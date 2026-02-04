import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '@/constants/Colors';
import {getFontSize, isIphoneX} from '@/utils/responsiveFn';
import {Images} from '@/assets/images';
import Button from '../../Button';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {useAppSelector} from '@/hooks/reduxHooks';
import LinearGradient from 'react-native-linear-gradient';

const ExploreStepTwo = ({next, previous}: any) => {
  const {personalizedCategories} = useAppSelector(state => state.auth);

  return personalizedCategories !== null ? (
    <ImageBackground
      source={Images.speechBubble_icons_3}
      resizeMode="stretch"
      style={styles.overlayTwo}>
      <Text
        style={[
          GeneralStyle.overlayText,
          {marginBottom: getFontSize(0.6), marginTop: getFontSize(1.9)},
        ]}>
        {'Here is your personalised\nchallenges as promised'}
      </Text>
      <View style={[GeneralStyle.btnRow, {marginBottom: 0}]}>
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
    </ImageBackground>
  ) : (
    <ImageBackground
      source={Images.speechBubble_icons}
      resizeMode="contain"
      imageStyle={styles.imageStyle}
      style={styles.overlay}>
      <View style={styles.mainContainer}>
        <Text style={GeneralStyle.overlayText}>
          Search challenge by category
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

export default ExploreStepTwo;

const styles = StyleSheet.create({
  overlay: {
    width: getFontSize(35),
    height: getFontSize(20),
    position: 'absolute', // ✅ Important for overlay
    top: isIphoneX() ? getFontSize(26) : getFontSize(22),
    left: getFontSize(3),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999, // ✅ Ensure it's above everything
  },

  overlayTwo: {
    width: getFontSize(32),
    height: getFontSize(15),
    position: 'absolute',
    top: isIphoneX() ? getFontSize(6.5) : getFontSize(16),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: getFontSize(2),
    zIndex: 9999, // Above backdrop (backdrop is 9998)
  },

  mainContainer: {
    padding: getFontSize(2),
    paddingTop: getFontSize(6),
  },
  imageStyle: {
    transform: [{rotateY: '180deg'}],
  },
});
