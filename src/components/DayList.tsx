import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {TouchableOpacity} from 'react-native';
import {Colors} from '@/constants/Colors';

const DayList = ({
  handleDayChange,
}: {
  handleDayChange: (day: string) => void;
}) => {
  const [selectIndex, setSelectIndex] = useState(0);

  const handlePress = (index: number) => {
    setSelectIndex(index);
    handleDayChange(`day${index + 1}`);
  };

  return (
    <View
      style={{
        backgroundColor: Colors.containerBGColor,
        paddingLeft: getFontSize(1),
      }}>
      <FlatList
        data={Array.from({length: 7})}
        renderItem={({item, index}: {item: any; index: number}) => (
          <TouchableOpacity
            style={[
              styles.dayButton,
              index === selectIndex && styles.selectedDayButton,
            ]}
            onPress={() => handlePress(index)}
            activeOpacity={0.6}>
            <Text
              style={[
                styles.defaultDayText,
                index === selectIndex && {color: Colors.white},
              ]}>
              D{index + 1}
            </Text>
          </TouchableOpacity>
        )}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: getFontSize(1)}}
        style={styles.calendarStrip}
      />
    </View>
  );
};

export default DayList;

const styles = StyleSheet.create({
  calendarStrip: {
    height: getFontSize(10),
  },
  defaultDayText: {
    color: Colors.defaultCalenderColor,
    fontSize: getFontSize(2.2),
    fontWeight: '500',
  },
  dayButton: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: getFontSize(7),
    width: getFontSize(6.5),
    borderRadius: 8,
  },
  selectedDayButton: {
    backgroundColor: Colors.calenderBgColor,
  },
});
