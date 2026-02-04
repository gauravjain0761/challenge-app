import IconComponent from '@/components/IconComponent';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import React, {memo} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';

const PlaybackControls = memo(
  ({
    rewind10s,
    forward10s,
    time,
    isIconShow = true,
  }: {
    rewind10s?: () => void;
    forward10s?: () => void;
    time: string;
    isIconShow?: boolean;
  }) => (
    <View style={styles.controlRow}>
      {isIconShow && (
        <TouchableOpacity onPress={rewind10s}>
          <IconComponent
            type="MaterialIcons"
            name={'replay-10'}
            color={Colors.white}
            size={36}
          />
        </TouchableOpacity>
      )}
      <Text style={styles.timerText}>{time}</Text>
      {isIconShow && (
        <TouchableOpacity onPress={forward10s}>
          <IconComponent
            type="MaterialIcons"
            name={'forward-10'}
            color={Colors.white}
            size={36}
          />
        </TouchableOpacity>
      )}
    </View>
  ),
);

export default PlaybackControls;

const styles = StyleSheet.create({
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: getFontSize(3),
  },

  timerText: {
    fontSize: getFontSize(3.5),
    color: Colors.white,
    fontWeight: 'bold',
  },
});
