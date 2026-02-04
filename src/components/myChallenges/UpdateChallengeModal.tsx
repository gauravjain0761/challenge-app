import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Button from '../Button';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import Modal from 'react-native-modal';
import IconComponent from '../IconComponent';

interface UpdateChallengeModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const UpdateChallengeModal = ({
  visible,
  onClose,
  onConfirm,
}: UpdateChallengeModalProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsVisible(visible);
    }
  }, [visible]);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.7}
      animationIn="fadeIn"
      onBackdropPress={handleClose}
      animationOut="fadeOut"
      style={styles.container}>
      <View style={styles.modal}>
        {/* Close Button */}

        <IconComponent
          name="close"
          size={getFontSize(4)}
          color={Colors.white}
          onPress={handleClose}
          style={styles.closeButton}
          type="Ionicons"
        />

        {/* Heading */}
        <Text style={styles.title}>
          Are you sure you want to update this challenge?
        </Text>

        {/* Highlighted Message */}
        <Text style={styles.normalText}>
          You won't know what version of you is on the other side.
        </Text>

        <Button
          title={'Update'}
          style={styles.joinButton1}
          onPress={onConfirm}
        />
      </View>
    </Modal>
  );
};

export default UpdateChallengeModal;
const styles = StyleSheet.create({
  container: {
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },

  modal: {
    width: '85%',
    backgroundColor: Colors._1A1A1A,
    borderRadius: getFontSize(2),
    padding: 20,
  },
  closeIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  title: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: getFontSize(1.8),
    textAlign: 'center',
    marginVertical: getFontSize(1.5),
  },

  normalText: {
    color: Colors.orange,
    fontWeight: '500',
    fontSize: getFontSize(2.6),
    textAlign: 'center',
    marginBottom: getFontSize(2),
  },
  inputLabel: {
    color: Colors.white,
    fontWeight: '400',
    fontSize: getFontSize(1.8),
    marginBottom: 8,
  },

  joinButton1: {
    width: '100%',
    backgroundColor: Colors.orange,
    alignSelf: 'center',
  },
});
