import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import FailsRemaining from '@/components/myChallenges/progress/FailsRemaining';
import {useLocalSearchParams} from 'expo-router';
import {useGetProgressQuery} from '@/api/progressChallengesApi';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import {GetChallengeProgressResponse} from '@/validation/schemas';
import LevelCompletionModule from '@/components/myChallenges/progress/LevelCompletionModule';
import GoalCompletionModule from '@/components/myChallenges/progress/GoalCompletionModule';
import LevelListModule from '@/components/myChallenges/progress/LevelListModule';
import ProgressS from '@/components/skeleton/ProgressS';
import RadarChartModule from '@/components/progress/RadarChartModule';
import {MIX_PANEL_EVENTS} from '@/types/enums';
import {trackEvent} from '@/hooks/useMixpanelClient';
import {useAppSelector} from '@/hooks/reduxHooks';
import {selectUser} from '@/features/authSlice';

const progress = () => {
  const param = useLocalSearchParams();
  const user = useAppSelector(selectUser);

  const {data: progress, isLoading} = useGetProgressQuery({
    id: param.id as string,
  });

  const [progressData, setProgressData] =
    useState<GetChallengeProgressResponse>({} as GetChallengeProgressResponse);

  useEffect(() => {
    if (progress) {
      setProgressData(progress);

      const findLevel = progress?.levels?.[progress?.avgLevel];
      // Mixpanel Event
      trackEvent(MIX_PANEL_EVENTS.progress_viewed, {
        challenge_id: progress?.challengeId,
        challenge_name: progress?.challengeName,
        user_id: user?.id,
        challenge_avg: findLevel?.name,
      });
    }
  }, [progress]);

  if (isLoading) {
    return <ProgressS />;
  }
  const formattedItem =
    progressData?.categoryMetrics && progressData?.categoryMetrics?.length > 0
      ? progressData?.categoryMetrics?.map(item => ({
          category: item.category,
          percentage: item.percentage,
          count: item.completedCount,
          totalCount: item.totalCount,
        }))
      : [];

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.headerText}>YOUR GROWTH</Text>
      <RadarChartModule item={formattedItem} listOfValue={[]} />

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
  headerText: {
    color: Colors.white,
    fontSize: getFontSize(2.2),
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
