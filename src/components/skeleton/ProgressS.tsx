import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Colors} from '@/constants/Colors';
import {getFontSize, SCREEN_WIDTH} from '@/utils/responsiveFn';

const ProgressS = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SkeletonPlaceholder
        speed={5000}
        backgroundColor={Colors.inactiveTabColor}
        highlightColor={Colors.borderColor}>
        <SkeletonPlaceholder.Item>
          {/* Description */}
          <SkeletonPlaceholder.Item
            width={SCREEN_WIDTH - 40}
            height={getFontSize(23)}
            borderRadius={4}
            marginBottom={getFontSize(2)}
          />

          <SkeletonPlaceholder.Item
            width={getFontSize(15)}
            height={getFontSize(2)}
            borderRadius={4}
            marginTop={getFontSize(2)}
          />

          <SkeletonPlaceholder.Item marginTop={getFontSize(3)}>
            {[...Array(2)].map((_, i) => (
              <SkeletonPlaceholder.Item key={i.toString()} gap={getFontSize(2)}>
                <SkeletonPlaceholder.Item
                  width={SCREEN_WIDTH - 40}
                  height={getFontSize(30)}
                  borderRadius={8}
                  marginBottom={getFontSize(2)}
                />
              </SkeletonPlaceholder.Item>
            ))}
          </SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item
            width={SCREEN_WIDTH - 40}
            height={getFontSize(80)}
            borderRadius={4}
            marginBottom={getFontSize(2)}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </ScrollView>
  );
};

export default memo(ProgressS);

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
});
