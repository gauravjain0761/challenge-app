import {StyleSheet, Text, View} from 'react-native';
import Button from './Button';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {Colors} from '../constants/Colors';
import {getFontSize} from '../utils/responsiveFn';

const FriendsTab = () => (
  <View style={{flex: 1, alignItems: 'center'}}>
    <Button
      title="Invite friends"
      type="outline"
      style={styles.inviteButton}
      textStyle={styles.inviteButtonText}
      leftIcon={
        <AntIcon
          name="addusergroup"
          size={getFontSize(3)}
          color={Colors.white}
        />
      }
    />
  </View>
);
const styles = StyleSheet.create({
  inviteButton: {
    backgroundColor: Colors.textInputBackground,
    borderWidth: 1,
    borderColor: Colors.borderColor,
    width: '95%',
    //paddingHorizontal: getFontSize(1),
  },
  inviteButtonText: {
    color: Colors.white,
    marginLeft: getFontSize(1),
  },
});

export default FriendsTab;
