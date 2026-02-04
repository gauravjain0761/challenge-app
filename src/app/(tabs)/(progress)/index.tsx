import {View} from 'react-native';
import React from 'react';
import {Header} from '@/components/Header';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '@/constants/Colors';
import {StyleSheet} from 'react-native';

import CustomTab from '@/components/CustomTab';
import {ProgressTabs, Tabs} from '@/types/enums';
import MetricsScreen from './metricsScreen';
import MaxOutScreen from './maxOutScreen';
import {GeneralStyle} from '@/constants/GeneralStyle';
import LeaderBoardScreen from './leaderBoardScreen';

const Progress = () => {
  const [activeTab, setActiveTab] = React.useState<string>(Tabs.Metrics);

  return (
    <View style={styles.container}>
      <Header title={`Progress`} />
      <LinearGradient
        colors={['#000', '#000', Colors.orangeOpacity]}
        style={{flex: 1}}>
        <CustomTab
          tabs={ProgressTabs}
          activeTab={activeTab}
          onTabChange={tab => setActiveTab(tab)}
        />

        {activeTab === Tabs.Metrics && <MetricsScreen />}

        {activeTab === Tabs.MaxOut && (
          <View style={GeneralStyle.flex}>
            <MaxOutScreen />
          </View>
        )}
        {activeTab === Tabs.Leaderboard && (
          <View style={GeneralStyle.flex}>
            <LeaderBoardScreen />
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
});

export default Progress;
