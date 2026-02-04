import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {getFontSize, SCREEN_WIDTH} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';

const SeeAllS = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/*  Personal cards (horizontal) */}
      {Array.from({length: 5}).map((_, i) => (
        <SkeletonPlaceholder
          key={`${i + 1}`}
          speed={5000}
          backgroundColor={Colors.inactiveTabColor}
          highlightColor={Colors.inactiveTabColor}>
          <SkeletonPlaceholder.Item
            width={SCREEN_WIDTH - 50}
            height={getFontSize(20)}
            borderRadius={4}
            top={getFontSize(2)}
          />
        </SkeletonPlaceholder>
      ))}
    </ScrollView>
  );
};

export default SeeAllS;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
