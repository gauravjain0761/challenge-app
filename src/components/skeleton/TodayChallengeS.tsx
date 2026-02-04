import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {getFontSize, SCREEN_WIDTH} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';

const TodayChallengeS = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SkeletonPlaceholder.Item gap={3}>
        {Array.from({length: 3}).map((_, i) => (
          <SkeletonPlaceholder.Item key={`${i + 1}`}>
            <SkeletonPlaceholder
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
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>

            <SkeletonPlaceholder
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
          </SkeletonPlaceholder.Item>
        ))}
      </SkeletonPlaceholder.Item>
    </ScrollView>
  );
};

export default memo(TodayChallengeS);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    padding: 16,
  },
});
