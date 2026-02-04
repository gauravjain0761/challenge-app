import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import {Levels} from '@/types';
import {
  useGetChallengeInfoQuery,
  useGetChallengeLevelQuery,
} from '@/api/exploreApi';
import {useLocalSearchParams} from 'expo-router';
import LevelsList from '@/components/myChallenges/LevelsList';
import {GeneralStyle} from '@/constants/GeneralStyle';
import FastImage from 'react-native-fast-image';
import {Images} from '@/assets/images';
import GoalModal from '@/components/Explore/GoalModal/GoalModal';

const levels = () => {
  const param = useLocalSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const {data: levels} = useGetChallengeLevelQuery({
    challengeId: param?.id as string,
  });
  const {data: challengeInfo} = useGetChallengeInfoQuery({
    challengeId: param?.id as string,
  });

  const [challengeLevels, setChallengeLevels] = useState<Levels[]>([]);

  useEffect(() => {
    if (levels) {
      setChallengeLevels(levels as Levels[]);
    }
  }, [levels]);

  return (
    <View style={GeneralStyle.layoutContainer}>
      <TouchableOpacity onPress={() => setIsVisible(true)}>
        <FastImage
          source={Images.info_Icon}
          resizeMode="contain"
          style={styles.image}
        />
      </TouchableOpacity>
      <LevelsList levelList={challengeLevels} />

      {isVisible && (
        <GoalModal
          visible={isVisible}
          onClose={() => setIsVisible(false)}
          goalList={challengeLevels}
          type={challengeInfo?.type}
        />
      )}
    </View>
  );
};

export default levels;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: getFontSize(3),
    alignSelf: 'flex-end',
    width: getFontSize(3),
  },
});
