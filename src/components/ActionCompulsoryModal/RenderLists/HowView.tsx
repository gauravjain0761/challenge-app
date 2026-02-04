import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {GeneralStyle} from '@/constants/GeneralStyle';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import CustomCheckBox from '@/components/CustomCheckBox';
import Button from '@/components/Button';
import {setAsyncActionCompulsoryHow} from '@/utils/common/useAsyncFunctions';

const HowView = ({onPress = () => {}}: {onPress?: () => void}) => {
  const [isCheck, setIsCheck] = React.useState(false);

  const content = [
    {
      id: 1,
      title: 'Select one action',
    },
    {
      id: 2,
      title: 'Complete the one action',
    },
    {
      id: 3,
      title: 'Mark complete',
    },
    {
      id: 4,
      title: 'Return to challenge',
    },
  ];
  const onPressSave = async () => {
    await setAsyncActionCompulsoryHow();
    onPress();
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.line} />
        {content?.length > 0 &&
          content?.map((item, index) => (
            <View key={index.toString()} style={styles.howContainer}>
              <View style={styles.stepContainer}>
                <Text style={styles.stepText}>{index + 1}</Text>
              </View>
              <Text style={{...styles.titleText, ...GeneralStyle.flex}}>
                {item?.title || ''}
              </Text>
            </View>
          ))} 
      </View>
      <View style={styles.row}>
        <CustomCheckBox
          isSelected={isCheck}
          onPress={() => setIsCheck(!isCheck)}
          title="Don’t show this again"
        />
        <Button
          disabled={!isCheck}
          title="Save"
          style={styles.btn}
          type="outline"
          textStyle={styles.btnText}
          onPress={onPressSave}
        />
      </View>
    </View>
  );
};

export default HowView;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },

  container: {
    overflow: 'hidden',
    marginLeft: getFontSize(4),
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

  line: {
    height: '100%',
    width: 2,
    backgroundColor: Colors._C05600,
    position: 'absolute',
    top: getFontSize(4.1),
    zIndex: -999,
    left: getFontSize(2),
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btn: {
    width: '20%',
    height: getFontSize(4.5),
    borderColor: Colors.white,
    backgroundColor: Colors.white,
  },
  btnText: {
    color: Colors.black,
  },
});
