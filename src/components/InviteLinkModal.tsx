import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import IconComponent from './IconComponent';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import Loader from './Loader';
import Button from './Button';
import GradientText from './GradientText';
import {ImageBackground} from 'react-native';
import {Images} from '@/assets/images';

interface InviteLinkModal {
  visible: boolean;
  onClose: () => void;
  onPressPreview?: () => void;
  onPressJoin?: () => void;
  isLoading?: boolean;
  challengeName?: string;
}

const InviteLinkModal = ({
  visible,
  onClose,
  onPressPreview,
  onPressJoin,
  isLoading = false,
  challengeName,
}: InviteLinkModal) => {

 // const [isVisible, setIsVisible] = useState(false);

  // useEffect(() => {
  //   if (visible) {
  //     setIsVisible(visible);
  //   } else {
  //     setIsVisible(false);
  //   }
  // }, [visible]);

  // const handleClose = () => {
  //   //setIsVisible(false);
  //   onClose();
  // };
  return (
    <Modal
      isVisible={visible}
      backdropOpacity={0.8}
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={styles.container}>
      <View style={styles.modal}>
        <IconComponent
          name="close"
          size={getFontSize(4)}
          color={Colors.white}
          onPress={onClose}
          style={styles.closeButton}
          type="Ionicons"
        />
        {/* <Text style={styles.heading}>Pomodoro Mastery</Text> */}
        <GradientText
          text={challengeName ?? ''}
          height={
            challengeName && challengeName?.length > 25
              ? getFontSize(7.5)
              : getFontSize(4)
          }
          style={styles.nameText}
          containerStyle={styles.nameContainer}
        />
        <Text style={styles.heading}>Do you want to join this challenge?</Text>
        <View style={styles.btnContainer}>
          <Button
            title="Preview"
            style={styles.buttonStyle}
            type="outline"
            // textStyle={styles.inviteButtonText}
            onPress={onPressPreview}
          />
          <Button
            title="Join Challenge"
            style={styles.buttonStyle}
            type="fill"
            // textStyle={styles.inviteButtonText}
            onPress={onPressJoin}
          />
        </View>
        {isLoading && <Loader />}
      </View>
    </Modal>
  );
};

export default InviteLinkModal;

const styles = StyleSheet.create({
  container: {
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: getFontSize(2),
  },

  modal: {
    backgroundColor: Colors._1A1A1A,
    padding: getFontSize(2),
    margin: getFontSize(1.5),
    borderRadius: getFontSize(2),
  },
  btnContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: getFontSize(2),
  },
  heading: {
    fontSize: getFontSize(2.5),
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: getFontSize(2),
  },
  buttonStyle: {
    flex: 1,
  },
  nameText: {
    fontSize: getFontSize(3),
    fontWeight: '600',
    textAlign: 'center',
  },
  nameContainer: {
    marginBottom: getFontSize(2),
  },
});
