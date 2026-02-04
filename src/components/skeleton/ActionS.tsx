import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Colors} from '@/constants/Colors';
import {getFontSize, SCREEN_WIDTH} from '@/utils/responsiveFn';

const ActionS = ({
  isTrue = true,
  numberOfArray,
}: {
  isTrue?: boolean;
  numberOfArray?: number;
}) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SkeletonPlaceholder
        speed={5000}
        backgroundColor={Colors.inactiveTabColor}
        highlightColor={Colors.borderColor}>
        <SkeletonPlaceholder.Item>
          {/* Description */}
          {isTrue && (
            <SkeletonPlaceholder.Item
              width={SCREEN_WIDTH - 40}
              height={getFontSize(3)}
              borderRadius={4}
              marginBottom={getFontSize(2)}
            />
          )}

          {isTrue && (
            <SkeletonPlaceholder.Item
              width={getFontSize(20)}
              height={getFontSize(2)}
              borderRadius={4}
              marginTop={getFontSize(2)}
            />
          )}

          {isTrue && (
            <SkeletonPlaceholder.Item
              width={getFontSize(15)}
              height={getFontSize(2)}
              borderRadius={4}
              marginTop={getFontSize(2)}
            />
          )}

          <SkeletonPlaceholder.Item marginTop={getFontSize(3)}>
            {[...Array(numberOfArray || 5)].map((_, i) => (
              <SkeletonPlaceholder.Item
                key={i.toString()}
                flexDirection="row"
                alignItems="center"
                gap={getFontSize(2)}>
                <SkeletonPlaceholder.Item
                  width={getFontSize(5)}
                  height={getFontSize(5)}
                  borderRadius={8}
                  marginBottom={getFontSize(2)}
                />
                <SkeletonPlaceholder.Item
                  width={SCREEN_WIDTH - getFontSize(12)}
                  height={getFontSize(8)}
                  borderRadius={8}
                  marginBottom={getFontSize(2)}
                />
              </SkeletonPlaceholder.Item>
            ))}
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </ScrollView>
  );
};

export default ActionS;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
});
