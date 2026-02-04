import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, FlatList, Dimensions} from 'react-native';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import {Picker} from '@react-native-picker/picker';

const DAYS = Array.from({length: 9999}, (_, i) => i + 1);

interface CustomWheelPickerProps {
  selectedDuration: number | any;
  handleDurationChange: (itemValue: number) => void;
  label: string;
  isDays?: boolean;
  isFirst?: boolean;
}

const MaxoutPicker: React.FC<CustomWheelPickerProps> = ({
  selectedDuration,
  handleDurationChange,
  label,
  isDays = false,
  isFirst,
}) => {
  const [selectedValue, setSelectedValue] = useState(0);

  useEffect(() => {
    const time = setTimeout(() => {
      setSelectedValue(parseInt(selectedDuration));
    }, 200);

    return () => clearTimeout(time);
  }, [selectedDuration]);

  useEffect(() => {
    if (selectedValue) {
      handleDurationChange(selectedValue);
    }
  }, [selectedValue]);

  return (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={setSelectedValue}
        style={styles.picker}>
        {DAYS.map(day => (
          <Picker.Item
            key={day}
            style={styles.picker}
            label={
              isDays
                ? `${day}${
                    day === 1
                      ? `                  Day`
                      : '                 Days'
                  }`
                : `${day}                  ${label}`
            }
            value={day}
            color={
              day === selectedDuration ? Colors.white : Colors.inactiveTabColor
            }
          />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    height: getFontSize(25),
    justifyContent: 'center',
    marginTop: getFontSize(15),
  },
  picker: {
    backgroundColor: 'transparent',
    color: Colors.white,
    gap: getFontSize(2),
    textTransform: 'capitalize',
  },
});

export default MaxoutPicker;