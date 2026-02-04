import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React, {memo, useMemo} from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import {Images} from '@/assets/images';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {
  GetChallengeProgressResponse,
  ProgressMetricsResponse,
} from '@/validation/schemas';
import LevelBarChart from '../myChallenges/progress/LevelBarChart';
import {DEFAULT_MULTIPLE_LEVELS} from '@/types/enums';
import {selectProfileData} from '@/features/authSlice';
import {useAppSelector} from '@/hooks/reduxHooks';

interface Props {
  item: ProgressMetricsResponse;
}

const LevelCompletion = memo(({item}: Props) => {
  const profile = useAppSelector(selectProfileData);

  const findLevelName = useMemo(
    () => DEFAULT_MULTIPLE_LEVELS?.[profile?.stats?.avgLevel || 0]?.name || '',
    [item],
  );

  return (
    <View style={styles.container}>
      <Text style={GeneralStyle.headingText}>COMPLETION</Text>
      <Text style={styles.avgText}>
        Avg Goal Completion rate{'\n'}(Last 7 Challenges)
      </Text>

      <LevelBarChart item={item as ProgressMetricsResponse} isProgress={true} />

      <View style={styles.bottomContainer}>
        <Text style={styles.challengeText}>YOUR ALL-TIME{'\n'}AVERAGE</Text>
        <ImageBackground
          source={Images.badge_bg}
          resizeMode="contain"
          style={GeneralStyle.badge}>
          <Text style={styles.levelTitle}>{findLevelName}</Text>
        </ImageBackground>
      </View>
    </View>
  );
});

export default LevelCompletion;

const styles = StyleSheet.create({
  container: {
    padding: getFontSize(2),
    borderRadius: getFontSize(1),
    backgroundColor: Colors.whiteOpacity_10,
    paddingBottom: getFontSize(3),
    paddingTop: getFontSize(2.5),
    marginTop: getFontSize(1.5),
    borderWidth: 1,
    borderColor: Colors._999999,
  },
  avgText: {
    color: Colors.white,
    fontSize: getFontSize(1.6),
    fontWeight: '400',
    paddingTop: getFontSize(0.5),
  },
  bottomContainer: {
    marginTop: getFontSize(1.5),
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
