import {StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import {HowContent} from '@/types';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import {GeneralStyle} from '@/constants/GeneralStyle';

const HowCard = memo(
  ({title, content}: {title: string; content: HowContent}) => {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>
        <View style={styles.container}>
          <View style={styles.line} />
          {content?.steps?.length > 0 &&
            content?.steps.map((item, index) => (
              <View key={index.toString()} style={styles.howContainer}>
                <View style={styles.stepContainer}>
                  <Text style={styles.stepText}>{index + 1}</Text>
                  {/* {content?.steps?.length - 1 !== index && (
                  <View style={styles.line} />
                  )} */}
                </View>
                <Text style={{...styles.titleText, ...GeneralStyle.flex}}>
                  {item?.title || ''}
                </Text>
              </View>
            ))}
        </View>
        {content?.disclaimer && (
          <>
            <Text style={styles.text}>Disclaimer</Text>
            <Text style={styles.disclaimerText}>
              {content?.disclaimer || ''}
            </Text>
          </>
        )}
      </View>
    );
  },
);

export default HowCard;

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

  container: {
    overflow: 'hidden',
  },
  howContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: getFontSize(2.5),
    gap: getFontSize(1.5),
  },

  titleText: {
    fontSize: getFontSize(1.8),
    color: Colors.white,
    fontWeight: '500',
  },

  stepContainer: {
    overflow: 'hidden',

    height: getFontSize(4.3),
    width: getFontSize(4.3),
    borderRadius: getFontSize(0.8),
    borderWidth: 1,
    borderColor: Colors._C05600,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors._2c2c2c,
    zIndex: 999,
  },
  stepText: {
    fontSize: getFontSize(2),
    color: Colors.white,
    fontWeight: '500',
  },
  text: {
    fontSize: getFontSize(2),
    color: Colors.white,
    fontWeight: '700',
    marginTop: getFontSize(2),
  },
  disclaimerText: {
    fontSize: getFontSize(1.8),
    color: Colors.white,
    fontWeight: '400',
    marginTop: getFontSize(0.5),
  },
  line: {
    height: '100%',
    width: 2,
    backgroundColor: Colors._C05600,
    position: 'absolute',
    top: getFontSize(4.1),
    zIndex: -999,
    left: getFontSize(2),
  },
});
