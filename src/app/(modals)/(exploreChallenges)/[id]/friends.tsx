import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Button from '@/components/Button';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import IconComponent from '@/components/IconComponent';
import {GeneralStyle} from '@/constants/GeneralStyle';

const friends = () => {
  return (
    <View style={[GeneralStyle.layoutContainer]}>
      <Button
        title="Invite friends"
        style={styles.inviteButton}
        type="outline"
        textStyle={styles.inviteButtonText}
        leftIcon={
          <IconComponent
            type="Feather"
            name="users"
            size={getFontSize(3)}
            color={Colors.white}
          />
        }
      />
    </View>
  );
};

export default friends;

const styles = StyleSheet.create({
  inviteButton: {
    backgroundColor: Colors.textInputBackground,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    width: '95%',
    alignSelf: 'center',
  },
  inviteButtonText: {
    color: Colors.orange,
    marginLeft: getFontSize(1),
  },
});
