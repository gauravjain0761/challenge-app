import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors} from '@/constants/Colors';
import {getFontSize, isIphoneX} from '@/utils/responsiveFn';
import {Images} from '@/assets/images';
import {GeneralStyle} from '@/constants/GeneralStyle';
import Button from '@/components/Button';
import AnimatedHandIcon from '@/components/AnimatedHandIcon';
import {setAsyncExplorer} from '@/utils/common/useAsyncFunctions';
import IconComponent from '@/components/IconComponent';
import {useAppDispatch} from '@/hooks/reduxHooks';
import {setPersonalizedCategories} from '@/features/authSlice';

const ExploreStepFour = ({
  next,
  previous,
  stop,
  onLayout,
  step: {mask},
}: any) => {
  const dispatch = useAppDispatch();

  const overlayStyle = {
    top: isIphoneX() ? mask.y + getFontSize(-23) : mask.y + getFontSize(-22), // place above the highlighted element
    right: getFontSize(7), // center horizontally
  };

  const close = async () => {
    await setAsyncExplorer();
    dispatch(setPersonalizedCategories(null as any));
    stop();
  };
  return (
    <ImageBackground
      source={Images.speechBubble_icons}
      resizeMode="contain"
      imageStyle={styles.imageStyle}
      style={[styles.overlay, overlayStyle]} // ✅ Merge dynamic style
    >
      <View style={styles.mainContainer}>
        <IconComponent
          name="close"
          size={getFontSize(3)}
          onPress={close}
          color={Colors.white}
          style={styles.close}
        />
        <Text style={[GeneralStyle.overlayText, {marginBottom: -5}]}>
          Click here to see all of the personal challenges
        </Text>
        <View style={GeneralStyle.btnRow}>
          <Button
            title="Previous"
            type="outline"
            onPress={previous}
            style={GeneralStyle.btnStyle}
            textStyle={GeneralStyle.btnTextStyle}
          />
        </View>
        <View style={[styles.handIcon]}>
          <AnimatedHandIcon type="upDown" />
        </View>
      </View>
    </ImageBackground>
  );
};

export default ExploreStepFour;

const styles = StyleSheet.create({
  overlay: {
    width: getFontSize(32),
    height: getFontSize(25),
    position: 'absolute', // ✅ Important for overlay
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999, // ✅ Ensure it's above everything
    alignSelf: 'center',
  },
  imageStyle: {
    transform: [{rotateY: '0deg'}, {rotateX: '180deg'}],
  },
  mainContainer: {
    paddingHorizontal: getFontSize(3),
  },

  handIcon: {
    position: 'absolute',
    top: getFontSize(20),
    right: -getFontSize(5),
    transform: [{rotate: '40deg'}],
  },
  close: {
    right: getFontSize(-3),
    alignSelf: 'flex-end',
  },
});
