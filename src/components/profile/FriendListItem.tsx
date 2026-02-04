import {StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import FastImage from 'react-native-fast-image';
import {PendingFriendList} from '@/validation/schemas';
import Button from '../Button';
import {getShortTimeAgo} from '@/utils/common/commonFunction';

type Props = {
  item: PendingFriendList;
  index?: number;
  onAccept?: () => void;
  onDecline?: () => void;
};

const FriendListItem = ({item, index, onAccept, onDecline}: Props) => {
  return (
    <View style={[styles.container]}>
      <FastImage
        source={require('../../assets/images/identityJournal.png')}
        style={styles.imageStyle}
      />
      <View style={styles.detailView}>
        {/* <View style={styles.btnView}> */}
        <Text style={styles.nameText}>{item?.senderId.name || ''}</Text>
        <Text style={styles.timeText}>
          {getShortTimeAgo(item?.sentAt) || ''}
        </Text>
        {/* </View> */}
        <View style={styles.btnView}>
          <Button
            title="Accept"
            type="fill"
            style={styles.btnStyle}
            onPress={onAccept}
          />
          <Button
            title="Decline"
            type="outline"
            style={styles.btnStyle}
            onPress={onDecline}
          />
        </View>
      </View>
    </View>
  );
};

export default memo(FriendListItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getFontSize(2),
    paddingVertical: getFontSize(1),
    paddingHorizontal: getFontSize(1),
  },
  current: {
    borderWidth: 1,
    borderColor: Colors._C05600,
    marginVertical: getFontSize(0.5),
  },

  imageStyle: {
    width: getFontSize(8),
    height: getFontSize(8),
    borderRadius: getFontSize(5),
  },

  detailView: {
    gap: 5,
  },

  btnView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getFontSize(1),
    flex: 1,
  },
  nameText: {
    color: Colors.white,
    fontSize: getFontSize(2),
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  timeText: {
    color: Colors.white,
    fontSize: getFontSize(1.5),
    fontWeight: '500',
    textTransform: 'capitalize',
    opacity: 0.7,
  },

  btnStyle: {
    width: '40%',
    height: getFontSize(4),
    marginVertical: 0,
  },
});
