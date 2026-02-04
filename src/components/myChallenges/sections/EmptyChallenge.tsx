import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import Button from '@/components/Button';
import IconComponent from '@/components/IconComponent';
import {router} from 'expo-router';

const EmptyChallenge = ({isType}: {isType?: 'Live' | 'Next' | 'Past'}) => {
  const onPress = () => {
    router.push('/(tabs)/(challenges)');
    router.setParams({isToday: 'true'});
  };
  return (
    <View style={styles.container}>
      {isType !== 'Past' && (
        <Button
          title={'Join challenge'}
          type="outline"
          leftIcon={
            <IconComponent
              type="Entypo"
              name="plus"
              size={23}
              color={Colors.orange}
            />
          }
          textStyle={styles.addChallengeButtonText}
          style={styles.addChallengeButton}
          onPress={onPress}
        />
      )}
    </View>
  );
};

export default EmptyChallenge;

const styles = StyleSheet.create({
  container: {
    height: getFontSize(20),
    width: getFontSize(47),
    borderWidth: 0.5,
    borderColor: Colors.white,
    borderRadius: getFontSize(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  addChallengeButtonText: {
    color: Colors.white,
    fontSize: getFontSize(2),
  },
  addChallengeButton: {
    // paddingVertical: getFontSize(1),
    borderRadius: getFontSize(1),
    height: getFontSize(3.9),
    marginTop: getFontSize(2.5),
    alignSelf: 'center',
    width: 'auto',
    paddingHorizontal: getFontSize(1.5),
    gap: 5,
  },
});
