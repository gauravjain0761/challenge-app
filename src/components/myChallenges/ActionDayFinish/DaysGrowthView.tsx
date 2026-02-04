import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import RadarChartModule from '@/components/progress/RadarChartModule';
import {getFontSize} from '@/utils/responsiveFn';
import {ChallengeLevel} from '@/types/enums';
import GradientText from '@/components/GradientText';
import {Colors} from '@/constants/Colors';
import {SkipAllAction} from '@/validation/schemas';

const DaysGrowthView = ({
  days,
  finishDayData,
}: {
  days?: any;
  finishDayData: SkipAllAction;
}) => {
  const listOfValue = React.useMemo(
    () =>
      finishDayData?.categoryMetrics.map(item => ({
        category: item.category,
      })),
    [finishDayData?.categoryMetrics],
  );

  const formattedItem = React.useMemo(
    () =>
      finishDayData?.categoryMetrics.map(item => ({
        category: item.category,
        percentage: item.percentage,
        count: item.completedCount,
        totalCount: item.totalCount,
      })),
    [finishDayData?.categoryMetrics],
  );

  return (
    <View style={styles.container}>
      <GradientText
        text={`DAY ${days} GROWTH!`}
        colors={['#C05600', '#5A2800']}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1.2}}
        style={styles.headingText1}
      />
      <GradientText
        text={'The harder the challenge the greater the growth.'}
        colors={['#FFFFFF', '#555555']}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1.2}}
        style={styles.decText}
        height={getFontSize(5)}
        containerStyle={{
          width: '70%',
          alignSelf: 'center',
        }}
      />

      <RadarChartModule
        item={formattedItem}
        //  listOfValue={listOfValue}
        listOfValue={[]}
        chartSize={true}
      />
    </View>
  );
};

export default DaysGrowthView;

const styles = StyleSheet.create({
  container: {
    paddingVertical: getFontSize(0.5),
    gap: getFontSize(0.7),
    paddingHorizontal: getFontSize(0.2),
    // width: '80%',
  },
  headingText1: {
    fontSize: getFontSize(4.5),
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  decText: {
    fontSize: getFontSize(2),
    fontWeight: '500',
    color: Colors.white,
    textAlign: 'center',
  },
});
