import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Button from '@/components/Button';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import IconComponent from '@/components/IconComponent';

const friends = () => {
  return (
    <View style={styles.container}>
      <Button
        title="Invite friends"
        type="outline"
        style={styles.inviteButton}
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
  container: {
    flex: 1,
  },
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
