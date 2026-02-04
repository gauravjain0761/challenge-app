import {SafeAreaView, StyleSheet, View} from 'react-native';
import React from 'react';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {Images} from '@/assets/images';
import FastImage from 'react-native-fast-image';
import {getFontSize} from '@/utils/responsiveFn';
import GradientText from '@/components/GradientText';
import Button from '@/components/Button';
import {Colors} from '@/constants/Colors';
import {router} from 'expo-router';
import OnBoardingProgressBar from '@/components/OnBoardingProgressBar';

const info3 = () => {
  const handlePress = () => {
    router.dismissTo('../(mainPersonalExp)/info4');
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
        <OnBoardingProgressBar step={4} />

        <View style={styles.headingView}>
          <View style={{}}>
            <GradientText
              text={'Did you know \n90% of all men \nhave bad habits?'}
              colors={[Colors.white, Colors._999999]}
              style={styles.headingText}
              height={getFontSize(14)}
            />

            <GradientText
              text={'Not You?'}
              style={styles.headingText2}
              height={getFontSize(5)}
            />
            <FastImage
              source={Images.onBoardInfo1}
              resizeMode="stretch"
              style={styles.image}
            />
          </View>
        </View>
        <Button title="Keep Moving" onPress={handlePress} />
      </View>
    </SafeAreaView>
  );
};

export default info3;

const styles = StyleSheet.create({
  logo: {
    width: getFontSize(15),
    height: getFontSize(18),
    alignSelf: 'center',
  },
  headingText: {
    fontSize: getFontSize(3.6),
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  headingText1: {
    fontSize: getFontSize(2.8),
    fontWeight: '500',
    textAlign: 'center',
    marginTop: getFontSize(0.5),
  },
  headingText2: {
    fontSize: getFontSize(3.6),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headingView: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: getFontSize(23),
    marginTop: getFontSize(10),
  },
});
