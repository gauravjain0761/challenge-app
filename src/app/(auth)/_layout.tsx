import React from 'react';
import {Redirect, Stack} from 'expo-router';
import {useAuth} from '@/hooks/useAuth';
import {useAppSelector} from '@/hooks/reduxHooks';
import {selectAutoJoinState} from '@/features/authSlice';
import Loader from '@/components/Loader';
const _layout = () => {
  const {isInitialized, hasValidSession} = useAuth();
  const autoJoinState = useAppSelector(selectAutoJoinState);

  if (!isInitialized) return null;

  if (autoJoinState) {
    return <Loader isAutoJoining={true} />;
  }

  if (hasValidSession && !autoJoinState) {
    return <Redirect href="/(tabs)/(today)" />;
  }
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      {/* <Stack.Screen name="onBoarding" /> */}
      <Stack.Screen name="logIn" />
      <Stack.Screen name="signUp" />
      <Stack.Screen name="forgotPassword" />
      <Stack.Screen name="verifyOtp" />
      <Stack.Screen name="resetPassword" />
      <Stack.Screen name="(onBoardingFlow)" />
    </Stack>
  );
};

export default _layout;
