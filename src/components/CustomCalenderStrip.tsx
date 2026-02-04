import React, {useState, useMemo, useCallback, useEffect, memo} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import moment, {Moment} from 'moment';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';

interface AvailableDay {
  available: boolean;
  date: string;
  order: number;
  originalDayRef: string;
  status: string;
}

interface CustomCalendarStripProps {
  startDate: string | Moment;
  endDate: string | Moment;
  selectedDate: Moment;
  dailyAction: Record<string, AvailableDay[]>;
  onDateSelected?: (date: Moment, originalDayRef?: string) => void;
  setSelectedDay: (day: string) => void;
  customSelectedStyle?: {
    backgroundColor?: string;
    borderRadius?: number;
  };
}

const CustomCalendarStrip: React.FC<CustomCalendarStripProps> = memo(
  ({
    startDate: initialStartDate,
    endDate: initialEndDate,
    dailyAction,
    onDateSelected,
    setSelectedDay,
    selectedDate,
    customSelectedStyle,
  }) => {
    const availableDates = useMemo(() => {
      return Object.values(dailyAction)
        .flat()
        .filter(day => day.available)
        .sort((a, b) => a.order - b.order)
        .map(day => ({
          ...day,
          momentDate: moment(day.date).startOf('day'),
        }));
    }, [dailyAction]);

    const customDatesStyles = useMemo(() => {
      return [
        {
          startDate: selectedDate.toDate(),
          dateContainerStyle: {
            backgroundColor:
              customSelectedStyle?.backgroundColor || `${Colors.orange}20`,
            borderRadius: customSelectedStyle?.borderRadius || 8,
          },
          dateNameStyle: {color: Colors.white},
          dateNumberStyle: {color: Colors.white},
        },
      ];
    }, [selectedDate, customSelectedStyle]);

    const renderCustomDay = useCallback(
      (props: any) => {
        const {date, customStyle} = props;
        const day = availableDates.find(d => d.momentDate.isSame(date, 'day'));

        const isDisabled = !day;
        const dayLabel = day ? `D${day.order}` : '';
        const formattedDate = date.format('D');

        const containerStyle = [
          styles.dayButton,
          customStyle?.dateContainerStyle,
        ];

        const dayLabelStyle = [
          styles.defaultDayText,
          customStyle?.dateNameStyle,
          isDisabled && styles.disabledDayText,
        ];

        const dateLabelStyle = [
          styles.defaultDateText,
          customStyle?.dateNumberStyle,
          isDisabled && styles.disabledDayText,
        ];

        const handlePress = () => {
          if (!isDisabled) {
            // handleDateSelected(date); // ✅ Use updated function
            onDateSelected?.(date);
            setSelectedDay('day' + day.order);
          }
        };

        return (
          <TouchableOpacity
            style={containerStyle}
            onPress={handlePress}
            activeOpacity={0.6}>
            <Text style={dayLabelStyle}>{dayLabel}</Text>
            <Text style={dateLabelStyle}>{formattedDate}</Text>
          </TouchableOpacity>
        );
      },
      [availableDates],
    );

    const startDate = moment(initialStartDate).startOf('day');
    const endDate = moment(initialEndDate).startOf('day');

    return (
      <CalendarStrip
        style={styles.calendarStrip}
        calendarColor={Colors.containerBGColor}
        calendarHeaderStyle={styles.headerStyle}
        customDatesStyles={customDatesStyles}
        dayComponent={renderCustomDay}
        selectedDate={selectedDate.toDate()}
        // onDateSelected={handleDateSelected}
        dayComponentHeight={getFontSize(10)}
        minDate={startDate.toDate()}
        maxDate={endDate.toDate()}
        scrollable={true}
        scrollerPaging={false}
        scrollToOnSetSelectedDate={true}
        useIsoWeekday={false}
        showMonth={false}
        leftSelector={[]}
        rightSelector={[]}
      />
    );
  },
);

const styles = StyleSheet.create({
  calendarStrip: {
    height: getFontSize(10),
    backgroundColor: 'transparent',
    marginTop: 10,
  },
  headerStyle: {
    color: Colors.white,
    fontSize: getFontSize(2.2),
  },
  dayButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    paddingVertical: 4,
    borderRadius: 8,
  },
  defaultDayText: {
    color: Colors.defaultCalenderColor,
    fontSize: getFontSize(2),
    fontWeight: '600',
  },
  defaultDateText: {
    marginTop: 2,
    color: Colors.defaultCalenderColor,
    fontSize: getFontSize(2.2),
    fontWeight: '400',
  },
  disabledDayText: {
    color: 'rgba(255, 255, 255, 0.2)',
  },
});

export default CustomCalendarStrip;
