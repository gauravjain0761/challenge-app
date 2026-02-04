import React, {useRef, useState, useEffect, memo} from 'react';
import {View, Text, StyleSheet, Animated, Easing} from 'react-native';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import PlaybackControls from './PlaybackControls';
import BottomControls from './BottomControls';
import {GetInProgressActionAssetsData} from '@/validation/schemas';
import {formatToHMS} from '@/utils/common/commonFunction';
import {Phase} from '@/types';
import {BreathWorkPhase} from '@/types/enums';
import {useAudioPlayer} from 'expo-audio';

interface BoxBreathWorkProps {
  item: GetInProgressActionAssetsData;
  isActive: boolean;
}

const BoxBreathWork = memo(({item, isActive}: BoxBreathWorkProps) => {
  // load the same MP3 once on mount
  const meditationSound = useAudioPlayer(
    require('@/assets/images/meditationSound.mp3'),
  );

  const inhaleSec = item?.breathwork?.inhale ?? 4;
  const holdSec = item?.breathwork?.hold ?? 0;
  const exhaleSec = item?.breathwork?.exhale ?? 4;
  const exhaleHoldSec = item?.breathwork?.exhaleHold ?? 4;
  const totalSec = item?.breathwork?.timer ?? 180;

  const [phase, setPhase] = useState<Phase>(BreathWorkPhase.INHALE);
  const [isRunning, setIsRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
  const [remainingTime, setRemainingTime] = useState(totalSec);

  const timers = useRef<NodeJS.Timeout[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const cycleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scale = useRef(new Animated.Value(1)).current;

  const playPhaseSound = () => {
    if (meditationSound) {
      // Reset to beginning and play
      meditationSound.seekTo(0);
      meditationSound.play();
    }
  };

  const clearTimers = () => {
    timers.current.forEach(t => clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => {
    if (!isActive) {
      clearTimers();
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
      setPhase(BreathWorkPhase.INHALE);
      setIsRunning(false);
      setPaused(false);
      setPhaseTimeLeft(0);
      setRemainingTime(totalSec);
      scale.setValue(1);
    }
  }, [isActive]);

  const animateScale = (toValue: number, duration: number) => {
    Animated.timing(scale, {
      toValue,
      duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const startPhaseTimer = (duration: number) => {
    setPhaseTimeLeft(duration / 1000);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setPhaseTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRemainingTimeTimer = () => {
    setRemainingTime(totalSec);
    if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
    cycleIntervalRef.current = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(cycleIntervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const runCycle = () => {
    const cycleDuration =
      (inhaleSec + holdSec + exhaleSec + exhaleHoldSec) * 1000;
    let elapsed = 0;

    const loopCycle = () => {
      if (elapsed >= totalSec * 1000) {
        setIsRunning(false);
        return;
      }

      clearTimers();
      scale.setValue(1);
      setPhase(BreathWorkPhase.INHALE);
      playPhaseSound();
      setIsRunning(true);
      setPaused(false);
      startPhaseTimer(inhaleSec * 1000);
      animateScale(0.6, inhaleSec * 1000);

      let delay = inhaleSec * 1000;

      if (holdSec > 0) {
        timers.current.push(
          setTimeout(() => {
            setPhase(BreathWorkPhase.HOLD);
            playPhaseSound();
            startPhaseTimer(holdSec * 1000);
          }, delay),
        );
        delay += holdSec * 1000;
      }

      timers.current.push(
        setTimeout(() => {
          setPhase(BreathWorkPhase.EXHALE);
          playPhaseSound();
          startPhaseTimer(exhaleSec * 1000);
          animateScale(1, exhaleSec * 1000);
        }, delay),
      );
      delay += exhaleSec * 1000;

      if (exhaleHoldSec > 0) {
        timers.current.push(
          setTimeout(() => {
            setPhase(BreathWorkPhase.HOLD);
            playPhaseSound();
            startPhaseTimer(exhaleHoldSec * 1000);
          }, delay),
        );
        delay += exhaleHoldSec * 1000;
      }

      timers.current.push(
        setTimeout(() => {
          elapsed += cycleDuration;
          loopCycle();
        }, delay),
      );
    };

    startRemainingTimeTimer();
    loopCycle();
  };

  const handleToggle = () => {
    if (!isRunning && !paused) {
      runCycle();
    } else if (paused) {
      setPaused(false);
      runCycle(); // resume from beginning of next cycle
    } else {
      handlePause();
    }
  };

  const handlePause = () => {
    setPaused(true);
    clearTimers();
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
    scale.stopAnimation();
  };

  const handleRestart = () => {
    setPaused(false);
    runCycle();
  };

  useEffect(() => {
    return () => {
      clearTimers();
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
    };
  }, []);

  const formatTime = (sec: number) => formatToHMS(sec);

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <View style={styles.boxContainer}>
          <Animated.View
            style={[
              styles.box,
              {
                transform: [{scale}],
              },
            ]}
          />
          <View style={styles.centerTextContainer}>
            <Text style={styles.centerText}>{phase}</Text>
            {phase && <Text style={styles.timerText}>{phaseTimeLeft}s</Text>}
          </View>
        </View>
      </View>

      <PlaybackControls time={formatTime(remainingTime)} isIconShow={false} />

      <BottomControls
        isPlaying={isRunning && !paused}
        togglePlayPause={handleToggle}
        restart={handleRestart}
        loading={false}
        toggleMute={() => {}}
        isMuted={false}
        position={totalSec - remainingTime}
        duration={totalSec}
        isMuteShow={false}
      />
    </View>
  );
});

export default BoxBreathWork;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  boxContainer: {
    height: getFontSize(25),
    width: getFontSize(25),
    borderColor: Colors.orange,
    borderRadius: getFontSize(1),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  box: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    borderRadius: getFontSize(1),
    borderWidth: 4,
    borderColor: Colors.orange,
  },
  centerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    color: Colors.white,
    fontSize: getFontSize(2.4),
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  timerText: {
    color: Colors.orange,
    fontSize: getFontSize(2.2),
    fontWeight: '600',
    marginTop: 5,
  },
});
