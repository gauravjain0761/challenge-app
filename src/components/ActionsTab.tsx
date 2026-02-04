// // components/ActionsTab/index.tsx
// import React, { useState } from 'react';
// import { View, StyleSheet, ScrollView } from 'react-native';
// import { TaskGroup } from './TaskGroup';
// import { getFontSize } from '@/utils/responsiveFn';
// import { Colors } from '@/constants/Colors';
// import { Task } from '../types';

// // interface Actions {
// //   [key: string]: Task[];
// // }

// interface ActionsTabProps {
//   data: {
//     [key: string]: Task[];
//   };
// }

// const ActionsTab: React.FC<ActionsTabProps> = ({ data }) => {
//   const [expandedGroups, setExpandedGroups] = useState<{
//     [key: string]: boolean;
//   }>(
//     Object.keys(data).reduce(
//       (acc, day) => ({
//         ...acc,
//         [day]: true,
//       }),
//       {}
//     )
//   );

//   const toggleGroup = (day: string) => {
//     setExpandedGroups(prev => ({
//       ...prev,
//       [day]: !prev[day],
//     }));
//   };

//   // Convert actions object to array of groups
//   const actionGroups = Object.entries(data).map(([day, actions]) => ({
//     title: `DAY ${day.replace('day', '')}`,
//     data: actions,
//   }));

//   return (
//     <ScrollView
//       style={styles.container}
//       showsVerticalScrollIndicator={false}
//     >
//       {actionGroups.map((group) => (
//         <TaskGroup
//           key={group.title}
//           group={group}
//           isExpanded={expandedGroups[group.title.toLowerCase().replace(' ', '')]}
//           onToggle={() => toggleGroup(group.title.toLowerCase().replace(' ', ''))}
//         />
//       ))}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

// export default ActionsTab;
import React, {useState, useMemo} from 'react';
import {View, StyleSheet, FlatList, Text, ScrollView} from 'react-native';
import moment from 'moment';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import {Task} from '../types';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import CustomCalendarStrip from './CustomCalenderStrip';
import TaskItem from './TaskItem';
import ProgressBar from '../constants/ProgressBar';

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

const ActionsTab: React.FC<ActionsTabProps> = ({data, type}) => {
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

  const renderHeader = () => (
    <View style={styles.actionCountContainer}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: getFontSize(2.4),
          color: Colors.white,
          fontWeight: '600',
          marginBottom: getFontSize(0.5),
        }}>
        {type === 'Single Action'
          ? "TODAY'S LEVEL ADVANCED"
          : "TODAY'S ACTIONS 2/7"}
      </Text>
      <Text
        style={{
          color: Colors.inactiveTabColor,
          textAlign: 'center',
          marginBottom: type === 'Single Action' ? 0 : getFontSize(1),
        }}>
        {type === 'Single Action'
          ? 'YOUR SELECTED LEVEL BEGINNER'
          : `YOUR EXPECTED ACTIONS ${data.totalDailyActions}/7`}
      </Text>
      {type === 'Single Action' ? null : (
        <ProgressBar remaining={2} total={7} />
      )}
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.dayContainer}>
        <FlatList
          ListHeaderComponent={renderHeader}
          data={tasksForSelectedDay}
          keyExtractor={(task: Task) => task.id}
          renderItem={({item: task}: {item: Task}) => (
            <TaskItem task={task} type={type} />
          )}
          showsVerticalScrollIndicator={false}
        />
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
              backgroundColor: 'rgba(0, 0, 0, 0.40)',
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
  calendarContainer: {
    flex: 0.1,
    marginBottom: getFontSize(1),
  },
  actionCountContainer: {
    paddingTop: getFontSize(1.5),
    paddingBottom: getFontSize(1.5),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.textInputBackground,
    borderRadius: 8,
    borderWidth: 0.9,
    borderColor: Colors.borderColor,
    marginBottom: getFontSize(1.5),
    paddingHorizontal: getFontSize(1.5),
    paddingVertical: getFontSize(0.5),
  },
});

export default ActionsTab;
