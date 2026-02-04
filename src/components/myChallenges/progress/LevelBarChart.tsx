import {Colors} from '@/constants/Colors';
import {ChallengeStatus} from '@/types/enums';
import {getFontSize} from '@/utils/responsiveFn';
import {
  GetChallengeProgressResponse,
  ProgressMetricsResponse,
} from '@/validation/schemas';
import React, {memo, useCallback} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  item: GetChallengeProgressResponse | ProgressMetricsResponse | any;
  isProgress?: boolean;
}

const LevelBarChart = ({item, isProgress = false}: Props) => {
  const findLevel = useCallback(
    (level: any, status: any): any => {
      if (isProgress) {
        if (status === ChallengeStatus.ACTIVE) {
          return level;
        } else {
          return status;
        }
      } else {
        if (level || level == 0) {
          return level === -1 ? status : item?.levels?.[level]?.name;
        } else {
          return status;
        }
      }
    },
    [item?.levels, item?.avgLevelAchievedName],
  );

  const getBarHeight = useCallback((level: any): number => {
    if (isProgress) {
      if (level === ChallengeStatus.ACTIVE) {
        return getFontSize(16);
      } else {
        return getFontSize(16 / 1.5);
      }
    } else {
      if (level || level == 0) {
        return level === -1 ? getFontSize(16 / 1.5) : getFontSize(16);
      } else {
        return getFontSize(16 / 1.5);
      }
    }
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        scrollEnabled={false}
        data={item?.dailyLevels || item?.recentChallenges || []}
        nestedScrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => `${index}-key`}
        renderItem={({item, index}) => (
          <View key={'key' + index.toString()} style={{...styles.barWrapper}}>
            <LinearGradient
              colors={['#555555', '#9C9A9A', '#555555']}
              start={{x: 0, y: 1.3}}
              end={{x: 0.5, y: 0.5}}
              style={[
                styles.bar,
                {
                  height: getBarHeight(isProgress ? item?.status : item?.level),
                },
              ]}>
              <View style={styles.view}>
                <Text style={styles.levelText}>
                  {findLevel(
                    isProgress ? item?.avgLevelAchievedName : item?.level,
                    item?.status,
                  )}
                </Text>
              </View>
            </LinearGradient>
            <Text style={styles.dayText}>
              {isProgress ? `C${index + 1}` : item.day}
            </Text>
          </View>
        )}
        horizontal
        contentContainerStyle={{
          flex: 1,
          gap: isProgress ? getFontSize(2) : undefined,
          justifyContent: isProgress ? 'flex-start' : 'space-around',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: getFontSize(1.5),
    paddingHorizontal: getFontSize(1.5),
    marginVertical: getFontSize(1.5),
  },
  barContainer: {
    gap: getFontSize(1.5),
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
  view: {
    width: getFontSize(13),
    height: getFontSize(2.6),
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

export default memo(LevelBarChart);
