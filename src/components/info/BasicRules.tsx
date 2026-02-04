import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import IconComponent, {IconType} from '../IconComponent';
import {getFontSize} from '@/utils/responsiveFn';
import {
  GetChallengeInfoResponse,
  InProgressChallengeInfoResponse,
  ScheduledChallengeInfoResponse,
} from '@/validation/schemas';
import {ChallengeMode, ChallengeType, ChallengeTypeTow, ChallengeVariantType} from '@/types/enums';
import {Colors} from '@/constants/Colors';

type Props = {
  data:
    | ScheduledChallengeInfoResponse
    | GetChallengeInfoResponse
    | InProgressChallengeInfoResponse
    | any;

  isOpen: boolean;
  toggleSection: () => void;
  isLive?: boolean;
};

const BasicRules = ({data, isOpen, toggleSection, isLive = false}: Props) => {
  const RuleItem = memo(
    ({
      iconType = 'AntDesign',
      icon,
      title,
    }: {
      iconType?: IconType;
      icon: string;
      title: string;
    }) => (
      <View style={styles.ruleItem}>
        <IconComponent
          type={iconType}
          name={icon}
          size={getFontSize(2.2)}
          color={Colors.white}
        />
        <Text style={styles.ruleText}>{title}</Text>
      </View>
    ),
  );

  function toKebabCaseChallengeType(type: ChallengeType): string {
    if (!type) return '';

    let newType = '';

    switch (type) {
      case ChallengeType.SINGLE:
        newType = ChallengeTypeTow.SINGLE;
        break;

      case ChallengeType.SINGLE_MAXOUT:
        newType = ChallengeTypeTow.SINGLE_MAXOUT;
        break;
      case ChallengeType.MULTIPLE:
        newType = ChallengeTypeTow.MULTIPLE;
        break;

      case ChallengeType.MULTIPLE_MAXOUT:
        newType = ChallengeTypeTow.MULTIPLE_MAXOUT;
        break;

      case ChallengeType.SINGLE_VARIANT:
        newType = ChallengeVariantType.SINGLE_VARIANT;
        break;

      case ChallengeType.MULTIPLE_VARIANT:
        newType = ChallengeVariantType.MULTIPLE_VARIANT;
        break;

      case ChallengeType.SINGLE_MAXOUT_VARIANT:
        newType = ChallengeVariantType.SINGLE_MAXOUT_VARIANT;
        break;
        
      case ChallengeType.MULTIPLE_MAXOUT_VARIANT:
        newType = ChallengeVariantType.MULTIPLE_MAXOUT_VARIANT;
        break;

      default:
        break;
    }
    return newType.replace(/_/g, ' ');
  }

  function getDurationSummary(startDateStr: string, endDateStr: string) {
    const now = new Date() as unknown as number;
    const start = new Date(startDateStr) as unknown as number;
    const end = new Date(endDateStr) as unknown as number;

    const msPerDay = 1000 * 60 * 60 * 24;

    const totalDays = Math.round((end - start) / msPerDay) + 1;
    const daysUntilStart = Math.max(0, Math.round((start - now) / msPerDay));

    return `${totalDays} Days (Starts in ${daysUntilStart} Day${
      daysUntilStart === 1 ? '' : 's'
    })`;
  }

  return (
    <View>
      <TouchableOpacity onPress={toggleSection} style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Basic rules</Text>
        <IconComponent
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={getFontSize(4)}
          color={Colors.orange}
          type="Feather"
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.rulesContainer}>
          <RuleItem iconType="Feather" icon="clock" title={'Everyday'} />
          <RuleItem
            iconType="SimpleLineIcons"
            icon="refresh"
            title={toKebabCaseChallengeType(data.type as ChallengeType)}
          />
          {/* {(isLive === true || data.mode === ChallengeMode.GROUP) && ( */}
          <RuleItem
            icon="close"
            title={
              'Fail Allowance : ' +
              (isLive == true
                ? `${data?.failRemaining} Remaining`
                : `${data?.basicRules?.daysToFail ?? data?.daysToFail} Max`)
            }
          />
          {/* )} */}

          {(isLive === true || data.mode === ChallengeMode.GROUP) && (
            <RuleItem
              iconType="MaterialIcons"
              icon="calendar-today"
              title={
                isLive
                  ? `${data?.totalDaysCompleted}/${data?.totalDays} Days`
                  : getDurationSummary(
                      (data.basicRules?.startDate ?? data.startDate) as string,
                      (data.basicRules?.endDate ??
                        data.targetEndDate) as string,
                    )
              }
            />
          )}
          <RuleItem
            iconType="MaterialCommunityIcons"
            icon={
              data.mode === ChallengeMode.GROUP ? 'account-group' : 'account'
            }
            title={data.mode + ' challenge'}
          />
        </View>
      )}
    </View>
  );
};

export default BasicRules;

const styles = StyleSheet.create({
  rulesContainer: {},
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getFontSize(2),
  },
  ruleText: {
    fontSize: getFontSize(1.7),
    color: Colors.white,
    marginLeft: getFontSize(1.5),
    textTransform: 'capitalize',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: getFontSize(1.5),
    flex: 1,
  },
  sectionTitle: {
    fontSize: getFontSize(2),
    color: Colors.white,
    fontWeight: '600',
    marginRight: getFontSize(1),
  },
});
