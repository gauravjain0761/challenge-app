import React, {memo, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ViewStyle,
  ListRenderItem,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '@/constants/Colors';
import {ChallengeType} from '@/types/enums';
import {getFontSize} from '@/utils/responsiveFn';
import {GetChallengeProgressResponse} from '@/validation/schemas';

interface Props {
  item: GetChallengeProgressResponse;
}

const GoalBarChart = ({item}: Props) => {
  const isLevelBased = useMemo(() => {
    return (
      item?.challengeType === ChallengeType.SINGLE ||
      item?.challengeType === ChallengeType.SINGLE_MAXOUT
    );
  }, [item?.challengeType]);

  const tasksForSelectedDay = useMemo(() => {
    return isLevelBased
      ? item?.dailyCompletion ?? []
      : item?.dayCompletions ?? [];
  }, [isLevelBased, item]);

  const maxCompletionCount = useMemo(() => {
    return tasksForSelectedDay.length
      ? Math.max(
          ...tasksForSelectedDay.map(
            (d: any) => d.completionCount ?? d.completed ?? 0,
          ),
        )
      : 0;
  }, [tasksForSelectedDay]);

  const maxBarHeight = getFontSize(16);
  const minBarHeight = getFontSize(4);

  const getBarHeight = useCallback(
    (completionCount: number = 0): number => {
      if (!completionCount || maxCompletionCount === 0) return minBarHeight;
      return (completionCount / maxCompletionCount) * maxBarHeight;
    },
    [maxCompletionCount, maxBarHeight],
  );

  const renderItem: ListRenderItem<(typeof tasksForSelectedDay)[number]> =
    useCallback(
      ({item: dayItem, index}: {item: any; index: number}) => {
        const count = dayItem?.completionCount ?? dayItem?.completed ?? '0';

        return (
          <View key={index.toString()} style={styles.barWrapper}>
            <LinearGradient
              colors={['#555555', '#9C9A9A', '#555555']}
              start={{x: 0, y: 1.3}}
              end={{x: 0.5, y: 0.5}}
              style={[styles.bar, {height: getBarHeight(count)}]}>
              <View style={styles.labelContainer}>
                <Text style={styles.levelText}>
                  {isLevelBased ? count : count + '/' + (dayItem?.total ?? 0)}
                </Text>
              </View>
            </LinearGradient>
            <Text style={styles.dayText}>{dayItem.day}</Text>
          </View>
        );
      },
      [getBarHeight, isLevelBased],
    );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.yAxis}>
          {[100, 75, 50, 25, 0].map(pct => (
            <Text key={pct} style={styles.yAxisLabel}>
              {pct}%
            </Text>
          ))}
        </View>
        <FlatList
          data={tasksForSelectedDay}
          horizontal
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.barContainer}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: getFontSize(3),
    marginVertical: getFontSize(1),
  },
  row: {
    flexDirection: 'row',
    gap: getFontSize(2),
  },
  yAxis: {
    justifyContent: 'space-between',
    width: getFontSize(5),
    height: getFontSize(16),
  },
  yAxisLabel: {
    color: Colors.white,
    fontSize: getFontSize(1.6),
    opacity: 0.6,
    textAlign: 'right',
  },
  barContainer: {
    // gap: getFontSize(1.5),
    flex: 1,
    justifyContent: 'space-around',
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: getFontSize(3.3),
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: Colors.orange,
  },
  labelContainer: {
    width: getFontSize(10),
    height: getFontSize(3),
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{rotate: '-90deg'}],
  },
  levelText: {
    color: Colors.white,
    fontSize: getFontSize(1.8),
    textTransform: 'capitalize',
  },
  dayText: {
    color: Colors.white,
    fontSize: getFontSize(1.4),
    marginTop: getFontSize(0.8),
    opacity: 0.5,
    textTransform: 'capitalize',
  },
});

export default memo(GoalBarChart);
