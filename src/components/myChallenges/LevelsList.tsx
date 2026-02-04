import {FlatList, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Levels} from '@/types';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import IconComponent from '../IconComponent';

const LevelsList = ({
  levelList,
  selectedLevelIndex,
}: {
  levelList: Levels[];
  selectedLevelIndex?: number;
}) => {
  const renderItem = ({item, index}: {item: Levels; index: number}) => {
    return (
      <View
        key={`${item.goal.value}`}
        style={[
          styles.skipOption,
          selectedLevelIndex === index && styles.selectedSkip,
        ]}>
        <Text
          style={[
            styles.skipText,
            selectedLevelIndex === index && styles.selectedText,
          ]}>
          {String(item.goal.value + ' ' + item.goal.unit)} = {item.name}
        </Text>
        {selectedLevelIndex === index && (
          <IconComponent name="check" size={24} color="#ff6b00" />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.description}>
        Every action is a victory and{'\n'}a step closer to your goals.
      </Text> */}
      <View style={styles.levelContainer}>
        <FlatList
          data={levelList as Levels[]}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

export default LevelsList;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: getFontSize(10),
  },
  description: {
    fontSize: getFontSize(1.8),
    color: Colors.white,
    marginBottom: getFontSize(1),
    lineHeight: getFontSize(2.4),
    textAlign: 'center',
    marginTop: getFontSize(1),
  },
  levelContainer: {
    marginTop: getFontSize(1),
    flex: 1,
  },
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
  selectedSkip: {
    backgroundColor: Colors.textInputBackground,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  selectedText: {
    color: Colors.orange,
    fontWeight: '500',
  },
});
