// ChallengeNavigation.tsx
import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';

type TabOption = 'explore' | 'myChallenges';

interface ChallengeNavigationProps {
  activeTab: TabOption;
  onTabChange: (tab: TabOption) => void;
  onLayout?: (e: any) => void;
}

const ChallengeNavigation: React.FC<ChallengeNavigationProps> = ({
  activeTab,
  onTabChange,
  onLayout,
}) => {
  return (
    <View onLayout={onLayout} style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'explore' && styles.activeTab]}
        onPress={() => onTabChange('explore')}>
        <Text
          style={[
            styles.tabText,
            activeTab === 'explore' && styles.activeTabText,
          ]}>
          Explore
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'myChallenges' && styles.activeTab]}
        onPress={() => onTabChange('myChallenges')}>
        <Text
          style={[
            styles.tabText,
            activeTab === 'myChallenges' && styles.activeTabText,
          ]}>
          My Challenges
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: getFontSize(2),
    marginBottom: getFontSize(1),
    width: '95%',
    alignSelf: 'center',
  },
  tab: {
    // paddingVertical: getFontSize(1),
    //marginHorizontal: getFontSize(1),
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
  },
  activeTabText: {
    color: 'white',
  },
});

export default ChallengeNavigation;
