import {I18nManager, StyleSheet} from 'react-native';
import React from 'react';
import {SvgXml} from 'react-native-svg';

interface Props {
  svgIcon: any;
  fill?: string;
  height?: number;
  width?: number;
  isRtl?: number;
  style?: any;
  onPress?: () => void;
}

const CustomSVG = ({
  svgIcon,
  fill,
  height,
  width,
  isRtl = 0,
  style = {},
  onPress,
}: Props) => {
  const styles = Array.isArray(style) ? style : [style];
  let svg;
  svg = fill
    ? svgIcon.replace(
        /fill="#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})"/g,
        `fill="${fill}"`,
      )
    : svgIcon;
  // let h = svgIcon.match(/height="(\d+)"/)[1];
  // let w = svgIcon.match(/width="(\d+)"/)[1];

  return (
    <SvgXml
      xml={svg}
      height={height}
      width={width}
      style={[...styles]}
      onPress={onPress}
    />
  );
};

export default CustomSVG;

const CustomSvgStyle = StyleSheet.create({
  scale: {
    transform: [{scaleX: -1}],
  },
});
