import React, {useEffect, useRef} from 'react';
import {View} from 'react-native';
import {router} from 'expo-router';
import branch, {BranchParams} from 'react-native-branch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppSelector, useAppDispatch} from '@/hooks/reduxHooks';
import {selectToken, selectUser, setIsGuestUser} from '@/features/authSlice';
import {AsyncTypes} from '@/types/enums';

export default function BranchHandler() {
  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const tokenRef = useRef(token);
  const userRef = useRef(user);

  useEffect(() => {
    tokenRef.current = token;
    userRef.current = user;
  }, [token, user]);

  useEffect(() => {
    async function handle(params: BranchParams) {
      const {'+clicked_branch_link': clicked, challenge_id, ...data} = params;

      if (clicked && challenge_id) {
        const navParams = {
          id: challenge_id as string,
          challengeItem: JSON.stringify({
            name: data.challengeName,
            image: data.challengeImage,
          }),
          inviteToken: data.invite_token as string,
          isInvite: 'true',
          selectedLevelIndex: Number(data.selectedLevelIndex),
          startDate: data.startDate as string,
          targetEndDate: data.targetEndDate as string,
          daysToFail: Number(data.daysToFail),
          deep_link_external:
            (data?.deep_link_external?.toString() as string) || null,
        };

        // Check if it's a friend invite (has invite_token) or just a challenge browse link
        const isFriendInvite = !!data.invite_token;
        const isAuthenticated = tokenRef.current && userRef.current;

        if (isFriendInvite && !isAuthenticated) {
          // Friend invite requires authentication
          await AsyncStorage.setItem(
            AsyncTypes.PENDING_BRANCH_LINK,
            JSON.stringify({
              screen: '/(modals)/(exploreChallenges)/[id]/info',
              params: navParams,
            }),
          );
          router.replace('/(auth)/logIn');
          return;
        } else {
          // Challenge browse link OR authenticated user - navigate directly
          if (!isAuthenticated) {
            // Mark as guest user for proper guest flow when joining
            dispatch(setIsGuestUser(true));
          }

          await AsyncStorage.removeItem(AsyncTypes.PENDING_BRANCH_LINK);
          router.replace({
            pathname: '/(modals)/(exploreChallenges)/[id]/info',
            params: navParams,
          });
        }
      } else {
        await AsyncStorage.multiRemove([
          AsyncTypes.HANDLED_BRANCH_ON_COLD_START,
          AsyncTypes.PENDING_BRANCH_LINK,
        ]);
        router.dismissTo('/(tabs)/(today)');
      }
    }

    (async () => {
      const initial = await branch.getLatestReferringParams();
      if (initial && initial['+clicked_branch_link']) await handle(initial);
    })();

    const unsub = branch.subscribe(({error, params}) => {
      if (!error && params && params['+clicked_branch_link']) handle(params);
    });

    return () => unsub();
  }, []);

  return <View style={{display: 'none'}} />;
}
