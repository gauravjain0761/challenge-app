import {StyleSheet, View} from 'react-native';
import React from 'react';
import GradientText from '../GradientText';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import SliderVIew from './SliderVIew';

const DaysWiseActionView = ({
  days,
  onChangeSlider,
  why,
  challengeName,
}: {
  days: number;
  onChangeSlider?: (value: number) => void;
  why: string;
  challengeName: string;
}) => {
  const getRandomValue = () => {
    const min = 5;
    const max = 15;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const getDetails = () => {
    switch (days) {
      case 1:
        return {
          text: 'Rate your State!',
          text1: '',
          dec: '',
        };
      case 2:
        return {
          text: 'Remember',
          text1: 'Your Why!',
          dec: why,
        };
      case 3:
        return {
          text: 'Make a',
          text1: 'Commitment!',
          dec: 'Say in your head or outload,\n“Today I will......”',
        };
      case 4:
        return {
          text: 'You are half',
          text1: 'way ish!',
          dec: getRandomValue() + '% of men fail today, Not You.',
        };
      case 5:
        return {
          text: 'Take a Deep',
          text1: 'Breath!',
          dec: 'And go again.',
        };
      case 6:
        return {
          text: 'Quote of the Day!',
          text1: '',
          dec: '“Only when the path is clear does confidence replace fear”\n-- AI 2025 -',
        };
      case 7:
        return {
          text: 'ENJOY THIS',
          text1: 'ONE!',
          dec: '',
        };

      default:
        return {
          text: '',
          text1: '',
          dec: '',
        };
    }
  };

  const {text, text1, dec} = getDetails();

  const preRatingText = `YOUR PRE CHALLENGE\n${
    challengeName ? challengeName.toUpperCase() : ''
  } RATING:`;

  return (
    <View>
      {text && (
        <GradientText
          text={text}
          colors={['#C05600', '#9C9A9A']}
          style={styles.headingText}
        />
      )}
      {text1 && (
        <GradientText
          text={text1}
          colors={['#C05600', '#9C9A9A']}
          style={styles.headingText}
        />
      )}

      {days === 1 ? (
        <SliderVIew
          text={preRatingText}
          containerStyle={{
            marginVertical: getFontSize(3),
            marginHorizontal: getFontSize(2),
            height:
              preRatingText.length < 35 ? getFontSize(15) : getFontSize(18),
          }}
          onChangeSlider={onChangeSlider}
        />
      ) : dec ? (
        <GradientText
          text={dec}
          colors={['#555555', '#D1D1D6']}
          style={styles.description}
          height={
            dec.length < 35
              ? getFontSize(3)
              : dec.length < 55
              ? getFontSize(6)
              : getFontSize(8)
          }
          containerStyle={{
            marginTop: getFontSize(3),
            marginVertical: getFontSize(2),
            width: '70%',
            alignSelf: 'center',
          }}
        />
      ) : null}
    </View>
  );
};

export default DaysWiseActionView;

const styles = StyleSheet.create({
  headingText: {
    fontSize: getFontSize(4),
    fontWeight: '500',
    color: Colors.white,
    textAlign: 'center',
  },
  description: {
    fontSize: getFontSize(2.1),
    fontWeight: '500',
    color: Colors.white,
    textAlign: 'center',
  },
});
