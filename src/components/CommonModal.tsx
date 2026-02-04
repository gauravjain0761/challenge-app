import {Platform, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import Button from './Button';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import IconComponent from './IconComponent';

type Props = {
  visible: boolean;
  onClose: () => void;
  onPress: () => void;
  isButtonShow?: boolean;
  title?: string;
  leftBtnTitle?: string;
  rightBtnTitle?: string;
  isLoading?: boolean;
  isCloseShow?: boolean;
  desc?: string;
  image?: any;
  onModalHide?: () => void;
};

const CommonModal = ({
  visible,
  onClose,
  onPress,
  isButtonShow = true,
  title = '',
  leftBtnTitle = '',
  rightBtnTitle = '',
  isLoading = false,
  isCloseShow = true,
  desc,
  image,
  onModalHide,
}: Props) => {
  const [_isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  const closeModal = () => {
    setIsVisible(false);
    onClose();
  };

  return (
    <Modal
      animationOutTiming={100}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      useNativeDriver={Platform.OS == 'ios' ? false : true}
      backdropOpacity={0.5}
      onBackButtonPress={() => closeModal()}
      onBackdropPress={() => closeModal()}
      onModalHide={onModalHide}
      style={styles.modalStyle}
      isVisible={_isVisible}>
      <View style={styles.modalContainer}>
        {isCloseShow && (
          <IconComponent
            name="close"
            onPress={closeModal}
            style={styles.closeView}
            color={Colors.white}
          />
        )}
        {image && (
          <FastImage source={image} style={styles.image} resizeMode="contain" />
        )}
        <Text style={styles.loginText}>
          {title ? title : 'Are you sure you want to logout?'}
        </Text>
        {desc && <Text style={styles.descText}>{desc}</Text>}
        {isButtonShow && (
          <View style={styles.row}>
            <Button
              title={leftBtnTitle ? leftBtnTitle : 'Cancel'}
              onPress={() => closeModal()}
              type="outline"
              style={styles.btnStyle}
            />
            <Button
              title={rightBtnTitle ? rightBtnTitle : 'Logout'}
              onPress={onPress}
              style={styles.btnStyle}
            />
          </View>
        )}
      </View>
    </Modal>
  );
};

export default CommonModal;

const styles = StyleSheet.create({
  modalStyle: {
    // alignItems: 'center',
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContainer: {
    borderTopStartRadius: 15,
    borderTopEndRadius: 15,
    backgroundColor: Colors.dark.background,
    padding: 10,
    shadowColor: Colors.white,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingBottom: getFontSize(5),
  },
  loginText: {
    fontSize: getFontSize(2.5),
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
    marginHorizontal: getFontSize(2),
    marginBottom: getFontSize(2),
  },
  descText: {
    fontSize: getFontSize(1.6),
    fontWeight: '400',
    color: Colors.white,
    textAlign: 'center',
    marginHorizontal: getFontSize(2),
    marginBottom: getFontSize(2),
    opacity: 0.7,
  },
  btnStyle: {
    flex: 1,
  },
  closeIconStyle: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
  },
  closeView: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: getFontSize(3),
  },
  image: {
    width: getFontSize(10),
    height: getFontSize(10),
    alignSelf: 'center',
  },
});
