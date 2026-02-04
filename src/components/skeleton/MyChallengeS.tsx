import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Colors} from '@/constants/Colors';
import {getFontSize, SCREEN_WIDTH} from '@/utils/responsiveFn';

const MyChallengeS = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SkeletonPlaceholder
        speed={5000}
        backgroundColor={Colors.inactiveTabColor}
        highlightColor={Colors.borderColor}>
        <SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item
            width={getFontSize(20)}
            height={getFontSize(2)}
            borderRadius={4}
            marginTop={getFontSize(2)}
          />

          <SkeletonPlaceholder.Item marginTop={getFontSize(2)}>
            <SkeletonPlaceholder.Item
              width={SCREEN_WIDTH - getFontSize(6)}
              height={getFontSize(20)}
              borderRadius={8}
              marginBottom={getFontSize(2)}
            />
          </SkeletonPlaceholder.Item>

          <SkeletonPlaceholder.Item
            width={getFontSize(20)}
            height={getFontSize(2)}
            borderRadius={4}
            marginTop={getFontSize(2)}
          />

          <SkeletonPlaceholder.Item marginTop={getFontSize(2)}>
            {[...Array(2)].map((_, i) => (
              <SkeletonPlaceholder.Item
                key={i}
                width={SCREEN_WIDTH - getFontSize(6)}
                height={getFontSize(8)}
                borderRadius={8}
                marginBottom={getFontSize(2)}
              />
            ))}
          </SkeletonPlaceholder.Item>

          <SkeletonPlaceholder.Item
            width={getFontSize(20)}
            height={getFontSize(2)}
            borderRadius={4}
            marginTop={getFontSize(2)}
          />

          <SkeletonPlaceholder.Item marginTop={getFontSize(2)}>
            {[...Array(2)].map((_, i) => (
              <SkeletonPlaceholder.Item
                key={i}
                width={SCREEN_WIDTH - getFontSize(6)}
                height={getFontSize(8)}
                borderRadius={8}
                marginBottom={getFontSize(2)}
              />
            ))}
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </ScrollView>
  );
};

export default MyChallengeS;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignSelf: 'center',
  },
});
