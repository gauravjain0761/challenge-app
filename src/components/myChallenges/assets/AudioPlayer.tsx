import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Easing, StyleSheet, View} from 'react-native';
import {GetInProgressActionAssetsData} from '@/validation/schemas';
import {getFontSize} from '@/utils/responsiveFn';
import PlaybackControls from './PlaybackControls';
import BottomControls from './BottomControls';
import Waveform from './Waveform';
import {useAudioPlayer} from 'expo-audio';
import {errorToast} from '@/utils/common/commonFunction';

interface AudioPlayerProps {
  item: GetInProgressActionAssetsData;
  onLoaded?: (value: boolean) => void;
  isActive?: boolean;
  onPlayingChange?: (isPlaying: boolean) => void;
}

const AudioPlayer = memo(
  ({
    item,
    onLoaded = () => {},
    isActive = false,
    onPlayingChange = () => {},
  }: AudioPlayerProps) => {
    const animationRefs = useRef<Animated.Value[]>([]);
    const animationLoops = useRef<Animated.CompositeAnimation[]>([]);
    const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const isMountedRef = useRef<boolean>(true);
    const wasPlayingRef = useRef<boolean>(false);
    const lastPositionRef = useRef<number>(0);
    const volumeBeforeMuteRef = useRef<number>(1);
    const playerRef = useRef<any>(null);
    const initialLoadDone = useRef<boolean>(false);

    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [position, setPosition] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isMuted, setIsMuted] = useState(false);

    const audioUrl = item?.files?.fileUrl || '';

    const player = useAudioPlayer(audioUrl);

    useEffect(() => {
      initialLoadDone.current = false;
    }, [item]);

    useEffect(() => {
      playerRef.current = player;
      return () => {
        playerRef.current = null;
      };
    }, [player]);

    useEffect(() => {
      animationRefs.current = Array(50)
        .fill(null)
        .map(() => new Animated.Value(0));

      return () => {
        stopWaveformAnimation();
      };
    }, []);

    useEffect(() => {
      isMountedRef.current = true;

      return () => {
        isMountedRef.current = false;
        if (timeUpdateIntervalRef.current) {
          clearInterval(timeUpdateIntervalRef.current);
          timeUpdateIntervalRef.current = null;
        }
        stopWaveformAnimation();

        if (playerRef.current?.playing) {
          playerRef.current.pause();
        }
      };
    }, []);

    useEffect(() => {
      if (!player || !isActive) return;

      const handleLoaded = async () => {
        if (!player.isLoaded) return;

        if (initialLoadDone.current) return;
        initialLoadDone.current = true;

        setLoading(false);
        setDuration(Math.floor(player.duration || 0));
        setPosition(Math.floor(player.currentTime || 0));

        onLoaded(false);

        if (wasPlayingRef.current) {
          if (lastPositionRef.current > 0) {
            await player.seekTo(lastPositionRef.current);
          }

          try {
            await player.play();
            startWaveformAnimation();
            setIsPlaying(true);
            onPlayingChange(true);
          } catch (err) {
            console.error('Failed to resume playback:', err);
          }

          wasPlayingRef.current = false;
        }
      };

      if (player.isLoaded) {
        handleLoaded();
      } else {
        const loadListener = player.addListener(
          'playbackStatusUpdate',
          status => {
            if (status?.isLoaded && isMountedRef.current) {
              handleLoaded();
              loadListener.remove?.();
            }
          },
        );

        const timeoutId = setTimeout(() => {
          loadListener.remove?.();
          if (isMountedRef.current) {
            setLoading(false);
            onLoaded(false);
          }
        }, 10000); // 10 second timeout

        return () => {
          clearTimeout(timeoutId);
          loadListener.remove?.();
        };
      }
    }, [player, isActive, onLoaded, onPlayingChange]);

    useEffect(() => {
      if (!player || !player.isLoaded) return;

      if (!isActive && player.playing) {
        wasPlayingRef.current = true;
        lastPositionRef.current = player.currentTime || 0;

        player.pause();
        stopWaveformAnimation();
        setIsPlaying(false);
        onPlayingChange(false);
      }
    }, [isActive, player, onPlayingChange]);

    useEffect(() => {
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
        timeUpdateIntervalRef.current = null;
      }

      if (isPlaying && player?.isLoaded) {
        timeUpdateIntervalRef.current = setInterval(() => {
          if (player?.currentTime !== undefined && isMountedRef.current) {
            setPosition(Math.floor(player.currentTime || 0));
          }
        }, 250);
      }

      return () => {
        if (timeUpdateIntervalRef.current) {
          clearInterval(timeUpdateIntervalRef.current);
          timeUpdateIntervalRef.current = null;
        }
      };
    }, [isPlaying, player?.isLoaded]);

    useEffect(() => {
      if (!player) return;

      const statusListener = player.addListener(
        'playbackStatusUpdate',
        (status: any) => {
          if (!isMountedRef.current) return;

          if (status?.isLoaded) {
            if (status.currentTime >= status.duration - 0.2) {
              handlePlaybackEnd();
            }
          }
        },
      );

      return () => {
        statusListener.remove?.();
      };
    }, [player]);

    const startWaveformAnimation = useCallback(() => {
      if (animationLoops.current.length) return;

      animationLoops.current = animationRefs.current.map(anim =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 400 + Math.random() * 400,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 400 + Math.random() * 400,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
          ]),
        ),
      );

      animationLoops.current.forEach(loop => loop.start());
    }, []);

    const stopWaveformAnimation = useCallback(() => {
      animationLoops.current.forEach(loop => loop?.stop());
      animationLoops.current = [];
    }, []);

    const togglePlayPause = useCallback(() => {
      if (!player || !player.isLoaded) return;

      if (isPlaying) {
        player.pause();
        stopWaveformAnimation();
        setIsPlaying(false);
        onPlayingChange(false);
      } else {
        player.play();
        startWaveformAnimation();
        setIsPlaying(true);
        onPlayingChange(true);
      }
    }, [
      isPlaying,
      player,
      startWaveformAnimation,
      stopWaveformAnimation,
      onPlayingChange,
    ]);

    const rewind10s = useCallback(() => {
      if (!player || !player.isLoaded || loading) return;

      const newPosition = Math.max((player.currentTime || 0) - 10, 0);

      setPosition(Math.floor(newPosition));

      player.seekTo(newPosition);
    }, [player, loading]);

    const forward10s = useCallback(() => {
      if (!player || !player.isLoaded || loading) return;

      const newPosition = Math.min(
        (player.currentTime || 0) + 10,
        player.duration || 0,
      );

      setPosition(Math.floor(newPosition));

      player.seekTo(newPosition);
    }, [player, loading]);

    const handleRestart = useCallback(() => {
      if (!player || !player.isLoaded) return;

      player.seekTo(0);

      setPosition(0);

      if (!isPlaying) {
        player.play();
        startWaveformAnimation();
        setIsPlaying(true);
        onPlayingChange(true);
      }
    }, [player, isPlaying, startWaveformAnimation, onPlayingChange]);

    const toggleMute = useCallback(() => {
      if (!player || !player.isLoaded) return;

      try {
        const newMuted = !isMuted;

        if (newMuted) {
          volumeBeforeMuteRef.current = player.volume || 1;

          player.volume = 0;
        } else {
          player.volume = volumeBeforeMuteRef.current;
        }

        player.muted = newMuted;

        setIsMuted(newMuted);
      } catch (error) {
        console.error('Error toggling mute:', error);
        errorToast('Could not change audio settings');
      }
    }, [player, isMuted]);

    const handlePlaybackEnd = useCallback(() => {
      if (!isMountedRef.current) return;

      stopWaveformAnimation();

      if (player && player.isLoaded) {
        player.seekTo(0);
      }

      setIsPlaying(false);
      setPosition(0);

      onPlayingChange(false);
    }, [player, stopWaveformAnimation, onPlayingChange]);

    const formatTime = useCallback((seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(
        2,
        '0',
      )}`;
    }, []);

    const timeRemaining = formatTime(Math.max(0, duration - position));

    return (
      <View style={styles.container}>
        <Waveform animationRefs={animationRefs.current} />

        <PlaybackControls
          time={timeRemaining}
          rewind10s={rewind10s}
          forward10s={forward10s}
        />

        <View style={{top: 20}}>
          <BottomControls
            isPlaying={isPlaying}
            togglePlayPause={togglePlayPause}
            restart={handleRestart}
            loading={loading}
            toggleMute={toggleMute}
            isMuted={isMuted}
            position={position}
            duration={duration}
            isMuteShow={true}
          />
        </View>
      </View>
    );
  },
);

export default AudioPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: getFontSize(2),
  },
});
