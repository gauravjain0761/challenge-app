import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import GradientText from '../GradientText';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import FastImage from 'react-native-fast-image';
import {Images} from '@/assets/images';

const LevelUPView = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <GradientText
        text="Level UP!"
        style={styles.headingText1}
        containerStyle={{
          marginBottom: getFontSize(5),
        }}
      />

      <Text style={styles.details}>
        Your aim is to level up as much as you can because different levels open
        hidden challenges and invites to one off Legend challenges against other
        men around the world.
      </Text>
      <Text style={styles.details}>
        Remember the more you level up, the harder the challenges become.
      </Text>

      <FastImage
        source={Images.levels_up}
        style={styles.image}
        resizeMode="contain"
      />
    </ScrollView>
  );
};

export default LevelUPView;

const styles = StyleSheet.create({
  headingText1: {
    fontSize: getFontSize(3),
    fontWeight: '500',
    color: Colors.white,
    textAlign: 'center',
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
    height: getFontSize(12),
    width: getFontSize(25),
    alignSelf: 'center',
    marginTop: getFontSize(5),
  },
});
