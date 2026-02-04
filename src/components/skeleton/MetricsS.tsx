import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Colors} from '@/constants/Colors';
import {getFontSize, SCREEN_WIDTH} from '@/utils/responsiveFn';

const MetricsS = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SkeletonPlaceholder
        backgroundColor={Colors.inactiveTabColor}
        speed={5000}
        highlightColor={Colors.borderColor}>
        <SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item
            width={SCREEN_WIDTH - 150}
            height={getFontSize(31)}
            borderRadius={getFontSize(35)}
            alignSelf="center"
            marginTop={getFontSize(2)}
          />

          <SkeletonPlaceholder.Item
            width={SCREEN_WIDTH - 60}
            height={getFontSize(20)}
            borderRadius={6}
            marginTop={getFontSize(3)}
          />

          <SkeletonPlaceholder.Item
            width={SCREEN_WIDTH - 60}
            height={getFontSize(30)}
            borderRadius={6}
            marginTop={getFontSize(3)}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </ScrollView>
  );
};

export default memo(MetricsS);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
  },
});
