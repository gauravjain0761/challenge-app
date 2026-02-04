import {SafeAreaView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {Images} from '@/assets/images';
import FastImage from 'react-native-fast-image';
import {getFontSize} from '@/utils/responsiveFn';
import GradientText from '@/components/GradientText';
import SelectionList from '@/components/myChallenges/SelectionView';
import {NUTRITION_EXP_STEPS_3} from '@/types/enums';
import Button from '@/components/Button';
import {router} from 'expo-router';
import {Colors} from '@/constants/Colors';
import OnBoardingProgressBar from '@/components/OnBoardingProgressBar';

const info2 = () => {
  const [isSelected, setSelected] = useState<string | null>(null);
  const handlePress = () => {
    router.dismissTo('../(nutritionPE)/info3');
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
        <OnBoardingProgressBar step={3} />

        <View style={styles.headingView}>
          <GradientText
            text={
              'If you could break free from any\none thing, which would it be?'
            }
            style={styles.headingText}
            height={getFontSize(12)}
          />

          <SelectionList
            data={[...Object.values(NUTRITION_EXP_STEPS_3)]}
            selected={setSelected}
            setSelectedItem={setSelected}
          />
        </View>
        {isSelected && (
          <Button
            title="Next Challenge "
            disabled={isSelected === null ? true : false}
            onPress={handlePress}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default info2;

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
