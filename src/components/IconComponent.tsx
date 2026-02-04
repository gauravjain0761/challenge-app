import React from 'react';
import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
  FontAwesome6,
  
} from '@expo/vector-icons';

import {TextStyle} from 'react-native';

const iconPacks = {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
  FontAwesome6,
} as const;

export type IconType = keyof typeof iconPacks;

interface IconProps {
  type?: IconType;
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
  onPress?: () => void;
}

const IconComponent: React.FC<IconProps> = ({
  type = 'AntDesign',
  name,
  size = 24,
  color = '#000',
  style,
  onPress,
}) => {
  const IconComponent = iconPacks[type];
  return (
    <IconComponent
      name={name as any} // Suppress name TS warning (optional enhancement later)
      size={size}
      color={color}
      style={style}
      onPress={onPress}
    />
  );
};

export default IconComponent;
