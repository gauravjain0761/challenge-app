import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useLocalSearchParams} from 'expo-router';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import {ChallengeType} from '@/types/enums';
import {ActionItem, LevelsItem} from '@/types';
import TaskItemPreview from '@/components/TaskItemPreview';
import ActionS from '@/components/skeleton/ActionS';
import {
  useGetScheduleActionDaysQuery,
  useGetScheduleActionsQuery,
} from '@/api/scheduledChallengesApi';
import CustomCalendarStrip from '@/components/CustomCalenderStrip';
import moment from 'moment';
import {useLazyGetWWHActionQuery} from '@/api/exploreApi';
import WhatWhyHowModal from '@/components/WhatWhyHowModal';

const actions = () => {
  const param = useLocalSearchParams();

  const [selectedDay, setSelectedDay] = useState<string>('day1');
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
  const [isWWHModalVisible, setIsWWHModalVisible] = useState(false);

  const {data: actionDays} = useGetScheduleActionDaysQuery({
    params: {
      id: param?.id as string,
    },
  });

  const [triggerChallenge, {data: wwhAction}] = useLazyGetWWHActionQuery();

  const shouldFetchActions = Boolean(actionDays && selectedDay);

  const {data: challengeActions, isLoading} = useGetScheduleActionsQuery(
    {params: {day: selectedDay, id: param?.id as string}},
    {skip: !shouldFetchActions},
  );

  useEffect(() => {
    if (!actionDays) return;
    const firstDate = moment(actionDays.startDate).startOf('day');
    setSelectedDate(firstDate);
    setSelectedDay('day1');
  }, [actionDays]);

  const isLevelBased = useMemo(
    () => challengeActions?.type === ChallengeType.SINGLE,
    [challengeActions?.type],
  );

  const handleWWHModal = (id: string) => {
    triggerChallenge({
      actionId: id as string,
    });
    setIsWWHModalVisible(true);
  };

  const renderItem = useCallback(
    ({item, index}: {item: ActionItem | LevelsItem; index: number}) => {
      let name = '';
      let image: any = null;
      let unit = '';
      let value = '';
      let level = '';
      let actionId = '';

      switch (challengeActions?.type) {
        case ChallengeType.SINGLE: {
          const baseAction = challengeActions?.actionDay?.actions?.[0]?.action;
          name = baseAction?.name ?? '';
          image = baseAction?.image ?? null;
          unit = (item as LevelsItem)?.goal?.unit ?? '';
          value = (item as LevelsItem)?.goal?.value?.toString() ?? '';
          level = (item as LevelsItem)?.name ?? '';
          actionId = baseAction?._id ?? '';
          break;
        }

        case ChallengeType.SINGLE_MAXOUT: {
          const act = item as ActionItem;
          name = act?.action?.name ?? '';
          image = act?.action?.image ?? null;
          unit = act?.action?.basicRules?.goal?.unit ?? '';
          value = 'Max';
          level = 'MaxOut';
          actionId = act?.action?._id ?? '';
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
          actionId = act?.action?._id ?? '';
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
          actionId = act?.action?._id ?? '';
          break;
        }
      }

      return (
        <TouchableOpacity
          onPress={() => {
            handleWWHModal(actionId as string);
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
    },
    [challengeActions?.type],
  );

  const tasksForSelectedDay = useMemo(() => {
    const day = challengeActions?.actionDay;

    return day
      ? isLevelBased
        ? (day.levels as LevelsItem[])
        : (day.actions as ActionItem[])
      : [];
  }, [challengeActions, isLevelBased]);

  const dailyActionsLength = challengeActions?.actionDay?.actions?.length ?? 0;

  if (isLoading || !selectedDate || !actionDays) {
    return <ActionS />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Every day complete as many actions as you can to finish the challenge
        and level up.
      </Text>

      <View style={styles.actionContainer}>
        <FlatList
          accessibilityRole="list"
          ListHeaderComponent={
            <>
              <Text style={styles.headingText}>{param?.challengeName}</Text>
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
      {actionDays && (
        <View style={styles.calendarContainer}>
          <CustomCalendarStrip
            startDate={actionDays?.startDate as any}
            endDate={actionDays?.targetEndDate as any}
            dailyAction={actionDays?.availableDays as any}
            selectedDate={selectedDate}
            //onDateSelected={setSelectedDate}
            onDateSelected={(date, dayKey) => {
              setSelectedDate(date);
              setSelectedDay(dayKey as string);
            }}
            customSelectedStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.40)',
              borderRadius: 8,
            }}
            setSelectedDay={setSelectedDay}
          />
        </View>
      )}
      <WhatWhyHowModal
        data={wwhAction}
        visible={isWWHModalVisible}
        onClose={() => setIsWWHModalVisible(false)}
      />
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
  },
  actionContainer: {
    backgroundColor: Colors.containerBGColor,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    borderRadius: getFontSize(1),
    padding: getFontSize(2),
    marginTop: getFontSize(2),
    marginBottom: getFontSize(1),
    flex: 1.3,
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
  calendarContainer: {
    flex: 0.015,
  },
});
