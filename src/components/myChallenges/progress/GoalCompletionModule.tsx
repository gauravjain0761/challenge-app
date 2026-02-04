import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import {Images} from '@/assets/images';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {GetChallengeProgressResponse} from '@/validation/schemas';
import GoalBarChart from './GoalBarChart';
import {ChallengeType} from '@/types/enums';

interface Props {
  item: GetChallengeProgressResponse;
}

const GoalCompletionModule = memo(({item}: Props) => {
  const findLevel = React.useMemo(() => {
    return item?.levels?.[1];
  }, [item?.levels, item?.avgLevel]);

  const isMultiple = React.useMemo(() => {
    return (
      item?.challengeType === ChallengeType.MULTIPLE ||
      item?.challengeType === ChallengeType.MULTIPLE_MAXOUT ||
      item?.challengeType === ChallengeType.MULTIPLE_VARIANT ||
      item?.challengeType === ChallengeType.MULTIPLE_MAXOUT_VARIANT
    );
  }, [item?.challengeType]);

  return (
    <View style={styles.container}>
      <Text style={GeneralStyle.headingText}>COMPLETION</Text>
      <Text style={styles.avgText}>Avg Goal Completion rate</Text>

      <GoalBarChart item={item} />

      <View style={styles.bottomContainer}>
        <Text style={styles.challengeText}>YOUR CHALLENGE{'\n'}AVERAGE</Text>
        <ImageBackground
          source={Images.badge_bg}
          resizeMode="contain"
          style={GeneralStyle.badge}>
          <Text style={styles.levelTitle}>
            {isMultiple
              ? item?.challengeAvg?.completed +
                '/' +
                item?.challengeAvg?.total +
                ' ' +
                'ACTIONS'
              : (item?.avgCompletion || 0) + ' ' + findLevel?.goal?.unit}
          </Text>
        </ImageBackground>
      </View>
    </View>
  );
});

export default GoalCompletionModule;

const styles = StyleSheet.create({
  container: {
    padding: getFontSize(2),
    borderRadius: getFontSize(1),
    backgroundColor: Colors._1A1A1A,
    paddingBottom: getFontSize(3),
    paddingTop: getFontSize(2.5),
    marginTop: getFontSize(3),
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  avgText: {
    color: Colors.white,
    fontSize: getFontSize(1.6),
    fontWeight: '400',
    paddingTop: getFontSize(0.5),
  },
  bottomContainer: {
    marginTop: getFontSize(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: getFontSize(1),
    backgroundColor: Colors._2a2a2a,
    padding: getFontSize(2),
  },
  challengeText: {
    color: Colors.orange,
    fontSize: getFontSize(1.9),
    fontWeight: '600',
    opacity: 0.6,
    textAlign: 'center',
  },
  levelTitle: {
    color: Colors.white,
    fontSize: getFontSize(2.2),
    fontWeight: '500',
  },
});
