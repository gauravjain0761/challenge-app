import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React, {useState, useCallback} from 'react';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import {Images} from '@/assets/images';
import Button from '../../Button';
import {router} from 'expo-router';
import {useAppSelector} from '@/hooks/reduxHooks';
import {useCompleteOnboardingMutation} from '@/api/authApi';
import {GeneralStyle} from '@/constants/GeneralStyle';

const inProgressStepOne = ({next}: {next: () => void}) => {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const {isExploreInfoParams} = useAppSelector(state => state.auth);
  const [completeOnboarding] = useCompleteOnboardingMutation();

  // const handleNextStep = useCallback(() => {
  //   setStepIndex(prev => {
  //     const newIndex = prev < 2 ? prev + 1 : prev;
  //     if (newIndex == 1) {
  //       router.push({
  //         pathname:
  //           '/(modals)/(myChallenges)/(progressChallenges)/[id]/progress',
  //         params: {
  //           id: isExploreInfoParams?.id,
  //           challengeItem: JSON.stringify(isExploreInfoParams.challengeItem),
  //         },
  //       });
  //     } else if (newIndex == 2) {
  //       router.push({
  //         pathname:
  //           '/(modals)/(myChallenges)/(progressChallenges)/[id]/leaderboard',
  //         params: {
  //           id: isExploreInfoParams?.id,
  //           challengeItem: JSON.stringify(isExploreInfoParams.challengeItem),
  //         },
  //       });
  //     }
  //     if (newIndex === prev + 1) return newIndex;
  //     next();
  //     router.push({
  //       pathname: '/(modals)/(myChallenges)/(progressChallenges)/[id]/actions',
  //       params: {
  //         id: isExploreInfoParams?.id,
  //         challengeItem: JSON.stringify(isExploreInfoParams.challengeItem),
  //       },
  //     });
  //     completeOnboarding({}).unwrap();
  //     return prev;
  //   });
  // }, [next]);
  const handlePreviousStep = useCallback(() => {
    setStepIndex(prev => (prev > 0 ? prev - 1 : prev));
    router.back();
  }, []);

  const getLeftPosition = useCallback(() => {
    // return getFontSize(4 + stepIndex * 9);
    if (stepIndex === 0) {
      return getFontSize(4 + 1.5 * 9);
    } else if (stepIndex === 1) {
      return getFontSize(4 + 0 * 9);
    } else if (stepIndex === 2) {
      return getFontSize(3 + 0 * 9);
    }
  }, [stepIndex]);

  const getDec = () => {
    if (stepIndex === 0) {
      return 'You can complete your Actions';
    } else if (stepIndex === 1) {
      return 'You can check your progress and share it with your friends';
    } else if (stepIndex === 2) {
      return 'You can check your rank and show your friends';
    }
  };
  return (
    <ImageBackground
      source={Images.speechBubble_icons}
      resizeMode="contain"
      imageStyle={{
        transform: [
          {rotateY: stepIndex === 2 ? '0deg' : '180deg'},
          {rotateX: '180deg'},
        ],
      }}
      style={[
        styles.overlay,
        {
          left: getLeftPosition(),
        },
      ]}>
      <View style={[styles.mainContainer]}>
        <Text style={GeneralStyle.overlayText}>
          {'You can complete your Actions'}
        </Text>
        <View style={GeneralStyle.btnRow}>
          {/* {stepIndex > 0 && (
            <Button
              title="Previous"
              type="outline"
              onPress={handlePreviousStep}
              style={GeneralStyle.btnStyle}
              textStyle={GeneralStyle.btnTextStyle}
            />
          )} */}
          <Button
            title={stepIndex === 2 ? 'Done' : 'Next'}
            onPress={next}
            style={GeneralStyle.btnStyle}
            textStyle={GeneralStyle.btnTextStyle}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default inProgressStepOne;

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
});
