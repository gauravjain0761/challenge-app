import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {CustomModalProps} from '../types';
import {getFontSize, isIphoneX} from '../utils/responsiveFn';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '../constants/Colors';
import IconComponent from './IconComponent';
import Modal from 'react-native-modal';

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  children,
  title,
  isBackShow = true,
  isCloseShow = false,
  rightIcon,
}) => (
  <Modal
    isVisible={visible}
    backdropOpacity={0.7}
    animationIn="slideInUp"
    animationOut="slideOutDown"
    style={styles.container}
    onBackdropPress={onClose}
    onBackButtonPress={onClose}>
    <View style={styles.modalContainer}>
      <LinearGradient
        colors={[Colors.orangeOpacity, Colors.black, Colors.black]}
        style={{flex: 1, borderRadius: getFontSize(1)}}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            {isBackShow && (
              <TouchableOpacity onPress={onClose}>
                <IconComponent
                  name="left"
                  size={getFontSize(3)}
                  color={Colors.white}
                />
              </TouchableOpacity>
            )}
            <Text style={styles.headerTitle}>{title}</Text>
            {isCloseShow && (
              <TouchableOpacity onPress={onClose}>
                <IconComponent
                  name="close"
                  size={getFontSize(3)}
                  color={Colors.white}
                />
              </TouchableOpacity>
            )}
            {rightIcon && rightIcon}
          </View>

          {children}
        </View>
      </LinearGradient>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    margin: 0,
  },
  modalContainer: {
    flex: 1,
    marginTop: isIphoneX() ? getFontSize(15) : getFontSize(5),
    backgroundColor: Colors.black,
    borderRadius: getFontSize(1),
  },
  modalContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getFontSize(2),
    padding: getFontSize(2),
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
});

export default CustomModal;
