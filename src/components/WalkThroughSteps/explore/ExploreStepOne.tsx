import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Colors} from '@/constants/Colors';
import {getFontSize, isIphoneX} from '@/utils/responsiveFn';
import {Images} from '@/assets/images';
import Button from '../../Button';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {setExplore, setAsyncExplorer} from '@/utils/common/useAsyncFunctions';
import IconComponent from '@/components/IconComponent';
import {useAppDispatch} from '@/hooks/reduxHooks';
import {setPersonalizedCategories} from '@/features/authSlice';

const ExploreStepOne = (props: any) => {
  const {next, stop} = props;
  const [stepIndex, setStepIndex] = useState<number>(0);
  const dispatch = useAppDispatch();
  
  const close = async () => {
    await setAsyncExplorer();
    dispatch(setPersonalizedCategories(null as any));
    stop();
  };

  const handlePreviousStep = useCallback(() => {
    if (stepIndex > 0) {
      const prevIndex = stepIndex - 1;
      setStepIndex(prevIndex);
    }
  }, [stepIndex]);

  const handleNextStep = useCallback(() => {
    if (stepIndex <= 0) {
      const nextIndex = stepIndex + 1;
      setStepIndex(nextIndex);
    } else {
      next?.();
    }
  }, [stepIndex, next]);

  const getLeftPosition = useCallback(() => {
    if (stepIndex === 0) {
      return getFontSize(5);
    } else if (stepIndex === 1) {
      return getFontSize(6 + stepIndex * 4);
    }
  }, [stepIndex]);

  const getDec = () => {
    if (stepIndex === 0) {
      return 'Explore all our challenges';
    } else if (stepIndex === 1) {
      return 'See your challenges';
    }
  };

  return (
    <ImageBackground
      source={
        stepIndex === 1
          ? Images.speechBubble_icons_2
          : Images.speechBubble_icons
      }
      resizeMode="contain"
      imageStyle={styles.imageStyle}
      style={[styles.overlay, {left: getLeftPosition()}]}>
      <View style={styles.mainContainer}>
        {stepIndex === 0 && (
          <IconComponent
            name="close"
            size={getFontSize(3)}
            onPress={close}
            color={Colors.white}
            style={styles.close}
          />
        )}
        <Text style={GeneralStyle.overlayText}>{getDec()}</Text>
        <View style={GeneralStyle.btnRow}>
          {stepIndex > 0 && (
            <Button
              title="Previous"
              type="outline"
              onPress={handlePreviousStep}
              style={GeneralStyle.btnStyle}
              textStyle={GeneralStyle.btnTextStyle}
            />
          )}
          <Button
            title="Next"
            onPress={handleNextStep}
            style={GeneralStyle.btnStyle}
            textStyle={GeneralStyle.btnTextStyle}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default ExploreStepOne;

const styles = StyleSheet.create({
  overlay: {
    width: getFontSize(30),
    height: getFontSize(23),
    position: 'absolute',
    top: isIphoneX() ? getFontSize(18) : getFontSize(15),
    left: getFontSize(4),
    alignItems: 'center',
    justifyContent: 'center',
    // transform: [{rotateY: '180deg'}],
  },
  imageStyle: {
    transform: [{rotateY: '180deg'}],
  },
  mainContainer: {
    padding: getFontSize(2),
    paddingTop: getFontSize(6),
    // transform: [{rotateY: '180deg'}],
  },
  close: {
    right: getFontSize(-3),
    alignSelf: 'flex-end',
    marginBottom: getFontSize(1),
  },
});
