import React from 'react';
import {Stack} from 'expo-router';

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}} />
      <Stack.Screen name="myChallengeDetails" options={{headerShown: false}} />
      <Stack.Screen name="leaderBoard" options={{headerShown: false}} />
      <Stack.Screen name="(scheduledChallenges)" options={{headerShown: false}} />
      <Stack.Screen name="(progressChallenges)" options={{headerShown: false}} />
      <Stack.Screen name="(pastChallenges)" options={{headerShown: false}} />
    </Stack>
  );
};

export default _layout;
