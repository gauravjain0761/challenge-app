import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import {Colors} from '@/constants/Colors';
import Button from '@/components/Button';
import IconComponent from '@/components/IconComponent';
import {getFontSize} from '@/utils/responsiveFn/index';

interface EmptyStateProps {
  onPressAdd: () => void;
  btnTitle?: string;
  description?: string;
  style?: ViewStyle;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  onPressAdd,
  btnTitle,
  description,
  style,
}) => {
  return (
    <View style={[styles.noChallengesContainer, style]}>
      <Text style={styles.noChallengesText}>
        {description
          ? description
          : `The harder the challenge\nthe greater the growth`}
      </Text>
      <Button
        title={btnTitle ? btnTitle : 'Add challenge'}
        type="outline"
        leftIcon={
          <IconComponent
            type="Entypo"
            name="plus"
            size={23}
            color={Colors.orange}
          />
        }
        textStyle={styles.addChallengeButtonText}
        style={styles.addChallengeButton}
        onPress={onPressAdd}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  noChallengesContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: getFontSize(2),
    marginTop: getFontSize(20),
  },
  noChallengesText: {
    color: Colors.white,
    fontSize: getFontSize(3),
    textAlign: 'center',
    lineHeight: getFontSize(3.5),
  },
  addChallengeButtonText: {
    color: Colors.white,
    fontSize: getFontSize(2),
  },
  addChallengeButton: {
    // paddingVertical: getFontSize(1),
    borderRadius: getFontSize(1),
    height: getFontSize(3.9),
    marginTop: getFontSize(2.5),
    alignSelf: 'center',
    width: 'auto',
    paddingHorizontal: getFontSize(1.5),
    gap: 5,
  },
});

export default EmptyState;
