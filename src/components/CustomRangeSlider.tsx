import React, {useCallback, useState} from 'react';
import {View, StyleSheet, LayoutChangeEvent} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  runOnJS,
  withTiming,
  useDerivedValue,
} from 'react-native-reanimated';
import {Canvas, Fill, Shader, Skia, vec} from '@shopify/react-native-skia';
import {getFontSize} from '@/utils/responsiveFn';

interface Props {
  min?: number;
  max?: number;
  value?: number;
  onChange?: (val: number) => void;
}

// Glass shader with frosted effect - static appearance
const shaderSource = Skia.RuntimeEffect.Make(`
uniform float progress;
uniform vec2 size;

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

vec4 main(vec2 pos) {
  vec2 uv = pos / size;

  // Frosted glass noise texture
  float noise = rand(pos) * 0.03;

  // Background track (dark glass) (1.0, 1.0, 1.0, 0.2) (0.25, 0.25, 0.28, 0.5)
  vec4 trackColor = vec4(0.2, 0.2, 0.2, 0.3);

  // Progress fill (orange glass #C05600)
  vec4 progressColor = vec4(0.753, 0.337, 0.0, 0.85);

  // Determine if current pixel is in progress or track area
  vec4 baseColor = uv.x <= progress ? progressColor : trackColor;

  // Add glass highlights (top highlight)
  float topHighlight = smoothstep(0.8, 1.0, uv.y) * 0.2;
  baseColor.rgb += topHighlight;

  // Add subtle center glow
  float centerGlow = (1.0 - abs(uv.y - 0.5) * 2.0) * 0.1;
  baseColor.rgb += centerGlow;

  // Add frosted texture
  baseColor.rgb += noise;

  // Add subtle border darkening
  float border = smoothstep(0.0, 0.1, uv.y) * smoothstep(1.0, 0.9, uv.y);
  baseColor.rgb *= (0.85 + border * 0.15);

  return baseColor;
}
`);

const CustomSlider: React.FC<Props> = ({
  min = 0,
  max = 10,
  value = 0,
  onChange = () => {},
}) => {
  const trackWidth = useSharedValue(1); // Initialize with 1 so shader renders immediately
  const translateX = useSharedValue(0);
  const stepWidth = useSharedValue(0);
  const [sliderValue, setSliderValue] = useState(min);
  const isDragging = useSharedValue(false);

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const width = e.nativeEvent.layout.width;
      if (width <= 0 || max === min) return;
      trackWidth.value = width;
      stepWidth.value = width / (max - min);
      translateX.value = withTiming(stepWidth.value * (value - min));
    },
    [max, min, value],
  );

  const handleRelease = (rawValue: number) => {
    onChange(rawValue);
    setSliderValue(rawValue);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
      isDragging.value = true;
    },
    onActive: (event, ctx: any) => {
      let newX = ctx.startX + event.translationX;
      newX = Math.max(0, Math.min(newX, trackWidth.value));
      translateX.value = newX;
    },
    onEnd: () => {
      isDragging.value = false;
      if (stepWidth.value === 1) return;
      let rawValue = Math.round(translateX.value / stepWidth.value) + min;
      rawValue = Math.max(min, Math.min(rawValue, max));
      const snappedX = stepWidth.value * (rawValue - min);
      translateX.value = withTiming(snappedX, {duration: 150});
      runOnJS(handleRelease)(rawValue);
    },
  });

  console.log('translateX.value', translateX.value);

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value - (translateX.value < 2 ? 18 : 25)},
      ],
    };
  });

  const thumbOpacity = useAnimatedStyle(() => {
    // Show BlurView when dragging, hide when stopped
    return {
      opacity: withTiming(isDragging.value ? 1 : 0, {duration: 200}),
    };
  });

  const thumbSolidOpacity = useAnimatedStyle(() => {
    // Show solid color when stopped, hide when dragging
    return {
      opacity: withTiming(isDragging.value ? 0 : 1, {duration: 200}),
    };
  });

  const thumbGlow = useAnimatedStyle(() => {
    // Subtle white glow effect when dragging
    return {
      opacity: withTiming(isDragging.value ? 0.6 : 0, {duration: 200}),
    };
  });

  // ✅ uniforms derived safely
  const uniforms = useDerivedValue(() => {
    if (trackWidth.value <= 0) {
      return {progress: 0, size: vec(1, 1)};
    }
    return {
      progress: translateX.value / trackWidth.value,
      size: vec(trackWidth.value, 12),
    };
  }, [trackWidth, translateX]);

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer} onLayout={onLayout}>
        {shaderSource && trackWidth.value > 0 ? (
          <Canvas style={styles.canvas}>
            <Fill>
              <Shader source={shaderSource} uniforms={uniforms} />
            </Fill>
          </Canvas>
        ) : (
          <View
            style={[
              styles.canvas,
              {backgroundColor: 'rgba(255, 255, 255, 0.35)'},
            ]}
          />
        )}

        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.thumbContainer, thumbStyle]}>
            {/* Subtle white glow effect - visible when dragging */}
            <Animated.View style={[styles.thumbGlowEffect, thumbGlow]} />

            {/* Glass effect - visible when dragging */}
            <Animated.View style={[styles.thumbGlass, thumbOpacity]} />

            {/* Solid color - visible when stopped */}
            <Animated.View style={[styles.thumbSolid, thumbSolidOpacity]} />
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  );
};

export default CustomSlider;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
  },
  canvas: {
    position: 'absolute',
    width: '100%',
    height: 12,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  thumbContainer: {
    position: 'absolute',
    width: getFontSize(4.5),
    height: getFontSize(3),
  },
  thumbGlass: {
    position: 'absolute',
    width: getFontSize(5.5),
    height: getFontSize(3),
    borderRadius: 16,
    //backgroundColor: "rgba(255, 255, 255, 0.25)", // Semi-transparent for glass effect
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    shadowColor: '#fff',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 0},
  },
  thumbGlowEffect: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -7,
    bottom: -1,
    borderRadius: getFontSize(4.5),
    //backgroundColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: 'transparent',
    shadowColor: '#fff',
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowOffset: {width: 0, height: 0},
  },
  thumbSolid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(192, 86, 0, 1)', // #C05600
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
});
