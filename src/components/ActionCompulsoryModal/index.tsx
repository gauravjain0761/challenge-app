import {View, Text, StyleSheet, FlatList} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Modal from 'react-native-modal';
import {getFontSize, SCREEN_WIDTH} from '@/utils/responsiveFn';
import FastImage from 'react-native-fast-image';
import {Images} from '@/assets/images';
import {Colors} from '@/constants/Colors';
import AssetsHeaderControl from '../myChallenges/AssetsHeaderControl';
import CompulsoryList from './CompulsoryList';
import {
  getAsyncActionCompulsoryHow,
  getAsyncActionCompulsoryNotice,
} from '@/utils/common/useAsyncFunctions';
import IconComponent from '../IconComponent';

interface ModalProps {
  visible: boolean;
  isLoading?: boolean;
  onClose?: () => void;
  onPress?: () => void;
}

const getCompulsoryListData = () => {
  const randomPairs = [
    {title: 'Truth', question: 'Who is your role model?'},
    {title: 'Vent', question: 'Get something off your chest...'},
    {title: 'Reflection', question: 'What was your win today?'},
  ];

  // Pick one random pair
  const randomChoice =
    randomPairs[Math.floor(Math.random() * randomPairs.length)];

  return [
    {id: 1, title: 'Compulsory Action Notice!'},
    {id: 2, title: 'How!'},
    {id: 3, title: 'Proof of Achievement'},
    {id: 4, title: randomChoice.title, question: randomChoice.question}, // ✅ linked pair
    {id: 5, title: 'Rate your effort'},
    {id: 6, title: 'Confirmation Button'},
  ];
};

const ActionCompulsoryModal = ({
  visible,
  onClose = () => {},
  onPress,
  isLoading,
}: ModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const checkIsVisible = async () => {
    const notice = await getAsyncActionCompulsoryNotice();
    const how = await getAsyncActionCompulsoryHow();
    const newList = getCompulsoryListData();

    // Filter items based on notice/how
    const newData = newList.filter((item, index) => {
      if (notice && index === 0) return false; // hide first
      if (how && index === 1) return false; // hide second
      return true;
    });

    setFilteredData(newData);
  };

  useEffect(() => {
    setIsVisible(visible);
    checkIsVisible(); // fetch async data when modal opens
  }, [visible]);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  const scrollToIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < filteredData.length) {
        flatListRef.current?.scrollToIndex({index, animated: true});
        setCurrentIndex(index);
      }
    },
    [filteredData.length],
  );

  const handleScrollEnd = useCallback((event: any) => {
    const offset = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offset / (SCREEN_WIDTH - 20));
    setCurrentIndex(newIndex);
  }, []);

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

        <View style={styles.innerContainer}>
          <FlatList
            ref={flatListRef}
            data={filteredData}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, idx) => idx.toString()}
            onMomentumScrollEnd={handleScrollEnd}
            style={{
              width: SCREEN_WIDTH - getFontSize(5.5),
            }}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    width: SCREEN_WIDTH - getFontSize(5.5),
                    alignItems: 'center',
                  }}>
                  <CompulsoryList
                    index={index}
                    item={item}
                    onNavigateLeft={() => scrollToIndex(currentIndex - 1)}
                    onNavigateRight={() => scrollToIndex(currentIndex + 1)}
                    totalItems={filteredData.length}
                    onPress={onPress}
                    isLoading={isLoading}
                  />
                </View>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ActionCompulsoryModal;

const styles = StyleSheet.create({
  container: {
    margin: 0,
    justifyContent: 'center',
  },
  logo: {
    width: getFontSize(10),
    height: getFontSize(5),
    alignSelf: 'center',
  },
  modal: {
    backgroundColor: Colors._1A1A1A,
    borderRadius: getFontSize(2),
    marginHorizontal: getFontSize(2.5),
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  innerContainer: {
    height: getFontSize(55),
  },
  closeButton: {
    alignSelf: 'flex-end',
    top: getFontSize(1),
    right: getFontSize(1),
    zIndex: 100,
  },
});
