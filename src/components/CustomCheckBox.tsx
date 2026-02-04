import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import IconComponent from './IconComponent';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';

interface CustomCheckBoxProps {
  title: string;
  onPress?: () => void;
  isSelected?: boolean;
}

const CustomCheckBox = ({
  title,
  onPress,
  isSelected = false,
}: CustomCheckBoxProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.checkbox}>
        {isSelected && (
          <IconComponent
            name="check"
            type="Entypo"
            size={getFontSize(2)}
            color={Colors._C05600}
          />
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomCheckBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors._C05600,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: getFontSize(1.8),
    fontWeight: '500',
    color: Colors.white,
  },
});
