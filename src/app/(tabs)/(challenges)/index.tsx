import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import ChallengeNavigation from './challengeNavigation';
import ExploreChallenges from '../../(modals)/(exploreChallenges)';
import MyChallenges from '../../(modals)/(myChallenges)'; // New component for my challenges
import {Colors} from '@/constants/Colors';
import {Header} from '@/components/Header';
import {router, useLocalSearchParams} from 'expo-router';
import {
  useWalkthrough,
  useWalkthroughStep,
} from 'react-native-interactive-walkthrough';
import ExploreStepOne from '@/components/WalkThroughSteps/explore/ExploreStepOne';
import {useAppSelector} from '@/hooks/reduxHooks';
import {useCompleteOnboardingMutation} from '@/api/authApi';
import {
  getAsyncExplorer,
  getAsyncToday,
} from '@/utils/common/useAsyncFunctions';
import {useIsFocused} from '@react-navigation/native';
import {CategoryFilter} from '@/types/enums';

const Challenge: React.FC = () => {
  const param = useLocalSearchParams();
  const {user, isCompletionInfoData} = useAppSelector(state => state.auth);
  const isFocused = useIsFocused();

  const [activeTab, setActiveTab] = useState<'explore' | 'myChallenges'>(
    'explore',
  );
  const {currentSteps} = useWalkthrough();

  const step1 = useWalkthroughStep({
    number: 1,
    OverlayComponent: ExploreStepOne,
  });

  useEffect(() => {
    if (param?.isJoined === 'true' || isCompletionInfoData !== null) {
      setActiveTab('myChallenges');
      router.setParams({isToday: 'false', category: ''});
    }
  }, [param?.isJoined, isFocused, isCompletionInfoData]);

  useEffect(() => {
    if (param?.isToday === 'true') {
      setActiveTab('explore');
      router.setParams({isToday: 'false', category: ''});
    }
  }, [param?.isToday]);

  const {start} = useWalkthrough();

  useEffect(() => {
    const checkWalkthrough = async () => {
      console.log('🎯 Challenges useEffect triggered 1:', {
        currentSteps: currentSteps.map(s => s.number),
        hasStep1: currentSteps.some(step => step.number === 1),
        //isFirstTimeUser: user?.isFirstTimeUser,
        userData: user ? 'exists' : 'null',
      });

      const isAsyncToday = await getAsyncToday();
      if (
        //user?.isFirstTimeUser &&
        currentSteps.length === 0 &&
        isAsyncToday !== null
      ) {
        console.log('🎯 Challenges useEffect triggered 2:', {
          currentSteps: currentSteps.map(s => s.number),
          hasStep1: currentSteps.some(step => step.number === 1),
          //isFirstTimeUser: user?.isFirstTimeUser,
          userData: user ? 'exists' : 'null',
        });

        // removeAsyncExplorer();
        onStartWalkthrough();
      }
    };
    checkWalkthrough();
  }, [currentSteps, isFocused]);

  const onStartWalkthrough = async () => {
    const isAsyncExplore = await getAsyncExplorer();
    console.log('🎯 Challenges Walkthrough Debug:', {
      isAsyncExplore,
      shouldStart: isAsyncExplore === null,
      //user: user?.isFirstTimeUser,
    });

    // Start walkthrough if user hasn't seen it before (isAsyncExplore is null)
    if (isAsyncExplore === null && !step1.isVisible) {
      console.log('🎯 Starting Today walkthrough - first time user');
      start();
    } else {
      console.log('🎯 Walkthrough already seen, skipping');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Challenges" />
      <View style={styles.tabContainer}>
        <ChallengeNavigation
          onLayout={step1.onLayout}
          activeTab={activeTab}
          onTabChange={t => {
            if (!step1.isVisible) {
              setActiveTab(t);
            }
          }}
        />
        {activeTab === 'explore' ? (
          <ExploreChallenges category={param?.category as CategoryFilter} />
        ) : (
          <MyChallenges onPressAdd={() => setActiveTab('explore')} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  tabContainer: {
    flex: 1,
    backgroundColor: Colors.black,
  },
});

export default Challenge;
