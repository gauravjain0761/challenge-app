import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import Button from '@/components/Button';
import {router} from 'expo-router';
import {ChallengeMode} from '@/types';
import {CategoryFilter} from '@/types/enums';

const TodayEmptyChallenge = ({
  isType,
  category,
}: {
  isType?: ChallengeMode;
  category?: CategoryFilter;
}) => {
  const onPress = () => {
    router.push({
      pathname: '/(tabs)/(challenges)',
      params: {isToday: 'true', category: category},
    });
  };

  const title = () => {
    if (isType === 'Personal') {
      return 'You vs You';
    } else if (isType === 'Group') {
      return 'You vs Friends';
    } else {
      return 'You vs World';
    }
  };

  const buttonTitle = () => {
    if (isType === 'Worldwide') {
      return 'Coming Soon';
    } else {
      return '+ ' + 'Join challenge';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{title()}</Text>
      <Button
        title={buttonTitle()}
        disabled={isType === 'Worldwide'}
        type="outline"
        textStyle={styles.buttonText}
        style={styles.button}
        onPress={onPress}
      />
    </View>
  );
};

export default TodayEmptyChallenge;

const styles = StyleSheet.create({
  container: {
    height: getFontSize(20),
    width: getFontSize(47),
    borderWidth: 0.5,
    borderColor: Colors.white,
    borderRadius: getFontSize(1),
    alignItems: 'center',
    justifyContent: 'center',
    gap: getFontSize(1),
  },
  buttonText: {
    color: Colors.primary,
    fontSize: getFontSize(2),
  },
  button: {
    borderRadius: getFontSize(1),
    height: getFontSize(3),
    alignSelf: 'center',
    width: 'auto',
    paddingHorizontal: getFontSize(1.5),
    marginVertical: 0,
  },
  titleText: {
    fontSize: getFontSize(3),
    fontWeight: '600',
    textAlign: 'center',
    color: Colors._D1D1D6,
  },
});
