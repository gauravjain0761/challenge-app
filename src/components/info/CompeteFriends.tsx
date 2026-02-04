import {Image, ImageSourcePropType, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Button from '../Button';
import IconComponent from '../IconComponent';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import {ViewStyle} from 'react-native';
import {Images} from '@/assets/images';

const CompeteFriends = ({
  onPress,
  containerStyle,
  onLayout,
}: {
  onPress?: () => void;
  containerStyle?: ViewStyle;
  onLayout?: (e: any) => void;
}) => {
  const getImages = (n: number) => {
    if (n === 1) {
      return Images.user1;
    } else if (n === 2) {
      return Images.user2;
    } else if (n === 3) {
      return Images.user3;
    } else {
      return Images.user1;
    }
  };
  return (
    <View
      onLayout={onLayout}
      style={{...styles.competeContainer, ...containerStyle}}>
      <View style={styles.avatarsContainer}>
        {[8, 4, 2].map((count, index) => (
          <View key={index} style={styles.avatarWrapper}>
            <Image source={getImages(index + 1)} style={styles.avatar} />
            {/* <View style={styles.countBadge}>
              <Text style={styles.countText}>{count}</Text>
            </View> */}
          </View>
        ))}
      </View>
      <Text style={styles.competeTitle}>
        We all have a friend who needs this!
      </Text>
      <Text style={styles.competeSubtext}>
        Challenge your friends, compete and do hard things together!
      </Text>
      <Button
        title="Invite your mates"
        style={styles.inviteButton}
        type="outline"
        textStyle={styles.inviteButtonText}
        onPress={onPress}
        leftIcon={
          <IconComponent
            type="Feather"
            name="users"
            size={getFontSize(3)}
            color={Colors.white}
          />
        }
      />
    </View>
  );
};

export default CompeteFriends;

const styles = StyleSheet.create({
  competeContainer: {
    backgroundColor: Colors.textInputBackground,
    borderRadius: getFontSize(1),
    padding: getFontSize(2),
    alignItems: 'center',
    marginTop: getFontSize(4.5),
    borderColor: Colors.borderColor,
    borderWidth: getFontSize(0.08),
  },
  avatarsContainer: {
    flexDirection: 'row',
    marginBottom: getFontSize(2),
    gap: getFontSize(2),
  },
  avatarWrapper: {
    // marginHorizontal: getFontSize(0.5),
    position: 'relative',
  },
  avatar: {
    width: getFontSize(5),
    height: getFontSize(5),
    borderRadius: getFontSize(2.5),
  },
  countBadge: {
    position: 'absolute',
    bottom: -5,
    right: 12,
    backgroundColor: Colors.white,
    borderRadius: getFontSize(1),
    paddingHorizontal: getFontSize(0.5),
  },
  countText: {
    color: Colors.orange,
    fontSize: getFontSize(1.8),
  },
  competeTitle: {
    fontSize: getFontSize(2.1),
    color: Colors.white,
    fontWeight: '600',
    marginBottom: getFontSize(1),
  },
  competeSubtext: {
    fontSize: getFontSize(1.6),
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: getFontSize(2),
  },
  inviteButton: {
    borderWidth: 1,
    borderColor: Colors.orange,
    paddingHorizontal: getFontSize(2),
  },
  inviteButtonText: {
    color: Colors.white,
    marginLeft: getFontSize(1),
  },
});
