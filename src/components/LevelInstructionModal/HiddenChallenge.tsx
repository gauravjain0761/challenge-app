import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import GradientText from '../GradientText';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import FastImage from 'react-native-fast-image';
import {Images} from '@/assets/images';

const HiddenChallenge = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <GradientText
        text="Hidden Challenges!"
        style={styles.headingText}
        containerStyle={{}}
      />
      <GradientText
        text="Coming Soon"
        style={styles.headingText1}
        containerStyle={{
          marginBottom: getFontSize(2),
        }}
      />

      <Text style={styles.details}>
        The more you level up, the more doors open. Hidden challenges unlock at
        higher levels, each one tougher than the last. Push yourself often,
        because every level is a gateway to the next test.
      </Text>

      <FastImage
        source={Images.challenge_dummy_image}
        style={styles.image}
        resizeMode="contain"
      />
    </ScrollView>
  );
};

export default HiddenChallenge;

const styles = StyleSheet.create({
  headingText: {
    fontSize: getFontSize(3),
    fontWeight: '500',
    color: Colors.white,
    textAlign: 'center',
  },
  headingText1: {
    fontSize: getFontSize(2.5),
    fontWeight: '500',
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.6,
  },
  details: {
    fontSize: getFontSize(2),
    fontWeight: '400',
    color: Colors.white,
    textAlign: 'left',
    opacity: 0.8,
    marginTop: getFontSize(3),
    letterSpacing: 0.5,
  },

  image: {
    height: getFontSize(20),
    width: '100%',
    alignSelf: 'center',
    marginTop: getFontSize(5),
  },
});
