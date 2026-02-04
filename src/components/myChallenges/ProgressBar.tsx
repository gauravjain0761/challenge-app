import {getFontSize} from '@/utils/responsiveFn';
import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

const ProgressBar = ({
  currentDay = 0,
  totalDays = 0,
  title,
  customWidth,
}: {
  currentDay: number;
  totalDays: number;
  title?: string;
  customWidth?: number;
}) => {
  const progress = currentDay / totalDays;
  const barWidth = width / (customWidth ? customWidth : 1.4); // you can adjust this value
  const fillWidth = totalDays ? progress * barWidth : 0;

  return (
    <View style={styles.container}>
      <View style={[styles.barBackground, {width: barWidth}]}>
        <View style={[styles.barFill, {width: fillWidth}]}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>
              {title ? title : `${currentDay}/${totalDays} Days Complete`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: getFontSize(0.5),
  },
  barBackground: {
    height: getFontSize(3.5),
    backgroundColor: '#222', // dark background
    borderRadius: getFontSize(1.6),
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#a04b00', // brown-orange
    borderRadius: 20,
    justifyContent: 'center',
  },
  labelContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    position: 'absolute',
    alignSelf: 'flex-start',
    width: width,
  },
  labelText: {
    color: 'white',
    fontWeight: '500',
    fontSize: getFontSize(1.8),
  },
});

export default ProgressBar;
