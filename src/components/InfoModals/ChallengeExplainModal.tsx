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

const ChallengeExplainModal = ({visible, onClose}: Props) => {
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
            text={'Challenges Explained!'}
            style={styles.headingText}
            containerStyle={{
              marginBottom: getFontSize(2),
            }}
          />

          <Text style={[styles.details]}>
            MenTools challenges is where men come to test themselves with
            purpose. Each challenge is designed to strip away excuses and prove
            what you’re really made of.
          </Text>

          <Text style={styles.heading}>{'Multi-Action'}</Text>
          <Text style={[styles.details]}>
            7 actions. Every day. For 7 days.Set your goal and see how many you
            can finish. The rules are simple, the reality is brutal. Most quit
            before the end. Will you?
          </Text>

          <Text style={styles.heading}>{'Single-Action'}</Text>
          <Text style={[styles.details]}>
            One action a day. Seven days straight. Looks easy on paper, but it
            takes discipline, grit, and a tolerance for pain to go the distance.
          </Text>

          <Text style={styles.heading}>{'MaxOut'}</Text>
          <Text style={[styles.details]}>
            The ultimate trial. Push until you break, find your true MaxOut, and
            stack your score against men worldwide.
          </Text>

          <Text style={styles.heading}>{'Mix'}</Text>
          <Text style={[styles.details]}>
            Every day a new action. No routine, no comfort zone, just relentless
            variety to keep you guessing and grinding.
          </Text>

          <Text style={styles.heading}>{'*Rules*'}</Text>
          <Text style={[styles.details]}>
            Completing Actions: Aim to complete each action in one go where you
            can.
            {'\n\n'}
            For example: hit your 50 press-ups in a single effort during that
            workout or day.
            {'\n\n'}
            For MaxOut, it’s all or nothing — every action must be done in one
            continuous attempt.
            {'\n\n'}
            For Example: perform your maximum press-ups without stopping to
            record a true MaxOut score.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default ChallengeExplainModal;

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
