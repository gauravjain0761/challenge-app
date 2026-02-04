import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import IconComponent from './IconComponent';

export const EmptyState: React.FC = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Challenge Yourself</Text>
    <View style={styles.buttonContainer}>
      {/* <TouchableOpacity style={styles.socialButton}>
        <Icon name="plus" size={23} color={Colors.orange} />
        <Text style={styles.socialButtonText}>Actions</Text>
      </TouchableOpacity> */}
      {/* <TouchableOpacity style={styles.socialButton}>
        <Icon name="plus" size={23} color={Colors.orange} />
        <Text style={styles.socialButtonText}>Journals</Text>
      </TouchableOpacity> */}
      {/* <TouchableOpacity style={styles.socialButton}>
        <Icon name="plus" size={23} color={Colors.orange} />
        <Text style={styles.socialButtonText}>Plans</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.socialButton}>
        <IconComponent
          type="Entypo"
          name="plus"
          size={23}
          color={Colors.orange}
        />
        <Text style={styles.socialButtonText}>Add Challenge</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: getFontSize(20),
    marginTop: getFontSize(2),
  },
  text: {
    color: Colors.white,
    fontSize: getFontSize(3.5),
    textAlign: 'center',
    width: '80%',
    fontWeight: '500',
    // marginBottom: getFontSize(35),
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: getFontSize(5),
    borderRadius: getFontSize(1),
    borderWidth: getFontSize(0.1),
    borderColor: Colors.orange,
    marginTop: getFontSize(2),
    paddingLeft: getFontSize(2),
    paddingRight: getFontSize(2),
    // width: "25%",
    marginLeft: getFontSize(1),
  },
  socialButtonText: {
    color: Colors.white,
    fontSize: getFontSize(2),
    marginLeft: getFontSize(0.2),
    fontWeight: '500',
  },
});
