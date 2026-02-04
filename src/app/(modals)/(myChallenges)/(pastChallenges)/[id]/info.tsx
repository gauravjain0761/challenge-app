import {Text, ScrollView, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors} from '@/constants/Colors';
import {useLocalSearchParams} from 'expo-router';
import {StyleSheet} from 'react-native';
import {getFontSize, getLocalDateString} from '@/utils/responsiveFn';
import IconComponent from '@/components/IconComponent';
import BasicRules from '@/components/info/BasicRules';
import InfoScreenS from '@/components/skeleton/InfoScreenS';
import CustomButton from '@/components/myChallenges/CustomButton';
import {useGetProgressLevelsQuery} from '@/api/progressChallengesApi';
import {InProgressChallengeInfoResponse} from '@/validation/schemas';
import {useGetPastInfoQuery} from '@/api/pastChallengeApi';
import WhatWhyHow from '@/components/info/WhatWhyHow';
import {GeneralStyle} from '@/constants/GeneralStyle';

export default function Info() {
  const param = useLocalSearchParams();

  const {data: challengeInfo, isLoading} = useGetPastInfoQuery({
    id: param?.id as string,
  });

  const {data: levels} = useGetProgressLevelsQuery({
    id: param?.id as string,
  });

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
          disabled={true}
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

        {/* What Why How */}
        <View style={GeneralStyle.whatWhyHowContainer}>
          <WhatWhyHow
            data={challengeDataInfo}
            isOpen={state.isWhatWhyHowOpen}
            toggleSection={() => toggleSection('whatWhyHow')}
          />
        </View>
      </ScrollView>
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
