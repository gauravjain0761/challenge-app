import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {ProfileListProps, ProfileListTypes} from '@/types/enums';
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';
import IconComponent from '../IconComponent';
import CustomSwitch from '../CommonSwitch';

interface Props {
  item: ProfileListProps;
  onPress?: (value?: any) => void;
}

const ProfileListItem = ({item, onPress = () => {}}: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.title}</Text>
      <View style={styles.innerItemContainer}>
        {item.list.map((lItem, index) => (
          <TouchableOpacity
            onPress={() => {
              onPress(lItem.title);
            }}
            disabled={!lItem.isArrow}
            key={lItem._id.toString()}
            style={styles.listItemContainer}>
            <Text
              style={{
                ...styles.listTitle,
                color:
                  lItem.title === ProfileListTypes.Close_Account
                    ? Colors.orange
                    : Colors.white,
              }}>
              {lItem.title}
            </Text>
            {lItem.isIcon &&
              (lItem.isArrow ? (
                <IconComponent
                  name="right"
                  size={getFontSize(2.5)}
                  color={Colors.white}
                />
              ) : (
                <CustomSwitch />
              ))}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default memo(ProfileListItem);

const styles = StyleSheet.create({
  container: {
    gap: getFontSize(1.5),
  },
  title: {
    color: Colors.white,
    fontSize: getFontSize(2),
    fontWeight: '500',
    textTransform: 'uppercase',
    opacity: 0.6,
  },
  innerItemContainer: {
    backgroundColor: Colors.textInputBackground,
    borderRadius: getFontSize(1),
    marginBottom: getFontSize(1.5),
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: getFontSize(2),
  },
  listTitle: {
    color: Colors.white,
    fontSize: getFontSize(2.2),
    fontWeight: '500',
  },
});
