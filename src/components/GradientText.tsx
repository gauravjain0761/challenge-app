import {StyleSheet, Text, TextStyle, ViewStyle} from 'react-native';
import React, {memo} from 'react';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import {getFontSize} from '@/utils/responsiveFn';

interface Props {
  text?: string | any;
  style?: TextStyle;
  gradientStyle?: ViewStyle;
  colors?: (string | number)[];
  start?: {x: number; y: number};
  end?: {x: number; y: number};
  height?: number;
  containerStyle?: ViewStyle;
  customGradient?: any;
}

const GradientText = ({
  text,
  style = {},
  gradientStyle,
  colors,
  start,
  end,
  height,
  containerStyle,
  customGradient,
}: Props) => {
  const fontSize = style.fontSize ?? getFontSize(1.8);
  const computedHeight = height ?? fontSize * 1.2; // Add some padding

  return (
    <MaskedView
      style={[containerStyle]}
      maskElement={
        customGradient ? (
          customGradient
        ) : (
          <Text style={{...styles.headingText, ...style}}>{text}</Text>
        )
      }>
      <LinearGradient
        colors={colors ?? ['#EF6C00', '#D1D1D6']}
        start={start ?? {x: 0, y: 0}}
        end={end ?? {x: 0.8, y: 0}}
        style={[{height: computedHeight}, gradientStyle]}
      />
    </MaskedView>
  );
};

export default memo(GradientText);

const styles = StyleSheet.create({
  headingText: {
    fontSize: getFontSize(1.8),
    fontWeight: '500',
  },
});
