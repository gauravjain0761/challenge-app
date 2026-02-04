import {SafeAreaView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {Images} from '@/assets/images';
import FastImage from 'react-native-fast-image';
import {getFontSize} from '@/utils/responsiveFn';
import GradientText from '@/components/GradientText';
import SelectionList from '@/components/myChallenges/SelectionView';
import {AGE, ALCOHOL_EXP_STEPS_2, RATE_YOUR_LIFE} from '@/types/enums';
import Button from '@/components/Button';
import {router} from 'expo-router';
import {Colors} from '@/constants/Colors';
import OnBoardingProgressBar from '@/components/OnBoardingProgressBar';

const info1 = () => {
  const [isSelected, setSelected] = useState<string | null>(null);
  const handlePress = () => {
    router.dismissTo('../(alcoholPE)/info2');
  };

  return (
    <SafeAreaView
      style={[GeneralStyle.flex, {backgroundColor: Colors._2d2d2d}]}>
      <FastImage
        source={Images.grayGradient} // Replace with your video path
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <View style={GeneralStyle.flex}>
        <OnBoardingProgressBar step={2} />

        <View style={styles.headingView}>
          <GradientText
            text={'How do you rate your alcohol\nconsumption right now?'}
            style={styles.headingText}
            height={getFontSize(11)}
          />

          <SelectionList
            data={[...Object.values(ALCOHOL_EXP_STEPS_2)]}
            selected={setSelected}
            setSelectedItem={setSelected}
          />
        </View>
        {isSelected && (
          <Button
            title="Push On"
            disabled={isSelected === null ? true : false}
            onPress={handlePress}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default info1;

const styles = StyleSheet.create({
  logo: {
    width: getFontSize(15),
    height: getFontSize(18),
    alignSelf: 'center',
  },
  headingText: {
    fontSize: getFontSize(2.6),
    fontWeight: '600',
    textAlign: 'center',

    paddingHorizontal: getFontSize(2),
  },
  headingView: {
    flex: 1,
  },
});
