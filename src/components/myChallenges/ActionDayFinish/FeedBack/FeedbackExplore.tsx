import {FlatList, ImageBackground, StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import {useGetChallengesQuery} from '@/api/exploreApi';
import {ChallengeMode} from '@/types/enums';
import {capitalizeFirstLetter, getFontSize} from '@/utils/responsiveFn';
import {ChallengeListItem} from '@/validation/schemas';
import {Images} from '@/assets/images';
import ChallengeItem from '@/components/ChallengeItem';
import {ChallengeInfo} from '@/types';
import {Colors} from '@/constants/Colors';
import {router} from 'expo-router';

const MODE = [
  capitalizeFirstLetter(ChallengeMode.GROUP),
  capitalizeFirstLetter(ChallengeMode.PERSONAL),
];

interface ChallengesData {
  group?: ChallengeListItem[];
  personal?: ChallengeListItem[];
  [key: string]: ChallengeListItem[] | undefined; // Add index signature
}

const FeedbackExplore = ({
  onPress = () => {},
  ChallengeType,
}: {
  onPress?: () => void;
  ChallengeType?: any;
}) => {
  const {data} = useGetChallengesQuery(
    {
      category: 'all',
      limit: 100,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const getChallengesForMode = (mode: ChallengeMode): ChallengeListItem[] => {
    if (!data) return [];
    const challenges = (data as ChallengesData)[mode.toLowerCase()] || [];

    const filteredData = challenges.filter(item => {
      return item.type === ChallengeType;
    });
    return filteredData.map((challenge: any) => ({
      ...challenge,
      id: challenge._id, // important for FlatList key
      mode: mode.toLowerCase(), // force correct mode ('personal' or 'group')
    }));
  };

  const filteredMODE = useMemo(() => {
    return MODE.reduce<
      {mode: ChallengeMode; challenges: ChallengeListItem[]}[]
    >((acc, mode) => {
      const challengesForMode = getChallengesForMode(mode as ChallengeMode);
      if (challengesForMode.length > 0) {
        acc.push({mode: mode as ChallengeMode, challenges: challengesForMode});
      }
      return acc;
    }, []);
  }, [data]);

  const renderMode = ({
    item,
  }: {
    item: {mode: ChallengeMode; challenges: ChallengeInfo[]};
  }) => {
    const {mode, challenges} = item;

    return (
      <View style={styles.levelSection}>
        <View style={styles.levelHeader}>
          <ImageBackground
            source={Images.badge_bg}
            resizeMode="contain"
            style={styles.badge}>
            <Text style={styles.levelTitle}>{mode}</Text>
          </ImageBackground>
          <Text
            onPress={() => {
              onPress();
              router.push({
                pathname: '/seeAll',
                params: {
                  mode,
                  category: 'all',
                },
              });
            }}
            style={styles.seeAllText}>
            See all Challenges
          </Text>
        </View>
        <FlatList
          data={challenges.slice(0, 3)}
          keyExtractor={challenge => challenge?.id}
          renderItem={({item}) => (
            <ChallengeItem
              item={item as unknown as ChallengeListItem}
              exploreChallenge={true}
              isWidth={true}
              onPress={onPress}
              containerStyle={{
                height: getFontSize(20),
              }}
            />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.challengeList}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        EXPLORE YOUR NEXT {'\n'}CHALLENGE AND{' '}
        <Text
          style={[
            styles.heading,
            {
              color: Colors.primary,
            },
          ]}>
          LEVEL UP!
        </Text>
      </Text>
      <FlatList
        data={filteredMODE as any}
        keyExtractor={item => item.mode}
        renderItem={renderMode}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.challengeList}
        // ListEmptyComponent={isLoading ? <ExploreS /> : null}
      />
    </View>
  );
};

export default FeedbackExplore;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: Colors.black,
    marginTop: getFontSize(4),
    borderRadius: getFontSize(2),
    paddingHorizontal: getFontSize(2),
    paddingTop: getFontSize(2),
  },
  levelSection: {
    marginBottom: getFontSize(1),
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: getFontSize(1.5),
  },
  badge: {
    padding: getFontSize(1.5),
  },
  levelTitle: {
    color: 'white',
    fontSize: getFontSize(1.8),
    fontWeight: '600',
  },
  seeAllText: {
    color: Colors.white,
    fontSize: getFontSize(1.8),
    fontWeight: '600',
    opacity: 0.8,
    textDecorationLine: 'underline',
  },
  challengeList: {
    paddingBottom: getFontSize(12),
  },
  heading: {
    color: Colors.white,
    fontSize: getFontSize(2.2),
    fontWeight: '600',
    marginBottom: getFontSize(1.5),
    paddingHorizontal: getFontSize(2),
    textAlign: 'center',
  },
});
