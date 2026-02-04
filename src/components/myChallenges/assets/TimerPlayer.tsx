import {StyleSheet, View} from 'react-native';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {GetInProgressActionAssetsData} from '@/validation/schemas';
import BottomControls from './BottomControls';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import TimerUpDown from './TimerUpDown';
import TimerBoxWithSvgProgress from './TimerBoxWithSvgProgress';

interface Props {
  item: GetInProgressActionAssetsData;
  isActive?: boolean;
}

const TimerPlayer = memo(({item, isActive}: Props) => {
  const defaultTotalSec = item?.timer?.duration ?? 180;

  const [totalSec, setTotalSec] = useState(defaultTotalSec);
  const [remainingTime, setRemainingTime] = useState(defaultTotalSec);
  const [isRunning, setIsRunning] = useState(false);
  const [paused, setPaused] = useState(false);

  // Restart when inactive
  useEffect(() => {
    if (!isActive) {
      handleRestart();
    }
  }, [isActive]);

  // Timer effect
  useEffect(() => {
    if (!isRunning || paused) return;

    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleRestart();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, paused]);

  const handleToggle = useCallback(() => {
    if (!isRunning && !paused) {
      setIsRunning(true);
    } else if (paused) {
      setPaused(false);
    } else {
      setPaused(true);
    }
  }, [isRunning, paused]);

  const handleRestart = useCallback(() => {
    setIsRunning(false);
    setPaused(false);
    setTotalSec(defaultTotalSec);
    setRemainingTime(defaultTotalSec);
  }, [defaultTotalSec]);

  const handleAddMinute = useCallback(() => {
    const updated = totalSec + 60;
    setTotalSec(updated);
    setRemainingTime(prev => prev + 60);
  }, [totalSec]);

  const handleSubtractMinute = useCallback(() => {
    if (totalSec <= 60) return;

    const updated = totalSec - 60;
    setTotalSec(updated);
    setRemainingTime(prev => Math.max(0, prev - 60));
  }, [totalSec]);

  return (
    <View style={styles.container}>
      <View style={styles.boxContainer}>
        <TimerUpDown
          title="Time"
          onPressUp={handleAddMinute}
          onPressDown={handleSubtractMinute}
        />
        <TimerBoxWithSvgProgress
          remainingTime={remainingTime}
          totalTime={totalSec}
        />
        <View style={styles.emptyBox} />
      </View>

      <BottomControls
        isPlaying={isRunning && !paused}
        togglePlayPause={handleToggle}
        restart={handleRestart}
        loading={false}
        isMuted={false}
        position={totalSec - remainingTime}
        duration={totalSec}
        isMuteShow={false}
      />
    </View>
  );
});

export default TimerPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  boxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: getFontSize(1.5),
  },
  emptyBox: {
    width: getFontSize(8),
  },
});
