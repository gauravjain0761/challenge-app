import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import HoldToCompleteButton from '../HoldToCompleteButton';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const Confirmation = ({onPress = () => {}}: {onPress?: () => void}) => {
  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        <HoldToCompleteButton onCompleted={onPress} />
      </GestureHandlerRootView>
    </View>
  );
};

export default Confirmation;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: '70%',
  },
});
