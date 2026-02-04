import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {getFontSize, SCREEN_HEIGHT, SCREEN_WIDTH} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import IconComponent, {IconType} from '@/components/IconComponent';
import GradientText from '../GradientText';
import {GeneralStyle} from '@/constants/GeneralStyle';
import Button from '../Button';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const RowView = ({
  iconName,
  title,
  type,
}: {
  iconName: string;
  title: string;
  type?: IconType;
}) => {
  return (
    <View style={styles.row}>
      <View style={[styles.checkbox]}>
        {
          <IconComponent
            name={iconName}
            size={getFontSize(2)}
            color={Colors.white}
            type={type}
          />
        }
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const ActionInfoModal = ({visible, onClose}: Props) => {
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
            text={'Action Options Explained!'}
            style={styles.headingText}
            containerStyle={{
              marginBottom: getFontSize(2),
            }}
          />
          <RowView iconName="right" title="ARROW" />
          <Text style={[styles.details]}>
            Some actions come with tools to help you get it done, like
            meditations, timers, or logging your reps. Use the tool, complete
            the task.
          </Text>

          <RowView iconName="check" title="TICK" />
          <Text style={[styles.details]}>
            For these actions, all you need to do is mark it complete once
            you’ve finished. Simple, no extras. It will go orange when selected.
          </Text>

          <RowView
            iconName="undo-variant"
            type="MaterialCommunityIcons"
            title="UNDO"
          />
          <Text style={[styles.details]}>
            Made a mistake? Slide the action to the right and hit Undo to reset
            it.
          </Text>

          <RowView iconName="plus" title="QUICK ADD" />
          <Text style={[styles.details]}>
            Slide left to see the Quick Add icon. Use this to drop in your next
            challenge instantly.
          </Text>

          <RowView iconName="arrowright" title="SKIPS" />
          <Text style={[styles.details]}>
            You can manually skip each action or press the finish day button to
            skip all actions.
          </Text>

          <GradientText
            text={'MaxOut'}
            style={styles.titleText}
            start={{x: 0, y: 0}}
            end={{x: 0.2, y: 0.2}}
            colors={[Colors.primary, Colors.white]}
            containerStyle={{
              marginVertical: getFontSize(1.5),
              paddingHorizontal: getFontSize(1.5),
              marginTop: getFontSize(3),
            }}
          />
          <Text style={[styles.details]}>
            In a MaxOut challenge, your score will appear. It’s saved, so next
            time, you’ll know exactly what number you need to beat.
          </Text>
          <Button
            title="Finish Day"
            style={styles.finishButton}
            containerStyle={styles.finishButtonContainer}
          />
          <Text style={[styles.details]}>
            Once you complete one action the finish day button will appear. Tap
            Finish day to close out your day. Any actions left incomplete will
            be auto skipped. You can only edit/undo actions for the current day
            only.
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

export default ActionInfoModal;

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

  titleText: {
    fontSize: getFontSize(2.6),
    fontWeight: '500',
    color: Colors.white,
  },

  title: {
    fontSize: getFontSize(2),
    fontWeight: '400',
    color: Colors.white,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getFontSize(1.5),
    paddingHorizontal: getFontSize(1.5),
    marginTop: getFontSize(3),
    marginBottom: getFontSize(1),
  },

  checkbox: {
    width: getFontSize(4),
    height: getFontSize(4),
    borderRadius: getFontSize(1),
    backgroundColor: Colors._1A1A1A,
    borderColor: Colors.white,
    borderWidth: getFontSize(0.1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishButton: {
    height: getFontSize(5),
    alignSelf: 'flex-start',
    width: 'auto',
    borderRadius: 10,
    marginHorizontal: getFontSize(1),
    marginTop: getFontSize(4),
  },
  finishButtonContainer: {
    paddingHorizontal: getFontSize(2.5),
  },
});
