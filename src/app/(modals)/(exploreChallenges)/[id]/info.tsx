import {Text, ScrollView, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Colors} from '@/constants/Colors';
import {router, useLocalSearchParams, useNavigation} from 'expo-router';
import {
  useGetChallengeInfoQuery,
  useGetChallengeLevelQuery,
} from '@/api/exploreApi';
import {
  GetChallengeInfoResponse,
  validateJoinChallengeData,
} from '@/validation/schemas';
import {StyleSheet} from 'react-native';
import {
  convertToLocalISOString,
  convertToUTCMidnight,
  formatDate,
  getFontSize,
  getLocalDateString,
} from '@/utils/responsiveFn';
import IconComponent from '@/components/IconComponent';
import BasicRules from '@/components/info/BasicRules';
import WhatWhyHow from '@/components/info/WhatWhyHow';
import DurationsModal from '@/components/DurationsModal';
import ReminderModal from '@/components/ReminderModal';
import LevelModal from '@/components/LevelModal';
import {
  AsyncTypes,
  ChallengeLevel,
  ChallengeMode,
  DEFAULT_MULTIPLE_LEVELS,
  MIX_PANEL_EVENTS,
} from '@/types/enums';
import Button from '@/components/Button';
import {Levels} from '@/types';
import FailsModal from '@/components/FailsModal';
import ChallengeTimer from '@/components/ChallengeTimer';
import InfoScreenS from '@/components/skeleton/InfoScreenS';
import {useJoinParticipationMutation} from '@/api/challengeParticipationApi';
import {errorToast, successToast} from '@/utils/common/commonFunction';
import moment from 'moment';
import * as challengeParticipationTypes from '@/validation/schemas/challenge-participation.schema';
import CustomButton from '@/components/myChallenges/CustomButton';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {useJoinInviteFriendMutation} from '@/api/friendApi';
import {challengeParticipationApi} from '@/api/challengeParticipationApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CompeteFriends from '@/components/info/CompeteFriends';
import InfoStepTwo from '@/components/WalkThroughSteps/exploreInfo/InfoStepTwo';
import InfoStepThree from '@/components/WalkThroughSteps/exploreInfo/InfoStepThree';
import InfoStepFour from '@/components/WalkThroughSteps/exploreInfo/InfoStepFour';
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks';
import {resetStore, store} from '@/store';
import {
  getAsyncExploreInfo,
  setAsyncExploreInfo,
  setAsyncSubscribeChallengeInfo,
} from '@/utils/common/useAsyncFunctions';
import {useCustomWalkthrough} from '@/hooks/useCustomWalkthrough';
import WalkthroughBackdrop from '@/components/WalkThrough/WalkthroughBackdrop';
import {clearToken, setIsCompletionInfoData} from '@/features/authSlice';
import {useCompleteOnboardingMutation} from '@/api/authApi';
import {challengeParticipationErrors} from '@/validation/errors';
import {trackEvent} from '@/hooks/useMixpanelClient';

export default function Info() {
  const param = useLocalSearchParams();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const scrollRef = useRef<ScrollView>(null);
  const {user, isGuestUser} = useAppSelector(state => state.auth);
  const [joinParticipation, {isLoading: joinLoading}] =
    useJoinParticipationMutation();

  const {data: challengeInfo, isLoading} = useGetChallengeInfoQuery({
    challengeId: param?.id as string,
  });

  const {data: levels} = useGetChallengeLevelQuery({
    challengeId: param?.id as string,
  });

  const [joinInviteFriend, {isLoading: joinInviteLoading}] =
    useJoinInviteFriendMutation();
  const [completeOnboarding] = useCompleteOnboardingMutation();

  const [challengeLevels, setChallengeLevels] = useState<Levels[]>([]);
  const [challengeDataInfo, setChallengeDataInfo] =
    useState<GetChallengeInfoResponse>({} as GetChallengeInfoResponse);

  const utcDate = challengeDataInfo?.basicRules?.startDate;
  const startDate = React.useMemo(
    () => utcDate && convertToLocalISOString(utcDate),
    [utcDate],
  );
  const [userChallengeId, setUserChallengeId] = useState<any>(null);
  const [isInvite, setIsInvite] = useState(false);
  // Check if user has already joined this challenge (persisted across app sessions)

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
    selectedFails: 3,
  });

  const {currentStep, isActive, steps, currentStepLayout} =
    useCustomWalkthrough({
      screenName: 'ExploreInfoSteps',
      totalSteps: 3,
      getAsyncFunction: async () => {
        const result = await getAsyncExploreInfo();
        return result === 'layout-completed' ? null : result ?? null;
      },
      setAsyncFunction: setAsyncExploreInfo,
      autoStart: false,
      delay: 500,
    });

  const [step1, step2, step3] = steps;

  useEffect(() => {
    if (challengeInfo) {
      trackEvent(MIX_PANEL_EVENTS.challenge_browsed, {
        challenge_id: challengeInfo?._id,
        challenge_name: challengeInfo?.name,
        is_worldwide:
          challengeInfo?.mode === ChallengeMode.PERSONAL ? false : true,
        is_guest: isGuestUser,
      });
    }
  }, [challengeInfo]);

  React.useEffect(() => {
    const checkStartInfoSteps = async () => {
      const result = await getAsyncExploreInfo();
      if (result === 'layout-completed' && !isActive) {
        console.log('🎯 Starting info steps after layout completion');
        step1?.start();
      }
    };

    checkStartInfoSteps();
    const interval = setInterval(checkStartInfoSteps, 200);
    return () => clearInterval(interval);
  }, [isActive, step1, steps]);

  // Store branch params in AsyncStorage when component mounts
  useEffect(() => {
    const storeBranchParams = async () => {
      if (param?.isInvite === 'true' && param?.inviteToken) {
        try {
          const branchParams = {
            isInvite: param.isInvite,
            inviteToken: param.inviteToken || '',
            id: param.id || '',
            selectedLevelIndex: param.selectedLevelIndex || null,
            challengeName: param.challengeName || '',
            challengeImage: param.challengeImage || '',
            startDate: param.startDate || new Date().toISOString(),
            targetEndDate: param.targetEndDate || '',
            daysToFail: param.daysToFail || 3,
          };

          await AsyncStorage.setItem(
            AsyncTypes.PENDING_BRANCH_LINK_FOR_INFO,
            JSON.stringify(branchParams),
          );
        } catch (error) {
          console.error('Error storing branch params:', error);
        }
      }
    };

    storeBranchParams();
  }, []);

  useEffect(() => {
    const loadStoredParams = async () => {
      if (!param?.isInvite && !param?.inviteToken) {
        try {
          const storedParams = await AsyncStorage.getItem(
            AsyncTypes.PENDING_BRANCH_LINK_FOR_INFO,
          );

          if (storedParams) {
            const parsedParams = JSON.parse(storedParams);
            // Update the route params with stored values
            router.setParams(parsedParams);
          }
        } catch (error) {
          console.error('Error loading stored branch params:', error);
        }
      }
    };

    loadStoredParams();
  }, []);

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
    if (param?.isInvite === 'true') {
      const levelName = param?.selectedLevelIndex
        ? (DEFAULT_MULTIPLE_LEVELS.find(
            (_, n) => n === Number(param?.selectedLevelIndex),
          )?.name as string)
        : 'Select your Goal';

      if (param?.deep_link_external !== 'true') {
        setIsInvite(true);
        updateState({
          selectedLevelIndex: Number(param?.selectedLevelIndex),
          selectedLevel: levelName,
          selectedDate: convertToUTCMidnight(param?.startDate as string),
        });
      }
    } else {
      setIsInvite(false);
    }
  }, [param?.isInvite]);

  useEffect(() => {
    if (challengeInfo) {
      setChallengeDataInfo(challengeInfo);
    }
  }, [challengeInfo]);

  useEffect(() => {
    if (levels) {
      setChallengeLevels(levels as Levels[]);
    }
  }, [levels]);

  const onJoin = async () => {
    try {
      let obj = {};
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (challengeInfo?.mode === ChallengeMode.GROUP) {
        obj = {
          selectedLevelIndex: state.selectedLevelIndex,
          timezone: timezone,
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
          timezone: timezone,
        };
      }

      try {
        validateJoinChallengeData({
          selectedLevelIndex: state.selectedLevelIndex,
          daysToFail: state.selectedFails,
          mode: challengeInfo?.mode as ChallengeMode,
        });
      } catch (validationError: any) {
        errorToast(validationError.message);
        return;
      }

      const response = await joinParticipation({
        challengeId: param?.id as string,
        data: obj as challengeParticipationTypes.JoinChallengeData,
      }).unwrap();

      if (response) {
        //  Mixpanel event
        trackEvent(MIX_PANEL_EVENTS.challenge_joined, {
          challenge_id: challengeInfo?._id,
          challenge_name: challengeInfo?.name,
          is_worldwide:
            challengeInfo?.mode === ChallengeMode.PERSONAL ? false : true,
          user_id: user?.id,
          joined_via_invite: false,
          difficulty: state.selectedLevel,
        });

        setUserChallengeId(response._id);
        successToast(response.message);
        await AsyncStorage.removeItem(AsyncTypes.PENDING_BRANCH_LINK_FOR_INFO);

        if (user?.isFirstTimeUser) {
          completeOnboarding({}).unwrap();
        }
        dispatch(
          setIsCompletionInfoData({
            _id: response?._id,
            challengeName: challengeInfo?.shortName ?? challengeInfo?.name,
            selectedGoal: state.selectedLevelIndex,
            image: challengeInfo?.image,
          }),
        );

        router.setParams({isJoined: 'true'});
        router.dismissTo('/(tabs)/(challenges)');
        router.push('/(modals)/challengeJoin');
        // router.dismissAll();
        // router.dismissTo('/(modals)/challengeJoin');
        // router.dismissTo('/(tabs)/(challenges)');
        // router.push('/(modals)/challengeJoin');
      }
    } catch (error: any) {
      errorToast(challengeParticipationTypes.handleChallengeApiError(error));
    }
  };

  const onJoinByInvite = async () => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response = await joinInviteFriend({
        token: param?.inviteToken as string,
        data: {
          timezone: timezone,
        },
      }).unwrap();

      if (response) {
        successToast(response.message);
        await AsyncStorage.removeItem(AsyncTypes.PENDING_BRANCH_LINK_FOR_INFO);

        // Invalidate myChallenges cache to refresh data
        store.dispatch(
          challengeParticipationApi.util.invalidateTags(['MyChallenges']),
        );

        dispatch(
          setIsCompletionInfoData({
            _id: response?.userChallenge?._id,
            challengeName: challengeInfo?.shortName ?? challengeInfo?.name,
            selectedGoal: response?.userChallenge?.selectedLevelIndex,
            image: challengeInfo?.image,
          }),
        );

        trackEvent(MIX_PANEL_EVENTS.challenge_joined, {
          challenge_id: challengeInfo?._id,
          challenge_name: challengeInfo?.name,
          is_worldwide:
            challengeInfo?.mode === ChallengeMode.PERSONAL ? false : true,
          user_id: user?.id,
          joined_via_invite: true,
          difficulty: state.selectedLevel,
        });

        if (user?.isFirstTimeUser) {
          // router.dismissTo('/(tabs)/(today)');
          router.dismissAll();
          router.push('/(modals)/challengeJoin');
        } else {
          router.dismissTo({
            pathname: '/(tabs)/(challenges)',
            params: {isJoined: 'true'},
          });
          router.push('/(modals)/challengeJoin');
        }
      }
    } catch (error: any) {
      console.log('leave error details:', error);
      errorToast(error.data?.message || error.message || 'Please try again');
    }
  };

  // Clean up stored params when component unmounts or user navigates away
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', async e => {
      // Clear stored params when navigating away from this screen
      if (param?.isInvite === 'true') {
        try {
          await AsyncStorage.removeItem(
            AsyncTypes.PENDING_BRANCH_LINK_FOR_INFO,
          );
        } catch (error) {
          console.error('Error clearing stored branch params:', error);
        }
      }
    });

    return () => {
      unsubscribe();
      // Also clear on unmount if invite was successfully processed
      if (param?.isInvite === 'true' && userChallengeId) {
        AsyncStorage.removeItem(AsyncTypes.PENDING_BRANCH_LINK_FOR_INFO).catch(
          console.error,
        );
      }
    };
  }, [navigation, param?.isInvite, userChallengeId]);

  const handleJoining = async () => {
    if (isInvite) {
      onJoinByInvite();
    } else {
      onJoin();
    }
    await setAsyncExploreInfo();
  };

  // console.log('challengeDataInfo', challengeDataInfo);

  const joinPayload = async () => {
    // here we to manage for the if the user is coming from the branch link
    console.log('joinPayload');
    let obj = {};
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (isInvite) {
      obj = {
        inviteToken: param?.inviteToken,
        isInvite: 'true',
        timezone: timezone,
      };
    } else {
      if (challengeInfo?.mode === ChallengeMode.GROUP) {
        obj = {
          selectedLevelIndex: state.selectedLevelIndex,
          timezone: timezone,
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
          timezone: timezone,
        };
      }
    }

    // Store both challengeId and data for auto-join after auth
    await setAsyncSubscribeChallengeInfo({
      challengeId: param?.id as string,
      data: obj,
      image: challengeInfo?.image,
      name: challengeInfo?.name,
    });
  };

  const goToSignUp = async () => {
    console.log('goToSignUp');
    router.dismissAll();
    router.dismissTo('/(auth)/signUp');
    dispatch(clearToken());
    await resetStore();
  };
  const goToSubscription = async () => {
    console.log('goToSubscription');
    router.push({
      pathname: '../../(profile)/subscription',
      params: {
        isSubscriptionThroughInfo: 'true',
        challengeID: challengeDataInfo?._id,
      },
    });
  };

  const onJoinButton = async () => {
    // Validate level selection first
    if (
      !Object.values(ChallengeLevel).includes(
        state.selectedLevel as ChallengeLevel,
      )
    ) {
      errorToast(challengeParticipationErrors.selectedLevelIndex);
      return;
    }

    if (isGuestUser) {
      // GUEST USER FLOW
      if (challengeDataInfo?.hasAccess === false) {
        // Premium challenge - check if guest has subscription
        console.log(
          '🔍 Guest accessing premium challenge - checking subscription...',
        );

        await joinPayload();
        await goToSubscription();
      } else {
        // Free challenge - direct auth with auto-join
        console.log('🆓 Guest accessing free challenge - proceeding to auth');
        await joinPayload();
        await goToSignUp();
      }
    } else {
      // AUTHENTICATED USER FLOW
      if (challengeDataInfo?.hasAccess === false) {
        // Premium challenge - auth user needs subscription
        console.log(
          '💳 Auth user accessing premium challenge - going to paywall',
        );
        await joinPayload();
        await goToSubscription();
      } else {
        // Free challenge OR auth user has subscription - direct join
        console.log('✅ Auth user has access - direct challenge join');
        handleJoining();
      }
    }
  };

  // Memoized render functions
  const renderButtons = useCallback(
    () => (
      <>
        <CustomButton
          onLayout={step1.onLayout}
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
          disabled={isInvite ? true : false}
          isRightIcon={isInvite ? false : true}
        />
        <CustomButton
          onLayout={step2.onLayout}
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
          disabled={isInvite ? true : false}
          isRightIcon={isInvite ? false : true}
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
        ref={scrollRef}
        style={[styles.container, GeneralStyle.layoutContainer]}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}>
        <Text style={styles.description}>{challengeDataInfo.description}</Text>

        {/* Basic Rules */}
        <BasicRules
          data={challengeDataInfo}
          isOpen={state.isRulesOpen}
          toggleSection={() => toggleSection('rules')}
        />

        <View style={styles.buttonsContainer}>
          {challengeDataInfo.mode === ChallengeMode.PERSONAL ? (
            renderButtons()
          ) : (
            <CustomButton
              onLayout={step1.onLayout}
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
          challengeType={challengeInfo?.type}
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
        {param?.isInvite !== 'true' && (
          <CompeteFriends
            onPress={() => {
              errorToast('Join the challenge first then invite your friends');
            }}
          />
        )}
      </ScrollView>
      <View style={styles.bottomContainer}>
        {startDate && <ChallengeTimer startDate={startDate} />}
        <Button
          onLayout={
            challengeDataInfo?.mode === ChallengeMode.PERSONAL
              ? step3.onLayout
              : undefined
          }
          title={
            (isInvite ? joinInviteLoading : joinLoading) ? 'Joining...' : 'Join'
          }
          style={{...styles.joinButton1, opacity: joinLoading ? 0.7 : 1}}
          onPress={async () => {
            onJoinButton();
          }}
          disabled={
            isActive && (currentStep === 1 || currentStep === 2)
              ? true
              : isInvite === true
              ? joinInviteLoading
              : joinLoading
          }
        />
      </View>

      {/* Custom Walkthrough Backdrop */}
      {currentStepLayout && (
        <WalkthroughBackdrop
          isVisible={isActive}
          highlightedArea={currentStepLayout}
          backdropColor="rgba(0, 0, 0, 0.7)"
        />
      )}

      <>
        {isActive &&
          console.log(
            'currentStepLayout:',
            JSON.stringify(currentStepLayout, null, 2),
          )}
      </>

      {/* Custom Walkthrough Overlays - InfoStepOne now handled by _layout.tsx */}
      {step1?.isVisible && currentStepLayout && (
        <InfoStepTwo
          next={() => {
            step1.next();
            // If Group mode, skip step 2 by calling step2.next() immediately
            if (challengeDataInfo?.mode === ChallengeMode.GROUP) {
              step2?.next();
            }
          }}
          previous={step1.previous}
          stop={step1.stop}
          selectedLevelIndex={state?.selectedLevelIndex ?? undefined}
          layout={currentStepLayout}
        />
      )}

      {step2?.isVisible && currentStepLayout && (
        <InfoStepThree
          next={step2.next}
          previous={step2.previous}
          layout={currentStepLayout}
        />
      )}

      {step3?.isVisible && (
        <InfoStepFour
          next={step3.next}
          previous={() => {
            step3.previous();
            // If Group mode, skip step 2 by calling step2.previous() immediately
            if (challengeDataInfo?.mode === ChallengeMode.GROUP) {
              step2?.previous();
            }
          }}
          stop={step3.stop}
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
    marginTop: getFontSize(1),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: getFontSize(1.5),
  },
  sectionTitle: {
    fontSize: getFontSize(2),
    color: Colors.white,
    fontWeight: '600',
    marginRight: getFontSize(1),
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
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    height: getFontSize(5),
    width: getFontSize(5),
    backgroundColor: Colors.containerBGColor,
    borderRadius: getFontSize(1),
    borderWidth: getFontSize(0.08),
    borderColor: Colors.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    marginTop: getFontSize(2),
  },
  buttonTextContainer: {
    marginLeft: getFontSize(1),
  },
  buttonTitle: {
    color: 'rgba(255, 255, 255, 0.60)',
    fontSize: getFontSize(1.8),
  },
  buttonSubtitle: {
    fontSize: getFontSize(1.8),
    color: Colors.white,
    fontWeight: '400',
    marginTop: getFontSize(0.3),
  },
  joinButton: {
    width: '99%',
    backgroundColor: 'transparent',
    borderColor: Colors.red,
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
    backgroundColor: Colors.containerBGColor,
    marginTop: getFontSize(2),
  },
  joinButton1: {
    width: '90%',
    backgroundColor: Colors.orange,
  },
  joinButtonText: {
    color: Colors.black,
  },
});
