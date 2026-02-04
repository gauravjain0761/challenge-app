import {Text, ScrollView, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors} from '@/constants/Colors';
import {useLocalSearchParams} from 'expo-router';
import {StyleSheet} from 'react-native';
import {getFontSize, getLocalDateString} from '@/utils/responsiveFn';
import IconComponent from '@/components/IconComponent';
import BasicRules from '@/components/info/BasicRules';
import WhatWhyHow from '@/components/info/WhatWhyHow';
import CompeteFriends from '@/components/info/CompeteFriends';
import ReminderModal from '@/components/ReminderModal';
import Button from '@/components/Button';
import InfoScreenS from '@/components/skeleton/InfoScreenS';
import CustomButton from '@/components/myChallenges/CustomButton';
import {useLeaveParticipationMutation} from '@/api/challengeParticipationApi';
import {errorToast, successToast} from '@/utils/common/commonFunction';
import * as challengeParticipationTypes from '@/validation/schemas/challenge-participation.schema';
import LeaveChallengeModal from '@/components/myChallenges/LeaveChallengeModal';
import {router} from 'expo-router';
import {
  useGetProgressInfoQuery,
  useGetProgressLevelsQuery,
  useGetRemindersQuery,
  useRemoveReminderMutation,
  useUpdateRemindersMutation,
} from '@/api/progressChallengesApi';
import {InProgressChallengeInfoResponse} from '@/validation/schemas';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {TimeReminder} from '@/types';
import {trackEvent} from '@/hooks/useMixpanelClient';
import {MIX_PANEL_EVENTS} from '@/types/enums';
import {useAppSelector} from '@/hooks/reduxHooks';
import {selectUser} from '@/features/authSlice';

export default function Info() {
  const param = useLocalSearchParams();

  const [leaveParticipation, {isLoading: leaveLoading}] =
    useLeaveParticipationMutation();
  const user = useAppSelector(selectUser);

  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const {data: challengeInfo, isLoading} = useGetProgressInfoQuery({
    id: param?.id as string,
  });

  const {data: levels} = useGetProgressLevelsQuery({
    id: param?.id as string,
  });

  const {
    data: gerReminderData,
    isLoading: reminderLoading,
    refetch: refetchReminders,
  } = useGetRemindersQuery({
    id: param?.id as string,
  });
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [updateReminders, {isLoading: updateRemindersLoading}] =
    useUpdateRemindersMutation();

  const [removeReminder, {isLoading: removeReminderLoading}] =
    useRemoveReminderMutation();

  const [challengeDataInfo, setChallengeDataInfo] =
    useState<InProgressChallengeInfoResponse>(
      {} as InProgressChallengeInfoResponse,
    );

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

      updateState({
        selectedFails: challengeInfo.daysToFail as number | undefined,
        selectedDuration: (challengeInfo.totalDays as number) || 7,
      });
    }
  }, [challengeInfo]);

  useEffect(() => {
    if (levels) {
      const selectedLevel = levels?.levels[levels?.selectedLevelIndex];
      updateState({
        selectedLevelIndex: levels?.selectedLevelIndex as number,

        selectedLevel: selectedLevel?.name as string,
      });
    }
  }, [levels]);

  const onLeave = async () => {
    setShowLeaveModal(false);
    try {
      const response = await leaveParticipation({
        challengeId: param?.id as string,
      }).unwrap();
      if (response) {
        successToast(response.message);
        router.dismissTo('/(tabs)/(challenges)');
        router.setParams({isJoined: 'true'});
      }
    } catch (error: any) {
      console.log('leave error details:', error);
      errorToast(challengeParticipationTypes.handleChallengeApiError(error));
    }
  };

  const onUpdateReminders = async (reminderTimes: any) => {
    try {
      const filteredReminders = reminderTimes;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const response = await updateReminders({
        id: param?.id as string,
        data: {
          timezone: timezone,
          reminderTimes: filteredReminders,
        },
      }).unwrap();
      if (response) {
        trackEvent(MIX_PANEL_EVENTS.reminder_set, {
          challenge_id: challengeInfo?.challengeId,
          reminder_time: filteredReminders.join(','),
          user_id: user?.id,
        });
        refetchReminders();
        successToast(response.message);
        setIsSuccess(true);
      }
    } catch (error: any) {
      console.log('leave error details:', error);
      setIsSuccess(false);
      setError(error?.data?.message);
      errorToast(challengeParticipationTypes.handleChallengeApiError(error));
    }
  };

  const onRemoveReminder = async (reminderTime: string) => {
    try {
      const response = await removeReminder({
        id: param?.id as string,
        reminderTime: reminderTime,
      });
      if (response) {
        refetchReminders();
        successToast(
          response?.data?.message || 'Reminder deleted successfully',
        );
        setIsSuccess(true);
      }
    } catch (error: any) {
      setIsSuccess(false);
      setError(error?.data?.message);
      errorToast(challengeParticipationTypes.handleChallengeApiError(error));
      console.log('remove reminder error details:', error);
    }
  };

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
          isRightIcon={false}
        />

        <CustomButton
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
        />
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
          isLive={true}
        />

        <View style={styles.buttonsContainer}>{renderButtons()}</View>

        <ReminderModal
          reminderList={
            gerReminderData?.reminderSettings?.reminderTimes as any[]
          }
          visible={state.reminderVisible}
          onClose={() => updateState({reminderVisible: false})}
          onUpdateReminders={onUpdateReminders}
          onRemoveReminder={(reminderTime: string) =>
            onRemoveReminder(reminderTime)
          }
          error={error}
          setError={() => {
            setIsSuccess(false);
            setError(null);
          }}
          isSuccess={isSuccess}
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
        {/* <CompeteFriends /> */}

        <View style={styles.bottomContainer}>
          <Button
            title={'Leave this Challenge'}
            type="outline"
            style={styles.leaveButton}
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
          isLoading={leaveLoading}
        />
      )}
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
    // marginTop: getFontSize(1),
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

  leaveButton: {
    width: '93%',
    backgroundColor: 'transparent',
    borderColor: Colors.red,
    marginVertical: 0,
    alignSelf: 'center',
  },

  bottomContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: getFontSize(2),
    marginTop: getFontSize(2),
    marginBottom: getFontSize(2),
    backgroundColor: Colors.textInputBackground,
    borderWidth: getFontSize(0.08),
    borderColor: Colors.borderColor,
    borderRadius: getFontSize(1),
  },
});
