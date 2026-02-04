import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import GradientText from '../GradientText';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';

const LevelsView = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <GradientText
        text="Levels!"
        style={styles.headingText1}
        containerStyle={{
          marginBottom: getFontSize(5),
        }}
      />

      <Text style={styles.details}>
        Every challenge you finish earns you a level. The higher you place, the
        higher you climb.
      </Text>
      <Text style={styles.details}>
        Your first challenge sets your baseline. From there, it’s a fight, to
        beat your old self, to outwork your friends, and to prove yourself
        against men worldwide.
      </Text>
      <Text style={styles.details}>
        The catch? Each time you level up, the game gets harder. That’s the
        point. Growth only comes when you take on tougher battles.
      </Text>
    </ScrollView>
  );
};

export default LevelsView;

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
});
