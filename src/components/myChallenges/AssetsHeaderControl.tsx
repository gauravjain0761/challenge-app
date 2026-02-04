import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import IconComponent from '../IconComponent';

interface Props {
  title: string;
  onPressLeft: () => void;
  onPressRight: () => void;
  isRightIcon?: boolean;
  isLeftIcon?: boolean;
}

const ButtonView = ({title, onPress}: {title: string; onPress: () => void}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.backView}>
      <IconComponent name={title} size={getFontSize(3)} color={Colors.white} />
    </TouchableOpacity>
  );
};

const AssetsHeaderControl = memo(
  ({
    title,
    onPressLeft,
    onPressRight,
    isRightIcon = true,
    isLeftIcon = true,
  }: Props) => {
    return (
      <View style={styles.container}>
        {isLeftIcon ? (
          <ButtonView title="left" onPress={onPressLeft} />
        ) : (
          <View style={styles.button} />
        )}

        <Text style={styles.headerTitle}>
          {title ? title.split('(')[0] : ''}
        </Text>

        {isRightIcon ? (
          <ButtonView title="right" onPress={onPressRight} />
        ) : (
          <View style={styles.button} />
        )}
      </View>
    );
  },
);

export default AssetsHeaderControl;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: getFontSize(2),
  },
  headerTitle: {
    color: Colors.white,
    fontSize: getFontSize(2.2),
    fontWeight: '500',
    textAlign: 'center',
    textTransform: 'capitalize',
    flex: 1,
  },
  backView: {
    height: getFontSize(5),
    width: getFontSize(5),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors._2a2a2a,
    borderRadius: getFontSize(1),
  },
  button: {
    height: getFontSize(5),
    width: getFontSize(5),
  },
});
