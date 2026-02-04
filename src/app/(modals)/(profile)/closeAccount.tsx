import {ScrollView, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import GradientContainer from '@/components/GradientContainer';
import HeaderBack from '@/components/HeaderBack';
import CustomInput from '@/components/CustomInput';
import {getFontSize} from '@/utils/responsiveFn';
import Button from '@/components/Button';
import {useCloseAccountMutation} from '@/api/authApi';
import {useAppSelector} from '@/hooks/reduxHooks';
import {selectIsLoading} from '@/features/loaderSlice';
import {errorToast, successToast} from '@/utils/common/commonFunction';
import {resetStore} from '@/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {router} from 'expo-router';
import {AsyncTypes} from '@/types/enums';
import Loader from '@/components/Loader';

const closeAccount = () => {
  const [closeAccount] = useCloseAccountMutation({});
  const isLoading = useAppSelector(selectIsLoading);
  const [reason, setReason] = useState('');

  const handleClose = async () => {
    try {
      const res = await closeAccount({reason: reason}).unwrap();
      if (res.message) {
        successToast(res.message);
        await resetStore();

        const keysToRemove = [
          AsyncTypes.PENDING_BRANCH_LINK,
          AsyncTypes.PENDING_BRANCH_LINK_FOR_INFO,
          AsyncTypes.FROM_NOTIFICATION,
        ];

        await AsyncStorage.multiRemove(keysToRemove);
        router.dismissTo('/(auth)/logIn');
        router.back();
      }
    } catch (error: any) {
      errorToast(error.data?.message || error.message || 'Please try again');
      console.log('error', error);
    }
  };

  return (
    <GradientContainer>
      <HeaderBack title={'Close Account'} isBackground />
      <ScrollView style={styles.scrollStyle}>
        <CustomInput
          label="Reason"
          value={reason}
          onChangeText={setReason}
          multiline
          numberOfLines={5}
          containerStyle={styles.input}
          inputStyle={styles.input}
          textAlignVertical="top"
        />
      </ScrollView>
      <Button title={'Close Account'} onPress={handleClose} />
      {isLoading && <Loader />}
    </GradientContainer>
  );
};

export default closeAccount;

const styles = StyleSheet.create({
  scrollStyle: {
    paddingVertical: getFontSize(3),
  },
  input: {
    height: getFontSize(15),
  },
});
