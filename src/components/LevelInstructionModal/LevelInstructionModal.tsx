import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {getFontSize, SCREEN_HEIGHT, SCREEN_WIDTH} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import PaginationDots from '../PaginationDots';
import IconComponent from '../IconComponent';
import LevelUPView from './LevelUpView';
import LevelsView from './LevelsView';
import HiddenChallenge from './HiddenChallenge';
import LegendStatusView from './LegendStatusView';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const LevelInstructionModal = ({visible, onClose}: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [index, setIndex] = useState(0);

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

        <FlatList
          data={[...Array(4)]}
          pagingEnabled
          horizontal
          nestedScrollEnabled
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          onScroll={event => {
            const offsetX = event.nativeEvent.contentOffset.x;
            const newIndex = Math.round(offsetX / SCREEN_WIDTH);
            setIndex(newIndex);
          }}
          renderItem={({index}) => {
            return (
              <View style={styles.listView}>
                <View
                  style={{
                    width: SCREEN_WIDTH - getFontSize(8),
                    alignSelf: 'center',
                  }}>
                  {index === 0 && <LevelsView />}
                  {index === 1 && <LevelUPView />}
                  {index === 2 && <HiddenChallenge />}
                  {index === 3 && <LegendStatusView />}
                </View>
              </View>
            );
          }}
        />

        <PaginationDots data={[...Array(4)]} currentIndex={index} />
      </View>
    </Modal>
  );
};

export default LevelInstructionModal;

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
  listView: {
    width: SCREEN_WIDTH - getFontSize(6),
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
    height: SCREEN_HEIGHT - getFontSize(40),
  },
});
