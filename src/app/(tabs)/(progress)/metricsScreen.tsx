import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  useLazyGetProgressMatrixActionsQuery,
  useLazyGetProgressMatrixChallengesQuery,
} from '@/api/progressChallengesApi';
import TotalChallenges from '@/components/progress/TotalChallenges';
import {CategoryProgress} from '@/validation/schemas';
import LevelCompletion from '@/components/progress/LevelCompletion';
import {getFontSize} from '@/utils/responsiveFn';
import RadarChartModule from '@/components/progress/RadarChartModule';
import MetricsS from '@/components/skeleton/MetricsS';
import {Colors} from '@/constants/Colors';
import {Entypo} from '@expo/vector-icons';
import {useIsFocused} from '@react-navigation/native';

const LIST = [
  {id: '1', title: 'TOTAL CHALLENGES'},
  {id: '2', title: 'TOTAL ACTIONS'},
];

const MetricsScreen = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const isFocused = useIsFocused();
  const [
    triggerChallenge,
    {data: challengeData, isLoading: challengeLoading, isError: challengeError},
  ] = useLazyGetProgressMatrixChallengesQuery();

  console.log('challengeData', JSON.stringify(challengeData, null, 2));

  const [
    triggerAction,
    {data: actionData, isLoading: actionLoading, isError: actionError},
  ] = useLazyGetProgressMatrixActionsQuery();

  console.log('actionData', JSON.stringify(actionData, null, 2));


  const [progress, setProgress] = useState<any>(null);

  // Fetch when tab changes
  useEffect(() => {
    if (currentIndex === 0) {
      triggerChallenge({});
    } else {
      triggerAction({});
    }
  }, [currentIndex, isFocused]);

  // Update local state when API returns data
  useEffect(() => {
    const challenge = challengeData?.data;
    const action = actionData?.data;

    if (currentIndex === 0 && challenge) {
      setProgress({
        categoryProgress: challenge.challengeCategoryProgress || [],
        recentChallenges: challenge.recentChallenges || [],
        completionStats: challenge.challengeStats || {
          totalStarted: 0,
          totalCompleted: 0,
          totalFailed: 0,
        },
        overallLevel: challenge.overallLevel || {
          levelName: 'Beginner',
          levelIndex: 0,
        },
      });
    } else if (currentIndex === 1 && action) {
      setProgress({
        categoryProgress: action.actionCategoryProgress || [],
        recentChallenges: [],
        completionStats: action.actionStats || {
          totalStarted: 0,
          totalCompleted: 0,
          totalFailed: 0,
        },
        overallLevel: action.overallLevel || {
          levelName: 'Beginner',
          levelIndex: 0,
        },
      });
    }
  }, [currentIndex, challengeData, actionData]);

  const handleNext = () => {
    if (currentIndex < LIST.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const isLoading = challengeLoading || actionLoading;
  const isError = challengeError || actionError;

  // if (isLoading || !progress) {
  //   return <MetricsS />;
  // }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Failed to load metrics. Please try again.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.headerView}>
          {currentIndex > 0 ? (
            <Entypo
              name="chevron-left"
              size={getFontSize(3)}
              color={Colors.primary}
              onPress={handlePrev}
            />
          ) : (
            <View style={{width: getFontSize(3)}} />
          )}

          <Text style={styles.headingTex}>{LIST[currentIndex]?.title}</Text>

          {currentIndex < LIST.length - 1 ? (
            <Entypo
              name="chevron-right"
              size={getFontSize(3)}
              color={Colors.primary}
              onPress={handleNext}
            />
          ) : (
            <View style={{width: getFontSize(3)}} />
          )}
        </View>

        {/* If loading OR no progress yet */}
        {isLoading ? (
          <MetricsS />
        ) : (
          <>
            {/* Radar Chart */}
            <RadarChartModule
              item={(progress?.categoryProgress as CategoryProgress) || []}
              listOfValue={[]}
            />

            {/* Total Challenges / Actions */}
            <TotalChallenges
              item={progress?.completionStats}
              title={LIST[currentIndex]?.title}
              type={currentIndex === 0 ? 'challenge' : 'action'}
            />

            {/* Level Completion (only for challenges) */}
            {currentIndex === 0 && <LevelCompletion item={progress} />}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default MetricsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: getFontSize(2),
  },
  contentContainer: {
    paddingBottom: getFontSize(15),
    paddingTop: getFontSize(2),
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: getFontSize(1),
    borderWidth: 1,
    borderColor: Colors.borderColor,
    paddingVertical: getFontSize(1),
    borderRadius: getFontSize(1.5),
    backgroundColor: Colors._0d0d0d,
  },
  headingTex: {
    fontSize: getFontSize(2.3),
    fontWeight: 'bold',
    color: Colors.white,
    flex: 1,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.red,
    fontSize: getFontSize(2),
  },
});
