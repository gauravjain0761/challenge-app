import React, {useRef, useState, useEffect, memo} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import PlaybackControls from './PlaybackControls';
import BottomControls from './BottomControls';
import {GetInProgressActionAssetsData} from '@/validation/schemas';
import {formatToHMS} from '@/utils/common/commonFunction';
import {Easing} from 'react-native-reanimated';
import {useAudioPlayer} from 'expo-audio';
import { Phase } from '@/types';
import { BreathWorkPhase } from '@/types/enums';

interface BreathWorkProps {
  item: GetInProgressActionAssetsData;
  isActive: boolean;
}

const BreathWork = memo(({item, isActive}: BreathWorkProps) => {
  // load the same MP3 once on mount
  const meditationSound = useAudioPlayer(
    require('@/assets/images/meditationSound.mp3'),
  );

  const inhaleSec = item?.breathwork?.inhale ?? 4;
  const holdSec = item?.breathwork?.hold ?? 0; // Default to 0 if not provided
  const exhaleSec = item?.breathwork?.exhale ?? 4;
  const totalSec = item?.breathwork?.timer ?? 180;

  const boxCount = inhaleSec;

  const [phase, setPhase] = useState<Phase>(BreathWorkPhase.INHALE);
  const [isRunning, setIsRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
  const [position, setPosition] = useState(0);
  const [remainingTime, setRemainingTime] = useState(totalSec);

  const timers = useRef<NodeJS.Timeout[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cycleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const inhaleAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const releaseAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const opacities = useRef(
    Array.from({length: boxCount}, () => new Animated.Value(0)),
  ).current;

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

  const resetBoxes = () => {
    opacities.forEach(op => op.setValue(0));
  };

  useEffect(() => {
    if (!isActive) {
      resetBoxes();
      clearTimers();
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
      if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
      setPhase(BreathWorkPhase.INHALE);
      setIsRunning(false);
      setPaused(false);
      setPhaseTimeLeft(0);
      setPosition(0);
      setRemainingTime(totalSec);
    }
  }, [isActive]);


  const animateBoxesInhale = () => {
    const singleDuration = (inhaleSec * 1000) / boxCount;
    const fadeDur = 1000;
    const animations = opacities.map((op, i) =>
      Animated.timing(op, {
        toValue: 1,
        duration: fadeDur, // slow it down 50%
        delay: 0, // we’ll use stagger instead
        easing: Easing.inOut(Easing.ease), // smooth ease-in/out
        useNativeDriver: true,
      }),
    );

    inhaleAnimRef.current?.stop();
    const staggered = Animated.stagger(singleDuration, animations);
    inhaleAnimRef.current = staggered;
    staggered.start();
  };

  const animateBoxesRelease = () => {
    const singleDuration = (exhaleSec * 1000) / boxCount;
    const fadeDur = 1000;
    const animations = opacities
      .slice()
      .reverse()
      .map(op =>
        Animated.timing(op, {
          toValue: 0,
          duration: fadeDur,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      );
    releaseAnimRef.current?.stop();
    const staggered = Animated.stagger(singleDuration, animations);
    releaseAnimRef.current = staggered;
    staggered.start();
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
    let cycleDuration = (inhaleSec + holdSec + exhaleSec) * 1000;
    let elapsed = 0;

    const loopCycle = () => {
      if (elapsed >= totalSec * 1000) {
        setIsRunning(false);
        return;
      }

      resetBoxes();
      clearTimers();
      setPhase(BreathWorkPhase.INHALE);
      playPhaseSound();
      setIsRunning(true);
      setPaused(false);
      startPhaseTimer(inhaleSec * 1000);
      animateBoxesInhale();

      timers.current.push(
        setTimeout(() => {
          setPhase(BreathWorkPhase.HOLD);
          if (holdSec > 0) {
            playPhaseSound();
            startPhaseTimer(holdSec * 1000);
          } else {
            // Skip the hold phase if holdSec is 0 or not provided
            setPhase(BreathWorkPhase.RELEASE);
            playPhaseSound();
            startPhaseTimer(exhaleSec * 1000);
            animateBoxesRelease();
          }
        }, inhaleSec * 1000),
      );

      if (holdSec > 0) {
        timers.current.push(
          setTimeout(() => {
            setPhase(BreathWorkPhase.RELEASE);
            playPhaseSound();
            startPhaseTimer(exhaleSec * 1000);
            animateBoxesRelease();
          }, (inhaleSec + holdSec) * 1000),
        );
      } else {
        timers.current.push(
          setTimeout(() => {
            setPhase(BreathWorkPhase.RELEASE);
            playPhaseSound();
            startPhaseTimer(exhaleSec * 1000);
            animateBoxesRelease();
          }, inhaleSec * 1000),
        );
      }

      timers.current.push(
        setTimeout(() => {
          elapsed += cycleDuration;
          loopCycle();
        }, cycleDuration),
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
    if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
    if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
    inhaleAnimRef.current?.stop();
    releaseAnimRef.current?.stop();
  };

  const handleRestart = () => {
    setPaused(false);
    setPosition(0);
    runCycle();
  };

  useEffect(() => {
    return () => {
      clearTimers();
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
      if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
    };
  }, []);

  const formatTime = (sec: number) => formatToHMS(sec);

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <View style={styles.boxContainer}>
          {opacities.map((opacity, i) => (
            <Animated.View
              key={i}
              style={[
                styles.box,
                {
                  opacity,
                  height: `${90 - i * (60 / boxCount)}%`,
                  width: `${90 - i * (60 / boxCount)}%`,
                  borderColor: `${Colors.orange}${Math.floor(
                    255 - i * (200 / boxCount),
                  ).toString(16)}`,
                },
              ]}
            />
          ))}
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

export default BreathWork;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  boxContainer: {
    height: getFontSize(25),
    width: getFontSize(25),
    borderWidth: 4,
    borderColor: Colors.orange,
    borderRadius: getFontSize(1),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  box: {
    position: 'absolute',
    borderRadius: getFontSize(1),
    borderWidth: 2,
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