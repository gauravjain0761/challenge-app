import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Colors} from '@/constants/Colors';
import {getFontSize, SCREEN_WIDTH} from '@/utils/responsiveFn';
import LinearGradient from 'react-native-linear-gradient';
import Checkbox from 'expo-checkbox';
import {BlurView} from 'expo-blur';
import {StatusModalProps} from '@/types';
import IconComponent from './IconComponent';
import Modal from 'react-native-modal';

const MODAL_CONTENT = {
  completed: {
    title: 'Man of Action!',
    message: 'Keep crushing those goals!',
    quote:
      'People who are crazy enough to think they can change the world, are the ones who do.',
    author: 'Rob Siltanen',
    gradientColors: ['rgb(1, 23, 11)', 'rgb(2, 49, 22)', 'rgb(1, 23, 11)'], // Greenish background
    backgroundColor: 'rgb(13, 77, 41)',
    iconName: 'check',
  },
  failed: {
    title: 'Temporary Setback!',
    message: 'This is your comeback story!',
    quote: 'The only time you really fail is when you fall down and stay down.',
    author: 'Stephen Richards',
    gradientColors: ['rgb(31, 30, 30)', 'rgb(61, 60, 60)', 'rgb(31, 30, 30)'], // Grayish background
    backgroundColor: 'rgb(68, 67, 67)',
    iconName: 'arrowright',
  },
  skipped: {
    title: 'Temporary Setback!',
    message: 'This is your comeback story!',
    quote: 'The only time you really fail is when you fall down and stay down.',
    author: 'Stephen Richards',
    gradientColors: ['rgb(31, 30, 30)', 'rgb(61, 60, 60)', 'rgb(31, 30, 30)'], // Grayish background
    backgroundColor: 'rgb(68, 67, 67)',
    iconName: 'arrowright',
  },
  pending: {
    title: 'Strategic Break',
    message: 'Strategic inaction is best action!',
    quote: 'Sometimes you have to take a step back to move forward.',
    author: 'Erika Taylor',
    gradientColors: ['rgb(31, 12, 11)', 'rgb(61, 24, 22)', 'rgb(31, 12, 11)'], // Reddish background
    backgroundColor: 'rgb(71, 34, 32)',
    iconName: 'close',
  },
};

export const StatusModal: React.FC<StatusModalProps> = ({
  visible,
  onClose,
  type,
  streak = 6,
  hideStreak = false,
  onPressSave = () => {},
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const content = MODAL_CONTENT[type];
  const [isChecked, setChecked] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    setChecked(false);
    setShowError(false);
    setIsVisible(visible);
  }, [visible]);

  const onSave = () => {
    if (isChecked) {
      onPressSave();
    } else {
      setShowError(true);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}>
      <BlurView style={styles.modalOverlay} intensity={7}>
        <LinearGradient
          colors={content.gradientColors}
          style={{borderRadius: getFontSize(2)}}>
          <View
            style={[
              styles.modalContent,
              {borderColor: content.backgroundColor},
            ]}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <IconComponent
                name="cross"
                size={getFontSize(4.5)}
                color={Colors.white}
                type="Entypo"
              />
            </TouchableOpacity>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: getFontSize(2),
              }}>
              <View
                style={[
                  styles.circle,
                  {backgroundColor: content.backgroundColor},
                ]}>
                <IconComponent
                  name={content.iconName}
                  size={getFontSize(4)}
                  color={Colors.white}
                />
              </View>

              <Text style={styles.modalTitle}>{content.title}</Text>
              <Text style={styles.modalMessage}>{content.message}</Text>
            </View>

            {!hideStreak && (
              <View style={styles.streakContainer}>
                <Text style={styles.streakText}>CURRENT STREAK</Text>
                <Text
                  style={[
                    styles.streakValue,
                    {backgroundColor: content.backgroundColor},
                  ]}>
                  🔥 {streak}d{' '}
                </Text>
              </View>
            )}

            <View
              style={[
                styles.quoteContainer,
                {backgroundColor: content.backgroundColor},
              ]}>
              <Text style={styles.quote}>"{content.quote}"</Text>
              <Text style={styles.author}>— {content.author}</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              }}>
              <View>
                <View style={styles.dontShowAgain}>
                  <Checkbox
                    style={styles.checkbox}
                    value={isChecked}
                    onValueChange={() => {
                      setChecked(!isChecked);
                      setShowError(false);
                    }}
                  />
                  <Text style={styles.dontShowText}>Don't show this again</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={onSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
            {showError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Please mark the checkbox</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    //backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH - 60,
    padding: getFontSize(3),
    alignItems: 'center',
    borderRadius: getFontSize(2), // Border radius
    borderWidth: 1, // Border width,
  },
  modalTitle: {
    color: 'white',
    fontSize: getFontSize(2.6),
    fontWeight: 'bold',
    marginBottom: getFontSize(2),
    marginTop: getFontSize(1),
  },
  modalMessage: {
    color: '#CCCCCC',
    fontSize: getFontSize(1.8),
    marginBottom: getFontSize(0.2),
    textAlign: 'center',
  },
  circle: {
    width: getFontSize(6), // Diameter of the circle
    height: getFontSize(6), // Diameter of the circle
    borderRadius: getFontSize(6), // Half of the width/height to make it a perfect circle
    backgroundColor: '#FF6B00', // Background color of the circle
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
  },
  streakContainer: {
    alignItems: 'center',
    marginBottom: getFontSize(2),
  },
  streakText: {
    color: Colors.white,
    fontSize: getFontSize(1.6),
    marginBottom: getFontSize(1),
    fontWeight: 'bold',
  },
  streakValue: {
    color: 'white',
    fontSize: getFontSize(1.8),
    fontWeight: '600',
    padding: getFontSize(0.5),
    borderRadius: getFontSize(2),
  },
  quoteContainer: {
    alignItems: 'center',
    marginBottom: getFontSize(2.5),
    paddingHorizontal: getFontSize(2),
    padding: getFontSize(0.5),
    borderRadius: getFontSize(2),
  },
  quote: {
    color: 'white',
    fontSize: getFontSize(1.6),
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: getFontSize(1),
    fontWeight: '500',
    marginTop: getFontSize(1),
  },
  author: {
    color: '#CCCCCC',
    fontSize: getFontSize(1.8),
  },
  closeButton: {
    position: 'absolute',
    right: getFontSize(2),
    top: getFontSize(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#CCCCCC',
    fontSize: getFontSize(3),
  },
  saveButton: {
    backgroundColor: Colors.white,
    height: getFontSize(4.5),
    width: getFontSize(8),
    borderRadius: getFontSize(1.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.black,
    fontSize: getFontSize(2),
  },
  dontShowAgain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getFontSize(1),
  },
  checkbox: {
    height: getFontSize(3),
    width: getFontSize(3),
  },
  dontShowText: {
    color: Colors.white,
    fontSize: getFontSize(1.6),
  },
  errorContainer: {
    width: '100%',
  },
  errorText: {
    color: Colors.red,
    fontSize: getFontSize(2),
    textAlign: 'left',
  },
});
