import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Colors} from '@/constants/Colors';
import {getFontSize, SCREEN_HEIGHT, SCREEN_WIDTH} from '@/utils/responsiveFn';
import {get} from 'lodash';

const AssetsS = () => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        <SkeletonPlaceholder
          speed={5000}
          backgroundColor={Colors.inactiveTabColor}
          highlightColor={Colors.borderColor}>
          <SkeletonPlaceholder.Item paddingHorizontal={getFontSize(2)}>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between">
              <SkeletonPlaceholder.Item
                width={getFontSize(4)}
                height={getFontSize(4)}
                marginTop={getFontSize(2)}
                borderRadius={5}
              />
              <SkeletonPlaceholder.Item
                width={getFontSize(20)}
                height={getFontSize(4)}
                marginTop={getFontSize(2)}
                borderRadius={5}
              />
              <SkeletonPlaceholder.Item
                width={getFontSize(4)}
                height={getFontSize(4)}
                marginTop={getFontSize(2)}
                borderRadius={5}
              />
            </SkeletonPlaceholder.Item>

            <SkeletonPlaceholder.Item
              width={SCREEN_WIDTH - 50}
              height={getFontSize(26)}
              marginTop={getFontSize(10)}
              borderRadius={getFontSize(2)}
            />
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              alignSelf="center"
              gap={getFontSize(5)}
              marginTop={getFontSize(10)}>
              <SkeletonPlaceholder.Item
                width={getFontSize(4)}
                height={getFontSize(4)}
                marginTop={getFontSize(2)}
                borderRadius={5}
              />
              <SkeletonPlaceholder.Item
                width={getFontSize(10)}
                height={getFontSize(4)}
                marginTop={getFontSize(2)}
                borderRadius={5}
              />
              <SkeletonPlaceholder.Item
                width={getFontSize(4)}
                height={getFontSize(4)}
                marginTop={getFontSize(2)}
                borderRadius={5}
              />
            </SkeletonPlaceholder.Item>
            <SkeletonPlaceholder.Item
              flexDirection="row"
              alignItems="center"
              alignSelf="center"
              gap={getFontSize(2)}
              marginTop={getFontSize(2)}>
              <SkeletonPlaceholder.Item
                width={getFontSize(4)}
                height={getFontSize(4)}
                marginTop={getFontSize(2)}
                borderRadius={5}
              />
              <SkeletonPlaceholder.Item
                width={getFontSize(10)}
                height={getFontSize(10)}
                marginTop={getFontSize(2)}
                borderRadius={getFontSize(5)}
              />
              <SkeletonPlaceholder.Item
                width={getFontSize(4)}
                height={getFontSize(4)}
                marginTop={getFontSize(2)}
                borderRadius={5}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
      </View>
    </ScrollView>
  );
};

export default AssetsS;

const styles = StyleSheet.create({
  container: {
    height: SCREEN_HEIGHT - getFontSize(35),
    width: SCREEN_WIDTH - 20,
    backgroundColor: Colors._1A1A1A,
    borderRadius: getFontSize(2),
  },
});
