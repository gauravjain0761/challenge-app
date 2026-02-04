import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Colors} from '@/constants/Colors';
import {getFontSize, isIphoneX} from '@/utils/responsiveFn';
import Modal from 'react-native-modal';
import IconComponent from './IconComponent';
import {GeneralStyle} from '@/constants/GeneralStyle';
import WhatWhyHow from './info/WhatWhyHow';
import {router} from 'expo-router';

interface WhatWhyHowModalModalProps {
  visible: boolean;
  onClose: () => void;
  data: any;
  assetsData?: any[];
}

const WhatWhyHowModal = ({
  visible,
  onClose,
  data,
  assetsData,
}: WhatWhyHowModalModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [input, setInput] = useState('');

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
        <ScrollView
          style={{
            marginBottom: getFontSize(12),
            width: '100%',
          }}
          showsVerticalScrollIndicator={false}>
          <WhatWhyHow
            data={data}
            isOpen={isOpen}
            toggleSection={() => setIsOpen(!isOpen)}
            isToggled={false}
          />
        </ScrollView>
      </View>
    </Modal>
  );
};

export default WhatWhyHowModal;
const styles = StyleSheet.create({
  container: {
    margin: 0,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },

  modal: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors._1A1A1A,
    borderRadius: getFontSize(2),
    padding: 20,
    marginTop: isIphoneX() ? getFontSize(20) : getFontSize(10),
  },
  closeIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
});
