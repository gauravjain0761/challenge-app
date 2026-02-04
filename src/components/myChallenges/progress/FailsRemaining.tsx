import {StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import IconComponent from '@/components/IconComponent';
import {GetChallengeProgressResponse} from '@/validation/schemas';
import {GeneralStyle} from '@/constants/GeneralStyle';

interface Props {
  item: GetChallengeProgressResponse;
}

const FailsRemaining = memo(({item}: Props) => {
  const findLevel = React.useMemo(() => {
    return item?.levels?.[item?.selectedLevel];
  }, [item?.levels, item?.selectedLevel]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <IconComponent
            name="bolt"
            type="MaterialIcons"
            size={getFontSize(3)}
            color={Colors.white}
          />
        </View>
        <Text style={styles.failText}>Challenge Fails Remaining</Text>
      </View>

      <View style={styles.lineContainer}>
        {[...Array(item?.daysToFail)].map((_, index) => {
          const isSelected = index < (item?.totalDaysFailed || 0);
          return (
            <View
              key={index.toString()}
              style={[
                styles.segment,
                {
                  backgroundColor: isSelected ? Colors._999999 : Colors._363636, // selected vs unselected
                  borderWidth: 1,
                  borderColor: isSelected ? Colors.red : Colors.borderColor,
                },
              ]}
            />
          );
        })}
      </View>

      <Text style={styles.disText}>
        Fail to achieve your selected goal 3 times and you're out of the
        challenge. Enjoy taking action!
      </Text>

      <Text style={{...GeneralStyle.headingText, ...styles.levelText}}>
        SELECTED GOAL : {findLevel?.name}
      </Text>
    </View>
  );
});

export default FailsRemaining;

const styles = StyleSheet.create({
  container: {
    padding: getFontSize(2),
    borderRadius: getFontSize(1),
    backgroundColor: Colors._1A1A1A,
    gap: getFontSize(2),
    paddingBottom: getFontSize(2),
    paddingTop: getFontSize(2),
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getFontSize(1.5),
  },
  iconContainer: {
    borderRadius: getFontSize(1),
    backgroundColor: Colors._363636,
    height: getFontSize(4),
    width: getFontSize(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  failText: {
    color: Colors.white,
    fontSize: getFontSize(2.3),
    fontWeight: '500',
  },
  disText: {
    color: Colors.white,
    fontSize: getFontSize(1.8),
    opacity: 0.6,
    textAlign: 'center',
  },
  levelText: {
    textAlign: 'center',
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: getFontSize(0.5),
  },
  segment: {
    flex: 1,
    height: getFontSize(2),
    borderRadius: 6,
  },
});
