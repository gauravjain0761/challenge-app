import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {Images} from '@/assets/images';
import FastImage from 'react-native-fast-image';
import {getFontSize} from '@/utils/responsiveFn';
import GradientText from '@/components/GradientText';
import Button from '@/components/Button';
import {router} from 'expo-router';
import {Colors} from '@/constants/Colors';
import OnBoardingProgressBar from '@/components/OnBoardingProgressBar';

const info5 = () => {
  const handlePress = () => {
    router.dismissTo('../(monyPE)/info6');
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
        <OnBoardingProgressBar step={6} />

        <View style={styles.headingView}>
          <View
            style={{
              marginTop: -getFontSize(15),
            }}>
            <GradientText
              text={'THE AVERAGE MAN\nCOMPLETES 3\nCHALLENGES'}
              colors={[Colors.white, Colors._999999]}
              style={{...styles.headingText, fontSize: getFontSize(3.6)}}
              height={getFontSize(15)}
            />
            <GradientText
              text={'But you’re not\nwhere to be\naverage'}
              style={{...styles.headingText2}}
              height={getFontSize(13)}
            />
          </View>
        </View>
        <Button title="Power Through" onPress={handlePress} />
      </View>
    </SafeAreaView>
  );
};

export default info5;

const styles = StyleSheet.create({
  logo: {
    width: getFontSize(15),
    height: getFontSize(18),
    alignSelf: 'center',
  },
  headingText: {
    fontSize: getFontSize(3.8),
    fontWeight: '600',
    textAlign: 'center',

    paddingHorizontal: getFontSize(2),
  },
  headingView: {
    flex: 1,
    justifyContent: 'center',
  },
  headingText2: {
    fontSize: getFontSize(3.5),
    fontWeight: '500',
    textAlign: 'center',
  },
});
