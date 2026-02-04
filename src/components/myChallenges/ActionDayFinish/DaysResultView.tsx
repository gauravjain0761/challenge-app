import {StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import GradientText from '@/components/GradientText';
import IconComponent from '@/components/IconComponent';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import FastImage from 'react-native-fast-image';
import {Images} from '@/assets/images';
import {SkipAllAction} from '@/validation/schemas';
import {convertUnits} from '@/utils/common/commonFunction';

type Props = {
  title: string;
  count: string | any;
  per?: number;
  perType?: string;
  day?: string;
};

type DayProps = {
  finishDayData: SkipAllAction;
  days?: any;
  isSingleActionType?: boolean;
  isSingleMaxOutAction?: boolean;
};

const DaysResultView = ({
  days,
  finishDayData,
  isSingleMaxOutAction,
  isSingleActionType,
}: DayProps) => {
  const RenderItem = memo(({title, count, per = 0, perType, day}: Props) => {
    const isUp = per >= 0;
    return (
      <View style={styles.row}>
        <View style={[styles.itemContainer]}>
          <GradientText
            colors={['#FF7302', Colors.black]}
            start={{x: 0.5, y: 0}}
            end={{x: 0.5, y: 0.9}}
            customGradient={
              <IconComponent
                name="fire"
                type="Fontisto"
                size={getFontSize(2)}
                color={Colors._b1b1b5}
              />
            }
            gradientStyle={{width: getFontSize(1.8), height: getFontSize(2)}}
          />
          <Text style={[styles.itemName]}>{title}</Text>
          <Text style={[styles.itemCount]}>{count}</Text>
        </View>
        <View style={styles.trendView}>
          <View style={styles.row}>
            <FastImage
              source={isUp ? Images.trend_up : Images.trend_down}
              defaultSource={Images.trend_up}
              style={styles.trendImage}
              tintColor={isUp ? Colors._54AB2F : Colors._F04438}
            />
            <Text
              style={[
                styles.trendText,
                {color: isUp ? Colors._54AB2F : Colors._F04438},
              ]}>
              {Math.abs(per)}
              {perType}
            </Text>
          </View>
          <Text
            style={[
              styles.dayText,
              {color: isUp ? Colors._54AB2F : Colors._F04438},
            ]}>
            {day || (days === 1 ? '' : 'Yesterday')}
          </Text>
        </View>
      </View>
    );
  });

  return (
    <View style={[styles.container]}>
      <GradientText
        text={`DAY ${days} RESULTS!`}
        colors={['#C05600', '#5A2800']}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1.2}}
        style={styles.headingText1}
      />
      <GradientText
        text={`Review, Improve, Grow`}
        colors={['#FFFFFF', '#555555']}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1.2}}
        style={styles.decText}
      />

      <View>
        {isSingleActionType ? (
          <View style={styles.unitView}>
            <RenderItem
              title={
                'TODAY’S ' +
                (isSingleMaxOutAction
                  ? 'MAXOUT'
                  : convertUnits(finishDayData?.completionUnit))
              }
              count={
                (finishDayData?.completionCount || 0) +
                ' ' +
                convertUnits(finishDayData?.completionUnit)
              }
              per={finishDayData?.metrics?.completionCountChange}
              perType={'%'}
            />
            <RenderItem
              title={'TODAY’S Level '}
              count={finishDayData?.levelName}
              per={finishDayData?.metrics?.levelChange}
              day={'Level          '}
              perType={'x'}
            />
          </View>
        ) : (
          <View style={styles.unitView}>
            <RenderItem
              title={'ACTIONS'}
              count={finishDayData?.completedActions || 0}
              per={finishDayData?.metrics?.completedActionsChange}
              perType={'%'}
            />
            <RenderItem
              title={'SKIPPED'}
              count={finishDayData?.skippedActions || 0}
              per={finishDayData?.metrics?.skippedActionsChange}
              perType={'%'}
            />
            <RenderItem
              title={'TODAY’S Level'}
              count={finishDayData?.levelName}
              per={finishDayData?.metrics?.levelChange}
              perType={'X'}
              day={'Level          '}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default DaysResultView;

const styles = StyleSheet.create({
  container: {
    paddingVertical: getFontSize(0.5),
    gap: getFontSize(0.7),
    paddingHorizontal: getFontSize(0.2),
    // width: '80%',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: getFontSize(1.2),
    borderRadius: getFontSize(1),
    borderColor: Colors._7f7d7c,
    gap: getFontSize(2),
    flex: 1,
    backgroundColor: '#3a3a3a',
    height: getFontSize(9),
  },

  itemName: {
    color: Colors.white,
    fontSize: getFontSize(2.2),
    fontWeight: '600',
    textTransform: 'uppercase',
    flex: 1,
  },
  itemCount: {
    color: Colors.white,
    fontSize: getFontSize(2.2),
    fontWeight: '400',
    textTransform: 'uppercase',
    textAlign: 'center',
    paddingRight: getFontSize(0.5),
  },
  headingText1: {
    fontSize: getFontSize(4.5),
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  decText: {
    fontSize: getFontSize(2),
    fontWeight: '500',
    color: Colors.white,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getFontSize(1),
  },
  unitView: {
    marginTop: getFontSize(4),
    gap: getFontSize(2),
  },
  trendView: {
    borderWidth: 1,
    paddingHorizontal: getFontSize(1),
    paddingVertical: getFontSize(1.4),
    borderRadius: getFontSize(1),
    borderColor: Colors._7f7d7c,
    gap: getFontSize(1),
    backgroundColor: '#3a3a3a',
    height: getFontSize(9),
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.25,
  },

  trendImage: {
    width: getFontSize(2),
    height: getFontSize(2),
  },
  trendText: {
    color: Colors.white,
    fontSize: getFontSize(1.5),
    fontWeight: '600',
  },
  dayText: {
    color: Colors.white,
    fontSize: getFontSize(1.3),
    fontWeight: '600',
    textAlign: 'center',
  },
});
