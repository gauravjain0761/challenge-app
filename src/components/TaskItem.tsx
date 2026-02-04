import React, {memo, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import {Task} from '@/types';

import IconComponent from './IconComponent';
import FastImage from 'react-native-fast-image';
import {
  ActionStatus,
  ActionType,
  ChallengeType,
  maxoutTypes,
} from '@/types/enums';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {convertUnits} from '@/utils/common/commonFunction';

import GradientText from './GradientText';
import {router} from 'expo-router';

interface TaskItemProps {
  task?: Task;
  type: ChallengeType;
  index: number;
  image: string;
  name: string;
  level: any;
  value: number | string;
  unit: string;
  status?: ActionStatus;
  singleStatus?: ActionStatus;
  actionType: string;
  onUpdateAction?: (status: ActionStatus) => void;
  completedLevelIndex?: number | null;
  selectedLevelIndex?: number | null;
  onPress?: (value?: string) => void;
  bestCount?: number | null;
  bestUnit?: string;
  isSuccess?: boolean;
  onIsSuccess?: () => void;
  onLayout?: (e: any) => void;
  onMainLayout?: (e: any) => void;
  isEdit?: boolean;
  showUndoStep?: boolean;
  compulsory?: boolean;
  quickChallenge?: {
    id: string;
    name: string;
    image: string;
  };
  challengeName?: string;
}

const TaskItem: React.FC<TaskItemProps> = memo(
  ({
    task,
    type,
    image,
    name,
    level,
    value,
    unit,
    status,
    actionType,
    onUpdateAction = () => {},
    completedLevelIndex,
    selectedLevelIndex,
    index,
    singleStatus,
    onPress = () => {},
    bestCount,
    bestUnit,
    isSuccess,
    onIsSuccess = () => {},
    onLayout,
    onMainLayout,
    isEdit = true,
    showUndoStep,
    compulsory,
    quickChallenge,
    challengeName,
  }) => {
    const translateX = useSharedValue(0);
    const startX = useSharedValue(0);
    const wasSwiped = useSharedValue(false);

    const undoAnimationCount = useSharedValue(0);
    const isUndoAnimating = useSharedValue(false);

    const undoSwipeDistance = getFontSize(1); // Subtle move

    const fontSizeForGesture = getFontSize(10);
    const maxRightDrag =
      fontSizeForGesture * (quickChallenge && quickChallenge?.id ? 2 : 1);
    const maxLeftDrag = fontSizeForGesture * 1;
    const threshold = fontSizeForGesture * 0.3;

    const springConfig = {
      stiffness: 300,
      damping: 50,
      mass: 10,
      overshootClamping: true,
      restDisplacementThreshold: 0.5,
      restSpeedThreshold: 0.5,
    };

    const isDisabled =
      type === ChallengeType.SINGLE
        ? false
        : // singleStatus === ActionStatus.COMPLETED ||
          // singleStatus === ActionStatus.FAILED ||
          // singleStatus === ActionStatus.SKIPPED
          false;
    //  status === ActionStatus.FAILED ||
    //   status === ActionStatus.COMPLETED ||
    //   status === ActionStatus.SKIPPED;

    // 3) mirror it into a shared value so our worklets can read it
    const disabledSV = useSharedValue(isDisabled ? 1 : 0);
    useEffect(() => {
      disabledSV.value = isDisabled ? 1 : 0;
    }, [isDisabled]);

    useEffect(() => {
      let timeoutId: number | null = null;
      if (showUndoStep && index === 0) {
        translateX.value = withSpring(getFontSize(4), springConfig);
        timeoutId = window.setTimeout(() => {
          translateX.value = withSpring(0, springConfig);
          timeoutId = window.setTimeout(() => {
            translateX.value = withSpring(getFontSize(4), springConfig);
            timeoutId = window.setTimeout(() => {
              translateX.value = withSpring(0, springConfig);
              timeoutId = window.setTimeout(() => {
                translateX.value = withSpring(getFontSize(4), springConfig);
                timeoutId = window.setTimeout(() => {
                  translateX.value = withSpring(0, springConfig);
                }, 1000);
              }, 1000);
            }, 1000);
          }, 1000);
        }, 1000);
      }
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }, [showUndoStep]);

    const panGesture = Gesture.Pan()
      .activeOffsetX([-getFontSize(2), getFontSize(2)])
      .failOffsetY([-getFontSize(2), getFontSize(2)])
      .onBegin(() => {
        startX.value = translateX.value;
        wasSwiped.value = false;
      })
      .onUpdate(e => {
        wasSwiped.value = true;

        if (!isEdit) return;

        if (
          type === ChallengeType.SINGLE &&
          singleStatus === ActionStatus.COMPLETED &&
          completedLevelIndex !== index
        )
          return;

        // Prevent left-to-right swipe when pending
        if (
          (singleStatus === ActionStatus.PENDING ||
            status === ActionStatus.PENDING) &&
          e.translationX > 0
        )
          return;

        let next: number;

        if (
          type === ChallengeType.SINGLE ||
          type === ChallengeType.SINGLE_MAXOUT
        ) {
          next = e.translationX;
          if (next <= 0) {
            translateX.value = 0;
          } else {
            translateX.value = Math.min(next, maxRightDrag);
          }
        } else {
          if (startX.value < 0) {
            const delta = -e.translationX;
            next = startX.value + delta;
            translateX.value = Math.min(0, Math.max(startX.value, next));
          } else if (startX.value > 0) {
            const delta = e.translationX;
            next = startX.value + delta;
            translateX.value = Math.max(0, Math.min(startX.value, next));
          } else {
            next = e.translationX;

            // Prevent left-to-right swipe when pending
            if (singleStatus === ActionStatus.PENDING && next > 0) return;

            translateX.value = Math.max(
              -maxRightDrag,
              Math.min(next, maxLeftDrag),
            );
          }
        }
      })
      .onEnd(() => {
        if (!isEdit) return;

        if (
          type === ChallengeType.SINGLE &&
          singleStatus === ActionStatus.COMPLETED &&
          completedLevelIndex !== index
        )
          return;

        // Prevent snapping to right if swipe started from 0 and was toward right
        if (
          (singleStatus === ActionStatus.PENDING ||
            status === ActionStatus.PENDING) &&
          translateX.value > 0
        ) {
          translateX.value = withSpring(0, springConfig);
          return;
        }

        if (
          type === ChallengeType.SINGLE ||
          type === ChallengeType.SINGLE_MAXOUT
        ) {
          if (translateX.value > threshold) {
            translateX.value = withSpring(maxRightDrag, springConfig);
          } else {
            translateX.value = withSpring(0, springConfig);
          }
        } else {
          if (startX.value === 0) {
            if (translateX.value > threshold) {
              translateX.value = withSpring(maxLeftDrag, springConfig);
            } else if (translateX.value < -threshold) {
              translateX.value = withSpring(-maxRightDrag, springConfig);
            } else {
              translateX.value = withSpring(0, springConfig);
            }
          } else {
            translateX.value = withSpring(0, springConfig);
          }
        }
      });

    const tapGesture = Gesture.Tap()
      .maxDuration(250)
      .maxDeltaX(10)
      .maxDeltaY(10)
      .onEnd(() => {
        if (!isEdit) return;

        if (translateX.value !== 0) {
          translateX.value = withSpring(0, springConfig);
          wasSwiped.value = false;
        } else {
          if (disabledSV.value === 0) {
            runOnJS(onPress)();
          }
        }
      });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{translateX: translateX.value}],
    }));
    const leftActionStyle = useAnimatedStyle(() => ({
      opacity: translateX.value > 0 ? Math.min(1, translateX.value / 80) : 0,
    }));

    const rightActionStyle = useAnimatedStyle(() => ({
      opacity:
        translateX.value < 0 ? Math.min(1, Math.abs(translateX.value) / 80) : 0,
    }));

    const getButtonStyle = () => {
      return status === ActionStatus.COMPLETED ||
        status === ActionStatus.SKIPPED ||
        status === ActionStatus.FAILED ||
        (type === ChallengeType.SINGLE && completedLevelIndex === index)
        ? //  ||
          // (type === ChallengeType.SINGLE && singleStatus === ActionStatus.SKIPPED)
          styles.buttonInactive
        : styles.checkbox;
    };

    const getButtonIcon = () => {
      let iconName: string = 'right';

      const isCompleted =
        (type === ChallengeType.SINGLE &&
          completedLevelIndex === index &&
          singleStatus === ActionStatus.COMPLETED) ||
        status === ActionStatus.COMPLETED;

      const isSkipped =
        (type === ChallengeType.SINGLE &&
          completedLevelIndex === index &&
          singleStatus === ActionStatus.SKIPPED) ||
        status === ActionStatus.SKIPPED;

      const isFailed =
        (type === ChallengeType.SINGLE &&
          completedLevelIndex === index &&
          singleStatus === ActionStatus.FAILED) ||
        status === ActionStatus.FAILED;

      const isNoAssetAutoComplete =
        (type === ChallengeType.SINGLE &&
          singleStatus === ActionStatus.PENDING &&
          actionType === ActionType.NO_ASSET) ||
        (status === ActionStatus.PENDING &&
          actionType === ActionType.NO_ASSET &&
          !maxoutTypes.includes(type));

      if (isCompleted || isNoAssetAutoComplete) {
        if (compulsory && !isCompleted) {
          iconName = 'right';
        } else {
          iconName = 'check';
        }
      } else if (isSkipped) {
        iconName = 'arrowright';
      } else if (isFailed) {
        iconName = 'close';
      }

      const iconColor =
        isCompleted || isSkipped || isFailed
          ? Colors.white
          : Colors.borderColor;

      return <IconComponent name={iconName} size={25} color={iconColor} />;
    };

    const handleStatusChange = (type: ActionStatus) => {
      onUpdateAction(type);
      translateX.value = withSpring(0, springConfig); // Reset swipe
    };

    const gesture = Gesture.Exclusive(panGesture, tapGesture);
    const noOpGesture = Gesture.Tap().onStart(() => true);
    const isIconDisabled =
      type === ChallengeType.SINGLE
        ? singleStatus === ActionStatus.COMPLETED ||
          singleStatus === ActionStatus.FAILED ||
          singleStatus === ActionStatus.SKIPPED
        : status === ActionStatus.FAILED ||
          status === ActionStatus.COMPLETED ||
          status === ActionStatus.SKIPPED;

    const iconTapGesture = Gesture.Tap()
      .enabled(!isIconDisabled)
      .onEnd(() => {
        if (!isEdit) return;

        if (
          compulsory === false &&
          actionType === ActionType.NO_ASSET &&
          !maxoutTypes.includes(type)
        ) {
          runOnJS(handleStatusChange)(ActionStatus.COMPLETED);
        } else {
          runOnJS(onPress)('isIconPress');
        }
      });
    return (
      <View style={styles.container}>
        {/* Background Right Buttons */}
        <Animated.View style={[styles.actionButtons, rightActionStyle]}>
          {type === ChallengeType.SINGLE ||
          type === ChallengeType.SINGLE_MAXOUT ? null : (
            <TouchableOpacity
              style={[styles.actionButton]}
              onPress={() => handleStatusChange(ActionStatus.SKIPPED)}>
              <IconComponent name="arrowright" size={25} color={Colors.white} />
              <Text style={styles.actionButtonText}>Skip</Text>
            </TouchableOpacity>
          )}
          {quickChallenge && quickChallenge?.id && (
            <TouchableOpacity
              style={[styles.actionButton]}
              onPress={() => {
                router.push({
                  pathname: '/(modals)/(exploreChallenges)/[id]',
                  params: {
                    id: quickChallenge?.id,
                    challengeItem: JSON.stringify({
                      name: quickChallenge?.name,
                      image: quickChallenge?.image,
                    }),
                  },
                });
              }}>
              <IconComponent name="plus" size={20} color={Colors.white} />
              <Text style={styles.actionButtonText}>Quick{'\n'}Add</Text>
            </TouchableOpacity>
          )}

          {/* <TouchableOpacity
            style={[styles.actionButton]}
            onPress={() => handleStatusChange(ActionStatus.FAILED)}>
            <IconComponent name="close" size={25} color={Colors.white} />
            <Text style={styles.actionButtonText}>Fail</Text>
          </TouchableOpacity> */}
        </Animated.View>
        {/* Background Left Buttons */}
        <Animated.View style={[styles.leftAction, leftActionStyle]}>
          <TouchableOpacity
            disabled={!isEdit}
            style={[styles.actionButton]}
            onPress={() => handleStatusChange(ActionStatus.PENDING)}>
            <IconComponent
              name="undo-variant"
              type="MaterialCommunityIcons"
              size={25}
              color={Colors.white}
            />
            <Text style={styles.actionButtonText}>Undo</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Foreground Content */}
        <View
          onLayout={index === 0 ? onMainLayout : undefined}
          style={GeneralStyle.row}>
          <View style={{...GeneralStyle.dot, ...rightActionStyle}} />
          <GestureDetector gesture={gesture}>
            <Animated.View
              style={[
                styles.content,
                animatedStyle,
                {
                  borderColor:
                    selectedLevelIndex === index
                      ? Colors.orange
                      : Colors.borderColor,
                },
              ]}>
              <FastImage
                source={{uri: image}}
                style={styles.image}
                resizeMode={FastImage.resizeMode.cover}
              />
              <View style={styles.textContent}>
                <Text style={styles.title}>{name}</Text>

                {bestCount ? (
                  <GradientText
                    text={`MaxOut ${bestCount} ${bestUnit}`}
                    style={styles.time}
                    end={{x: 0.5, y: 0}}
                  />
                ) : (
                  <Text style={styles.time}>{level}</Text>
                )}
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.durationContainer}>
                  <Text style={styles.duration}>{value}</Text>
                  <Text style={styles.durationUnit}>{convertUnits(unit)}</Text>
                </View>
              </View>
              <GestureDetector gesture={iconTapGesture}>
                <TouchableOpacity
                  disabled={!isEdit}
                  onLayout={index === 0 ? onLayout : undefined}
                  style={{
                    justifyContent: 'center',
                    zIndex: 10000,
                  }}>
                  <View style={[styles.checkbox, getButtonStyle()]}>
                    {getButtonIcon()}
                  </View>
                </TouchableOpacity>
              </GestureDetector>
            </Animated.View>
          </GestureDetector>
        </View>
      </View>
    );
  },
);

export default TaskItem;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: getFontSize(2),
  },
  leftAction: {
    position: 'absolute',
    left: 30,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    flexDirection: 'row',
    zIndex: 3,
  },
  actionButtons: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    zIndex: 3,
    gap: 10,
  },
  actionButton: {
    flexDirection: 'column',
    width: getFontSize(9),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.containerBGColor,
    borderRadius: getFontSize(2),
    borderWidth: getFontSize(0.1),
    // marginLeft: getFontSize(1),
    gap: 5,
    borderColor: Colors.borderColor,
    zIndex: -1,
  },
  buttonInactive: {
    backgroundColor: Colors.orangeOpacity,
  },
  buttonActive: {
    backgroundColor: '#FF6B00',
  },
  actionButtonText: {
    color: 'white',
    fontSize: getFontSize(1.8),
    marginTop: getFontSize(-0.5),
    textAlign: 'center',
  },
  content: {
    flexDirection: 'row',
    // alignItems: 'center',
    borderRadius: getFontSize(2),
    padding: getFontSize(1),
    borderWidth: getFontSize(0.1),
    borderColor: Colors.borderColor,
    zIndex: 2,
    backgroundColor: Colors.containerBGColor,
    // paddingVertical: getFontSize(1.5),
    flex: 1,
  },
  image: {
    width: getFontSize(6.5),
    height: getFontSize(6.5),
    borderRadius: getFontSize(1.2),
    marginRight: getFontSize(1.5),
    marginLeft: getFontSize(0.5),
    alignSelf: 'center',
  },
  textContent: {
    flex: 1,
    paddingVertical: getFontSize(1.5),
  },
  challengeText: {
    color: Colors.white,
    fontSize: getFontSize(1.5),
    fontWeight: '500',
  },
  title: {
    color: 'white',
    fontSize: getFontSize(2),
    textTransform: 'capitalize',
  },
  time: {
    color: Colors.white,
    fontSize: getFontSize(1.8),
    opacity: 0.6,
    textTransform: 'capitalize',
  },
  durationContainer: {
    width: getFontSize(5),
    height: getFontSize(5),
    borderRadius: getFontSize(1),
    backgroundColor: Colors.containerBGColor,
    alignItems: 'center', // Center text horizontally
    justifyContent: 'center', // Center text vertically
    // // padding: getFontSize(0.5),
    // paddingHorizontal: getFontSize(0.5),
    // paddingVertical: getFontSize(0.5),
  },
  duration: {
    color: Colors.white,
    fontSize: getFontSize(1.5),
    opacity: 0.6,
    marginTop: getFontSize(0.1),
  },

  durationUnit: {
    color: Colors.white,
    fontSize: getFontSize(1.5),
    marginTop: getFontSize(0.1),
    textAlign: 'center',
    textTransform: 'capitalize',
    opacity: 0.6,
  },
  checkbox: {
    width: getFontSize(5),
    height: getFontSize(5),
    borderRadius: getFontSize(1),
    backgroundColor: Colors.containerBGColor,
    borderColor: Colors.borderColor,
    borderWidth: getFontSize(0.1),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: getFontSize(1.5),
    marginRight: getFontSize(1),
    zIndex: 10000,
  },
  checkboxText: {
    color: Colors.borderColor,
    fontSize: getFontSize(3),
  },
});
