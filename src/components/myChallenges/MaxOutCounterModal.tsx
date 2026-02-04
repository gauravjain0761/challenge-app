import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors} from '@/constants/Colors';
import {getFontSize, isIphoneX} from '@/utils/responsiveFn';
import Modal from 'react-native-modal';
import {GeneralStyle} from '@/constants/GeneralStyle';
import IconComponent from '../IconComponent';
import DayPicker from '../DayPicker';
import Button from '../Button';
import {router} from 'expo-router';
import {ActionStatus, MIX_PANEL_EVENTS} from '@/types/enums';
import {useUpdateProgressActionMutation} from '@/api/progressChallengesApi';
import {errorToast} from '@/utils/common/commonFunction';
import MaxoutPicker from './MaxoutPicker';
import {trackEvent} from '@/hooks/useMixpanelClient';
import {useAppSelector} from '@/hooks/reduxHooks';
import {selectUser} from '@/features/authSlice';

interface MaxOutCounterModalModalProps {
  visible: boolean;
  onClose: () => void;
  unit: any;
  onSelectDuration: (duration: number) => void;
  isGoBack?: boolean;
  selectedDuration?: any;
  id: any;
  selectedDay: any;
  actionId: any;
  navType?: string;
  compulsory?: boolean;
  name?: string;
}

const MaxOutCounterModal = ({
  visible,
  onClose,
  unit,
  onSelectDuration,
  isGoBack,
  selectedDuration,
  id,
  selectedDay,
  actionId,
  navType,
  name,
  compulsory,
}: MaxOutCounterModalModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectValue, setSelectValue] = useState(1);
  const [isFirst, setIsFirst] = useState(false);
  const user = useAppSelector(selectUser);

  const [updateProgressAction, {isLoading: updateProgressActionLoading}] =
    useUpdateProgressActionMutation();

  useEffect(() => {
    if (visible) {
      setIsVisible(visible);
    }
  }, [visible]);

  useEffect(() => {
    if (selectedDuration) {
      const time = setTimeout(() => {
        setSelectValue(selectedDuration);
      }, 200);

      return () => clearTimeout(time);
    }
  }, [selectedDuration]);

  const handleClose = (isGo?: boolean) => {
    setIsVisible(false);
    onClose();
    if (isGoBack && isGo) {
      router.back();
    }
  };

  const handleUpdateAction = async (count?: number) => {
    try {
      let payload = {
        id: id as string,
        day: selectedDay,
        data: {
          actionId,
          status: ActionStatus.COMPLETED,
          completionData: {completionCount: selectValue, completionUnit: unit},
        },
      };

      const response = await updateProgressAction(payload).unwrap();

      if (response) {
        trackEvent(MIX_PANEL_EVENTS.action_status, {
          challenge_id: response?.challengeId,
          action_status: response?.dayStatus,
          action_id: actionId,
          action_name: name,
          day_number: selectedDay,
          compulsory: compulsory,
          user_id: user?.id,
        });

        router.back();
        router.setParams({refresh: 'true'});
        // setIsVisible(false);
        // onClose();
      }
    } catch (error: any) {
      errorToast(error.data?.message || error.message || 'Please try again');
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={1}
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={styles.container}>
      <View style={styles.modal}>
        {/* Close Button */}

        <IconComponent
          name="left"
          size={getFontSize(4)}
          color={Colors.white}
          onPress={() => handleClose(true)}
          style={styles.closeButton}
          // type="Ionicons"
        />
        {/* <View style={styles.pickerContainer}>
          <DayPicker
            selectedDuration={selectValue}
            handleDurationChange={setSelectValue}
            label={unit}
            isAutoScroll
            navType={navType}
          />
        </View> */}
        <View style={GeneralStyle.flex}>
          <MaxoutPicker
            selectedDuration={selectValue}
            handleDurationChange={setSelectValue}
            label={unit}
            isDays={false}
            isFirst={isFirst}
          />
        </View>
        <Button
          title={updateProgressActionLoading ? 'Completing...' : 'Complete'}
          disabled={updateProgressActionLoading}
          style={{
            marginBottom: getFontSize(5),
            alignSelf: 'center',
            width: '93%',
          }}
          onPress={() => {
            if (isGoBack) {
              handleUpdateAction();
            } else {
              handleClose(false);
              onSelectDuration(selectValue);
            }
          }}
        />
      </View>
    </Modal>
  );
};

export default MaxOutCounterModal;
const styles = StyleSheet.create({
  container: {
    margin: 0,
    flex: 1,
  },
  closeButton: {
    // alignSelf: 'flex-end',
    padding: getFontSize(1),
  },

  modal: {
    flex: 1,
    backgroundColor: Colors._1A1A1A,
    borderRadius: getFontSize(2),
    marginTop: isIphoneX() ? getFontSize(20) : getFontSize(10),
  },
  pickerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
});
