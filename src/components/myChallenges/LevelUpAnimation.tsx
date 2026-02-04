import {Images} from '@/assets/images';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {Text, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
  FadeIn,
} from 'react-native-reanimated';

export default function LevelUpAnimation({isGoalHit}: {isGoalHit: boolean}) {
  const containerTranslateY = useSharedValue(30);
  const containerOpacity = useSharedValue(0);

  const arrow1Y = useSharedValue(0);

  const startContainerAnimation = () => {
    containerOpacity.value = withTiming(1, {duration: 300});
    containerTranslateY.value = withTiming(0, {
      duration: 700,
      easing: Easing.out(Easing.exp),
    });
  };

  const startArrowAnimations = () => {
    arrow1Y.value = withRepeat(
      withTiming(-10, {
        duration: 500,
        easing: Easing.inOut(Easing.quad),
      }),
      -1,
      true, // reverse for up/down
    );
  };

  useEffect(() => {
    startContainerAnimation();
    startArrowAnimations();
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{translateY: containerTranslateY.value}],
    opacity: containerOpacity.value,
  }));

  const arrow1Style = useAnimatedStyle(() => ({
    transform: [{translateY: arrow1Y.value}],
  }));

  return (
    <View style={styles.mainContainer}>
      <Animated.View
        style={[styles.container, containerStyle]}
        entering={FadeIn}>
        <Animated.Image
          style={[styles.image, arrow1Style]}
          source={Images.level_up}
          tintColor={Colors._C05600}
        />
        <Text style={styles.text}>
          {' '}
          {isGoalHit ? 'GOAL HIT' : 'LEVELED UP'}{' '}
        </Text>
        <Animated.Image
          style={[styles.image, arrow1Style]}
          source={Images.level_up}
          tintColor={Colors._C05600}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: getFontSize(2),
    // right: 0,
  },
  container: {
    // alignSelf: 'flex-end',
    zIndex: 999,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: Colors._C05600,
    fontSize: getFontSize(2.5),
    fontWeight: '800',
  },
  image: {
    width: getFontSize(2.5),
    height: getFontSize(2.5),
  },
});
