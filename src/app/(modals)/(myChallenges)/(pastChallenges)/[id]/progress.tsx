import {ScrollView, StyleSheet, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import FailsRemaining from '@/components/myChallenges/progress/FailsRemaining';
import {useLocalSearchParams} from 'expo-router';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import {GetChallengeProgressResponse} from '@/validation/schemas';
import LevelCompletionModule from '@/components/myChallenges/progress/LevelCompletionModule';
import GoalCompletionModule from '@/components/myChallenges/progress/GoalCompletionModule';
import LevelListModule from '@/components/myChallenges/progress/LevelListModule';
import ProgressS from '@/components/skeleton/ProgressS';
import {useGetPastProgressQuery} from '@/api/pastChallengeApi';

const progress = () => {
  const param = useLocalSearchParams();

  const {data: progress, isLoading} = useGetPastProgressQuery({
    id: param.id as string,
  });

  const [progressData, setProgressData] =
    useState<GetChallengeProgressResponse>({} as GetChallengeProgressResponse);

  useEffect(() => {
    if (progress) {
      setProgressData(progress);
    }
  }, [progress]);

  if (isLoading) {
    return <ProgressS />;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}>
      <FailsRemaining item={progressData} />

      <Text style={styles.daysText}>Day’s 01 - 0{progressData.totalDays}</Text>

      <LevelCompletionModule item={progressData} />

      <GoalCompletionModule item={progressData} />

      <LevelListModule item={progressData} />
    </ScrollView>
  );
};

export default progress;

const styles = StyleSheet.create({
  container: {
    paddingBottom: getFontSize(3),
  },
  daysText: {
    color: Colors.white,
    fontSize: getFontSize(2),
    fontWeight: '600',
    paddingTop: getFontSize(3),
  },
});
