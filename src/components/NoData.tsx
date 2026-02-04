import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {GeneralStyle} from '@/constants/GeneralStyle';
import GradientText from './GradientText';
import {getFontSize} from '@/utils/responsiveFn';

const NoData = () => {
  return (
    <View style={GeneralStyle.center}>
      <Text style={GeneralStyle.noDataText}>No Data Found</Text>
    </View>
  );
};

export default NoData;

const styles = StyleSheet.create({});
