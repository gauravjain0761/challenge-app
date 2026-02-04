import React, {memo, useState} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import {ChallengeType} from '@/types/enums';
import FastImage from 'react-native-fast-image';
import {convertUnits} from '@/utils/common/commonFunction';

interface TaskItemProps {
  type: string;
  index: number;
  image: any;
  name: string;
  level: any;
  value: any;
  unit: any;
}

const TaskItemPreview: React.FC<TaskItemProps> = memo(
  ({type, index, image, name, level, value, unit}) => {
    return (
      <View style={styles.container}>
        {/* Foreground Content */}
        <View style={styles.row}>
          {type === ChallengeType.SINGLE ||
          type === ChallengeType.SINGLE_MAXOUT ? (
            <>
              <View key={index} style={styles.dot} />
            </>
          ) : (
            <View style={styles.icon}>
              <Text style={styles.indexStyle}>{index + 1}</Text>
            </View>
          )}
          <View style={[styles.content]}>
            <FastImage
              source={{uri: image}}
              style={styles.image}
              resizeMode={FastImage.resizeMode.cover}
            />
            <View style={styles.textContent}>
              <Text style={styles.title}>{name}</Text>
              <Text style={styles.level}>{level}</Text>
            </View>
            <View style={styles.durationContainer}>
              <Text style={styles.duration}>{value}</Text>
              <Text style={styles.durationUnit}>{convertUnits(unit)}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  },
);
export default TaskItemPreview;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: getFontSize(1),
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  indexStyle: {
    color: Colors.white,
    fontSize: getFontSize(2),
    fontWeight: '500',
  },
  dot: {
    width: getFontSize(1.7),
    height: getFontSize(1.7),
    borderRadius: getFontSize(1),
    backgroundColor: Colors.white,
    marginHorizontal: getFontSize(1),
    opacity: 0.3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: getFontSize(2),
    padding: getFontSize(1),
    borderWidth: getFontSize(0.1),
    borderColor: Colors.borderColor,
    zIndex: 1, // Ensure swipeable content is in front
    backgroundColor: Colors.containerBGColor,
    // width: '83%',
    gap: getFontSize(2),
    flex: 1,
  },
  image: {
    width: getFontSize(6.5),
    height: getFontSize(6.5),
    borderRadius: getFontSize(1.2),
  },
  textContent: {
    flex: 1,
  },
  title: {
    color: Colors.white,
    fontSize: getFontSize(2),
  },
  level: {
    color: Colors.white,
    fontSize: getFontSize(1.8),
    opacity: 0.6,
    textTransform: 'capitalize',
  },

  duration: {
    color: Colors.white,
    fontSize: getFontSize(1.5),
    opacity: 0.6,
    textAlign: 'center',
  },
  durationUnit: {
    color: Colors.white,
    fontSize: getFontSize(1.5),
    opacity: 0.6,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  icon: {
    marginRight: getFontSize(2),
    height: getFontSize(5),
    width: getFontSize(5),
    backgroundColor: 'transparent',
    borderRadius: getFontSize(1),
    borderWidth: getFontSize(0.09),
    borderColor: Colors.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationContainer: {
    width: getFontSize(6.5),
    height: getFontSize(6),
    borderRadius: getFontSize(1),
    backgroundColor: Colors.textInputBackground,
    alignItems: 'center', // Center text horizontally
    justifyContent: 'center', // Center text vertically
    marginRight: getFontSize(0.5),
    gap: getFontSize(0.1),
  },
});
