import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useLocalSearchParams} from 'expo-router';
import moment from 'moment';

import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import {ActionStatus, ChallengeType} from '@/types/enums';
import {ActionItem, LevelsItem} from '@/types';

import {
  useGetProgressActionDaysQuery,
  useGetProgressActionsQuery,
} from '@/api/progressChallengesApi';

import TaskItem from '@/components/TaskItem';
import ActionS from '@/components/skeleton/ActionS';
import CustomCalendarStrip from '@/components/CustomCalenderStrip';
import Loader from '@/components/Loader';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {formatDay} from '@/utils/common/commonFunction';
import {CalendarS} from '@/components/skeleton/CalenderS';
import ActionHeader from '@/components/myChallenges/ActionHeader/ActionHeader';

const ActionsScreen = () => {
  const {id} = useLocalSearchParams<{id: string; refresh?: string}>();

  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<moment.Moment>(() =>
    moment().startOf('day'),
  );

  const [loader, setLoader] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(true);

  const {data: actionDays, isLoading: daysLoading} =
    useGetProgressActionDaysQuery({id: id});

  useEffect(() => {
    if (!actionDays) return;

    const today = moment().startOf('day');
    const entries = Object.entries(actionDays.availableDays);
    let dayKey = entries.find(([, {date}]) =>
      moment(date).startOf('day').isSame(today, 'day'),
    )?.[0];

    if (!dayKey) {
      const pastEntries = entries.filter(([, {date}]) =>
        moment(date).startOf('day').isSameOrBefore(today, 'day'),
      );
      dayKey = pastEntries.length
        ? pastEntries[pastEntries.length - 1][0]
        : entries[0][0];
    }

    setSelectedDay(dayKey);
    setSelectedDate(
      moment(actionDays.availableDays[dayKey].date).startOf('day'),
    );
  }, [actionDays]);

  const {data: challengeActions, isFetching} = useGetProgressActionsQuery(
    {day: selectedDay, id},
    {
      skip: !selectedDay,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    },
  );

  useEffect(() => {
    if (isFetching === false) {
      setLoader(false);
    }
  }, [isFetching]);

  const isLevelBased = useMemo(
    () => challengeActions?.type === ChallengeType.SINGLE,
    [challengeActions?.type],
  );

  const tasksForSelectedDay = useMemo(() => {
    if (!challengeActions?.actionDay) return [];
    return isLevelBased
      ? (challengeActions.actionDay.levels as LevelsItem[])
      : (challengeActions.actionDay.actions as ActionItem[]);
  }, [challengeActions, isLevelBased]);

  useEffect(() => {
    if (tasksForSelectedDay.length > 0) {
      setActionLoading(false);
    }
  }, [tasksForSelectedDay]);

  const renderItem = useCallback(
    ({item, index}: {item: ActionItem | LevelsItem; index: number}) => {
      let name = '',
        image = null,
        unit = '',
        value = 0 as number | string,
        level = '',
        actionType = '',
        status = '',
        actionId = '',
        completedLevelIndex: number | null = null,
        selectedLevelIndex: number | null = null,
        maxOutValue: number | null = null,
        singleStatus = '',
        bestCount: number | null = 0,
        bestUnit = '',
        passValue: number | null = null;

      switch (challengeActions?.type) {
        case ChallengeType.SINGLE: {
          const actionsData = challengeActions?.actionDay
            ?.actions?.[0] as ActionItem;
          const baseAction = challengeActions?.actionDay?.actions?.[0]?.action;

          name = baseAction?.name ?? '';
          image = baseAction?.image ?? null;
          unit = (item as LevelsItem)?.goal?.unit ?? '';
          value = (item as LevelsItem)?.goal?.value ?? 0;
          level = (item as LevelsItem)?.name ?? '';
          actionType = baseAction?.type ?? '';
          singleStatus = actionsData?.status ?? '';
          actionId = baseAction?._id;
          completedLevelIndex = actionsData?.completedLevelIndex as number;
          selectedLevelIndex = actionsData?.selectedLevelIndex as number;
          break;
        }

        case ChallengeType.SINGLE_MAXOUT:
        case ChallengeType.MULTIPLE_MAXOUT: {
          const act = item as ActionItem;

          const hasOverride =
            act?.overrides &&
            act?.overrides?.goal &&
            Object.keys(act?.overrides).length > 0;
          const rules = hasOverride ? act?.overrides : act?.action?.basicRules;

          name = act?.action?.name ?? '';
          image = act?.action?.image ?? null;
          unit = challengeActions?.type === ChallengeType.SINGLE_MAXOUT
              ? rules?.goal?.unit
              : rules?.goal?.unit ?? '';
          value = 'Max' as string | number;
          level = 'MaxOut';
          actionType = act?.action?.type ?? '';
          actionId = act?.action?._id ?? '';
          status = act?.status ?? '';
          maxOutValue = rules?.goal?.value ?? 0;
          bestCount = act?.bestCount;
          bestUnit = act?.bestUnit;
          passValue =
            ChallengeType.SINGLE_MAXOUT === challengeActions?.type
              ? act?.selectedCompletionCount
              : rules?.goal.value ?? 0;
          break;
        }

        case ChallengeType.MULTIPLE:
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
          actionType = act?.action?.type ?? '';
          status = act?.status ?? '';
          actionId = act?.action?._id ?? '';
          break;
        }
      }
      return (
        <TaskItem
          image={image as string}
          type={challengeActions?.type as ChallengeType}
          index={index}
          name={name}
          level={level}
          unit={unit}
          value={value}
          actionType={actionType}
          status={status as ActionStatus}
          singleStatus={singleStatus as ActionStatus}
          completedLevelIndex={completedLevelIndex}
          selectedLevelIndex={selectedLevelIndex}
          bestCount={bestCount}
          bestUnit={bestUnit}
          isEdit={false}
        />
      );
    },
    [challengeActions, selectedDay, id],
  );

  if (actionLoading) {
    return (
      <>
        <CalendarS />
        <ActionS isTrue={false} />
      </>
    );
  }

  return (
    <GestureHandlerRootView style={styles.rootContainer}>
      <View style={styles.container}>
        {tasksForSelectedDay.length > 0 && (
          <ActionHeader
            type={challengeActions?.type as ChallengeType}
            challengeActions={challengeActions}
            isEdit={false}
          />
        )}
        <View style={styles.actionContainer}>
          <FlatList
            ListHeaderComponent={
              <Text style={styles.actionText}>{formatDay(selectedDay)}/7</Text>
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
              startDate={actionDays.startDate}
              endDate={actionDays.targetEndDate}
              dailyAction={actionDays?.availableDays as any}
              selectedDate={selectedDate}
              onDateSelected={setSelectedDate}
              customSelectedStyle={{
                backgroundColor: Colors.calenderBgColor,
                borderRadius: 8,
              }}
              setSelectedDay={setSelectedDay}
            />
          </View>
        )}
      </View>

      {loader && <Loader />}
    </GestureHandlerRootView>
  );
};

export default ActionsScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingBottom: getFontSize(10),
  },
  actionContainer: {
    borderRadius: getFontSize(1),
    // padding: getFontSize(2),
    marginBottom: getFontSize(1),
    flex: 2,
  },
  actionText: {
    fontSize: getFontSize(2),
    color: Colors.white,
    marginBottom: getFontSize(1),
    textTransform: 'uppercase',
    fontWeight: '500',
    left: 30,
  },
  calendarContainer: {
    flex: 0.015,
  },
  btnStyle: {
    height: getFontSize(5),
    alignSelf: 'flex-end',
    width: 'auto',
    borderRadius: 10,
  },
});
