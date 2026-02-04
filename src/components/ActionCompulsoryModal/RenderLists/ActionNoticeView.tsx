import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import GradientText from '../../GradientText';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import CustomCheckBox from '@/components/CustomCheckBox';
import Button from '@/components/Button';
import {setAsyncActionCompulsoryNotice} from '@/utils/common/useAsyncFunctions';

const ActionNoticeView = ({onPress = () => {}}: {onPress?: () => void}) => {
  const [isCheck, setIsCheck] = React.useState(false);

  const onPressSave = async () => {
    await setAsyncActionCompulsoryNotice();
    onPress();
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <GradientText
          text={
            'To ensure the integrity of the challenges we include random compulsory actions. This ensures that men cannot claim to be so called ‘Legends’ without doing the work.'
          }
          colors={['#D1D1D6', '#555555']}
          start={{x: 0.5, y: 0}}
          end={{x: 0.5, y: 1.2}}
          style={styles.description}
          height={getFontSize(20)}
          containerStyle={{
            width: '80%',
            alignSelf: 'center',
          }}
        />
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

export default ActionNoticeView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontSize: getFontSize(2.1),
    fontWeight: '500',
    color: Colors.white,
    textAlign: 'center',
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
