import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {GetInProgressActionAssetsData} from '@/validation/schemas';
import BottomControls from './BottomControls';
import TimerUpDown from './TimerUpDown';
import TimerBoxWithSvgProgress from './TimerBoxWithSvgProgress';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import Button from '@/components/Button';

interface Props {
  item: GetInProgressActionAssetsData;
  isActive?: boolean;
}

const TimerPlayerFocus = memo(({item, isActive}: Props) => {
  const defaultFocusDuration = item?.timer?.duration ?? 180;
  const defaultBreakDuration = 300;

  const [focusDuration, setFocusDuration] = useState(defaultFocusDuration);
  const [breakDuration, setBreakDuration] = useState(defaultBreakDuration);

  const [isFocusMode, setIsFocusMode] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(defaultFocusDuration);
  const [selectedRepeat, setSelectedRepeat] = useState(0);
  const [isValueChanged, setIsValueChanged] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

  const phases = useMemo(() => {
    return Array.from({length: (selectedRepeat + 1) * 2}).map((_, index) =>
      index % 2 === 0 ? 'Focus' : 'Break',
    );
  }, [selectedRepeat]);

  const totalPhases = phases.length;

  useEffect(() => {
    if (!isActive) handleRestart();
  }, [isActive]);

  useEffect(() => {
    if (!isRunning || paused) return;

    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);

          const nextIndex = currentPhaseIndex + 1;
          if (nextIndex < totalPhases) {
            const isNextFocus = nextIndex % 2 === 0;
            setCurrentPhaseIndex(nextIndex);
            setIsFocusMode(isNextFocus);
            setRemainingTime(isNextFocus ? focusDuration : breakDuration);
          } else {
            handleRestart();
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    isRunning,
    paused,
    currentPhaseIndex,
    totalPhases,
    focusDuration,
    breakDuration,
  ]);

  const handleToggle = useCallback(() => {
    if (isValueChanged) {
      setIsValueChanged(false);
      setCurrentPhaseIndex(0);
      setRemainingTime(focusDuration);
      setIsFocusMode(true);
    }

    if (!isRunning) {
      setIsRunning(true);
      setPaused(false);
    } else {
      setPaused(prev => !prev);
    }
  }, [isRunning, paused, focusDuration, isValueChanged]);

  const handleRestart = useCallback(() => {
    setPaused(false);
    setIsRunning(false);
    setIsFocusMode(true);
    setRemainingTime(focusDuration);
    setCurrentPhaseIndex(0);
    setIsValueChanged(false);
  }, [focusDuration]);

  const updateDuration = (
    type: 'focus' | 'break',
    amount: number,
    switchPhase: boolean = false,
  ) => {
    if (type === 'focus') {
      setIsValueChanged(true);

      setFocusDuration(prev => {
        const newVal = Math.max(60, prev + amount);
        if (isFocusMode) {
          setRemainingTime(newVal);
        }
        return newVal;
      });

      if (switchPhase) {
        setCurrentPhaseIndex(Math.max(0, currentPhaseIndex - 1));
        setIsFocusMode(true);
        setRemainingTime(focusDuration + amount);
      }
    } else {
      setIsValueChanged(true);
      setBreakDuration(prev => {
        const newVal = Math.max(60, prev + amount);
        console.log('ddfdf');

        if (!isFocusMode) {
          setRemainingTime(newVal);
          console.log('1');
        }
        return newVal;
      });

      if (switchPhase) {
        console.log('2');

        setCurrentPhaseIndex(currentPhaseIndex + 1);
        setIsFocusMode(false);
        setRemainingTime(breakDuration + amount);
      }
    }
  };

  const currentDuration = useMemo(
    () => (isFocusMode ? focusDuration : breakDuration),
    [isFocusMode, focusDuration, breakDuration],
  );

  return (
    <View style={styles.container}>
      <View style={styles.modeContainer}>
        <Text style={styles.modeText}>
          {phases[currentPhaseIndex] || 'Done'}
        </Text>
        <View style={styles.dotContainer}>
          {phases.map((phase, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (isRunning && !paused) return;
                setCurrentPhaseIndex(index);
                setIsFocusMode(phase === 'Focus');
                setRemainingTime(
                  phase === 'Focus' ? focusDuration : breakDuration,
                );
              }}>
              <View
                style={[
                  styles.dot,
                  index === currentPhaseIndex && styles.activeDot,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.boxContainer}>
        <TimerUpDown
          title="Focus"
          onPressUp={() => {
            if (isRunning && !paused) return;
            updateDuration('focus', 60, !isFocusMode);
          }}
          onPressDown={() => {
            if (isRunning && !paused) return;
            updateDuration('focus', -60, !isFocusMode);
          }}
          containerStyle={{
            opacity: isRunning && !paused ? 0.6 : 1,
          }}
        />

        <TimerBoxWithSvgProgress
          remainingTime={remainingTime}
          totalTime={currentDuration}
        />

        <TimerUpDown
          title="Break"
          onPressUp={() => {
            if (isRunning && !paused) return;
            updateDuration('break', 60, isFocusMode);
          }}
          onPressDown={() => {
            if (isRunning && !paused) return;
            updateDuration('break', -60, isFocusMode);
          }}
          containerStyle={{
            opacity: isRunning && !paused ? 0.6 : 1,
          }}
        />
      </View>

      <View style={styles.boxContainer}>
        {[...Array(3)].map((_, index) => (
          <Button
            title={'X' + (index + 1)}
            style={{width: '23%'}}
            type={selectedRepeat === index ? 'fill' : 'outline'}
            key={index.toString()}
            onPress={() => {
              setSelectedRepeat(index);
              handleRestart();
            }}
          />
        ))}
      </View>

      <BottomControls
        isPlaying={isRunning && !paused}
        togglePlayPause={handleToggle}
        restart={handleRestart}
        loading={false}
        isMuted={false}
        position={currentDuration - remainingTime}
        duration={currentDuration}
        isMuteShow={false}
        containerStyles={styles.containerStyles}
      />
    </View>
  );
});

export default TimerPlayerFocus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  modeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: getFontSize(1),
    gap: getFontSize(1.5),
  },
  modeText: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: getFontSize(2.5),
    fontWeight: '600',
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: getFontSize(1.5),
  },
  dot: {
    width: getFontSize(1.5),
    height: getFontSize(1.5),
    borderRadius: getFontSize(0.75),
    backgroundColor: Colors.white,
  },
  activeDot: {
    backgroundColor: Colors.orange,
  },
  boxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: getFontSize(1.5),
  },
  containerStyles: {
    top: getFontSize(2),
  },
});
