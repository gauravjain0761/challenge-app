import React, {useCallback} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {GetInProgressActionAssetsData} from '@/validation/schemas';
import {AssetType} from '@/types/enums';
import {getFontSize, SCREEN_WIDTH} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import {GeneralStyle} from '@/constants/GeneralStyle';

import AssetsHeaderControl from '@/components/myChallenges/AssetsHeaderControl';
import Question from '@/components/myChallenges/assets/Question';
import BreathWork from './BreathWork';
import VideoPlayer from './VideoPlayer';
import AudioPlayer from './AudioPlayer';
import BoxBreathWork from './BoxBreathWork';
import TimerPlayer from './TimerPlayer';
import TimerPlayerFocus from './TimerPlayerFocus';

interface AssetItemProps {
  item: GetInProgressActionAssetsData;
  index: number;
  currentIndex: number;
  totalItems: number;
  onNavigateLeft: () => void;
  onNavigateRight: () => void;
  onWhatWhyHowClick: () => void;
  setVideoUrl: (url: string) => void;
  setIsVideoModalVisible: (visible: boolean) => void;
  onAnswerChange: (answers: {[questionIndex: number]: string}) => void; // 👈 new
}

const AssetItem: React.FC<AssetItemProps> = ({
  item,
  index,
  currentIndex,
  totalItems,
  onNavigateLeft,
  onNavigateRight,
  onWhatWhyHowClick,
  setVideoUrl,
  setIsVideoModalVisible,
  onAnswerChange,
}) => {
  const renderAssetContent = useCallback(() => {
    const assetType = item.assetType as AssetType;

    switch (assetType) {
      case AssetType.JOURNAL:
        return (
          <Question
            questionList={item.journal?.questions || []}
            onAnswerChange={onAnswerChange}
          />
        );

      case AssetType.AUDIO:
        return <AudioPlayer item={item} isActive={currentIndex === index} />;

      case AssetType.VIDEO:
        if (item.files?.fileUrl) {
          return <VideoPlayer item={item} isActive={currentIndex === index} />;
        }
        return null;

      case AssetType.BREATHWORK:
        return <BoxBreathWork item={item} isActive={currentIndex === index} />;
      // item.info.includes('box breathing') ? (
      //   <BoxBreathWork item={item} isActive={currentIndex === index} />
      // ) : (
      //   <BreathWork item={item} isActive={currentIndex === index} />
      // );

      case AssetType.TIMER:
        return item.timer?.allowCustom ? (
          <TimerPlayer item={item} isActive={currentIndex === index} />
        ) : (
          <TimerPlayerFocus item={item} isActive={currentIndex === index} />
        );

      default:
        return (
          <View style={styles.unsupported}>
            <Text style={styles.unsupportedText}>
              This content type is not supported
            </Text>
          </View>
        );
    }
  }, [item, index, currentIndex, setVideoUrl]);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <AssetsHeaderControl
          title={item.name}
          onPressLeft={onNavigateLeft}
          onPressRight={onNavigateRight}
          isLeftIcon={index !== 0}
          isRightIcon={index !== totalItems - 1}
        />

        <View style={GeneralStyle.flex}>{renderAssetContent()}</View>

        <Text onPress={onWhatWhyHowClick} style={styles.whatWhyHow}>
          What Why How
        </Text>
      </View>
    </View>
  );
};

export default React.memo(AssetItem);

const styles = StyleSheet.create({
  mainContainer: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  container: {
    backgroundColor: Colors._1e1e1e,
    borderRadius: getFontSize(2),
    marginTop: getFontSize(2),
    paddingHorizontal: getFontSize(2),
    marginBottom: getFontSize(3),
    width: SCREEN_WIDTH - 30,
    flex: 1,
  },
  whatWhyHow: {
    fontSize: getFontSize(2.2),
    fontWeight: '500',
    color: Colors.orange,
    textAlign: 'center',
    paddingVertical: getFontSize(1.5),
  },
  unsupported: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unsupportedText: {
    color: Colors.orange,
    textAlign: 'center',
    fontSize: getFontSize(2.3),
  },
});
