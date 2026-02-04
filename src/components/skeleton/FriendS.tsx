import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {Colors} from '@/constants/Colors';
import {getFontSize, SCREEN_WIDTH} from '@/utils/responsiveFn';

const FriendS = ({numberOfArray}: {numberOfArray?: number}) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SkeletonPlaceholder
        speed={5000}
        backgroundColor={Colors.inactiveTabColor}
        highlightColor={Colors.borderColor}>
        <SkeletonPlaceholder.Item marginTop={getFontSize(3)}>
          {[...Array(numberOfArray || 5)].map((_, i) => (
            <SkeletonPlaceholder.Item
              key={i.toString()}
              flexDirection="row"
              alignItems="center"
              gap={getFontSize(2)}>
              <SkeletonPlaceholder.Item
                width={SCREEN_WIDTH - getFontSize(5)}
                height={getFontSize(11)}
                borderRadius={8}
                marginBottom={getFontSize(2)}
              />
            </SkeletonPlaceholder.Item>
          ))}
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </ScrollView>
  );
};

export default FriendS;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
});
