import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Button from '../Button';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import CustomInput from '../CustomInput';
import Modal from 'react-native-modal';
import IconComponent from '../IconComponent';
import {get} from 'react-hook-form';

interface LeaveChallengeModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const LeaveChallengeModal = ({
  visible,
  onClose,
  onConfirm,
  isLoading,
}: LeaveChallengeModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [input, setInput] = useState('');

  const handleConfirm = () => {
    if (input === 'Leave') {
      onConfirm();
    }
  };

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
          Are you sure you want to leave this challenge?
        </Text>

        {/* Highlighted Message */}
        <Text style={styles.normalText}>
          You won't know what version of you is on the other side.
        </Text>

        {/* Input */}
        <Text style={styles.inputLabel}>Type "Leave" to confirm</Text>
        <CustomInput
          value={input}
          onChangeText={setInput}
          placeholder="Leave"
        />

        <Button
          title={'Leave this Challenge'}
          type="outline"
          isLoading={isLoading}
          style={styles.joinButton}
          onPress={handleConfirm}
        />
      </View>
    </Modal>
  );
};

export default LeaveChallengeModal;
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

  joinButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderColor: Colors.red,
    marginVertical: getFontSize(0),
    alignSelf: 'center',
  },
});
