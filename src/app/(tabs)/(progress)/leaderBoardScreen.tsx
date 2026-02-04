import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {useGetProgressLeaderBoardQuery} from '@/api/progressChallengesApi';
import {UserLeaderboardData} from '@/validation/schemas';
import {GeneralStyle} from '@/constants/GeneralStyle';
import ActionS from '@/components/skeleton/ActionS';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import UserLeaderBoard from '@/components/myChallenges/progress/UserLeaderBoard';
import NoData from '@/components/NoData';
import EmptyState from '@/components/myChallenges/EmptyState';
import {router} from 'expo-router';

const LeaderBoardScreen = () => {
  const {data, isLoading} = useGetProgressLeaderBoardQuery({});

  const [leaderBoardData, setLeaderBoardData] = useState<UserLeaderboardData[]>(
    [],
  );
  const [currentUserData, setCurrentUserData] =
    useState<UserLeaderboardData | null>(null);

  useEffect(() => {
    if (data) {
      setLeaderBoardData(data?.top10);
      setCurrentUserData(data?.currentUser);
    }
  }, [data]);

  const renderItem = ({item, index}: {item: any; index: number}) => {
    return <UserLeaderBoard item={item} index={index} />;
  };

  const renderFooter = () => {
    return (
      <>
        {currentUserData?.position && (
          <UserLeaderBoard
            item={currentUserData}
            index={currentUserData?.position || 0}
          />
        )}
      </>
    );
  };

  return (
    <GestureHandlerRootView style={GeneralStyle.flex}>
      {isLoading && <ActionS isTrue={false} numberOfArray={6} />}

      <View style={styles.container}>
        <FlatList
          data={leaderBoardData}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          contentContainerStyle={styles.containerStyle}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={() =>
            !isLoading ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <EmptyState
                  style={{
                    marginTop: 0,
                  }}
                  onPressAdd={() => {
                    router.push({
                      pathname: '/(tabs)/(challenges)',
                      params: {isToday: 'true'},
                    });
                  }}
                  description={'Join the challenge\n to see the leaderboard'}
                  btnTitle="Join challenge"
                />
              </View>
            ) : (
              <></>
            )
          }
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default LeaderBoardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: getFontSize(1),
  },
  containerStyle: {
    flexGrow: 1,
    paddingBottom: getFontSize(15),
  },
});
