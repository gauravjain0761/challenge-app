import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {getFontSize} from '../utils/responsiveFn';
import {Colors} from '../constants/Colors';
import {isArray, isNumber} from 'lodash';
import {WheelPicker} from 'react-native-infinite-wheel-picker';

interface DayPickerProps {
  selectedDuration: number;
  handleDurationChange: (itemValue: number) => void;
  label: string | string[];
  containerStyle?: ViewStyle;
  restElements?: 1 | 2 | 3 | 4 | 5;
  isAutoScroll?: boolean;
}

const DayPicker: React.FC<DayPickerProps> = ({
  selectedDuration,
  handleDurationChange,
  label,
  containerStyle,
  restElements = 1,
}) => {
  const pickerRef = useRef<any>(null);
  const [selectedValue, setSelectedValue] = useState<number>(selectedDuration - 1);
  const [isProgrammatic, setIsProgrammatic] = useState(false);

  // Create combined items with number and label
  const labels = isArray(label) ? label : [label];
  const combinedData = React.useMemo(() => {
    return labels.map((item, index) => {
      const num = index + 1;
      // Add spacing for single digit numbers to align them
       const numStr = num < 2 ? `${num}   ` : num < 3 ? `${num}           ` : num < 4 ? `${num}       ` : num < 5 ? `${num}       `: num < 6 ? `  ${num}   ` : `${num} `;
       return `${numStr}   ${item}`;
      //return `${num}   ${item}`;
    });
  }, [labels]);

  useEffect(() => {
    if (
      isNumber(Number(selectedDuration)) &&
      selectedDuration !== selectedValue + 1
    ) {
      setSelectedValue(selectedDuration - 1);
      setIsProgrammatic(true);
    }
  }, [selectedDuration, selectedValue]);

  useEffect(() => {
    if (isProgrammatic && pickerRef.current) {
      const timeout = setTimeout(() => {
        pickerRef.current.scrollToIndex(selectedValue);
        setIsProgrammatic(false);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isProgrammatic, selectedValue]);

  return (
    <View style={[styles.pickerContainer, containerStyle]}>
      <WheelPicker
        ref={pickerRef}
        data={combinedData}
        infiniteScroll={false}
        restElements={restElements}
        elementHeight={40}
        onChangeValue={index => {
          setSelectedValue(index);
          handleDurationChange(index + 1);
        }}
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
  pickerContainer: {
    flexDirection: 'row',
    height: getFontSize(10),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'relative',
  },
  selectedLayoutStyle: {
    borderRadius: 0,
    backgroundColor: 'rgba(51,51,51,0.5)',
  },
  containerStyle: {
    width: getFontSize(35),
    borderRadius: 0,
    overflow: 'hidden',
  },
  elementTextStyle: {
    fontSize: getFontSize(2.2),
    fontWeight: '600',
    color: Colors.white,
  },
});

export default DayPicker;
