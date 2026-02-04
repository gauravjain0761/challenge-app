import {SafeAreaView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {Images} from '@/assets/images';
import FastImage from 'react-native-fast-image';
import {getFontSize} from '@/utils/responsiveFn';
import GradientText from '@/components/GradientText';
import SelectionList from '@/components/myChallenges/SelectionView';
import {PERSONAL_EXP_STEPS_3} from '@/types/enums';
import Button from '@/components/Button';
import {router} from 'expo-router';
import {Colors} from '@/constants/Colors';
import OnBoardingProgressBar from '@/components/OnBoardingProgressBar';

const info4 = () => {
  const [isSelected, setSelected] = useState<string | null>(null);
  const handlePress = () => {
    router.dismissTo('../(fitnessPE)/info5');
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
        <OnBoardingProgressBar step={5} />

        <View style={styles.headingView}>
          <GradientText
            text={'Do you want to compete\nor go it alone?'}
            style={styles.headingText}
            height={getFontSize(12)}
          />

          <SelectionList
            data={[...Object.values(PERSONAL_EXP_STEPS_3)]}
            selected={setSelected}
            setSelectedItem={setSelected}
            isCapitalize={false}
          />
        </View>
        {isSelected && (
          <Button
            title="Forge Ahead"
            disabled={isSelected === null ? true : false}
            onPress={handlePress}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default info4;

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
