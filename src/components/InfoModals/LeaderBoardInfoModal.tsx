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

const LeaderBoardInfoModal = ({visible, onClose}: Props) => {
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
            text={'Winners & Losers'}
            style={styles.headingText}
            containerStyle={{
              marginBottom: getFontSize(2),
            }}
          />

          <Text style={styles.heading}>{'Invite a Friend'}</Text>
          <Text style={[styles.details]}>
            A challenge alone is only half the battle. Bring your friends in and
            raise the stakes, more accountability, more banter, and the sweet
            shame of finishing last (or the bragging rights of finishing first).
            {'\n \n'}
            You can invite friends anytime before Day 1 ends. Accepted friends
            will show with a white friend icon beside their name.
          </Text>

          <Text style={styles.heading}>{'Kick Up the Arse'}</Text>
          <Text style={[styles.details]}>
            If your mate’s slipping behind, send him a friendly wake-up call.
            Tap the three dots and hit Nudge, a reminder that pride, not
            excuses, is on the line.
          </Text>

          <Text style={styles.heading}>{'Leader-board'}</Text>
          <Text style={[styles.details]}>
            Our leader board rewards consistent action, not talk. To climb,
            you’ve got to finish every day strong. Scores update once per day,
            so if you’ve earned it, your position will show soon enough.
          </Text>

          <Text style={styles.heading}>{'You vs World Challenges'}</Text>
          <Text style={[styles.details]}>
            Top the leader board and you’ll unlock entry into Legend Challenges,
            exclusive events where the best compete to prove who truly deserves
            the title of MenTools Legend.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default LeaderBoardInfoModal;

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
