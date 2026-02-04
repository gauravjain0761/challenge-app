import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {router, useLocalSearchParams} from 'expo-router';
import moment from 'moment';

import {convertUTCToLocalDate, getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import {
  ActionStatus,
  ChallengeType,
  DayStatus,
  MIX_PANEL_EVENTS,
  multipleTypes,
  singleTypes,
} from '@/types/enums';
import {ActionItem, LevelsItem} from '@/types';

import {
  useGetProgressActionDaysQuery,
  useGetProgressActionsQuery,
  useSkipAllActionMutation,
  useUpdateProgressActionMutation,
} from '@/api/progressChallengesApi';

import TaskItem from '@/components/TaskItem';
import ActionS from '@/components/skeleton/ActionS';
import CustomCalendarStrip from '@/components/CustomCalenderStrip';
import ProgressBar from '@/constants/ProgressBar';
import Loader from '@/components/Loader';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  errorToast,
  formatDay,
  successToast,
} from '@/utils/common/commonFunction';
import {CalendarS} from '@/components/skeleton/CalenderS';
import ActionHeader from '@/components/myChallenges/ActionHeader/ActionHeader';
import {StatusModal} from '@/components/StatusModal';
import {
  setIsShowCancel,
  setIsShowComplete,
  setIsShowUndo,
} from '@/features/authSlice';
import {useDispatch} from 'react-redux';
import {useAppSelector} from '@/hooks/reduxHooks';
import Button from '@/components/Button';
import InProgressStepTwo from '@/components/WalkThroughSteps/inProgressChallenge/InProgressStepTwo';
import InProgressStepThree from '@/components/WalkThroughSteps/inProgressChallenge/InProgressStepThree';
import ActionFinishDayModal from '@/components/myChallenges/ActionDayFinish/ActionFinishDayModal';
import {useCustomWalkthrough} from '@/hooks/useCustomWalkthrough';
import {
  getAsyncInProgress,
  setAsyncInProgress,
  removeAsyncInProgress,
} from '@/utils/common/useAsyncFunctions';
import WalkthroughBackdrop from '@/components/WalkThrough/WalkthroughBackdrop';
import InProgressStepFour from '@/components/WalkThroughSteps/inProgressChallenge/inProgressStepFour';
import ActionDayModal from '@/components/ActionDayModals/ActionDayModal';
import {SkipAllAction} from '@/validation/schemas';
import FastImage from 'react-native-fast-image';
import {Images} from '@/assets/images';
import ActionInfoModal from '@/components/InfoModals/ActionInfoModal';
import {isUndefined} from 'lodash';
import {trackEvent} from '@/hooks/useMixpanelClient';

const ActionsScreen = () => {
  const {id, refresh} = useLocalSearchParams<{id: string; refresh?: string}>();
  const {isShowCancel, isShowUndo, isShowComplete, user} = useAppSelector(
    state => state.auth,
  );

  const dispatch = useDispatch();
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<moment.Moment>(() =>
    moment().startOf('day'),
  );

  const [loader, setLoader] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(true);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ActionStatus | null>(null);
  const [isSkipVisible, setIsSkipVisible] = useState(false);
  const [isFinishButtonShow, setIsFinishButtonShow] = useState(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [infoVisible, setInfoVisible] = useState(false);

  const [
    updateProgressAction,
    {isLoading: updateProgressActionLoading, isSuccess},
  ] = useUpdateProgressActionMutation();

  const [
    skipAllAction,
    {isLoading: skipAllActionLoading, data: finishDayData},
  ] = useSkipAllActionMutation();

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

  const {
    data: challengeActions,
    refetch: refetchAction,
    isFetching,
  } = useGetProgressActionsQuery(
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

  useEffect(() => {
    if (challengeActions) {
      const isSingleActionPending = challengeActions?.actionDay.actions?.filter(
        action => action.status !== ActionStatus.PENDING,
      );
      const isMultipleActionPending =
        challengeActions?.actionDay.actions?.filter(
          action => action.status !== ActionStatus.PENDING,
        );

      const selectedActionCount = challengeActions?.selectedActionCount || 0;
      const completedActionCount = challengeActions?.completedActionCount || 0;

      const challengeDate = challengeActions?.actionDay?.date;

      const isToday = moment(challengeDate)
        .startOf('day')
        .isSame(moment().startOf('day'));

      if (challengeActions?.actionDay?.popupShown === false && isToday) {
        setActionDatModalShow(true);
      }

      if (isToday) {
        if (!challengeActions?.actionDay?.finishDay) {
          if (
            multipleTypes.includes(challengeActions?.type as ChallengeType) &&
            isMultipleActionPending.length > 0
          ) {
            setIsFinishButtonShow(true);
          } else if (
            singleTypes.includes(challengeActions?.type as ChallengeType) &&
            isSingleActionPending.length > 0
          ) {
            setIsFinishButtonShow(true);
          } else {
            setIsFinishButtonShow(false);
          }
        } else {
          setIsFinishButtonShow(false);
        }
      } else {
        setIsFinishButtonShow(false);
      }
    }
  }, [challengeActions]);

  // Custom walkthrough for In Progress Challenge (2 steps)
  const {currentStep, isActive, steps, currentStepLayout, completeWalkthrough} =
    useCustomWalkthrough({
      screenName: 'InProgressChallenge',
      totalSteps: 2,
      getAsyncFunction: getAsyncInProgress,
      setAsyncFunction: setAsyncInProgress,
      autoStart: true,
      delay: 100,
    });

  // Extract steps for easy access: step1=First action info, step2=Undo functionality
  const [step1, step2] = steps;

  React.useEffect(() => {
    const checkStartActionSteps = async () => {
      const result = await getAsyncInProgress();

      if (result === null && !isActive) {
        step1?.start();
      }
    };

    checkStartActionSteps();
  }, []);

  useEffect(() => {
    if (refresh === 'true' && selectedDay) {
      setLoader(true);
      refetchAction();

      router.setParams({refresh: 'false'});
      setIsUpdate(true);

      const startSteps2 = async () => {
        const result = await getAsyncInProgress();

        if (result === null && isActive) {
          step1?.next();
          setShowUndoStep(true);
        }
      };
      startSteps2();
    }
  }, [refresh, selectedDay, refetchAction, router]);

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

  // console.log(
  //   'tasksForSelectedDay',
  //   JSON.stringify(tasksForSelectedDay, null, 2),
  // );

  // State to track if we should show step 2 (undo step)
  const [showUndoStep, setShowUndoStep] = useState(false);
  const [showStepFour, setShowStepFour] = useState(false);

  const [actionDatModalShow, setActionDatModalShow] = useState(false);

  useEffect(() => {
    if (tasksForSelectedDay.length > 0) {
      setActionLoading(false);
    }
  }, [tasksForSelectedDay]);

  const onUpdateAction = async (
    actionId: string,
    status: ActionStatus,
    unit?: string,
    value?: string | number,
    index?: number,
    maxOutValue?: number | null,
    name?: string,
  ) => {
    console.log('actionId', maxOutValue, unit);
    if (!selectedDay) return;
    try {
      const payload: any = {
        id,
        day: selectedDay,
        data: {actionId, status, completionData: {}},
      };
      console.log('challengeActions?.type', id);
      if (
        challengeActions?.type === ChallengeType.SINGLE ||
        challengeActions?.type === ChallengeType.SINGLE_VARIANT
      ) {
        payload.data.completionData = {levelIndex: index};
      } else if (
        challengeActions?.type === ChallengeType.MULTIPLE ||
        challengeActions?.type === ChallengeType.MULTIPLE_VARIANT
      ) {
        payload.data.completionData = {
          completionCount: value,
          completionUnit: unit,
        };
      } else {
        payload.data.completionData = {
          completionCount: maxOutValue,
          completionUnit: unit,
        };
      }
      const response = await updateProgressAction(payload).unwrap();
      if (response) {
        setModalType(status);
        // onSuccess(status);
        refetchAction();

        // Track event
        trackEvent(MIX_PANEL_EVENTS.action_status, {
          challenge_id: response?.challengeId,
          action_status: status,
          action_id: actionId,
          action_name: name,
          day_number: selectedDay,
          compulsory: false,
          user_id: user?.id,
        });

        if (status === ActionStatus.COMPLETED) {
          setIsUpdate(true);
        }
        // When action status changes from pending, hide step 1 and show step 2

        if (status !== ActionStatus.PENDING && isActive && !showUndoStep) {
          setShowUndoStep(true);
        }
      }
    } catch (err: any) {
      errorToast(err.data?.message || err.message || 'Please try again');
    }
  };

  const onSuccess = (status: ActionStatus) => {
    if (status === ActionStatus.COMPLETED && isShowComplete) {
      setShowPopup(false);
    } else if (status === ActionStatus.PENDING && isShowUndo) {
      setShowPopup(false);
    } else if (status === ActionStatus.SKIPPED && isShowCancel) {
      setShowPopup(false);
    } else {
      setShowPopup(true);
    }
  };

  const onSelectCheck = () => {
    if (modalType === ActionStatus.COMPLETED) {
      dispatch(setIsShowComplete(true));
    } else if (modalType === ActionStatus.PENDING) {
      dispatch(setIsShowUndo(true));
    } else if (modalType === ActionStatus.SKIPPED) {
      dispatch(setIsShowCancel(true));
    }
    setShowPopup(false);
    // const time = setTimeout(() => {
    setModalType(null);
    // }, 1000);
    // return () => clearTimeout(time);
  };

  const onSkipRemaining = async () => {
    try {
      const {message, data} = await skipAllAction({
        id,
        day: selectedDay,
      }).unwrap();
      if (data) {
        trackEvent(MIX_PANEL_EVENTS.finish_day, {
          challenge_id: id,
          completed_level: data?.levelName,
          user_id: user?.id,
        });
        refetchAction();
        successToast(message);
        setIsSkipVisible(true);
      }
    } catch (err: any) {
      errorToast(err.data?.message || err.message || 'Please try again');
    }
  };

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
        compulsory: boolean = false,
        quickChallenge: any | null = null,
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
          compulsory = (actionsData?.compulsory as boolean) ?? false;
          quickChallenge = actionsData?.quickChallenge ?? null;

          break;
        }

        case ChallengeType.SINGLE_MAXOUT:
        case ChallengeType.MULTIPLE_MAXOUT:
        case ChallengeType.MULTIPLE_MAXOUT_VARIANT: {
          const act = item as ActionItem;
          // console.log('act', act?.quickChallenge);

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
          compulsory = false;
          passValue =
            ChallengeType.SINGLE_MAXOUT === challengeActions?.type
              ? act?.selectedCompletionCount
              : rules?.goal.value ?? 0;
          quickChallenge = act?.quickChallenge ?? null;

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
          compulsory = (act?.compulsory as boolean) ?? false;
          quickChallenge = act?.quickChallenge ?? null;

          break;
        }
      }
      return (
        <TaskItem
          image={image as string}
          challengeName={challengeActions?.challengeName as string}
          type={challengeActions?.type as ChallengeType}
          index={index}
          name={name}
          level={level}
          unit={unit}
          value={value}
          actionType={actionType}
          status={status as ActionStatus}
          singleStatus={singleStatus as ActionStatus}
          onUpdateAction={status => {
            setModalType(status);
            onUpdateAction(
              actionId,
              status,
              unit,
              value,
              index,
              maxOutValue,
              name,
            );
          }}
          completedLevelIndex={completedLevelIndex}
          selectedLevelIndex={selectedLevelIndex}
          bestCount={bestCount}
          bestUnit={bestUnit}
          onLayout={step1.onLayout}
          onMainLayout={step2.onLayout}
          showUndoStep={showUndoStep}
          compulsory={compulsory as boolean}
          quickChallenge={quickChallenge as any}
          onPress={(v: any) => {
            router.push({
              pathname: '/assetsScreen',
              params: {
                id: id,
                actionId: actionId,
                selectedDay: selectedDay,
                unit: unit,
                value: value,
                index: index,
                name: name,
                challengeType: challengeActions?.type,
                navType: v,
                passValue: passValue,
                compulsory: compulsory.toString() as 'true' | 'false',
                status:
                  challengeActions?.type === ChallengeType.SINGLE
                    ? singleStatus
                    : (status as ActionStatus),
              },
            });

            // No additional walkthrough trigger needed for press events
          }}
        />
      );
    },
    [challengeActions, onUpdateAction, selectedDay, id],
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
            isUpdate={isUpdate}
            onUpdateChange={() => setIsUpdate(false)}
          />
        )}
        <View style={styles.actionContainer}>
          <FlatList
            ListHeaderComponent={
              <View style={styles.row}>
                <Text style={styles.actionText}>
                  {formatDay(selectedDay)}/7
                </Text>
                <TouchableOpacity onPress={() => setInfoVisible(true)}>
                  <FastImage
                    source={Images.info_Icon}
                    resizeMode="contain"
                    style={styles.image}
                  />
                </TouchableOpacity>
              </View>
            }
            data={tasksForSelectedDay}
            renderItem={renderItem}
            keyExtractor={(_, idx) => idx.toString()}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              isFinishButtonShow ? (
                <Button
                  title="Finish Day"
                  onPress={() => {
                    onSkipRemaining();
                  }}
                  style={styles.btnStyle}
                  containerStyle={{
                    paddingHorizontal: getFontSize(2.5),
                  }}
                />
              ) : null
            }
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

      {isSkipVisible && (
        <ActionFinishDayModal
          visible={isSkipVisible}
          onClose={() => {
            setIsSkipVisible(false);
          }}
          challengeActions={challengeActions}
          finishDayData={finishDayData?.data as SkipAllAction}
        />
      )}

      {showPopup && (
        <StatusModal
          visible={showPopup}
          onClose={() => {
            setShowPopup(false);
            setModalType(null);
          }}
          type={modalType as any}
          onPressSave={() => onSelectCheck()}
        />
      )}

      {(skipAllActionLoading || updateProgressActionLoading || loader) && (
        <Loader />
      )}

      {/* Custom Walkthrough Backdrop */}
      <WalkthroughBackdrop
        isVisible={isActive || showUndoStep}
        highlightedArea={
          showUndoStep ? steps[1]?.layoutInfo : currentStepLayout
        }
        backdropColor="rgba(0, 0, 0, 0.7)"
      />

      {/* Custom Walkthrough Overlays */}
      {step1?.isVisible && !showUndoStep && (
        <InProgressStepTwo
          next={step1.next}
          previous={step1.previous}
          stop={async () => {
            step1.stop();
            setShowUndoStep(false);
            await completeWalkthrough(); // Properly complete the walkthrough
          }}
          layoutInfo={step1.layoutInfo}
        />
      )}

      {showUndoStep && (
        <InProgressStepThree
          next={async () => {
            console.log('🎯 Completing InProgress walkthrough');
            setShowUndoStep(false);
            await completeWalkthrough(); // Properly complete the walkthrough
          }}
          previous={() => {}} // Not used
        />
      )}
      {showStepFour && (
        <InProgressStepFour
          next={async () => {
            setShowUndoStep(false);
            await completeWalkthrough(); // Properly complete the walkthrough
          }}
          // next={step1.next}
          // previous={step1.previous}
          // layoutInfo={step1.layoutInfo}
        />
      )}

      <ActionDayModal
        visible={actionDatModalShow}
        onClose={() => {
          setActionDatModalShow(false);
          refetchAction();
        }}
        challengeActions={challengeActions}
      />

      {infoVisible && (
        <ActionInfoModal
          visible={infoVisible}
          onClose={() => setInfoVisible(false)}
        />
      )}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingBottom: 10,
  },
  image: {
    height: getFontSize(3),
    width: getFontSize(3),
  },
});
