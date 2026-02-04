import React from 'react';
import {Stack} from 'expo-router';

const _layout = () => {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{headerShown: false}} />
      <Stack.Screen name="unSure" options={{headerShown: false}} />
      <Stack.Screen name="justTakeAction" options={{headerShown: false}} />
      <Stack.Screen name="(mainPersonalExp)" options={{headerShown: false}} />
      <Stack.Screen name="(alcoholPE)" options={{headerShown: false}} />
      <Stack.Screen name="(fitnessPE)" options={{headerShown: false}} />
      <Stack.Screen name="(mindsetPE)" options={{headerShown: false}} />
      <Stack.Screen name="(monyPE)" options={{headerShown: false}} />
      <Stack.Screen name="(nutritionPE)" options={{headerShown: false}} />
      <Stack.Screen name="(relationShipPE)" options={{headerShown: false}} />
    </Stack>
  );
};

export default _layout;
