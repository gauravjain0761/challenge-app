import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import {Images} from '@/assets/images';
import Button from '../../Button';
import {router} from 'expo-router';
import {useAppSelector} from '@/hooks/reduxHooks';
import {GeneralStyle} from '@/constants/GeneralStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AsyncTypes} from '@/types/enums';
import IconComponent from '@/components/IconComponent';

const InfoStepOne = ({next}: {next: () => void}) => {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [challengeData, setChallengeData] = useState<any>(null);
  const {isExploreInfoParams} = useAppSelector(state => state.auth);

  useEffect(() => {
    if (isExploreInfoParams) {
      setChallengeData(isExploreInfoParams);
    }
  }, []);

  const handleNextStep = useCallback(() => {
    if (stepIndex < 2) {
      // Navigate to next tab
      const newIndex = stepIndex + 1;
      setStepIndex(newIndex);

      if (newIndex === 1) {
        // Go to Actions tab
        router.push({
          pathname: '/(modals)/(exploreChallenges)/[id]/actions',
          params: {
            id: challengeData?.id,
            challengeItem: JSON.stringify(challengeData.challengeItem),
          },
        });
      } else if (newIndex === 2) {
        // Go to Goals tab
        router.push({
          pathname: '/(modals)/(exploreChallenges)/[id]/levels',
          params: {
            id: challengeData?.id,
            challengeItem: JSON.stringify(challengeData.challengeItem),
          },
        });
      }
    } else {
      // Finished showing all 3 tabs, go back to Info and signal to start info steps
      router.push({
        pathname: '/(modals)/(exploreChallenges)/[id]/info',
        params: {
          id: challengeData?.id,
          challengeItem: JSON.stringify(challengeData.challengeItem),
        },
      });

      // Signal that layout step is completed and info steps should start
      AsyncStorage.setItem(AsyncTypes.EXPLORE_INFO, 'layout-completed');
      next(); // Complete the layout walkthrough
    }
  }, [stepIndex, next, challengeData]);
  const handlePreviousStep = useCallback(() => {
    if (stepIndex > 0) {
      const newIndex = stepIndex - 1;
      setStepIndex(newIndex);

      if (newIndex === 0) {
        // Go back to Info tab
        router.push({
          pathname: '/(modals)/(exploreChallenges)/[id]/info',
          params: {
            id: challengeData?.id,
            challengeItem: JSON.stringify(challengeData.challengeItem),
          },
        });
      } else if (newIndex === 1) {
        // Go back to Actions tab
        router.push({
          pathname: '/(modals)/(exploreChallenges)/[id]/actions',
          params: {
            id: challengeData?.id,
            challengeItem: JSON.stringify(challengeData.challengeItem),
          },
        });
      }
    }
  }, [stepIndex, challengeData]);

  const getLeftPosition = useCallback(() => {
    // return getFontSize(4 + stepIndex * 6);
    if (stepIndex === 0) {
      return getFontSize(4 + stepIndex * 6);
    } else if (stepIndex === 1) {
      return getFontSize(6 + stepIndex * 6);
    } else if (stepIndex === 2) {
      return getFontSize(4 + stepIndex * 6);
    }
  }, [stepIndex]);

  const getDec = () => {
    if (stepIndex === 0) {
      return 'Challenge information';
    } else if (stepIndex === 1) {
      return 'Challenge daily actions';
    } else if (stepIndex === 2) {
      return 'Challenge goals and levels';
    }
  };

  const close = async () => {
    AsyncStorage.setItem(AsyncTypes.EXPLORE_INFO, 'layout-completed');
    next(); // Complete the layout walkthrough
  };
  return (
    <ImageBackground
      source={
        stepIndex === 2
          ? Images.speechBubble_icons_2
          : Images.speechBubble_icons
      }
      resizeMode="contain"
      imageStyle={styles.imageStyle}
      style={[styles.overlay, {left: getLeftPosition()}]}>
      {stepIndex === 0 && (
        <IconComponent
          name="close"
          size={getFontSize(3)}
          onPress={close}
          color={Colors.white}
          style={styles.close}
        />
      )}
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

export default InfoStepOne;

const styles = StyleSheet.create({
  overlay: {
    width: getFontSize(30),
    height: getFontSize(20),
    position: 'absolute',
    top: getFontSize(-19),
    left: getFontSize(4),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  mainContainer: {
    padding: getFontSize(2),
  },
  imageStyle: {
    transform: [{rotateY: '180deg'}, {rotateX: '180deg'}],
  },
  close: {
    right: getFontSize(1.5),
    alignSelf: 'flex-end',
    marginBottom: -getFontSize(1),
    top: getFontSize(1),
    zIndex: 9999,
  },
});
