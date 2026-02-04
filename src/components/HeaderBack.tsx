import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {Colors} from '@/constants/Colors';
import {getFontSize, SCREEN_WIDTH} from '@/utils/responsiveFn';
import IconComponent, {IconType} from './IconComponent';
import {router} from 'expo-router';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ViewStyle} from 'react-native';

interface Props {
  title: string;
  isBackground?: boolean;
  containerStyle?: ViewStyle;
  iconName?: string;
  iconType?: IconType;
  onPress?: () => void;
}

const HeaderBack = memo(
  ({
    title,
    isBackground = false,
    containerStyle,
    iconName,
    iconType,
    onPress,
  }: Props) => {
    const insets = useSafeAreaInsets();

    const onBack = () => {
      onPress && onPress();
      router.back();
    };

    const BackView = () => {
      return (
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          style={{...styles.container, ...containerStyle}}>
          <IconComponent
            name={iconName || 'left'}
            size={getFontSize(3)}
            color={Colors.white}
            type={iconType || 'AntDesign'}
          />
          <Text style={styles.headerTitle}>{title}</Text>
        </TouchableOpacity>
      );
    };

    return isBackground ? (
      <View
        style={{
          ...styles.headerContainer,
          paddingTop: insets.top,
          marginTop: -insets.top,
          width: SCREEN_WIDTH,
          alignSelf: 'center',
          paddingHorizontal: getFontSize(2),
        }}>
        <BackView />
      </View>
    ) : (
      <BackView />
    );
  },
);

export default HeaderBack;

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: Colors.dark.background,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: getFontSize(2),
    // paddingHorizontal: getFontSize(2),
  },
  headerTitle: {
    color: Colors.white,
    fontSize: getFontSize(2.5),
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});
