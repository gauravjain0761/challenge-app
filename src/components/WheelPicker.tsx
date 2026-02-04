import React, {memo, useEffect} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {getFontSize} from '../utils/responsiveFn';
import {Colors} from '../constants/Colors';
import {WheelPicker} from 'react-native-infinite-wheel-picker';

interface WheelPickerProps {
  data: string[];
  onChange?: (item: any) => void;
  containerStyle?: ViewStyle;
  selectedValue?: any;
  restElements?: 1 | 2 | 3 | 4 | 5;
  isAutoScroll?: boolean;
}

const CustomWheelPicker: React.FC<WheelPickerProps> = ({
  data,
  onChange = () => {},
  containerStyle,
  selectedValue,
  restElements = 1,
  isAutoScroll,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <WheelPicker
        data={data}
        infiniteScroll={false}
        restElements={restElements}
        elementHeight={40}
        onChangeValue={value => onChange(value)}
        selectedIndex={selectedValue}
        decelerationRate="normal"
        containerStyle={styles.containerStyle}
        elementTextStyle={styles.elementTextStyle}
        selectedLayoutStyle={styles.selectedLayoutStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignSelf: 'center',
  },
  selectedLayoutStyle: {
    borderRadius: 0,
    backgroundColor: 'rgba(51,51,51,0.5)',
  },
  containerStyle: {
    width: getFontSize(20),
    borderRadius: 0,
    overflow: 'hidden',
  },
  elementTextStyle: {
    fontSize: getFontSize(2.2),
    fontWeight: '600',
    color: Colors.white,
  },
});

export default memo(CustomWheelPicker);
