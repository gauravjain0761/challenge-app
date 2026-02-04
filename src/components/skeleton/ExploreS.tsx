import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {getFontSize, SCREEN_WIDTH} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';

const ExploreS = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SkeletonPlaceholder
        key={'1'}
        speed={5000}
        backgroundColor={Colors.inactiveTabColor}
        highlightColor={Colors.inactiveTabColor}>
        {/* 1) “Personal” section title */}
        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="space-between">
          <SkeletonPlaceholder.Item
            width={getFontSize(20)}
            height={getFontSize(2.5)}
            borderRadius={4}
          />

          <SkeletonPlaceholder.Item
            width={getFontSize(10)}
            height={getFontSize(2.5)}
            borderRadius={4}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>

      {/* 2) Personal cards (horizontal) */}

      {Array.from({length: 2}).map((_, i) => (
        <SkeletonPlaceholder
          key={`${i + 1}`}
          speed={5000}
          backgroundColor={Colors.inactiveTabColor}
          highlightColor={Colors.inactiveTabColor}>
          <SkeletonPlaceholder.Item
            width={SCREEN_WIDTH - 50}
            height={getFontSize(18)}
            borderRadius={4}
            marginTop={16}
          />
        </SkeletonPlaceholder>
      ))}

      {/* 3) “Group” section title */}
      <SkeletonPlaceholder
        key={'3'}
        speed={5000}
        backgroundColor={Colors.inactiveTabColor}
        highlightColor={Colors.inactiveTabColor}>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          marginTop={getFontSize(2)}
          justifyContent="space-between">
          <SkeletonPlaceholder.Item
            width={getFontSize(20)}
            height={getFontSize(2.5)}
            borderRadius={4}
          />

          <SkeletonPlaceholder.Item
            width={getFontSize(10)}
            height={getFontSize(2.5)}
            borderRadius={4}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>

      {/* 4) Group cards (horizontal) */}
      <SkeletonPlaceholder
        key={'4'}
        speed={5000}
        backgroundColor={Colors.inactiveTabColor}
        highlightColor={Colors.inactiveTabColor}>
        <SkeletonPlaceholder.Item
          width={SCREEN_WIDTH - 50}
          height={getFontSize(18)}
          borderRadius={4}
          marginTop={16}
        />
      </SkeletonPlaceholder>
    </ScrollView>
  );
};

export default ExploreS;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    padding: 16,
  },
});
