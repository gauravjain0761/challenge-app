import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Button from '@/components/Button';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import IconComponent from '@/components/IconComponent';
import {
  useGetFriendParticipantsQuery,
  useInviteFriendMutation,
} from '@/api/friendApi';
import {useLocalSearchParams} from 'expo-router';
import {ITEMS_PER_PAGE} from '@/utils/constants/api';
import {ParticipantList} from '@/validation/schemas';
import LeaderBoardItem from '@/components/myChallenges/leaderboard/LeaderBoardItem';
import FriendItem from '@/components/myChallenges/leaderboard/FriendItem';
import Loader from '@/components/Loader';
import branch from 'react-native-branch';
import * as Linking from 'expo-linking';
import ActionS from '@/components/skeleton/ActionS';
import {trackEvent} from '@/hooks/useMixpanelClient';
import {MIX_PANEL_EVENTS} from '@/types/enums';
import {useAppSelector} from '@/hooks/reduxHooks';

const friends = () => {
  const param = useLocalSearchParams();
  const [offset, setOffset] = useState(0);
  const {user} = useAppSelector(state => state.auth);

  const [inviteFriend, {isLoading: inviteLoading}] = useInviteFriendMutation();

  const {
    data: friendParticipants,
    isLoading,
    isFetching,
  } = useGetFriendParticipantsQuery({
    id: param?.id as string,
    query: {
      limit: 30,
      offset: offset,
    },
  });

  const [participantData, setParticipantData] = useState<ParticipantList[]>([]);

  useEffect(() => {
    if (friendParticipants?.participants) {
      const participants = friendParticipants?.participants;
      setParticipantData(participants);
    }
  }, [friendParticipants?.participants]);

  const loadMore = () => {
    const pagination = friendParticipants?.limit;

    if (!isFetching && pagination?.hasMore) {
      setOffset(prev => prev + 30);
    }
  };

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

        console.log('queryParams', queryParams);

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

  const renderFooter = () => {
    // Only show loader if we're fetching AND there are more items to load
    if (!isFetching || !friendParticipants?.limit?.hasMore) return null;

    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={Colors.orange} size="small" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Button
        onPress={onInvite}
        title="Invite friends"
        style={styles.inviteButton}
        type="outline"
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

      {!isLoading && participantData.length > 0 && (
        <View style={styles.participantsContainer}>
          {isLoading ? (
            <ActionS isTrue={false} numberOfArray={3} />
          ) : (
            <FlatList
              data={participantData}
              renderItem={({item, index}) => {
                return <FriendItem item={item} index={index} />;
              }}
              keyExtractor={item => item.name}
              contentContainerStyle={styles.containerStyle}
              onEndReached={loadMore}
              onEndReachedThreshold={0.2}
              ListFooterComponent={renderFooter}
            />
          )}
        </View>
      )}
      {inviteLoading && <Loader />}
    </View>
  );
};

export default friends;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

  participantsContainer: {
    backgroundColor: Colors.textInputBackground,
    borderRadius: getFontSize(1),
    padding: getFontSize(2),
    marginHorizontal: getFontSize(1),
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },

  containerStyle: {
    gap: getFontSize(2),
  },
  loaderContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: getFontSize(1),
  },
});
