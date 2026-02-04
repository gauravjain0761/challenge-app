import {FlatList, StyleSheet, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import Modal from 'react-native-modal';
import {Colors} from '@/constants/Colors';
import {getFontSize, SCREEN_HEIGHT, SCREEN_WIDTH} from '@/utils/responsiveFn';
import DaysResultView from './DaysResultView';
import IconComponent from '@/components/IconComponent';
import DaysGrowthView from './DaysGrowthView';
import DaysFeedbackView from './DaysFeedbackView';
import {ChallengeType, singleTypes} from '@/types/enums';
import {SkipAllAction} from '@/validation/schemas';
import DeviceInfo from 'react-native-device-info';
interface ActionFinishDayModal {
  visible: boolean;
  onClose: () => void;
  challengeActions?: any;
  finishDayData?: SkipAllAction;
}

const ActionFinishDayModal = ({
  visible,
  onClose,
  challengeActions,
  finishDayData,
}: ActionFinishDayModal) => {
  const [isVisible, setIsVisible] = useState(false);
  const [index, setIndex] = useState(0);

  const isSingleAction = singleTypes.includes(
    (challengeActions?.type as ChallengeType) || '',
  );
  const isSingleMaxOutAction =
    challengeActions?.type === ChallengeType.SINGLE_MAXOUT;

  const getDay = parseInt(
    ((challengeActions?.actionDay?.day as string) || '').replace(/\D/g, ''),
    10,
  );

  const isCheckSingle = useMemo(() => {
    if (singleTypes.includes((challengeActions?.type as ChallengeType) || '')) {
      return true;
    }
    return false;
  }, [challengeActions]);

  useEffect(() => {
    if (visible) {
      setIsVisible(visible);
    }
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
        {index ===
          (isCheckSingle ? (getDay === 7 ? 2 : 1) : getDay === 7 ? 3 : 2) && (
          <IconComponent
            name="x"
            type="Feather"
            size={getFontSize(4)}
            color={Colors.white}
            onPress={() => handleClose()}
            style={styles.closeButton}
          />
        )}
        <View
          style={{
            flex: 1,
          }}>
          <FlatList
            data={[
              ...Array(
                isCheckSingle ? (getDay === 7 ? 3 : 2) : getDay === 7 ? 4 : 3,
              ),
            ]}
            pagingEnabled
            horizontal
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            onScroll={event => {
              const offsetX = event.nativeEvent.contentOffset.x;
              const newIndex = Math.round(offsetX / SCREEN_WIDTH);
              setIndex(newIndex);
            }}
            style={{
              width: SCREEN_WIDTH - getFontSize(5.5),
            }}
            renderItem={({index}) => {
              return (
                <View style={styles.listView}>
                  <View style={styles.innerContainer}>
                    {index === 0 ? (
                      <DaysResultView
                        days={getDay || 0}
                        isSingleActionType={isSingleAction}
                        isSingleMaxOutAction={isSingleMaxOutAction}
                        finishDayData={finishDayData as SkipAllAction}
                      />
                    ) : index === (isCheckSingle ? null : 1) ? (
                      <DaysGrowthView
                        days={getDay || 0}
                        finishDayData={finishDayData as SkipAllAction}
                      />
                    ) : index === (isCheckSingle ? 1 : 2) ? (
                      <DaysFeedbackView
                        days={getDay}
                        onPressChallenge={() => {
                          handleClose();
                        }}
                        onPressFeedBack={() => {
                          handleClose();
                        }}
                        ChallengeType={challengeActions?.type}
                        preRating={(challengeActions?.preRating as number) || 1}
                        challengeName={challengeActions?.challengeShortName}
                        challengeActions={challengeActions}
                      />
                    ) : (
                      <DaysFeedbackView
                        days={3}
                        onPressChallenge={() => {
                          handleClose();
                        }}
                        ChallengeType={challengeActions?.type}
                        preRating={(challengeActions?.preRating as number) || 1}
                        challengeName={challengeActions?.challengeShortName}
                        challengeActions={challengeActions}
                      />
                    )}
                  </View>
                </View>
              );
            }}
          />
        </View>

        <View style={styles.dotContainer}>
          {[
            ...Array(
              isCheckSingle ? (getDay === 7 ? 3 : 2) : getDay === 7 ? 4 : 3,
            ),
          ].map((_, ind) => (
            <View
              key={ind.toString()}
              style={[
                styles.dot,
                {...(ind === index ? {backgroundColor: Colors.orange} : {})},
              ]}
            />
          ))}
        </View>
      </View>
    </Modal>
  );
};

export default ActionFinishDayModal;

const styles = StyleSheet.create({
  container: {
    margin: 0,
    justifyContent: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: getFontSize(1),
    marginBottom: getFontSize(1),
    position: 'absolute',
    right: getFontSize(1),
    zIndex: 100,
  },
  listView: {
    width: SCREEN_WIDTH - getFontSize(5.5),
    alignItems: 'center',
  },
  innerContainer: {
    height: '100%',
    width: SCREEN_WIDTH - getFontSize(7),
  },
  modal: {
    backgroundColor: Colors._1A1A1A,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: getFontSize(2),
    paddingTop: getFontSize(1),
    alignItems: 'center',
    paddingBottom: getFontSize(2),
    marginHorizontal: getFontSize(1),
    height: SCREEN_HEIGHT - getFontSize(DeviceInfo?.isTablet() ? 40 : 53),
  },
  logo: {
    width: getFontSize(8),
    height: getFontSize(5),
    alignSelf: 'center',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: getFontSize(1),
    marginTop: getFontSize(3),
  },
  dot: {
    height: getFontSize(1.2),
    width: getFontSize(1.2),
    borderRadius: getFontSize(2),
    backgroundColor: Colors._838383,
  },
});
