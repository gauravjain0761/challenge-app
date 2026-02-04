// components/SkipModal.tsx
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, FlatList} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import {Levels, LevelModalProps} from '../types';
import CustomModal from './CustomModal';
import {Colors} from '../constants/Colors';
import {getFontSize} from '../utils/responsiveFn';
import Button from './Button';
import FastImage from 'react-native-fast-image';
import {Images} from '@/assets/images';
import GoalModal from './Explore/GoalModal/GoalModal';

const LevelModal: React.FC<LevelModalProps> = ({
  visible,
  onClose,
  selectedLevel,
  onSelectLevel,
  levels = [] as Levels[],
  challengeType,
}) => {
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (selectedLevel === 'Select your Goal') {
      setSelectedItem(null);
    } else {
      setSelectedItem(selectedLevel);
    }
  }, [selectedLevel]);
  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      rightIcon={
        <TouchableOpacity onPress={() => setIsVisible(true)}>
          <FastImage
            source={Images.info_Icon}
            resizeMode="contain"
            style={styles.image}
          />
        </TouchableOpacity>
      }
      title="Edit Challenge Goal">
      <View style={styles.container}>
        <Text style={styles.description}>
          Select your current goal and then challenge yourself everyday to beat
          it.
        </Text>

        <FlatList
          data={levels}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.skipOption,
                selectedItem === item.name && styles.selectedSkip,
              ]}
              onPress={() => setSelectedItem(item.name)}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.skipText,
                  selectedItem === item.name && styles.selectedText,
                ]}>
                {String(item.goal.value + ' ' + item.goal.unit)} = {item.name}
              </Text>
              {selectedItem === item.name && (
                <AntDesign name="check" size={24} color="#ff6b00" />
              )}
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={
            selectedItem !== null ? (
              <Button
                title="Confirm"
                style={{
                  marginTop: getFontSize(10),
                }}
                onPress={() => {
                  onSelectLevel(selectedItem);
                  onClose();
                }}
              />
            ) : (
              <></>
            )
          }
        />
      </View>
      {isVisible && (
        <GoalModal
          visible={isVisible}
          onClose={() => setIsVisible(false)}
          goalList={levels}
          type={challengeType}
        />
      )}
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  skipOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: getFontSize(1.8),
    paddingHorizontal: getFontSize(2),
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  selectedSkip: {
    backgroundColor: Colors.textInputBackground,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  skipText: {
    color: Colors.white,
    fontSize: getFontSize(2),
    fontWeight: '500',
  },
  selectedText: {
    color: Colors.orange,
    fontWeight: '500',
  },
  description: {
    color: Colors.white,
    fontSize: getFontSize(2),
    fontWeight: '400',
    marginTop: getFontSize(1),
    marginBottom: getFontSize(5),
    textAlign: 'center',
  },
  image: {
    height: getFontSize(3),
    alignSelf: 'flex-end',
    width: getFontSize(3),
  },
});

export default LevelModal;
