import {StyleSheet, Text, View} from 'react-native';
import React, {memo, useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import LevelListModule from './progress/LevelListModule';
import GradientContainer from '../GradientContainer';
import IconComponent from '../IconComponent';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import {useGetProgressQuery} from '@/api/progressChallengesApi';
import Loader from '../Loader';
import {GetChallengeProgressResponse} from '@/validation/schemas';

interface ChallengeCompleteModalProps {
  visible: boolean;
  onClose: () => void;
  userChallengeId?: string;
}
const ChallengeCompleteModal = ({
  onClose,
  visible,
  userChallengeId,
}: ChallengeCompleteModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const {data: progress, isLoading} = useGetProgressQuery({
    id: userChallengeId as string,
  });

  console.log('progress=>', progress);

  useEffect(() => {
    if (visible) {
      setIsVisible(visible);
    }
  }, [visible]);

  const handleClose = (isGo?: boolean) => {
    setIsVisible(false);
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.7}
      animationIn="fadeIn"
      animationOut="fadeOut"
      onBackdropPress={handleClose}
      style={styles.container}>
      <GradientContainer>
        <View style={styles.mainContainer}>
          <IconComponent
            name="close"
            size={getFontSize(4)}
            color={Colors.white}
            onPress={handleClose}
            style={styles.closeButton}
            type="Ionicons"
          />
          <LevelListModule
            isCompleted={true}
            item={progress as GetChallengeProgressResponse}
          />
        </View>
        {isLoading && <Loader />}
      </GradientContainer>
    </Modal>
  );
};

export default memo(ChallengeCompleteModal);

const styles = StyleSheet.create({
  container: {
    margin: 0,
    flex: 1,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
