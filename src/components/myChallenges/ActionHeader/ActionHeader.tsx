import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {getFontSize, SCREEN_WIDTH} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import GoalView from './GoalView';
import {
  ChallengeType,
  MIX_PANEL_EVENTS,
  multipleTypes,
  singleTypes,
} from '@/types/enums';
import {LevelsItem} from '@/types';
import WhyView from './WhyView';
import CompletionView from './CompletionView';
import {
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import LevelUpAnimation from '../LevelUpAnimation';
import PreChallengeView from './PreChallengeView';
import {isUndefined} from 'lodash';
import {trackEvent} from '@/hooks/useMixpanelClient';
import {useAppSelector} from '@/hooks/reduxHooks';
import {selectUser} from '@/features/authSlice';

type Props = {
  type: ChallengeType;
  challengeActions: any;
  isEdit?: boolean;
  isUpdate?: boolean;
  onUpdateChange?: () => void;
};

const ActionHeader = ({
  type,
  challengeActions,
  isEdit = true,
  isUpdate,
  onUpdateChange = () => {},
}: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const user = useAppSelector(selectUser);

  const selectedActionCount = challengeActions?.selectedActionCount || 0;
  const [isVisible, setIsVisible] = useState(false);

  const completedActionCount = challengeActions?.completedActionCount || 0;

  const levels = challengeActions?.actionDay?.levels as LevelsItem[];

  const levelIndex = multipleTypes.includes(type)
    ? challengeActions.completedActionCount > 0
      ? challengeActions.completedActionCount - 1
      : challengeActions?.actionDay?.selectedLevelIndex || 0
    : !isUndefined(challengeActions?.actionDay?.actions[0]?.completedLevelIndex)
    ? challengeActions?.actionDay?.actions[0]?.completedLevelIndex
    : challengeActions?.actionDay?.actions[0]?.selectedLevelIndex;

  const completionCount =
    challengeActions?.actionDay?.actions[0]?.completionCount || 0;

  const selectedCompletionCount =
    challengeActions?.actionDay?.actions[0]?.selectedCompletionCount || 0;

  const selectedCompletionUnit =
    challengeActions?.actionDay?.actions[0]?.selectedCompletionUnit || '';

  const selectedLevelIndex =
    challengeActions?.actionDay?.actions[0]?.selectedLevelIndex || 0;

  const completedLevelIndex =
    challengeActions?.actionDay?.actions[0]?.completedLevelIndex || 0;

  const findLevelName = useMemo(
    () => levels.length > 0 && levels?.[levelIndex].name,
    [levels, levelIndex],
  );

  useEffect(() => {
    let timeoutId: number | null = null;

    if (!isEdit) return;

    if (
      ((singleTypes.includes(type) &&
        selectedLevelIndex <= completedLevelIndex) ||
        (multipleTypes.includes(type) &&
          completedActionCount >= selectedActionCount)) &&
      isUpdate
    ) {
      trackEvent(MIX_PANEL_EVENTS.goal_hit, {
        challenge_id: challengeActions?.challengeId,
        challenge_name: challengeActions?.challengeName,
        total_days: 7,
        // completed_days:'',
        // completion_date:'',
        user_id: user?.id,
      });

      setIsVisible(true);
      timeoutId = window.setTimeout(() => setIsVisible(false), 3000);
      offset.value = withSequence(
        withTiming(-10, {duration: 200}),
        withTiming(10, {duration: 200}),
        withTiming(-10, {duration: 200}),
        withTiming(10, {duration: 200}),
        withTiming(-10, {duration: 200}),
        withTiming(10, {duration: 200}),
        withTiming(-10, {duration: 200}),
        withTiming(10, {duration: 200}),
        withTiming(0, {duration: 200}),
      );
      onUpdateChange();
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [
    completionCount,
    selectedCompletionCount,
    completedActionCount,
    selectedActionCount,
    selectedLevelIndex,
    completedLevelIndex,
  ]);

  const offset = useSharedValue(0);

  const getDay = parseInt(
    (
      (challengeActions?.actionDay?.day &&
        (challengeActions?.actionDay?.day as string)) ||
      ''
    ).replace(/\D/g, ''),
    10,
  );

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={[...Array(4)]}
        pagingEnabled
        horizontal
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        onScroll={event => {
          const offsetX = event.nativeEvent.contentOffset.x;
          const newIndex = Math.round(offsetX / SCREEN_WIDTH);
          setCurrentIndex(newIndex);
        }}
        renderItem={({index}) => {
          return (
            <View style={styles.listView}>
              {index === 0 && (
                <GoalView
                  challengeName={
                    challengeActions?.challengeShortName ||
                    challengeActions?.challengeName ||
                    ''
                  }
                  goalName={(findLevelName as string) || ''}
                  total={
                    multipleTypes.includes(type)
                      ? selectedActionCount
                      : selectedCompletionCount
                  }
                  remaining={
                    multipleTypes.includes(type)
                      ? completedActionCount
                      : completionCount
                  }
                />
              )}
              {index === 1 && (
                <PreChallengeView
                  challengeName={
                    challengeActions?.challengeShortName ||
                    challengeActions?.challengeName ||
                    ''
                  }
                  total={10}
                  remaining={challengeActions?.preRating || 0}
                />
              )}

              {index === 2 && <WhyView why={challengeActions?.userWhy || ''} />}

              {index === 3 && <CompletionView day={getDay} />}
            </View>
          );
        }}
      />
      {isVisible && (
        <LevelUpAnimation
          isGoalHit={
            singleTypes.includes(type)
              ? selectedLevelIndex === completedLevelIndex
              : selectedActionCount === completedActionCount
          }
        />
      )}
      <View style={styles.dotContainer}>
        {[...Array(4)].map((_, ind) => (
          <View
            key={ind.toString()}
            style={[
              styles.dot,
              {
                ...(ind === currentIndex
                  ? {backgroundColor: Colors.orange}
                  : {}),
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default ActionHeader;

const styles = StyleSheet.create({
  mainContainer: {
    alignSelf: 'center',
    width: SCREEN_WIDTH - getFontSize(2),
    marginBottom: getFontSize(1.5),
  },
  listView: {
    width: SCREEN_WIDTH - getFontSize(2),
    paddingHorizontal: getFontSize(1),
  },
  container: {
    paddingTop: getFontSize(1.5),
    paddingBottom: getFontSize(1.5),
    backgroundColor: Colors.textInputBackground,
    borderRadius: 8,
    borderWidth: 0.9,
    borderColor: Colors.borderColor,

    paddingHorizontal: getFontSize(1.5),
    paddingVertical: getFontSize(0.5),
  },

  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: getFontSize(1),
    marginTop: getFontSize(1),
  },
  dot: {
    height: getFontSize(1.2),
    width: getFontSize(1.2),
    borderRadius: getFontSize(2),
    backgroundColor: Colors._838383,
  },
});
