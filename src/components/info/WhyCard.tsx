import {StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import {WhyContent} from '@/types';
import FastImage from 'react-native-fast-image';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import {Images} from '@/assets/images';

const WhyCard = memo(
  ({title, content}: {title: string; content: WhyContent}) => {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>
        {content?.items?.length > 0 &&
          content?.items.map((item, index) => (
            <View key={index.toString()} style={styles.whyContainer}>
              <FastImage
                source={
                  item?.files?.length > 0
                    ? {
                        uri:
                          item?.files?.length > 0
                            ? item?.files[0]?.fileUrl
                            : '',
                      }
                    : Images.meditation_
                }
                style={styles.imageStyle}
              />
              <View style={styles.whyCard}>
                <Text style={styles.titleText}>{item?.title || ''}</Text>
                <Text style={styles.detailsText}>{item?.details || ''}</Text>
              </View>
            </View>
          ))}
      </View>
    );
  },
);

export default WhyCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.textInputBackground,
    padding: getFontSize(1.5),
    borderRadius: getFontSize(1),
    marginBottom: getFontSize(1.5),
    borderWidth: getFontSize(0.08),
    borderColor: Colors.borderColor,
  },
  cardTitle: {
    fontSize: getFontSize(2),
    color: Colors.white,
    fontWeight: '500',
    marginBottom: getFontSize(0.5),
  },

  whyContainer: {
    flexDirection: 'row',
    marginTop: getFontSize(1.5),
    gap: getFontSize(1.5),
  },

  imageStyle: {
    height: getFontSize(7),
    width: getFontSize(7),
    borderRadius: getFontSize(1),
    opacity: 0.6,
    borderWidth: 1,
    borderColor: Colors.borderColor,
  },
  whyCard: {
    flex: 1,
    gap: 3,
  },
  titleText: {
    fontSize: getFontSize(1.8),
    color: Colors.white,
    fontWeight: '500',
  },
  detailsText: {
    fontSize: getFontSize(1.8),
    color: Colors.white,
    fontWeight: '400',
    flex: 1,
    opacity: 0.5,
  },
});
