import React, {useEffect, useRef} from 'react';
import {Animated, View, StyleSheet, ViewStyle} from 'react-native';
import IconComponent from './IconComponent';
import {Colors} from '@/constants/Colors';
import FastImage from 'react-native-fast-image';
import {Images} from '@/assets/images';
import {getFontSize} from '@/utils/responsiveFn';
type AnimatedHandIconProps = {
  type: 'upDown' | 'leftRight';
  containerStyle?: ViewStyle;
};

const AnimatedHandIcon: React.FC<AnimatedHandIconProps> = ({
  type = 'upDown',
  containerStyle,
}) => {
  const translate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const toValue = type === 'upDown' ? -20 : 20;

    const loopAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(translate, {
          toValue,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translate, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );

    loopAnimation.start();

    return () => loopAnimation.stop(); // Clean up on unmount
  }, [translate, type]);

  const animatedStyle = {
    transform:
      type === 'upDown' ? [{translateY: translate}] : [{translateX: translate}],
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View style={animatedStyle}>
        {/* {type === 'leftRight' && (
          <IconComponent
            type="Feather"
            name="arrow-right"
            color={Colors._C05600}
            size={getFontSize(4)}
            style={styles.rightIcon}
          />
        )} */}
        <FastImage
          source={Images.hand_icon}
          defaultSource={Images.hand_icon}
          style={{width: 100, height: 100}}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  rightIcon: {
    position: 'absolute',
    right: getFontSize(3),
  },
});

export default AnimatedHandIcon;
