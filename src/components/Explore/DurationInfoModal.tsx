import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {getFontSize, SCREEN_HEIGHT, SCREEN_WIDTH} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import IconComponent from '@/components/IconComponent';
import GradientText from '../GradientText';
import {GeneralStyle} from '@/constants/GeneralStyle';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const RowView = ({title}: any) => {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>•</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const DurationInfoModal = ({visible, onClose}: Props) => {
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
            text={'Why 7 Day Only?'}
            style={styles.headingText}
            containerStyle={{
              marginBottom: getFontSize(2),
            }}
          />
          <Text style={styles.details}>
            Habits don’t stick because you set a plan six months from now, they
            stick because you do something today.
          </Text>
          <Text style={styles.details}>
            A 7-day challenge is short enough to commit, but powerful enough to
            change you.
          </Text>

          <Text style={styles.details}>In one week you:</Text>
          <RowView title={'Build discipline through daily action'} />
          <RowView title={'Learn the art of habit stacking'} />
          <RowView title={'Get fast wins that fire up your dopamine system'} />
          <RowView title={'See clearly what’s working and what needs work'} />

          <Text style={styles.heading}>The Payoff</Text>

          <Text style={[styles.title, {paddingHorizontal: getFontSize(1.5)}]}>
            By Day 7 you’ll feel sharper, mentally stronger, and more in
            control. You’ll have real evidence that you can take action every
            day, and that’s addictive in the best way.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default DurationInfoModal;

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
  details: {
    fontSize: getFontSize(2),
    fontWeight: '400',
    color: Colors.white,
    textAlign: 'left',
    opacity: 0.8,
    marginTop: getFontSize(3),
    letterSpacing: 0.5,
    paddingHorizontal: getFontSize(1.5),
  },
  title: {
    fontSize: getFontSize(2),
    fontWeight: '400',
    color: Colors.white,
    textAlign: 'left',
    opacity: 0.8,
    letterSpacing: 0.5,
  },
  heading: {
    fontSize: getFontSize(2.5),
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'left',
    marginTop: getFontSize(5),
    letterSpacing: 0.5,
    marginBottom: getFontSize(1),
    paddingHorizontal: getFontSize(1.5),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getFontSize(1.5),
    paddingHorizontal: getFontSize(1.5),
    marginTop: getFontSize(0.5),
  },
});
