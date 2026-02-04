import React, {useEffect, useState} from 'react';
import {Stack, useLocalSearchParams} from 'expo-router';
import Loader from '@/components/Loader';
import {View} from 'react-native';
import {GeneralStyle} from '@/constants/GeneralStyle';

const _layout = () => {
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (
      params?.id &&
      params?.screen === '(exploreChallenges)' &&
      !params?.__EXPO_ROUTER_key
    ) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, []);

  if (isLoading) {
    return (
      <View style={GeneralStyle.loader}>
        <Loader />
      </View>
    );
  }

  return (
    <Stack initialRouteName="(exploreChallenges)">
      <Stack.Screen name="(myChallenges)" options={{headerShown: false}} />
      <Stack.Screen name="(exploreChallenges)" options={{headerShown: false}} />
      <Stack.Screen name="(profile)" options={{headerShown: false}} />
      <Stack.Screen name="challengeJoin" options={{headerShown: false}} />
    </Stack>
  );
};

export default _layout;
