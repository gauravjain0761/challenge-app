import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useLocalSearchParams} from 'expo-router';
import {
  useGetChallengeActionsQuery,
  useLazyGetWWHActionQuery,
} from '@/api/exploreApi';
import {GetChallengeActionsResponse} from '@/validation/schemas';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import {ChallengeType} from '@/types/enums';
import {ActionItem, LevelsItem} from '@/types';
import TaskItemPreview from '@/components/TaskItemPreview';
import ActionS from '@/components/skeleton/ActionS';
import DayList from '@/components/DayList';
import {GeneralStyle} from '@/constants/GeneralStyle';
import WhatWhyHowModal from '@/components/WhatWhyHowModal';

const actions = () => {
  const param = useLocalSearchParams();

  const [selectedDay, setSelectedDay] = useState('day1');

  const handleDayChange = (day: string) => {
    setSelectedDay(day);
  };

  const {data: action, isLoading} = useGetChallengeActionsQuery({
    challengeId: param?.id as string,
    day: selectedDay,
  });

  const [challengeActions, setChallengeActions] =
    useState<GetChallengeActionsResponse>({} as GetChallengeActionsResponse);
  const [isWWHModalVisible, setIsWWHModalVisible] = useState(false);

  const [triggerChallenge, {data: wwhAction}] = useLazyGetWWHActionQuery();

  useEffect(() => {
    if (action) {
      setChallengeActions(action);
    }
  }, [action]);

  const handleWWHModal = (id: string) => {
    triggerChallenge({
      actionId: id as string,
    });
    setIsWWHModalVisible(true);
  };

  if (isLoading) {
    return <ActionS />;
  }

  const renderItem = ({
    item,
    index,
  }: {
    item: ActionItem | LevelsItem;
    index: number;
  }) => {
    let name = '';
    let image: any = null;
    let unit = '';
    let value = '';
    let level = '';
    let ID = '';

    switch (challengeActions?.type) {
      case ChallengeType.SINGLE: {
        const baseAction = challengeActions?.actionDay?.actions?.[0]?.action;
        name = baseAction?.name ?? '';
        image = baseAction?.image ?? null;
        unit = (item as LevelsItem)?.goal?.unit ?? '';
        value = (item as LevelsItem)?.goal?.value?.toString() ?? '';
        level = (item as LevelsItem)?.name ?? '';
        ID = baseAction?._id ?? '';
        break;
      }

      case ChallengeType.SINGLE_MAXOUT: {
        const act = item as ActionItem;
        name = act?.action?.name ?? '';
        image = act?.action?.image ?? null;
        unit = act?.action?.basicRules?.goal?.unit ?? '';
        value = 'Max';
        level = 'MaxOut';
        ID = act?.action?._id ?? '';
        break;
      }

      case ChallengeType.MULTIPLE_MAXOUT:
      case ChallengeType.MULTIPLE_MAXOUT_VARIANT: {
        const act = item as ActionItem;
        const hasOverride =
        act?.overrides &&
        act?.overrides?.goal &&
        Object.keys(act?.overrides).length > 0;
        const rules = hasOverride ? act?.overrides : act?.action?.basicRules;
        name = act?.action?.name ?? '';
        image = act?.action?.image ?? null;
        unit = rules?.goal?.unit ?? '';
        value = 'Max';
        level = 'MaxOut';
        ID = act?.action?._id ?? '';
        break;
      }

      case ChallengeType.MULTIPLE:
      case ChallengeType.MULTIPLE_VARIANT:
      default: {
        const act = item as ActionItem;
        const hasOverride =
          act?.overrides &&
          act?.overrides?.goal &&
          Object.keys(act?.overrides).length > 0;
        const rules = hasOverride ? act?.overrides : act?.action?.basicRules;
        const levelV = hasOverride
          ? act?.overrides?.timeOfDay?.time
          : act?.action?.basicRules?.timeOfDay;

        name = act?.action?.name ?? '';
        image = act?.action?.image ?? null;
        unit = rules?.goal?.unit ?? '';
        value = rules?.goal?.value?.toString() ?? '';
        level = levelV;
        ID = act?.action?._id ?? '';
        break;
      }
    }

    return (
      <TouchableOpacity
        onPress={() => {
          handleWWHModal(ID as string);
        }}>
        <TaskItemPreview
          type={challengeActions?.type as string}
          index={index}
          name={name}
          image={image}
          level={level}
          unit={unit}
          value={value}
        />
      </TouchableOpacity>
    );
  };

  const isLevelBased = challengeActions?.type === ChallengeType.SINGLE;

  const tasksForSelectedDay = isLevelBased
    ? (challengeActions?.actionDay?.levels as LevelsItem[]) || []
    : (challengeActions?.actionDay?.actions as ActionItem[]) || [];

  const dailyActionsLength = challengeActions?.actionDay?.actions?.length;

  return (
    <View style={styles.container}>
      <View style={GeneralStyle.layoutContainer}>
        <Text style={styles.description}>
          Every day complete as many actions as you can to finish the challenge
          and level up.
        </Text>
        <View style={styles.actionContainer}>
          <FlatList
            ListHeaderComponent={
              <>
                <Text style={styles.headingText}>
                  {param?.challengeName}
                </Text>
                <Text style={styles.actionText}>
                  {dailyActionsLength} Daily Action{dailyActionsLength > 1 ? 's' : ''}
                </Text>
              </>
            }
            data={tasksForSelectedDay}
            renderItem={renderItem}
            keyExtractor={(_, idx) => idx.toString()}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <WhatWhyHowModal
          data={wwhAction}
          visible={isWWHModalVisible}
          onClose={() => setIsWWHModalVisible(false)}
        />
      </View>
      <View style={styles.dayContainer}>
        {!isLoading && <DayList handleDayChange={handleDayChange} />}
      </View>
    </View>
  );
};

export default actions;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: getFontSize(10),
  },
  description: {
    fontSize: getFontSize(1.8),
    color: Colors.white,
    marginBottom: getFontSize(1),
    lineHeight: getFontSize(2.4),
    marginTop: getFontSize(1),
  },
  actionContainer: {
    backgroundColor: Colors.containerBGColor,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: getFontSize(1),
    padding: getFontSize(2),
    marginTop: getFontSize(2),
    // marginBottom: getFontSize(5),
    marginBottom: getFontSize(1),
    flex: 2,
  },
  headingText: {
    fontSize: getFontSize(2.3),
    fontWeight: '500',
    color: Colors.white,
    marginBottom: getFontSize(0.5),
  },
  actionText: {
    fontSize: getFontSize(1.8),
    color: Colors.white,
    marginBottom: getFontSize(2),
    opacity: 0.6,
  },
  dayContainer: {
    flex: 0.015,
  },
});
