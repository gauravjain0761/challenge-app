import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import GradientText from '@/components/GradientText';
import GoalList from './GoalList';
import {ChallengeType, multipleTypes} from '@/types/enums';

const ActionView = ({
  goalList,
  type,
}: {
  goalList?: any[] | undefined;
  type?: ChallengeType;
}) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <GradientText
        text={(type ? type.replace(/_/g, '-') : '') + ' Challenges'}
        style={styles.headingText1}
        containerStyle={{
          marginBottom: getFontSize(1),
        }}
        height={getFontSize(8)}
      />
      <GoalList data={goalList || []} />
      <Text style={styles.details}>
        {multipleTypes.includes((type as ChallengeType) || '')
          ? 'The amount of actions completed per day is used for measuring the success of Multi-Action challenges.'
          : 'The amount of reps/sets/time etc completed per day is used for measuring the success of Single-Action challenges.'}
      </Text>
    </ScrollView>
  );
};

export default ActionView;

const styles = StyleSheet.create({
  headingText1: {
    fontSize: getFontSize(3),
    fontWeight: '500',
    color: Colors.white,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  details: {
    fontSize: getFontSize(2),
    fontWeight: '400',
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.8,
    marginTop: getFontSize(3),
    letterSpacing: 0.5,
  },
});
