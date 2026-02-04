import {
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import GradientContainer from '@/components/GradientContainer';
import HeaderBack from '@/components/HeaderBack';
import {helpList, helpListProps} from '@/types/enums';
import IconComponent from '@/components/IconComponent';
import {Colors} from '@/constants/Colors';
import {getFontSize, SCREEN_WIDTH} from '@/utils/responsiveFn';
import {GeneralStyle} from '@/constants/GeneralStyle';
import Button from '@/components/Button';
import {router} from 'expo-router';

const helpScreen = () => {
  const renderItem = ({item}: {item: helpListProps}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.url) {
            router.push(`/(modals)/(profile)/webScreen`);
            router.setParams({url: item.url, title: item.title});
          } else {
            router.push('/(modals)/(profile)/menToolDetailsScreen');
            router.setParams({title: item.title});
          }
        }}
        key={item._id.toString()}
        style={styles.itemContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.listTitle}>{item.title}</Text>
          <Text style={styles.dec}>{item.dec}</Text>
        </View>

        <IconComponent
          name="right"
          size={getFontSize(2.5)}
          color={Colors.white}
        />
      </TouchableOpacity>
    );
  };

  return (
    <GradientContainer>
      <HeaderBack title={'Help and Support'} isBackground />

      <FlatList
        data={helpList}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[GeneralStyle.flex, {marginTop: getFontSize(2)}]}
      />

      <View style={styles.bottomContainer}>
        <Text style={styles.cantFindText}>
          Can’t find what you’re looking for?
        </Text>
        <Button
          title="Contact Support"
          style={styles.btn}
          onPress={() => {
            router.push(`/(modals)/(profile)/webScreen`);
            router.setParams({
              url: 'https://www.mentoolschallenges.co/contact-us',
              title: 'Contact Support',
            });
          }}
        />
      </View>
    </GradientContainer>
  );
};

export default helpScreen;

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: Colors.textInputBackground,
    borderRadius: getFontSize(1),
    marginBottom: getFontSize(1.5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: getFontSize(2),
  },
  textContainer: {
    flex: 1,
    paddingRight: getFontSize(1),
    gap: getFontSize(1),
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
  },
  bottomContainer: {
    padding: getFontSize(2),
    width: SCREEN_WIDTH,
    alignSelf: 'center',
  },
  cantFindText: {
    color: Colors.orange,
    fontSize: getFontSize(1.8),
    fontWeight: '500',
    textAlign: 'center',
  },
  btn: {
    width: '100%',
  },
});
