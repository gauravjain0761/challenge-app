import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import React from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';

const PaginationDots = ({
  data = [],
  currentIndex = 0,
  container,
}: {
  data?: any[];
  currentIndex?: number;
  container?: ViewStyle;
}) => {
  return (
    <View style={[styles.dotContainer, container]}>
      {data?.length > 0 &&
        data.map((_, ind) => (
          <View
            key={ind.toString()}
            style={[
              styles.dot,
              {
                ...(ind === currentIndex
                  ? {backgroundColor: Colors.orange}
                  : {}),
              },
            ]}
          />
        ))}
    </View>
  );
};

export default PaginationDots;

const styles = StyleSheet.create({
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: getFontSize(1),
    marginTop: getFontSize(3),
  },
  dot: {
    height: getFontSize(1.2),
    width: getFontSize(1.2),
    borderRadius: getFontSize(2),
    backgroundColor: Colors._838383,
  },
});
