import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Levels} from '@/types';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';

const GoalList = ({data}: {data: any[]}) => {
  const renderItem = ({item, index}: {item: Levels; index: number}) => {
    return (
      <View key={`${item.goal.value}`} style={[styles.skipOption]}>
        <Text style={[styles.skipText]}>
          {String(item.goal.value + ' ' + item.goal.unit)} = {item.name}
        </Text>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default GoalList;

const styles = StyleSheet.create({
  skipOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: getFontSize(1.8),
    paddingHorizontal: getFontSize(1.5),
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  skipText: {
    color: Colors.white,
    fontSize: getFontSize(2),
    fontWeight: '500',
  },
});
