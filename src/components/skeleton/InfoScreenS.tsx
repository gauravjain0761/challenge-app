import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Colors} from '@/constants/Colors';
import {getFontSize, SCREEN_WIDTH} from '@/utils/responsiveFn';

const InfoScreenS = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SkeletonPlaceholder
        backgroundColor={Colors.inactiveTabColor}
        speed={5000}
        highlightColor={Colors.borderColor}>
        <SkeletonPlaceholder.Item>
          {/* Description */}
          <SkeletonPlaceholder.Item
            width={SCREEN_WIDTH - 60}
            height={getFontSize(3)}
            borderRadius={4}
            marginBottom={getFontSize(2)}
          />

          <SkeletonPlaceholder.Item
            width={getFontSize(15)}
            height={getFontSize(3)}
            borderRadius={4}
            marginBottom={getFontSize(2)}
            marginTop={getFontSize(2)}
          />
          {[...Array(4)].map((_, i) => (
            <SkeletonPlaceholder.Item
              key={i}
              width={getFontSize(25)}
              height={getFontSize(2.5)}
              borderRadius={8}
              marginBottom={getFontSize(2)}
            />
          ))}

          {/* Buttons */}
          <SkeletonPlaceholder.Item marginTop={getFontSize(3)}>
            {[...Array(2)].map((_, i) => (
              <SkeletonPlaceholder.Item
                key={i}
                width={SCREEN_WIDTH - 60}
                height={getFontSize(8)}
                borderRadius={8}
                marginBottom={getFontSize(2)}
              />
            ))}
          </SkeletonPlaceholder.Item>

          {/* What Why How Header */}
          <SkeletonPlaceholder.Item
            width={SCREEN_WIDTH / 2}
            height={getFontSize(3)}
            borderRadius={4}
            marginTop={getFontSize(3)}
          />

          {/* What Why How Content */}
          <SkeletonPlaceholder.Item marginTop={getFontSize(3)}>
            {[...Array(2)].map((_, i) => (
              <SkeletonPlaceholder.Item
                key={i}
                width={SCREEN_WIDTH - 60}
                height={getFontSize(12)}
                borderRadius={6}
                marginBottom={getFontSize(2)}
              />
            ))}
          </SkeletonPlaceholder.Item>

          {/* Join Button */}
          <SkeletonPlaceholder.Item
            width={SCREEN_WIDTH - 60}
            height={getFontSize(6)}
            borderRadius={50}
            alignSelf="center"
            marginTop={getFontSize(2)}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </ScrollView>
  );
};

export default InfoScreenS;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
});
