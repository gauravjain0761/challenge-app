import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import GradientText from '../GradientText';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import FastImage from 'react-native-fast-image';
import {Images} from '@/assets/images';

const LegendStatusView = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <GradientText
        text="Legend Status!"
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
        Legend status isn’t given, it’s earned. Every challenge is built to test
        you, and only a few men climb past Master.
      </Text>
      <Text style={styles.details}>
        Hold that level long enough, and you’ll be called into exclusive Legend
        Challenges, one-off trials that decide who truly deserves the title of
        MenTools Legend.
      </Text>

      <FastImage
        source={Images.legend_Badge}
        style={styles.image}
        resizeMode="contain"
      />
    </ScrollView>
  );
};

export default LegendStatusView;

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
    height: getFontSize(15),
    width: '100%',
    alignSelf: 'center',
    marginTop: getFontSize(5),
  },
});
