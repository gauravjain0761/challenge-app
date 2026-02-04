import React, {useState, useMemo} from 'react';
import {View, StyleSheet, FlatList, Text} from 'react-native';
import moment from 'moment';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import {Task} from '../types';
import TaskItemPreview from './TaskItemPreview';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import CustomCalendarStrip from './CustomCalenderStrip';

interface ActionsTabProps {
  data: {
    description: string;
    totalDailyActions: number;
    startDate: string;
    endDate: string;
    dailyAction: {
      [key: string]: Task[];
    };
  };
  type: string;
}

const ActionsPreviewTab: React.FC<ActionsTabProps> = ({data, type}) => {
  const [selectedDate, setSelectedDate] = useState<moment.Moment>(() => {
    const today = moment().startOf('day');
    const startDate = moment(data.startDate).startOf('day');
    const endDate = moment(data.endDate).startOf('day');

    if (today.isBefore(startDate)) return startDate;
    if (today.isAfter(endDate)) return endDate;
    return today;
  });

  const getDayKey = (date: moment.Moment) => {
    const startDate = moment(data.startDate).startOf('day');
    const diffDays = date.startOf('day').diff(startDate, 'days');
    return `day${diffDays + 1}`;
  };

  // Get tasks for the currently selected date
  const dayKey = getDayKey(selectedDate);
  const tasksForSelectedDay: Task[] = data.dailyAction[dayKey] || [];

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.dayContainer}>
        <Text style={styles.description}>{data?.description}</Text>
        <View style={styles.taskContainer}>
          <Text style={styles.actionCount}>
            {data?.totalDailyActions} Daily Actions
          </Text>
          <FlatList
            data={tasksForSelectedDay}
            keyExtractor={(task: Task) => task.id}
            renderItem={({item: task}: {item: Task}) => (
              <TaskItemPreview task={task} type={type} />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
      {type === 'Variation Action' && (
        <View style={styles.calendarContainer}>
          <CustomCalendarStrip
            startDate={data.startDate}
            endDate={data.endDate}
            dailyAction={data.dailyAction}
            selectedDate={selectedDate}
            onDateSelected={setSelectedDate}
            customSelectedStyle={{
              backgroundColor: Colors.orange + '20',
              borderRadius: 8,
            }}
          />
        </View>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: getFontSize(1),
  },
  dayContainer: {
    flex: 1,
  },
  description: {
    color: Colors.white,
    fontSize: getFontSize(1.8),
    fontWeight: '400',
    marginBottom: getFontSize(2.5),
  },
  taskContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: getFontSize(0.1),
    borderColor: Colors.borderColor,
    borderRadius: getFontSize(1),
    padding: getFontSize(1),
  },
  actionCount: {
    color: Colors.whiteOpacity,
    fontSize: getFontSize(1.8),
    fontWeight: '500',
    marginBottom: getFontSize(1.5),
    marginLeft: getFontSize(1),
  },
  calendarContainer: {
    flex: 0.1,
    marginBottom: getFontSize(1),
  },
});

export default ActionsPreviewTab;
