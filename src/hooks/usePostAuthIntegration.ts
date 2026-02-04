import {useCallback, useState} from 'react';
import Purchases from 'react-native-purchases';
import {
  getAsyncSubscribeChallengeInfo,
  removeAsyncSubscribeChallengeInfo,
  setAsyncSubscribeChallengeInfo,
} from '@/utils/common/useAsyncFunctions';
import {useJoinParticipationMutation} from '@/api/challengeParticipationApi';
import {useJoinInviteFriendMutation} from '@/api/friendApi';
import {useSyncRcCustomerIdMutation} from '@/api/authApi';
import {errorToast, successToast} from '@/utils/common/commonFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch, useAppSelector} from '@/hooks/reduxHooks';
import {store} from '@/store';
import {User} from '@/validation/schemas/auth.schema';
import {
  selectUser,
  setAutoJoinState,
  setIsCompletionInfoData,
} from '@/features/authSlice';
import {router} from 'expo-router';
import {
  AsyncTypes,
  ChallengeMode,
  DEFAULT_MULTIPLE_LEVELS,
  MIX_PANEL_EVENTS,
} from '@/types/enums';
import {trackEvent} from './useMixpanelClient';

export const usePostAuthIntegration = () => {
  const dispatch = useAppDispatch();
  const [joinParticipation] = useJoinParticipationMutation();
  const [joinInviteFriend] = useJoinInviteFriendMutation();
  const [syncRcCustomerId] = useSyncRcCustomerIdMutation();

  const user = useAppSelector(selectUser);

  /**
   * Refreshes all app data after subscription changes
   * Invalidates caches and refetches user data
   */
  const refreshAppDataAfterSubscription = useCallback(async () => {
    try {
      store.dispatch({type: 'INVALIDATE_ALL_CACHES'});

      try {
        const state = store.getState();

        if (state.exploreApi) {
          store.dispatch({type: 'exploreApi/resetApiState'});
        }

        if (state.profileApi) {
          store.dispatch({
            type: 'profileApi/resetApiState',
          });
        }
      } catch (resetError) {
        console.log('⚠️ API reset failed (non-blocking):', resetError);
      }
    } catch (error: any) {
      console.error('❌ Failed to refresh app data:', error);
    }
  }, []);

  const processQueuedChallengeJoin = useCallback(
    async (isAuth = true, retryCount = 0) => {
      const maxRetries = 3;
      const baseDelay = 1000;

      try {
        const challengeInfo = await getAsyncSubscribeChallengeInfo();

        const storedInviteParams = await AsyncStorage.getItem(
          AsyncTypes.PENDING_BRANCH_LINK_FOR_INFO,
        );

        if (challengeInfo || storedInviteParams) {
          let response: any;

          // Check if this is an invite-based join
          if (storedInviteParams || challengeInfo?.data?.isInvite === 'true') {
            const parsedParams = storedInviteParams
              ? JSON.parse(storedInviteParams)
              : challengeInfo?.data;
            if (
              parsedParams?.isInvite === 'true' &&
              parsedParams?.inviteToken
            ) {
              const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
              response = await joinInviteFriend({
                token: parsedParams.inviteToken,
                data: {
                  timezone: timezone,
                },
              }).unwrap();

              const levelName = DEFAULT_MULTIPLE_LEVELS.find(
                (_, n) =>
                  n === Number(response?.userChallenge?.selectedLevelIndex),
              )?.name as string;

              trackEvent(MIX_PANEL_EVENTS.challenge_joined, {
                challenge_id: response?.userChallenge?.challengeId,
                challenge_name: response?.userChallenge?.challengeName,
                is_worldwide:
                  response?.mode === ChallengeMode.PERSONAL ? false : true,
                user_id: user?.id,
                joined_via_invite: true,
                difficulty: levelName,
              });

              // Clean up invite-specific storage
              await AsyncStorage.removeItem(
                AsyncTypes.PENDING_BRANCH_LINK_FOR_INFO,
              );

              const challengeData = {
                _id: response?.userChallenge?._id,
                challengeName:
                  response?.userChallenge?.challengeShortName === ''
                    ? response?.userChallenge?.challengeName
                    : response?.userChallenge?.challengeShortName,
                selectedGoal: response?.userChallenge?.selectedLevelIndex,
                image: response?.userChallenge?.challengeImage,
              };
              dispatch(setIsCompletionInfoData(challengeData));

              // Small delay to ensure Redux state is updated before navigation
              await new Promise(resolve => setTimeout(resolve, 50));

              router.dismissTo({
                pathname: '/(tabs)/(today)',
              });
              router.push({
                pathname: '/(modals)/challengeJoin',
              });
            } else {
              // Regular challenge join
              response = await joinParticipation({
                challengeId: challengeInfo.challengeId,
                data: challengeInfo.data,
              }).unwrap();

              const challengeData = {
                _id: response?._id,
                challengeName:
                  response?.challengeShortName === ''
                    ? response?.challengeName
                    : response?.challengeShortName,
                selectedGoal: response?.selectedLevelIndex,
                image: challengeInfo?.image,
              };

              const levelName = DEFAULT_MULTIPLE_LEVELS.find(
                (_, n) => n === Number(response.selectedLevelIndex),
              )?.name as string;

              trackEvent(MIX_PANEL_EVENTS.challenge_joined, {
                challenge_id: response?.challengeId,
                challenge_name: response?.challengeName,
                is_worldwide:
                  response?.mode === ChallengeMode.PERSONAL ? false : true,
                user_id: user?.id,
                joined_via_invite: false,
                difficulty: levelName,
              });
              // Dispatch data FIRST before navigation
              dispatch(setIsCompletionInfoData(challengeData));

              // Small delay to ensure Redux state is updated before navigation
              await new Promise(resolve => setTimeout(resolve, 50));

              router.dismissTo({
                pathname: '/(tabs)/(challenges)',
                params: {isJoined: 'true'},
              });
              router.push({
                pathname: '/(modals)/challengeJoin',
              });
            }
          } else {
            // Regular challenge join
            response = await joinParticipation({
              challengeId: challengeInfo.challengeId,
              data: challengeInfo.data,
            }).unwrap();

            const challengeData = {
              _id: response?._id,
              challengeName:
                response?.challengeShortName === ''
                  ? response?.challengeName
                  : response?.challengeShortName,
              selectedGoal: response?.selectedLevelIndex,
              image: challengeInfo?.image,
            };

            const levelName = DEFAULT_MULTIPLE_LEVELS.find(
              (_, n) => n === Number(response.selectedLevelIndex),
            )?.name as string;

            trackEvent(MIX_PANEL_EVENTS.challenge_joined, {
              challenge_id: response?.challengeId,
              challenge_name: response?.challengeName,
              is_worldwide:
                response?.mode === ChallengeMode.PERSONAL ? false : true,
              user_id: user?.id,
              joined_via_invite: false,
              difficulty: levelName,
            });
            // Dispatch data FIRST before navigation
            dispatch(setIsCompletionInfoData(challengeData));

            // Small delay to ensure Redux state is updated before navigation
            await new Promise(resolve => setTimeout(resolve, 50));

            router.dismissTo({
              pathname: '/(tabs)/(challenges)',
              params: {isJoined: 'true'},
            });
            router.push({
              pathname: '/(modals)/challengeJoin',
            });
          }

          // Don't clear autoJoinState here - let the challengeJoin modal handle it
          // when the user presses "Done" button to prevent premature redirect
          // dispatch(setAutoJoinState(false));

          await removeAsyncSubscribeChallengeInfo();

          successToast('Challenge joined successfully');
          await refreshAppDataAfterSubscription();

          return {
            success: true,
            challengeResponse: response,
          };
        }

        dispatch(setAutoJoinState(false));
        return false;
      } catch (error: any) {
        console.error(
          `❌ Failed to auto-join challenge (attempt ${retryCount + 1}):`,
          error,
        );
        const isRetryableError = error.status === 403;

        if (isRetryableError && retryCount < maxRetries) {
          const delay = baseDelay * Math.pow(2, retryCount);
          await new Promise(resolve => setTimeout(resolve, delay));
          return processQueuedChallengeJoin(isAuth, retryCount + 1);
        }

        if (error.data?.message) {
          errorToast(error.data.message);
        } else if (error.message) {
          errorToast(error.message);
        } else {
          errorToast('Failed to join challenge. Please try again.');
        }

        await removeAsyncSubscribeChallengeInfo();
        // Also clean up invite storage on error
        await AsyncStorage.removeItem(AsyncTypes.PENDING_BRANCH_LINK_FOR_INFO);

        console.log('❌ Auto-join failed permanently');
        dispatch(setAutoJoinState(false));
        router.dismissTo('/(tabs)/(today)');

        return false;
      }
    },
    [
      joinParticipation,
      joinInviteFriend,
      refreshAppDataAfterSubscription,
      user,
    ],
  );

  const handlePostAuthIntegration = useCallback(
    async (user: User, hasPendingInvite?: string) => {
      try {
        const guestCustomerInfo = await Purchases.getCustomerInfo();
        const previousCustomerId = guestCustomerInfo.originalAppUserId;
        const hadActiveEntitlements =
          Object.keys(guestCustomerInfo.entitlements.active).length > 0;

        const {customerInfo} = await Purchases.logIn(user.id);

        if (previousCustomerId !== user.id && hadActiveEntitlements) {
          try {
            await syncRcCustomerId({
              revenueCatCustomerId: user.id,
              previousCustomerId: previousCustomerId,
            }).unwrap();

            await refreshAppDataAfterSubscription();
          } catch (reconcileError: any) {
            console.error(
              '⚠️ Reconciliation failed (non-blocking):',
              reconcileError,
            );
          }
        }

        const hasPremium = await AsyncStorage.getItem('hasPremium');
        let restoredInfo = null;

        if (hasPremium === 'true') {
          restoredInfo = await Purchases.restorePurchases();
          console.log(
            '✅ RC purchases restored - user purchased on this device',
          );
        } else {
          console.log(
            'ℹ️ No purchase flag found - skipping auto-restore (user can manually restore)',
          );
        }

        if (!(previousCustomerId !== user.id && hadActiveEntitlements)) {
          try {
            await syncRcCustomerId({
              revenueCatCustomerId: user.id,
            }).unwrap();
            console.log('✅ RC customer ID synced with backend:', user.id);
          } catch (syncError: any) {
            console.error('⚠️ RC sync failed (non-blocking):', syncError);
          }
        }

        if (!hasPendingInvite) {
          console.log('hasPendingInviteeeeeeeeeeeeeeeeeeeeeeeeeee');
          await processQueuedChallengeJoin(true);
        } else {
          dispatch(setAutoJoinState(false));
        }

        return {
          success: true,
          customerInfo,
          restoredInfo,
        };
      } catch (error: any) {
        console.error('❌ Post-auth RC integration failed:', error);

        // Always clear autoJoinState on error to prevent stuck loader
        dispatch(setAutoJoinState(false));

        if (
          error.message?.includes('network') ||
          error.message?.includes('Network')
        ) {
          errorToast('Network error. Please check your connection.');
        } else if (
          error.message?.includes('RevenueCat') ||
          error.code?.includes('RC_')
        ) {
          errorToast('Subscription sync failed. Please try again later.');
        } else {
          errorToast('Authentication sync failed. Please try again.');
        }

        return {
          success: false,
          error: error.message,
          customerInfo: null,
        };
      }
    },
    [syncRcCustomerId, processQueuedChallengeJoin],
  );

  const checkGuestSubscriptionStatus = useCallback(async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const activeEntitlements = customerInfo.entitlements.active;
      const hasActiveSubscriptions = Object.keys(activeEntitlements).length > 0;

      return {
        hasActiveSubscriptions,
        entitlements: activeEntitlements,
        customerId: customerInfo.originalAppUserId,
        subscriptions: Object.values(activeEntitlements).map(entitlement => ({
          productIdentifier: entitlement.productIdentifier,
          isActive: entitlement.isActive,
          expirationDate: entitlement.expirationDate,
        })),
      };
    } catch (error: any) {
      console.error('Failed to check guest subscription:', error);
      return {
        hasActiveSubscriptions: false,
        entitlements: {},
        customerId: null,
        subscriptions: [],
        error: error.message,
      };
    }
  }, []);

  const queueChallengeJoinForAuth = useCallback(
    async (challengeJoinData: any) => {
      try {
        await setAsyncSubscribeChallengeInfo(challengeJoinData);
        return true;
      } catch (error: any) {
        console.error('Failed to queue challenge join:', error);
        errorToast('Failed to queue challenge join. Please try again.');
        return false;
      }
    },
    [],
  );

  const smartRevenueCatLogin = useCallback(
    async (userIdOrCustomerInfo?: string) => {
      try {
        if (userIdOrCustomerInfo && typeof userIdOrCustomerInfo === 'string') {
          const {customerInfo} = await Purchases.logIn(userIdOrCustomerInfo);
          return customerInfo;
        } else {
          const customerInfo = await Purchases.getCustomerInfo();
          return customerInfo;
        }
      } catch (error: any) {
        console.error('❌ RC smart login failed:', error);
        throw error;
      }
    },
    [],
  );

  const manualRestorePurchases = useCallback(async () => {
    try {
      const restoredInfo = await Purchases.restorePurchases();

      if (Object.keys(restoredInfo.entitlements.active).length > 0) {
        await AsyncStorage.setItem('hasPremium', 'true');
        successToast('Purchases restored successfully!');
        return restoredInfo;
      } else {
        console.log('ℹ️ No purchases found to restore');
        errorToast('No purchases found to restore.');
        return null;
      }
    } catch (error: any) {
      console.error('❌ Manual restore failed:', error);
      errorToast('Failed to restore purchases. Please try again.');
      return null;
    }
  }, []);

  return {
    handlePostAuthIntegration,
    checkGuestSubscriptionStatus,
    queueChallengeJoinForAuth,
    processQueuedChallengeJoin,
    smartRevenueCatLogin,
    refreshAppDataAfterSubscription,
    manualRestorePurchases,
  };
};
