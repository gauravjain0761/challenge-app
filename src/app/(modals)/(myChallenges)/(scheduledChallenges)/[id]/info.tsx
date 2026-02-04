import {Text, ScrollView, TouchableOpacity, View, Share} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Colors} from '@/constants/Colors';
import {useLocalSearchParams} from 'expo-router';
import {ScheduledChallengeInfoResponse} from '@/validation/schemas/scheduled-challenge.schema';
import {StyleSheet} from 'react-native';
import {
  convertToLocalISOString,
  convertToUTCMidnight,
  convertUTCToLocalDate,
  formatDate,
  getFontSize,
  getLocalDateString,
} from '@/utils/responsiveFn';
import IconComponent from '@/components/IconComponent';
import BasicRules from '@/components/info/BasicRules';
import WhatWhyHow from '@/components/info/WhatWhyHow';
import CompeteFriends from '@/components/info/CompeteFriends';
import DurationsModal from '@/components/DurationsModal';
import ReminderModal from '@/components/ReminderModal';
import LevelModal from '@/components/LevelModal';
import {ChallengeMode, MIX_PANEL_EVENTS, ROLE} from '@/types/enums';
import Button from '@/components/Button';
import {Levels} from '@/types';
import FailsModal from '@/components/FailsModal';
import ChallengeTimer from '@/components/ChallengeTimer';
import InfoScreenS from '@/components/skeleton/InfoScreenS';
import CustomButton from '@/components/myChallenges/CustomButton';
import {
  useGetScheduleInfoQuery,
  useGetScheduleLevelsQuery,
} from '@/api/scheduledChallengesApi';
import {
  useLeaveParticipationMutation,
  useUpdateParticipationMutation,
} from '@/api/challengeParticipationApi';
import moment from 'moment';
import {errorToast, successToast} from '@/utils/common/commonFunction';
import * as challengeParticipationTypes from '@/validation/schemas/challenge-participation.schema';
import {useNavigation} from '@react-navigation/native';
import LeaveChallengeModal from '@/components/myChallenges/LeaveChallengeModal';
import UpdateChallengeModal from '@/components/myChallenges/UpdateChallengeModal';
import {set} from 'zod';
import {router} from 'expo-router';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {useInviteFriendMutation} from '@/api/friendApi';
import InviteModal from '@/components/InviteModal';
import Loader from '@/components/Loader';
import branch from 'react-native-branch';
import * as Linking from 'expo-linking';
import {trackEvent} from '@/hooks/useMixpanelClient';
import {useAppSelector} from '@/hooks/reduxHooks';

export default function Info() {
  const param = useLocalSearchParams();
  const [updateParticipation, {isLoading: updateLoading}] =
    useUpdateParticipationMutation();
  const {user} = useAppSelector(state => state.auth);

  const [leaveParticipation, {isLoading: leaveLoading}] =
    useLeaveParticipationMutation();

  const [inviteFriend, {isLoading: inviteLoading}] = useInviteFriendMutation();

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const {data: challengeInfo, isLoading} = useGetScheduleInfoQuery(
    {
      params: {
        id: param?.id as string,
      },
    },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const {data: levels} = useGetScheduleLevelsQuery(
    {
      params: {
        id: param?.id as string,
      },
    },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const [challengeLevels, setChallengeLevels] = useState<Levels[]>([]);

  const [challengeDataInfo, setChallengeDataInfo] =
    useState<ScheduledChallengeInfoResponse>(
      {} as ScheduledChallengeInfoResponse,
    );

  const utcDate = challengeDataInfo?.startDate as string;
  const startDate = React.useMemo(
    () => utcDate && convertToLocalISOString(utcDate),
    [utcDate],
  );

  const [originalValues, setOriginalValues] = useState({
    selectedLevelIndex: null as number | null,
    selectedFails: undefined as number | undefined,
    selectedDuration: 7,
    selectedDate: '',
  });

  const [state, setState] = useState({
    isRulesOpen: true,
    isWhatWhyHowOpen: true,
    durationsVisible: false,
    reminderVisible: false,
    levelVisible: false,
    selectedLevelIndex: null as number | null,
    selectedDuration: 7,
    selectedDate: getLocalDateString(),
    selectedEndDate: getLocalDateString(),
    selectedLevel: 'Select your Goal',
    failsVisible: false,
    selectedFails: undefined as number | undefined,
  });

  // Memoized state update function
  const updateState = useCallback((updates: Partial<typeof state>) => {
    setState(prev => ({...prev, ...updates}));
  }, []);

  // Memoized section toggle function
  const toggleSection = useCallback((section: 'rules' | 'whatWhyHow') => {
    setState(prev => ({
      ...prev,
      [section === 'rules' ? 'isRulesOpen' : 'isWhatWhyHowOpen']:
        !prev[section === 'rules' ? 'isRulesOpen' : 'isWhatWhyHowOpen'],
    }));
  }, []);

  useEffect(() => {
    if (challengeInfo) {
      setChallengeDataInfo(challengeInfo);

      const localDate = convertUTCToLocalDate(
        challengeInfo.startDate as string,
      );

      updateState({
        selectedDate: localDate,
        selectedFails: challengeInfo.daysToFail as number | undefined,
        selectedDuration: (challengeInfo.totalDays as number) || 7,
      });

      setOriginalValues(prev => ({
        ...prev,
        selectedFails: challengeInfo.daysToFail,
        selectedDuration: challengeInfo.totalDays || 7,
        selectedDate: localDate,
      }));
    }
  }, [challengeInfo]);

  useEffect(() => {
    if (levels) {
      const selectedLevel = levels?.levels[levels?.selectedLevelIndex];
      setChallengeLevels(levels.levels as Levels[]);
      updateState({
        selectedLevelIndex: levels.selectedLevelIndex as number,

        selectedLevel: selectedLevel?.name as string,
      });
      setOriginalValues(prev => ({
        ...prev,
        selectedLevelIndex: levels.selectedLevelIndex,
      }));
    }
  }, [levels]);

  const onUpdate = async () => {
    setShowUpdateModal(false);
    try {
      let obj: any = {};
      if (challengeInfo?.mode === ChallengeMode.GROUP) {
        obj = {
          selectedLevelIndex: state.selectedLevelIndex,
        };
      } else {
        obj = {
          selectedLevelIndex: state.selectedLevelIndex,
          startDate: convertToUTCMidnight(state.selectedDate),
          targetEndDate: convertToUTCMidnight(
            moment(state.selectedDate)
              .add(state.selectedDuration - 1, 'days')
              .format('YYYY-MM-DD'),
          ),
          daysToFail: state.selectedFails,
        };

        if (challengeInfo?.role === ROLE.MEMBER) {
          delete obj['targetEndDate'];
          delete obj['daysToFail'];
          delete obj['startDate'];
        }
      }

      const response = await updateParticipation({
        challengeId: param?.id as string,
        data: obj as challengeParticipationTypes.JoinChallengeData,
      }).unwrap();

      if (response) {
        successToast(response.message);

        router.dismissTo('/(tabs)/(challenges)');
        router.setParams({isJoined: 'true'});
      }
    } catch (error: any) {
      console.log('join error details:', error);
      errorToast(challengeParticipationTypes.handleChallengeApiError(error));
    }
  };

  const onLeave = async () => {
    setShowLeaveModal(false);
    try {
      const response = await leaveParticipation({
        challengeId: param?.id as string,
      }).unwrap();
      if (response) {
        successToast(response.message);
        router.back();
      }
    } catch (error: any) {
      console.log('leave error details:', error);
      errorToast(challengeParticipationTypes.handleChallengeApiError(error));
    }
  };
  const onInvite = async () => {
    try {
      const response = await inviteFriend({
        id: param?.id as string,
      }).unwrap();
      console.log('response', response);

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

  const hasChanges = useMemo(() => {
    return (
      state.selectedLevelIndex !== originalValues.selectedLevelIndex ||
      state.selectedFails !== originalValues.selectedFails ||
      state.selectedDuration !== originalValues.selectedDuration ||
      state.selectedDate !== originalValues.selectedDate
    );
  }, [state, originalValues]);

  // Memoized render functions
  const renderButtons = useCallback(
    () => (
      <>
        <CustomButton
          icon={
            <IconComponent
              name="chess-pawn"
              size={getFontSize(2.5)}
              color={Colors.white}
              type="MaterialCommunityIcons"
            />
          }
          title="Goal"
          subtitle={state.selectedLevel}
          onPress={() => updateState({levelVisible: true})}
        />
        {/* <CustomButton
          icon={
            <IconComponent
              name="close"
              size={getFontSize(3)}
              color={Colors.white}
              type="AntDesign"
            />
          }
          title="Fails"
          subtitle={
            state.selectedFails === undefined
              ? `Select the amount of fails`
              : `${state.selectedFails} Fails`
          }
          onPress={() => updateState({failsVisible: true})}
        /> */}
        {challengeInfo?.role !== ROLE.MEMBER && (
          <CustomButton
            icon={
              <IconComponent
                name="arrowright"
                size={getFontSize(3)}
                color={Colors.white}
                type="AntDesign"
              />
            }
            title="Start Date"
            subtitle={`${formatDate(state.selectedDate)} (${
              state.selectedDuration
            } ${state.selectedDuration > 1 ? 'days' : 'day'})`}
            onPress={() => updateState({durationsVisible: true})}
          />
        )}
        {/* <CustomButton
          icon={
            <IconComponent
              name="notifications-active"
              size={getFontSize(2.5)}
              color={Colors.white}
              type="MaterialIcons"
            />
          }
          title="Reminder"
          subtitle="Set a reminder"
          onPress={() => updateState({reminderVisible: true})}
        /> */}
      </>
    ),
    [
      state.selectedLevel,
      state.selectedDate,
      state.selectedDuration,
      state.selectedFails,
      updateState,
    ],
  );

  if (isLoading) {
    return <InfoScreenS />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}>
        <Text style={styles.description}>{challengeDataInfo.description}</Text>

        {/* Basic Rules */}

        <BasicRules
          data={challengeDataInfo}
          isOpen={state.isRulesOpen}
          toggleSection={() => toggleSection('rules')}
          isLive={false}
        />

        <View style={styles.buttonsContainer}>
          {challengeDataInfo.mode === ChallengeMode.PERSONAL ? (
            renderButtons()
          ) : (
            <CustomButton
              icon={
                <IconComponent
                  type="MaterialCommunityIcons"
                  name="chess-pawn"
                  size={getFontSize(2.5)}
                  color={Colors.white}
                />
              }
              title="Goal"
              subtitle={state.selectedLevel}
              onPress={() => updateState({levelVisible: true})}
            />
          )}
        </View>

        <DurationsModal
          visible={state.durationsVisible}
          onClose={() => updateState({durationsVisible: false})}
          selectedDuration={state.selectedDuration}
          onSelectDuration={duration =>
            updateState({selectedDuration: duration})
          }
          selectedDate={state.selectedDate}
          onSelectDate={date => {
            updateState({selectedDate: date});
          }}
        />

        <ReminderModal
          visible={state.reminderVisible}
          onClose={() => updateState({reminderVisible: false})}
        />

        <LevelModal
          visible={state.levelVisible}
          onClose={() => updateState({levelVisible: false})}
          selectedLevel={state.selectedLevel}
          onSelectLevel={selectedLevel => {
            const index = challengeLevels.findIndex(
              level => level.name === selectedLevel,
            );
            updateState({
              selectedLevel: selectedLevel,
              selectedLevelIndex: index !== -1 ? index : null,
            });
          }}
          levels={challengeLevels}
        />

        <FailsModal
          visible={state.failsVisible}
          onClose={() => updateState({failsVisible: false})}
          selectedFail={state.selectedFails}
          onSelectFails={fail => updateState({selectedFails: fail})}
        />

        {/* What Why How */}
        <View style={GeneralStyle.whatWhyHowContainer}>
          <WhatWhyHow
            data={challengeDataInfo}
            isOpen={state.isWhatWhyHowOpen}
            toggleSection={() => toggleSection('whatWhyHow')}
          />
        </View>

        {/* Compete with friends */}
        <CompeteFriends onPress={onInvite} />
        <View style={styles.bottomContainer}>
          {startDate && (
            <ChallengeTimer
              startDate={startDate}
              title={'Challenge Starts'}
              description=""
            />
          )}
          <Button
            title={updateLoading ? 'Updating...' : 'Update'}
            style={{
              ...styles.joinButton1,
              opacity: !hasChanges || updateLoading ? 0.5 : 1,
            }}
            onPress={() => setShowUpdateModal(true)}
            disabled={!hasChanges || updateLoading}
          />
          <Button
            title={'Leave this Challenge'}
            textStyle={{
              color: Colors.white,
            }}
            type="outline"
            style={styles.joinButton}
            onPress={() => setShowLeaveModal(true)}
          />
        </View>
      </ScrollView>

      {/*  Leave Modal */}
      {showLeaveModal && (
        <LeaveChallengeModal
          visible={showLeaveModal}
          onClose={() => setShowLeaveModal(false)}
          onConfirm={() => onLeave()}
        />
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <UpdateChallengeModal
          visible={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          onConfirm={onUpdate}
        />
      )}

      {inviteLoading && <Loader />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  description: {
    fontSize: getFontSize(1.8),
    color: Colors.white,
    // marginVertical: getFontSize(1),
    lineHeight: getFontSize(2.4),
    //marginTop: getFontSize(1),
  },

  button: {
    backgroundColor: Colors.textInputBackground,
    padding: getFontSize(1.5),
    borderRadius: getFontSize(1),
    marginBottom: getFontSize(1.5),
    borderWidth: getFontSize(0.08),
    borderColor: Colors.borderColor,
    height: getFontSize(8),
  },

  buttonsContainer: {
    marginTop: getFontSize(2),
  },

  joinButton: {
    width: '93%',
    backgroundColor: 'transparent',
    borderColor: Colors.red,
    marginVertical: 0,
    alignSelf: 'center',
  },
  whatWhyHowContainer: {
    borderWidth: 0.5,
    borderColor: Colors.borderColor,
    paddingHorizontal: getFontSize(1.5),
    borderRadius: getFontSize(1),
    marginTop: getFontSize(3),
  },
  bottomContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: getFontSize(2),
    marginTop: getFontSize(2),
    marginBottom: getFontSize(2),
    backgroundColor: Colors.textInputBackground,
    borderWidth: getFontSize(0.08),
    borderColor: Colors.borderColor,
    borderRadius: getFontSize(1),
  },
  joinButton1: {
    width: '93%',
    backgroundColor: Colors.orange,
    alignSelf: 'center',
  },
  joinButtonText: {
    color: Colors.black,
  },
});
