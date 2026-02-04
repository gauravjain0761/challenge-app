import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {useLocalSearchParams} from 'expo-router';
import {
  useGetProgressActionsQuery,
  useGetProgressInfoQuery,
  useGetProgressLevelsQuery,
  useLazyGetFriendLeaderBoardQuery,
  useLazyGetLeaderBoardQuery,
} from '@/api/progressChallengesApi';
import {LeaderboardEntry} from '@/validation/schemas';
import LeaderBoardItem from '@/components/myChallenges/leaderboard/LeaderBoardItem';
import ActionS from '@/components/skeleton/ActionS';
import CustomSwitch from '@/components/CommonSwitch';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import {errorToast, successToast} from '@/utils/common/commonFunction';
import {
  useFriendRequestMutation,
  useInviteFriendMutation,
  useSedFriendNudgesMutation,
} from '@/api/friendApi';
import Loader from '@/components/Loader';
import Button from '@/components/Button';
import IconComponent from '@/components/IconComponent';
import branch from 'react-native-branch';
import * as Linking from 'expo-linking';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import {Images} from '@/assets/images';
import LeaderBoardInfoModal from '@/components/InfoModals/LeaderBoardInfoModal';
import {trackEvent} from '@/hooks/useMixpanelClient';
import {MIX_PANEL_EVENTS} from '@/types/enums';
import {useAppSelector} from '@/hooks/reduxHooks';

const ITEMS_PER_PAGE = 30;

const Leaderboard = () => {
  const param: any = useLocalSearchParams();
  const {user} = useAppSelector(state => state.auth);

  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    [],
  );
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(
    null,
  );
  const [showFriend, setShowFriend] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const offsetRef = useRef(0); // ✅ no UI re-render
  const senderIdRef = useRef<string>(); // ✅ no UI re-render
  const levelUnitRef = useRef<string | null>(null); // ✅ no UI re-render

  const {data: levels} = useGetProgressLevelsQuery({id: param?.id as string});

  const [inviteFriend, {isLoading: inviteLoading}] = useInviteFriendMutation();

  const {data: challengeActions} = useGetProgressActionsQuery({
    day: 'day1',
    id: param?.id,
  });

  const [triggerGetLeaderboard, {data: leaderboard, isLoading}] =
    useLazyGetLeaderBoardQuery();

  const [
    triggerGetFriendLeaderboard,
    {data: friendLeaderboard, isLoading: friendIsLoading},
  ] = useLazyGetFriendLeaderBoardQuery();

  const [friendRequest, {isLoading: friendRequestLoading}] =
    useFriendRequestMutation();
  const [sedFriendNudges, {isLoading: friendNudgeLoading}] =
    useSedFriendNudgesMutation();

  // ✅ Combine setup logic in one effect
  useEffect(() => {
    if (
      param?.encodedItem &&
      JSON.stringify(param?.encodedItem) !== '"[object Object]"'
    ) {
      try {
        const newItem = JSON.parse(param.encodedItem);
        senderIdRef.current = newItem?.senderId;
      } catch (error) {
        console.error('Error parsing encodedItem:', error);
      }
    }

    if (levels?.levels?.[0]?.goal?.unit) {
      levelUnitRef.current = levels.levels[0].goal.unit;
    }
  }, [param?.encodedItem, levels]);

  // ✅ Fetch leaderboard
  const fetchLeaderboard = useCallback(async () => {
    const payload = {
      id: param.id as string,
      query: {limit: ITEMS_PER_PAGE, offset: offsetRef.current},
    };
    const trigger = showFriend
      ? triggerGetFriendLeaderboard
      : triggerGetLeaderboard;
    await trigger(payload);
  }, [
    param?.id,
    showFriend,
    triggerGetFriendLeaderboard,
    triggerGetLeaderboard,
  ]);

  // ✅ Reset and load on toggle or param change
  useEffect(() => {
    if (!param?.id) return;
    offsetRef.current = 0;
    fetchLeaderboard();
  }, [param?.id, showFriend, fetchLeaderboard]);

  // ✅ Merge new data
  useEffect(() => {
    const data = showFriend
      ? friendLeaderboard?.data?.leaderboard || []
      : leaderboard?.data?.leaderboard || [];

    if (data.length > 0) {
      setLeaderboardData(prev =>
        offsetRef.current === 0 ? data : [...prev, ...data],
      );
    }
  }, [
    leaderboard?.data?.leaderboard,
    friendLeaderboard?.data?.leaderboard,
    showFriend,
  ]);

  // ✅ Pagination
  const loadMore = useCallback(() => {
    const pagination = showFriend
      ? friendLeaderboard?.data?.pagination
      : leaderboard?.data?.pagination;

    if (!(isLoading || friendIsLoading) && pagination?.hasMore) {
      offsetRef.current += ITEMS_PER_PAGE;
      fetchLeaderboard();
    }
  }, [
    isLoading,
    friendIsLoading,
    showFriend,
    leaderboard,
    friendLeaderboard,
    fetchLeaderboard,
  ]);

  // ✅ Handlers
  const handleToggleFriend = useCallback(() => {
    setLeaderboardData([]);
    setShowFriend(prev => !prev);
  }, []);

  const onAddFriend = useCallback(async () => {
    if (!selectedUser) return;
    try {
      const obj = {
        receiverId: selectedUser.user._id,
        message: 'lets connect',
        source: 'leaderboard',
      };
      const {message} = await friendRequest(obj).unwrap();
      setSelectedUser(null);
      successToast(message);
    } catch (error: any) {
      setSelectedUser(null);
      errorToast(error.data?.message || error.message || 'Please try again');
    }
  }, [selectedUser, friendRequest]);

  const onPressNudges = useCallback(async () => {
    if (!selectedUser) return;
    try {
      const obj = {
        friendId: selectedUser.user._id,
        userChallengeId: selectedUser.userChallengeId,
      };
      const {message} = await sedFriendNudges(obj).unwrap();
      setSelectedUser(null);
      successToast(message);
    } catch (error: any) {
      setSelectedUser(null);
      errorToast(error.data?.message || error.message || 'Please try again');
    }
  }, [selectedUser, sedFriendNudges]);

  const renderItem = useCallback(
    ({item, index}: {item: LeaderboardEntry; index: number}) => (
      <LeaderBoardItem
        item={item}
        index={index}
        onPressDots={setSelectedUser}
        selectedUser={selectedUser}
        onPressAdd={onAddFriend}
        onPressNudges={onPressNudges}
        senderId={senderIdRef.current as string}
        selectedLevelUnit={levelUnitRef.current}
      />
    ),
    [selectedUser, onAddFriend, onPressNudges],
  );

  const onInvite = async () => {
    try {
      const response = await inviteFriend({
        id: param?.id as string,
      }).unwrap();

      if (response) {
        const challenge = response?.inviteData?.challengeData;
        const token = response?.inviteData?.token;
        const parsed = Linking.parse(response?.inviteData?.links?.universal);
        const {queryParams}: any = parsed;

        const buo = await branch.createBranchUniversalObject(
          `invite/${queryParams?.invite}`,
          {
            title: `Join "${queryParams.challengeName}" on MenTools!`,
            contentDescription: `You're invited to join the "${queryParams.challengeName}" challenge on MenTools.`,
            canonicalUrl: 'https://invite.mentoolschallenges.co',
            contentImageUrl: queryParams.challengeImage,
            contentMetadata: {
              customMetadata: {
                invite_token: queryParams?.invite,
                challenge_id: queryParams.challengeId,
                challengeName: queryParams?.challengeName,
                challengeImage: queryParams?.challengeImage,
                startDate: challenge?.startDate || '',
                targetEndDate: challenge?.targetEndDate || '',
                selectedLevelIndex: response?.inviteData?.challengeData
                  ?.selectedLevelIndex as any,
                daysToFail: response?.inviteData?.challengeData
                  ?.daysToFail as any,
              },
            },
          },
        );
        trackEvent(MIX_PANEL_EVENTS.challenge_invite_sent, {
          user_id: user?.id,
          challenge_id: queryParams.challengeId,
          challenge_name: queryParams.challengeName,
          invite_method: 'challenge_invite',
        });

        await buo.showShareSheet({});
      }
    } catch (error: any) {
      console.log('leave error details:', error);
      // errorToast(challengeParticipationTypes.handleChallengeApiError(error));
    }
  };

  const isToday = moment((challengeActions?.actionDay?.date as string) || '')
    .startOf('day')
    .isSame(moment().startOf('day'));
  console.log('isToday', isToday);

  if ((isLoading || friendIsLoading) && leaderboardData.length === 0) {
    return <ActionS isTrue={false} numberOfArray={6} />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setIsVisible(true)}>
        <FastImage
          source={Images.info_Icon}
          resizeMode="contain"
          style={styles.image}
        />
      </TouchableOpacity>
      <FlatList
        data={leaderboardData}
        renderItem={renderItem}
        keyExtractor={item => item.user._id.toString()}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        contentContainerStyle={styles.containerStyle}
        initialNumToRender={10}
        windowSize={10}
        removeClippedSubviews
      />

      {isToday && (
        <Button
          title="Invite friends"
          type="outline"
          onPress={onInvite}
          style={styles.inviteButton}
          textStyle={styles.inviteButtonText}
          leftIcon={
            <IconComponent
              type="Feather"
              name="users"
              size={getFontSize(3)}
              color={Colors.white}
            />
          }
        />
      )}
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Show Friends Only</Text>
        <CustomSwitch
          onToggleSwitch={handleToggleFriend}
          isToggleOn={showFriend}
        />
      </View>
      {(friendRequestLoading || friendNudgeLoading || inviteLoading) && (
        <Loader />
      )}

      {isVisible && (
        <LeaderBoardInfoModal
          visible={isVisible}
          onClose={() => setIsVisible(false)}
        />
      )}
    </View>
  );
};

export default Leaderboard;

const styles = StyleSheet.create({
  container: {flex: 1},
  containerStyle: {gap: getFontSize(2)},
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: getFontSize(2),
    marginBottom: Platform.OS === 'ios' ? getFontSize(5) : getFontSize(3),
    marginRight: getFontSize(2),
  },
  switchText: {
    color: Colors.white,
    fontSize: getFontSize(1.8),
    fontWeight: '400',
    opacity: 0.6,
  },
  inviteButton: {
    backgroundColor: Colors.textInputBackground,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    width: '95%',
    alignSelf: 'center',
  },
  inviteButtonText: {
    color: Colors.orange,
    marginLeft: getFontSize(1),
  },

  image: {
    height: getFontSize(3),
    alignSelf: 'flex-end',
    width: getFontSize(3),
    marginBottom: getFontSize(2),
  },
});
