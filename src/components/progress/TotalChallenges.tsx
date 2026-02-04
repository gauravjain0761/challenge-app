import {StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import ProgressBar from '../myChallenges/ProgressBar';
import GradientText from '../GradientText';
import LinearGradient from 'react-native-linear-gradient';

const ChallengeNumber = ({title, number}: {title: string; number: number}) => {
  return (
    <LinearGradient
      colors={[Colors.primary, Colors.primary, Colors.black]} // gradient border colors
      start={{x: 0.1, y: 0}}
      end={{x: 0.9, y: 0}}
      style={styles.gradientBorder}>
      <View style={styles.innerContainer}>
        <Text style={styles.number}>{number || 0}</Text>
        <Text style={styles.status}>{title}</Text>
      </View>
    </LinearGradient>
  );
};

type Props = {
  item: any;
  title: string;
  type: string;
};
const TotalChallenges = ({item, title, type}: Props) => {
  //  Get average
  const avgChallenge =
    (item?.totalStarted ?? 0) > 0
      ? (
          ((item?.totalCompleted ?? 0) / (item?.totalStarted ?? 0)) *
          100
        ).toFixed(0) || 0
      : 0;

  return (
    <View style={styles.container}>
      <GradientText
        text={title}
        style={styles.headingText}
        height={getFontSize(5)}
      />

      <View style={styles.detailsView}>
        <ChallengeNumber title="Started" number={item?.totalStarted } />
        <ChallengeNumber title="Completed" number={item?.totalCompleted} />
        <ChallengeNumber title="Failed" number={item?.totalFailed} />
      </View>

      <View style={styles.barView}>
        <ProgressBar
          totalDays={100}
          currentDay={Number(avgChallenge) || 0}
          customWidth={1.2}
          title={
            avgChallenge +
            '%' +
            ' AVG ' +
            type.toLocaleUpperCase() +
            ' COMPLETION'
          }
        />
      </View>
    </View>
  );
};

export default memo(TotalChallenges);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.whiteOpacity_10,
    borderWidth: 1,
    borderColor: Colors._999999,
    borderRadius: getFontSize(1),
    padding: getFontSize(2),
    marginVertical: getFontSize(2),
  },
  detailsView: {
    paddingHorizontal: getFontSize(2),
    gap: getFontSize(2),
  },
  headingText: {
    color: Colors.white,
    fontSize: getFontSize(2.5),
    fontWeight: 'bold',
    textAlign: 'center',
  },

  number: {
    color: Colors.white,
    fontSize: getFontSize(3.2),
    fontWeight: '700',
  },
  status: {
    color: Colors.white,
    fontSize: getFontSize(1.9),
    fontWeight: '400',
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  barView: {
    marginTop: getFontSize(2),
  },

  gradientBorder: {
    borderRadius: getFontSize(3.2),
    paddingHorizontal: 1, // space for border
    width: '100%',
    justifyContent: 'center',
    height: getFontSize(5.6),
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#222', // inner background
    borderRadius: getFontSize(3.2),
    paddingHorizontal: getFontSize(5),
    height: getFontSize(5.3),
  },
});
