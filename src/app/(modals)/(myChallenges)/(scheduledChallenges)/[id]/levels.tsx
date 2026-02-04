import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Levels} from '@/types';
import {useLocalSearchParams} from 'expo-router';
import LevelsList from '@/components/myChallenges/LevelsList';
import {useGetScheduleLevelsQuery} from '@/api/scheduledChallengesApi';

const levels = () => {
  const param = useLocalSearchParams();

  const {data: levels} = useGetScheduleLevelsQuery({
    params: {
      id: param?.id as string,
    },
  });

  const [challengeLevels, setChallengeLevels] = useState<Levels[]>([]);
  const [selectedLevelIndex, setSelectedLevelIndex] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (levels) {
      setChallengeLevels(levels.levels as Levels[]);
      setSelectedLevelIndex(levels.selectedLevelIndex as number);
    }
  }, [levels]);

  return (
    <View style={styles.container}>
      <LevelsList
        levelList={challengeLevels}
        selectedLevelIndex={selectedLevelIndex as number}
      />
    </View>
  );
};

export default levels;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
