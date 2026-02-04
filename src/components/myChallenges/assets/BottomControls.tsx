import React, {memo} from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Pressable as _Press,
  ViewStyle,
} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import IconComponent from '@/components/IconComponent';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';

const RADIUS = 35;
const CIRCLE_LENGTH = 2 * Math.PI * RADIUS;

interface BottomControlsProps {
  isPlaying: boolean;
  togglePlayPause: () => void;
  restart?: () => void;
  loading: boolean;
  toggleMute?: () => void;
  isMuted?: boolean;
  position: number;
  duration: number;
  isMuteShow?: boolean;
  isRestartShow?: boolean;
  containerStyles?: ViewStyle;
}

const CircularProgress = ({progress}: {progress: number}) => {
  const dashOffset = CIRCLE_LENGTH - progress * CIRCLE_LENGTH;

  return (
    <Svg width={80} height={80} style={styles.svgStyle}>
      <Circle
        cx="40"
        cy="40"
        r={RADIUS}
        stroke="#363636"
        strokeWidth={4}
        fill="none"
      />
      <Circle
        cx="40"
        cy="40"
        r={RADIUS}
        stroke={Colors.white}
        strokeWidth={4}
        strokeDasharray={CIRCLE_LENGTH}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        fill="none"
        rotation="-90"
        origin="40,40"
      />
    </Svg>
  );
};

const BottomControls = memo(
  ({
    isPlaying,
    togglePlayPause,
    restart,
    loading,
    toggleMute,
    isMuted,
    position,
    duration,
    isMuteShow = true,
    isRestartShow = true,
    containerStyles,
  }: BottomControlsProps) => {
    const progress = duration > 0 ? position / duration : 0;

    return (
      <View style={{...styles.container, ...containerStyles}}>
        {/* Restart Button or Spacer */}
        {isRestartShow ? (
          <_Press
            onPress={restart}
            hitSlop={10}
            accessibilityLabel="Restart"
            accessible
            style={styles.buttonContainer}>
            <IconComponent
              type="EvilIcons"
              name="undo"
              color={Colors.white}
              size={40}
            />
          </_Press>
        ) : (
          <View style={styles.emptyBox} />
        )}

        {/* Play/Pause Button with Progress */}
        <TouchableOpacity
          onPress={togglePlayPause}
          style={styles.playPauseWrapper}
          activeOpacity={0.8}
          hitSlop={10}
          accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
          accessible>
          <CircularProgress progress={progress} />
          {loading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <IconComponent
              type="Ionicons"
              name={isPlaying ? 'pause' : 'play'}
              color={Colors.white}
              size={40}
            />
          )}
        </TouchableOpacity>

        {/* Mute Toggle or Spacer */}
        {isMuteShow ? (
          <_Press
            onPress={toggleMute}
            hitSlop={10}
            accessibilityLabel={isMuted ? 'Unmute' : 'Mute'}
            accessible
            style={styles.buttonContainer}>
            <IconComponent
              type="Feather"
              name={isMuted ? 'volume-x' : 'volume-2'}
              color={Colors.white}
              size={28}
            />
          </_Press>
        ) : (
          <View style={styles.emptyBox} />
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: getFontSize(4),
    // marginTop: getFontSize(3),
    paddingBottom: getFontSize(6),
  },
  buttonContainer: {
    width: getFontSize(6),
    height: getFontSize(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgStyle: {
    position: 'absolute',
  },
  emptyBox: {
    height: getFontSize(5),
    width: getFontSize(5),
  },
});

export default BottomControls;
