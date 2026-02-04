import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {
  GetChallengeInfoResponse,
  ScheduledChallengeInfoResponse,
  InProgressChallengeInfoResponse,
} from '@/validation/schemas';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import {HowContent, WhyContent, WWHContent} from '@/types';
import IconComponent from '../IconComponent';
import VideoModal from './VideoModal';
import WhyCard from './WhyCard';
import HowCard from './HowCard';
import WhatCard from './WhatCard';

const WhatWhyHow = ({
  data,
  isOpen,
  toggleSection,
  isToggled = true,
}: {
  data:
    | GetChallengeInfoResponse
    | ScheduledChallengeInfoResponse
    | InProgressChallengeInfoResponse;
  isOpen?: boolean;
  toggleSection?: () => void;
  isToggled?: boolean;
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string>('');

  return (
    <View>
      <TouchableOpacity
        onPress={toggleSection}
        disabled={!isToggled}
        style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>What Why How</Text>
        {isToggled && (
          <IconComponent
            type="Feather"
            name={isOpen ? 'chevron-up' : 'chevron-down'}
            size={getFontSize(4)}
            color={Colors.orange}
          />
        )}
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.whatWhyHowContainer}>
          <WhatCard title="WHAT" content={data?.what as WWHContent} />
          <WhyCard title="WHY" content={data?.why as WhyContent} />
          <HowCard title="HOW" content={data?.how as HowContent} />

          <VideoModal
            videoUrl={videoUrl}
            visible={visible}
            onClose={() => setVisible(false)}
          />
        </View>
      )}
    </View>
  );
};

export default WhatWhyHow;

const styles = StyleSheet.create({
  whatWhyHowContainer: {
    // marginTop: getFontSize(1),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: getFontSize(1.5),
    // flex: 1,
  },
  sectionTitle: {
    fontSize: getFontSize(2),
    color: Colors.white,
    fontWeight: '600',
    marginRight: getFontSize(1),
  },
});
