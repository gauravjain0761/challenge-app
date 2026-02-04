import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import {StyleSheet} from 'react-native';
import {View} from 'react-native';

export const CalendarS = () => {
  return (
    <View style={styles.calendarContainer}>
      <View style={styles.calendarSkeletonContainer}>
        <View style={styles.calendarSkeletonBar} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    flex: 0.015,
    minHeight: getFontSize(10), // Ensure minimum height
  },
  calendarSkeletonContainer: {
    height: getFontSize(8),
    backgroundColor: Colors.textInputBackground,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: getFontSize(2),
  },
  calendarSkeletonBar: {
    height: getFontSize(3),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
  },
});
