import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import {ChallengeType, TitleFilter} from '../types';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import {ExploreChallengeLabel, ExploreChallengeUserType} from '@/types/enums';
import {CategoryFilter} from '@/types/enums';
interface FilterButtonProps {
  title:
    | TitleFilter
    | ChallengeType
    | ExploreChallengeUserType
    | CategoryFilter
    | string;
  isSelected: boolean;
  onPress: () => void;
  disabled?: boolean;
}

export const FilterButton: React.FC<FilterButtonProps> = memo(
  ({title, isSelected, onPress, disabled}) => {
    const handlePress = () => {
      if (!disabled) {
        onPress();
      }
    };

    return (
      <TouchableOpacity
        disabled={disabled}
        style={[styles.button, isSelected && styles.buttonSelected]}
        onPress={handlePress}>
        <Text style={[styles.text, isSelected && styles.textSelected]}>
          {title}{' '}
          {title === ExploreChallengeLabel.SINGLE && (
            <Text style={{color: Colors.primary}}>Free</Text>
          )}
        </Text>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: getFontSize(2),
    marginRight: getFontSize(1),
    borderRadius: getFontSize(1),
    height: getFontSize(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSelected: {
    borderWidth: getFontSize(0.1),
    borderColor: Colors.orange,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.50)',
    fontSize: getFontSize(1.6),
    fontWeight: '500',
    // textTransform: 'capitalize',
  },
  textSelected: {
    color: Colors.white,
  },
});
