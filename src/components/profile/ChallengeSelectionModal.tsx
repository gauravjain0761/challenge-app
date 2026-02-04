import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import Modal from 'react-native-modal';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import FastImage from 'react-native-fast-image';
import {Images} from '@/assets/images';
import GradientText from '../GradientText';
import IconComponent from '../IconComponent';
import Button from '../Button';
import {router} from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AsyncTypes} from '@/types/enums';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const ChallengeSelectionModal = ({visible, onClose}: Props) => {
  const [_isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  const closeModal = () => {
    setIsVisible(false);
    onClose();
  };

  const handleOnPress = async () => {
    const todayW = await AsyncStorage.getItem(AsyncTypes.TODAY);

    if (todayW === 'true') {
      router.dismissTo('/(tabs)/(challenges)');
    } else {
      router.dismissTo('/(tabs)/(today)');
    }
  };

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
          onPress={closeModal}
          style={styles.closeButton}
          type="Ionicons"
        />
        <FastImage
          source={Images.Men_Tools_Logo} // Replace with your video path
          style={styles.logo}
          resizeMode="contain"
        />

        <GradientText
          text={'Chose your\nchallenge!'}
          style={styles.headingText}
          gradientStyle={{
            height: getFontSize(12),
          }}
          containerStyle={{
            marginTop: getFontSize(1),
          }}
        />
        <GradientText
          colors={[Colors._999999, Colors.white]}
          text={
            'Payment will only be taken once\nyou have selected your challenge.'
          }
          style={styles.headingText2}
          gradientStyle={{
            height: getFontSize(5),
          }}
          containerStyle={{
            marginBottom: getFontSize(2),
          }}
        />

        <Button
          title="See challenges >"
          type="outline"
          style={styles.buttonStyle}
          onPress={handleOnPress}
        />
      </View>
    </Modal>
  );
};

export default ChallengeSelectionModal;

const styles = StyleSheet.create({
  container: {
    margin: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: Colors._1A1A1A,
    padding: getFontSize(2),
    margin: getFontSize(1.5),
    borderRadius: getFontSize(2),
    borderWidth: 1,
    borderColor: Colors._C05600,
    width: '90%',
    gap: getFontSize(1.5),
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: getFontSize(2),
    position: 'absolute',
    top: getFontSize(2),
    right: getFontSize(2),
  },
  logo: {
    width: getFontSize(11),
    height: getFontSize(5),
    alignSelf: 'center',
  },
  headingText: {
    fontSize: getFontSize(4.5),
    fontWeight: '500',
    textAlign: 'center',
  },
  headingText2: {
    fontSize: getFontSize(2),
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonStyle: {
    backgroundColor: Colors._2a2a2a,
    borderColor: Colors.borderColor,
    alignSelf: 'center',
  },
});
