// components/SkipModal.tsx
import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import {FailsModalProps} from '../types';
import CustomModal from './CustomModal';
import {Colors} from '../constants/Colors';
import {getFontSize} from '../utils/responsiveFn';

const FailsModal: React.FC<FailsModalProps> = ({
  visible,
  onClose,
  onSelectFails,
  selectedFail,
}) => {
  return (
    <CustomModal visible={visible} onClose={onClose} title="Daily fails">
      <View style={styles.container}>
        <Text style={styles.description}>
          Select the amount of days you are allowed to fail before you are
          eliminated from the challenge.
        </Text>
        {Array.from({length: 5}).map((_, i) => (
          <TouchableOpacity
            key={`${i + 1}`}
            style={[styles.skipOption]}
            onPress={() => onSelectFails(i)}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.skipText,
                selectedFail === i && styles.selectedText,
              ]}>
              {i === 0 ? 'No' : i} Fail{i === 0 ? 's' : ''}
            </Text>
            {selectedFail === i && (
              <AntDesign name="check" size={24} color={Colors.white} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  skipOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: getFontSize(1.8),
    paddingHorizontal: getFontSize(2),
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  description: {
    color: Colors.white,
    fontSize: getFontSize(1.8),
    fontWeight: '400',
    marginBottom: getFontSize(2.5),
    opacity: 0.6,
  },
  selectedSkip: {
    backgroundColor: Colors.textInputBackground,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  skipText: {
    color: Colors.white,
    fontSize: getFontSize(2),
    fontWeight: '500',
  },
  selectedText: {
    color: Colors.orange,
    fontWeight: '500',
  },
});

export default FailsModal;
