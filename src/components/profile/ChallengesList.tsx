import React, {memo} from 'react';
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

import FastImage from 'react-native-fast-image';
import {GeneralStyle} from '@/constants/GeneralStyle';
import IconComponent from '../IconComponent';

interface ChallengesListProps {
  image?: string;
  name?: string;
  level?: any;
  onPress?: () => void;
  onPressDelete?: () => void;
}

const ChallengesList: React.FC<ChallengesListProps> = memo(
  ({image, name, level, onPress = () => {}, onPressDelete = () => {}}) => {
    const translateX = useSharedValue(0);
    const startX = useSharedValue(0);
    const wasSwiped = useSharedValue(false);

    const fontSizeForGesture = getFontSize(10);
    const maxRightDrag = fontSizeForGesture * 1;
    const threshold = fontSizeForGesture * 0.3;

    const springConfig = {
      stiffness: 300,
      damping: 50,
      mass: 10,
      overshootClamping: true,
      restDisplacementThreshold: 0.5,
      restSpeedThreshold: 0.5,
    };

    // 3) mirror it into a shared value so our worklets can read it
    const disabledSV = useSharedValue(0);

    const panGesture = Gesture.Pan()
      .activeOffsetX([-getFontSize(2), getFontSize(2)])
      .failOffsetY([-getFontSize(2), getFontSize(2)])
      .onBegin(() => {
        startX.value = translateX.value;
        wasSwiped.value = false;
      })
      .onUpdate(e => {
        wasSwiped.value = true;

        const next = e.translationX;

        if (next < 0) {
          translateX.value = Math.max(next, -maxRightDrag); // cap at -maxRightDrag
        } else {
          translateX.value = 0;
        }
      })
      .onEnd(() => {
        if (translateX.value < -threshold) {
          translateX.value = withSpring(-maxRightDrag, springConfig);
        } else {
          translateX.value = withSpring(0, springConfig);
        }
      });

    const tapGesture = Gesture.Tap()
      .maxDuration(250)
      .maxDeltaX(10)
      .maxDeltaY(10)
      .onEnd(() => {
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

    const rightActionStyle = useAnimatedStyle(() => ({
      opacity:
        translateX.value < 0 ? Math.min(1, Math.abs(translateX.value) / 80) : 0,
    }));

    const gesture = Gesture.Exclusive(panGesture, tapGesture);

    return (
      <View style={styles.container}>
        {/* Background Right Buttons */}
        <Animated.View style={[styles.actionButtons, rightActionStyle]}>
          <TouchableOpacity
            style={[styles.actionButton]}
            onPress={() => {
              translateX.value = withSpring(0, springConfig);
              onPressDelete();
            }}>
            <IconComponent
              name="trash"
              type="Feather"
              size={25}
              color={Colors.white}
            />
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Foreground Content */}
        <View style={GeneralStyle.row}>
          <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.content, animatedStyle]}>
              <FastImage
                source={{uri: image}}
                style={styles.image}
                resizeMode={FastImage.resizeMode.cover}
              />
              <View style={styles.textContent}>
                <Text style={styles.title}>{name}</Text>
                <Text style={styles.time}>{level}</Text>
              </View>
            </Animated.View>
          </GestureDetector>
        </View>
      </View>
    );
  },
);

export default ChallengesList;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: getFontSize(2),
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
    gap: 2,
    borderColor: Colors.borderColor,
  },

  actionButtonText: {
    color: 'white',
    fontSize: getFontSize(1.8),
    marginTop: getFontSize(-0.5),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: getFontSize(2),
    padding: getFontSize(1),
    borderWidth: getFontSize(0.1),
    borderColor: Colors.borderColor,
    zIndex: 2,
    backgroundColor: Colors.containerBGColor,
    paddingVertical: getFontSize(1.5),
    flex: 1,
  },
  image: {
    width: getFontSize(6.5),
    height: getFontSize(6.5),
    borderRadius: getFontSize(1.2),
    marginRight: getFontSize(1.5),
    marginLeft: getFontSize(0.5),
  },
  textContent: {
    flex: 1,
    gap: getFontSize(0.5),
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
});
