import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import GradientContainer from '@/components/GradientContainer';
import HeaderBack from '@/components/HeaderBack';
import {useLocalSearchParams} from 'expo-router';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';

const menToolDetailsScreen = () => {
  const params = useLocalSearchParams();

  return (
    <GradientContainer>
      <HeaderBack title={params?.title as string} isBackground />
      <ScrollView style={styles.container}>
        <Text style={styles.listTitle}>Welcome to MenTools</Text>
        <Text style={styles.dec}>
          Discover tools to optimize your time, improve focus, and take control
          of your day
        </Text>

        <View style={styles.descriptionContainer}>
          <Text style={styles.heading}>Why Choose MenTools?</Text>
          <Text style={styles.dec}>
            Welcome to MenTools, your ultimate companion for productivity and
            success. Whether you're looking to organize your tasks, improve your
            focus, or achieve your goals, MenTools provides the tools you need
            to take control of your day. Designed to empower you, our platform
            is here to make your daily life simpler, more productive, and
            stress-free.
          </Text>
          <Text style={styles.heading}>What can Mentools do for you?</Text>
          <Text style={styles.dec}>
            MenTools is more than just a productivity app—it’s your personal
            toolkit for success. Whether you’re juggling a demanding work
            schedule, balancing personal commitments, or setting ambitious
            goals, MenTools is here to simplify your life.
          </Text>
          <Text style={styles.heading}>Task Management Made Simple:</Text>
          <Text style={styles.dec}>
            Break down your workload with intuitive tools that let you
            prioritize, set deadlines, and stay on track.
          </Text>
        </View>
      </ScrollView>
    </GradientContainer>
  );
};

export default menToolDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: getFontSize(3),
  },
  listTitle: {
    color: Colors.white,
    fontSize: getFontSize(2.2),
    fontWeight: '500',
  },
  dec: {
    color: Colors.white,
    fontSize: getFontSize(1.8),
    fontWeight: '500',
    opacity: 0.4,
    paddingTop: getFontSize(1),
  },
  descriptionContainer: {
    paddingHorizontal: getFontSize(2),
    paddingBottom: getFontSize(2),
    borderRadius: getFontSize(1),
    backgroundColor: Colors.textInputBackground,
    marginTop: getFontSize(2),
  },
  heading: {
    color: Colors.white,
    fontSize: getFontSize(2),
    fontWeight: '500',
    paddingTop: getFontSize(2),
  },
});
