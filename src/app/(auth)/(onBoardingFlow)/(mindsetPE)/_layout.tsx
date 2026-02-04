import React from 'react';
import {Stack} from 'expo-router';

const _layout = () => {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{headerShown: false}} />
      <Stack.Screen name="info1" options={{headerShown: false}} />
      <Stack.Screen name="info2" options={{headerShown: false}} />
      <Stack.Screen name="info3" options={{headerShown: false}} />
      <Stack.Screen name="info4" options={{headerShown: false}} />
      <Stack.Screen name="info5" options={{headerShown: false}} />
      <Stack.Screen name="info6" options={{headerShown: false}} />
      <Stack.Screen name="info7" options={{headerShown: false}} />
    </Stack>
  );
};

export default _layout;
