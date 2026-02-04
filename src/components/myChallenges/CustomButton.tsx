import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import IconComponent from '../IconComponent';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';

interface ButtonProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress?: () => void;
  isRightIcon?: boolean;
  disabled?: boolean;
  onLayout?: (e: any) => void;
}

const CustomButton = ({
  icon,
  title,
  subtitle,
  onPress,
  isRightIcon = true,
  disabled = false,
  onLayout,
}: ButtonProps) => (
  <TouchableOpacity
    onLayout={onLayout}
    style={styles.button}
    disabled={disabled}
    onPress={onPress}>
    <View style={styles.buttonContent}>
      <View style={styles.buttonLeft}>
        <View style={styles.iconBox}>{icon}</View>
        <View style={styles.buttonTextContainer}>
          <Text style={styles.buttonTitle}>{title}</Text>
          <Text style={styles.buttonSubtitle}>{subtitle}</Text>
        </View>
      </View>
      {isRightIcon && (
        <IconComponent
          name="right"
          size={getFontSize(2.5)}
          color={Colors.white}
        />
      )}
    </View>
  </TouchableOpacity>
);

export default memo(CustomButton);

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.textInputBackground,
    padding: getFontSize(1.5),
    borderRadius: getFontSize(1),
    marginBottom: getFontSize(1.5),
    borderWidth: getFontSize(0.08),
    borderColor: Colors.borderColor,
    height: getFontSize(8),
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    height: getFontSize(5),
    width: getFontSize(5),
    backgroundColor: Colors.containerBGColor,
    borderRadius: getFontSize(1),
    borderWidth: getFontSize(0.08),
    borderColor: Colors.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    marginTop: getFontSize(2),
  },
  buttonTextContainer: {
    marginLeft: getFontSize(1),
  },
  buttonTitle: {
    color: 'rgba(255, 255, 255, 0.60)',
    fontSize: getFontSize(1.8),
  },
  buttonSubtitle: {
    fontSize: getFontSize(1.8),
    color: Colors.white,
    fontWeight: '400',
    marginTop: getFontSize(0.3),
  },
});
