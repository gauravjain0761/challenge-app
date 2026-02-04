import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {getFontSize, SCREEN_HEIGHT} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import IconComponent from '@/components/IconComponent';
import GradientText from '../GradientText';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const TypeOfChallengesInfoModal = ({visible, onClose}: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(visible);
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
        <IconComponent
          name="x"
          type="Feather"
          size={getFontSize(4)}
          color={Colors.white}
          onPress={() => handleClose()}
          style={styles.closeButton}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <GradientText
            text={'Types of Challenges!'}
            style={styles.headingText}
            containerStyle={{
              marginBottom: getFontSize(2),
            }}
          />

          <Text style={styles.heading}>{'Personal Challenges'}</Text>
          <Text style={[styles.details]}>
            <Text style={{fontWeight: '600'}}>You vs You:</Text> Your starting
            point. Set your own target and prove you can follow through. Every
            rep, every action, every day builds discipline.
          </Text>

          <Text style={styles.heading}>{'Group Challenges '}</Text>
          <Text style={[styles.details]}>
            <Text style={{fontWeight: '600'}}>You vs Friends:</Text> Go
            head-to-head with your circle. Push each other, keep each other
            accountable, and find out who can hold the line the longest.{'\n\n'}
            To create a group challenge, simply start a personal challenge and
            invite your friends/circle.
          </Text>

          <Text style={styles.heading}>{'Worldwide Challenges'}</Text>
          <Text style={[styles.details]}>
            <Text style={{fontWeight: '600'}}>You vs The World:</Text> Monthly
            events where men from around the world take on the same test. See
            where you rank, measure your edge, and join a global movement of
            action.
          </Text>

          <Text style={styles.heading}>{'Legend Challenges'}</Text>
          <Text style={[styles.details]}>
            <Text style={{fontWeight: '600'}}>You vs Legend Status:</Text>{' '}
            One-off events reserved for men who’ve climbed to Master level.
            These are the hardest trials of all, the final step to prove if
            you’re worthy of Legend Status.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default TypeOfChallengesInfoModal;

const styles = StyleSheet.create({
  container: {
    margin: 0,
    justifyContent: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: getFontSize(1),
    marginBottom: getFontSize(1),
    zIndex: 100,
  },

  modal: {
    backgroundColor: Colors._1A1A1A,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: getFontSize(2),
    paddingTop: getFontSize(1),
    paddingHorizontal: getFontSize(2),
    paddingBottom: getFontSize(2),
    marginHorizontal: getFontSize(1),
    height: SCREEN_HEIGHT / 1.5,
  },

  headingText: {
    fontSize: getFontSize(3),
    fontWeight: '500',
    color: Colors.white,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  heading: {
    fontSize: getFontSize(2),
    fontWeight: '700',
    color: Colors.white,
    padding: getFontSize(1),
    marginTop: getFontSize(2),
  },

  details: {
    fontSize: getFontSize(2),
    fontWeight: '400',
    color: Colors.white,
    textAlign: 'left',
    opacity: 0.8,
    letterSpacing: 0.5,
    paddingHorizontal: getFontSize(1.5),
  },
});
