import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AssetsHeaderControl from '../myChallenges/AssetsHeaderControl';
import {getFontSize, SCREEN_WIDTH} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import ActionNoticeView from './RenderLists/ActionNoticeView';
import HowView from './RenderLists/HowView';
import Achievement from './RenderLists/Achievement';
import Confirmation from './RenderLists/Confirmation';
import RateYourEffort from './RenderLists/RateYourEffort';
import QuestionView from './RenderLists/QuestionView';

type Props = {
  item: any;
  index: number;
  totalItems: number;
  onNavigateLeft: () => void;
  onNavigateRight: () => void;
  onPress?: () => void;
  isLoading?: boolean;
};

const CompulsoryList = ({
  item,
  index,
  totalItems,
  onNavigateLeft,
  onNavigateRight,
  onPress = () => {},
  isLoading,
}: Props) => {
  return (
    <View key={index.toString()} style={styles.container}>
      <AssetsHeaderControl
        title={item.title}
        onPressLeft={onNavigateLeft}
        onPressRight={onNavigateRight}
        isLeftIcon={index !== 0}
        isRightIcon={index !== totalItems - 1}
      />

      {item?.id === 1 ? (
        <ActionNoticeView
          onPress={() => {
            onNavigateRight();
          }}
        />
      ) : item?.id === 2 ? (
        <HowView
          onPress={() => {
            onNavigateRight();
          }}
        />
      ) : item?.id === 3 ? (
        <Achievement onPress={onPress} isLoading={isLoading} />
      ) : item?.id === 4 ? (
        <QuestionView
          question={item?.question || ''}
          onPress={onPress}
          isLoading={isLoading}
        />
      ) : item?.id === 5 ? (
        <RateYourEffort onPress={onPress} isLoading={isLoading} />
      ) : item?.id === 6 ? (
        <Confirmation onPress={onPress} />
      ) : null}
    </View>
  );
};

export default CompulsoryList;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: SCREEN_WIDTH - getFontSize(7),
    paddingHorizontal: getFontSize(2),
  },
});
