import React, {memo} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, FlatList} from 'react-native';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';

interface CustomTabProps {
  tabs: any[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const CustomTab: React.FC<CustomTabProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={tabs}
        renderItem={({item}) => (
          <TouchableOpacity
            key={item}
            style={[styles.tab, activeTab === item && styles.activeTab]}
            onPress={() => onTabChange(item)}>
            <Text
              style={[
                styles.tabText,
                activeTab === item && styles.activeTabText,
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default memo(CustomTab);

const styles = StyleSheet.create({
  container: {
    marginTop: getFontSize(2),
    marginBottom: getFontSize(2),
    width: '100%',
    paddingHorizontal: getFontSize(1),
  },
  tab: {
    marginRight: getFontSize(2),
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.white,
  },
  tabText: {
    color: Colors.inactiveTabColor,
    fontSize: getFontSize(2.1),
    fontWeight: '500',
    letterSpacing: -0.24,
    // textTransform: 'capitalize',
  },
  activeTabText: {
    color: 'white',
  },
});
