import React, {useEffect, useRef, useState, useCallback} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import moment from 'moment';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';

const ITEM_WIDTH = getFontSize(7.2);
const CHUNK_SIZE = getFontSize(9);
const MAX_DAYS = 60;

interface DateItem {
  day: string;
  date: number;
  full: string;
}

interface HorizontalCalendarProps {
  onDateSelected: (date: Date) => void;
  selectedDate: Date;
}

const HorizontalCalendar = ({
  onDateSelected,
  selectedDate,
}: HorizontalCalendarProps) => {
  const [dates, setDates] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [onSelectedDate, setSelectedDate] = useState<Date | string>('');

  useEffect(() => {
    if (selectedDate) {
      setSelectedDate(selectedDate.toISOString().split('T')[0]);
    }
  }, [selectedDate]);

  const flatListRef = useRef<FlatList>(null);

  // Load a chunk of dates
  const loadMoreDates = () => {
    if (currentIndex >= MAX_DAYS) return;
    const newDates: DateItem[] = [];
    for (
      let i = currentIndex;
      i < currentIndex + CHUNK_SIZE && i < MAX_DAYS;
      i++
    ) {
      const date = moment().add(i, 'days');
      newDates.push({
        day: date.format('ddd').toUpperCase(),
        date: date.date(),
        full: date.format('YYYY-MM-DD'),
      });
    }
    setDates(prev => [...prev, ...newDates]);
    setCurrentIndex(prev => prev + CHUNK_SIZE);
  };

  // Auto-scroll to today
  useEffect(() => {
    if (dates.length > 0) {
      const todayIndex = dates.findIndex(
        d => d.full === moment().format('YYYY-MM-DD'),
      );
      if (todayIndex !== -1) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: todayIndex,
            animated: false,
            viewPosition: 0.5,
          });
        }, 100);
      }
    }
  }, [dates]);

  // Initial load with proper dependency
  useEffect(() => {
    loadMoreDates();
  }, []);

  const handleDateSelect = (item: any, index: number) => {
    setSelectedDate(item.full);
    onDateSelected(new Date(item.full));
    flatListRef.current?.scrollToIndex({
      index: Math.min(index, dates.length - 1),
      animated: true,
      viewPosition: 0.5,
    });
  };

  const renderItem = ({item, index}: any) => {
    const isSelected = onSelectedDate === item.full;

    return (
      <TouchableOpacity
        style={styles.dateContainer}
        onPress={() => handleDateSelect(item, index)}>
        <Text style={[styles.dayText, isSelected && styles.selectedDay]}>
          {item.day}
        </Text>
        <Text style={[styles.dateText, isSelected && styles.selectedDate]}>
          {item.date}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={dates}
        renderItem={renderItem}
        keyExtractor={item => item.full}
        horizontal
        showsHorizontalScrollIndicator={false}
        onEndReached={loadMoreDates}
        onEndReachedThreshold={0.5}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        windowSize={21}
        maxToRenderPerBatch={20}
        removeClippedSubviews
        initialNumToRender={CHUNK_SIZE}
        contentContainerStyle={styles.calendarWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendarWrapper: {
    height: getFontSize(10),
    alignItems: 'center',
  },
  dateContainer: {
    alignItems: 'center',
    width: ITEM_WIDTH,
    gap: getFontSize(0.3),
  },
  dayText: {
    color: Colors.white,
    fontSize: getFontSize(1.6),
    fontWeight: '500',
  },
  dateText: {
    color: Colors.white,
    fontSize: getFontSize(2),
    fontWeight: '600',
  },
  selectedDay: {
    color: Colors.orange,
  },
  selectedDate: {
    color: Colors.orange,
  },
});

export default HorizontalCalendar;
