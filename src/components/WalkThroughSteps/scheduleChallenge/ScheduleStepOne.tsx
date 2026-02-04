import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import {Images} from '@/assets/images';
import Button from '@/components/Button';
import {router} from 'expo-router';
import {useAppSelector} from '@/hooks/reduxHooks';
import {useCompleteOnboardingMutation} from '@/api/authApi';
import {GeneralStyle} from '@/constants/GeneralStyle';

const ScheduleStepOne = ({
  next,
  previous,
  step: {mask},
  challengeInfo,
}: any) => {
  const overlayStyle = {
    top: mask.y - getFontSize(16), // place above the highlighted element
    // left: mask.x + mask.width / 2 - getFontSize(15), // center horizontally
  };
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [completeOnboarding] = useCompleteOnboardingMutation();

  const getLeftPosition = useCallback(() => {
    return getFontSize(3 + (stepIndex === 0 ? stepIndex : 2.2) * 9);
  }, [stepIndex]);

  const {isExploreInfoParams} = useAppSelector(state => state.auth);

  const handleNextStep = useCallback(() => {
    setStepIndex(prev => {
      const newIndex = prev < 1 ? prev + 1 : prev;
      if (newIndex == 1) {
        router.push({
          pathname:
            '/(modals)/(myChallenges)/(scheduledChallenges)/[id]/friends',
          params: {
            id: isExploreInfoParams?.id,
            challengeItem: JSON.stringify(isExploreInfoParams.challengeItem),
          },
        });
      }
      if (newIndex === prev + 1) return newIndex;
      next();
      router.push({
        pathname: '/(modals)/(myChallenges)/(scheduledChallenges)/[id]/info',
        params: {
          id: isExploreInfoParams?.id,
          challengeItem: JSON.stringify(isExploreInfoParams.challengeItem),
        },
      });
      completeOnboarding({}).unwrap();
      return prev;
    });
  }, [next]);

  const handlePreviousStep = useCallback(() => {
    setStepIndex(prev => (prev > 0 ? prev - 1 : prev));
    router.back();
  }, []);

  const getDec = () => {
    if (stepIndex === 0) {
      return 'You can update your challenge Goal and Start Date in this info tab';
    } else {
      return 'You can invite your friend';
    }
  };

  return (
    <ImageBackground
      source={Images.speechBubble_icons}
      resizeMode="contain"
      style={[styles.overlay, overlayStyle, {left: getLeftPosition()}]} // ✅ Merge dynamic style
    >
      <View style={styles.mainContainer}>
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
            title={stepIndex === 1 ? 'Done' : 'Next'}
            onPress={handleNextStep}
            style={GeneralStyle.btnStyle}
            textStyle={GeneralStyle.btnTextStyle}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default ScheduleStepOne;

const styles = StyleSheet.create({
  overlay: {
    width: getFontSize(30),
    height: getFontSize(18),
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
