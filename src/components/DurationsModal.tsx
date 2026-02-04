import React, {useState, useCallback, useMemo, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {Picker} from '@react-native-picker/picker';
import CustomModal from './CustomModal';
import {Colors} from '../constants/Colors';
import {getFontSize} from '../utils/responsiveFn';
import dayjs from 'dayjs';
import {getLocalDateString} from '../utils/responsiveFn';
import FastImage from 'react-native-fast-image';
import {Images} from '@/assets/images';
import DurationInfoModal from './Explore/DurationInfoModal';
import Button from './Button';

interface DurationsModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDuration: number;
  selectedDate: string;
  onSelectDuration: (duration: number) => void;
  onSelectDate: (date: string) => void;
}

const DAYS = Array.from({length: 360}, (_, i) => i + 1);

const DurationsModal: React.FC<DurationsModalProps> = React.memo(
  ({
    visible,
    onClose,
    selectedDuration,
    selectedDate,
    onSelectDuration,
    onSelectDate,
  }) => {
    const [infoVisible, setInfoVisible] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [dateType, setDateType] = useState<'start' | 'end' | null>(null);


    useEffect(() => {
      setStartDate(selectedDate || '');
    }, [selectedDate]);

    const endDate = useMemo(() => {
      if (!startDate || !selectedDuration) return '';

      return dayjs(startDate)
        .add(selectedDuration - 1, 'day')
        .format('YYYY-MM-DD');
    }, [startDate, selectedDuration]);

    const markedDates = useMemo(() => {
      const marked: Record<string, {selected: boolean; selectedColor: string}> =
        {};

      if (startDate && endDate) {
        let current = dayjs(startDate);
        const end = dayjs(endDate);

        while (current.isSame(end) || current.isBefore(end)) {
          const dateString = current.format('YYYY-MM-DD');
          marked[dateString] = {
            selected: true,
            selectedColor: Colors.orange,
          };
          current = current.add(1, 'day');
        }
      } else if (startDate) {
        marked[startDate] = {
          selected: true,
          selectedColor: Colors.orange,
        };
      }

      return marked;
    }, [startDate, endDate, selectedDate]);

    const handleDatePress = (day: {dateString: string}) => {
      setStartDate(day.dateString);
    };

    const formatDate = useCallback((date: string) => {
      if (!date) return 'Select Date';

      return dayjs(date).format('MMM D, YYYY');
    }, []);

    const today = useMemo(() => {
      return getLocalDateString();
    }, []);

    const calendarTheme = useMemo(
      () => ({
        backgroundColor: 'transparent',
        calendarBackground: 'transparent',
        textSectionTitleColor: '#fff',
        selectedDayBackgroundColor: Colors.black,
        selectedDayTextColor: '#fff',
        todayTextColor: Colors.orange,
        dayTextColor: '#fff',
        textDisabledColor: '#444',
        monthTextColor: '#fff',
        textMonthFontWeight: 'bold',
        textDayFontWeight: '500',
        textDayFontSize: 14,
        textMonthFontSize: 16,
        weekdayTextColor: Colors.containerBGColor,
        arrowColor: '#fff',
      }),
      [],
    );

    return (
      <CustomModal
        visible={visible}
        onClose={() => {
          onClose();
          setStartDate(selectedDate || '');
        }}
        title="Durations">
        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingRight: getFontSize(2),
            }}>
            <View style={styles.pickerContainer}>
              <View style={styles.picker}>
                <Text
                  style={
                    styles.pickerText
                  }>{`${selectedDuration}              Days`}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setInfoVisible(true)}>
              <FastImage
                source={Images.info_Icon}
                resizeMode="contain"
                style={styles.image}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.dateSection}>
            <View style={styles.dateRow}>
              <View style={styles.dateCol}>
                <Text style={styles.dateLabel}>Start Date</Text>
                <TouchableOpacity
                  disabled
                  style={[
                    styles.dateButton,
                    // dateType === 'start' && styles.selectedDateButton,
                  ]}
                  // onPress={() => setDateType('start')}
                >
                  <Text style={styles.dateValue}>{formatDate(startDate)}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dateCol}>
                <Text style={styles.dateLabel}>End Date</Text>
                <TouchableOpacity
                  disabled
                  style={[
                    styles.dateButton,
                    // dateType === 'end' && styles.selectedDateButton,
                  ]}
                  // onPress={() => setDateType('end')}
                >
                  <Text style={styles.dateValue}>{formatDate(endDate)}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Calendar
              current={startDate || today}
              onDayPress={handleDatePress}
              markedDates={markedDates}
              theme={calendarTheme}
              minDate={today}
            />
            <Button
              title="Confirm"
              type="outline"
              style={{
                width: '80%',
                alignSelf: 'center',
                backgroundColor: Colors.primary,
                marginTop: getFontSize(5),
              }}
              onPress={() => {
                onSelectDate(startDate);
                onClose();
              }}
            />
          </View>
        </View>

        {infoVisible && (
          <DurationInfoModal
            visible={infoVisible}
            onClose={() => setInfoVisible(false)}
          />
        )}
      </CustomModal>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pickerContainer: {
    // justifyContent: 'center',
    flex: 1,
  },
  pickerText: {
    color: Colors.white,
    fontSize: getFontSize(2.5),
    fontWeight: '500',
  },
  picker: {
    borderRadius: getFontSize(1),
    margin: getFontSize(2),
    padding: getFontSize(1.2),
    alignItems: 'center',
    backgroundColor: Colors.textInputBackground,
  },
  dateSection: {
    flex: 1,
    backgroundColor: Colors.textInputBackground,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: getFontSize(0.5),
    gap: getFontSize(1.5),
    padding: getFontSize(2),
  },
  dateCol: {
    flex: 1,
    marginTop: getFontSize(1),
  },
  dateLabel: {
    color: Colors.white,
    fontSize: getFontSize(1.8),
    marginBottom: getFontSize(0.5),
    fontWeight: '500',
  },
  dateButton: {
    padding: getFontSize(1.8),
    backgroundColor: Colors.textInputBackground,
    borderRadius: getFontSize(1),
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  selectedDateButton: {
    borderColor: Colors.orange,
  },
  dateValue: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: getFontSize(1.6),
  },
  image: {
    height: getFontSize(3),
    alignSelf: 'flex-end',
    width: getFontSize(3),
  },
});

export default DurationsModal;
