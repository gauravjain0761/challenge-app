import React, {useEffect, useState} from 'react';
import {Redirect} from 'expo-router';
import {useAuth} from '@/hooks/useAuth';
import {AsyncTypes} from '@/types/enums';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '@/components/Loader';
import {useAppSelector} from '@/hooks/reduxHooks';
import {selectAutoJoinState} from '@/features/authSlice';

export default function Index() {
  const {isInitialized, hasValidSession} = useAuth();
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<
    boolean | null
  >(null);
  const autoJoinState = useAppSelector(selectAutoJoinState);
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const completed = await AsyncStorage.getItem(
          AsyncTypes.ONBOARDING_COMPLETED,
        );
        setIsOnboardingCompleted(completed === 'true');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setIsOnboardingCompleted(false);
      }
    };
    checkOnboardingStatus();
  }, []);

  if (!isInitialized || isOnboardingCompleted === null) return null;

  if (autoJoinState) {
    return <Loader isAutoJoining={true} />;
  }

  if (hasValidSession && !autoJoinState) {
    return <Redirect href="/(tabs)/(today)" />;
  }

  if (isOnboardingCompleted) {
    return <Redirect href="/(auth)/logIn" />;
  } else {
    return <Redirect href="/(auth)/(onBoardingFlow)/" />;
  }
}
