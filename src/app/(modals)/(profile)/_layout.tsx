import React from 'react';
import {Stack} from 'expo-router';

const _layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="helpScreen" />
      <Stack.Screen name="menToolDetailsScreen" />
      <Stack.Screen name="subscription" />
      <Stack.Screen name="profileSetting" />
      <Stack.Screen name="manageChallenges" />
      <Stack.Screen name="friendsRequest" />
      <Stack.Screen name="notification" />
      <Stack.Screen name="webScreen" />
      <Stack.Screen name="closeAccount" />
      <Stack.Screen name="feedbackFeaturebase" />
      <Stack.Screen name="freeSubscription" />
    </Stack>
  );
};

export default _layout;
