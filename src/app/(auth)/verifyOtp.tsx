import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getFontSize} from '@/utils/responsiveFn';
import {Colors} from '@/constants/Colors';
import Button from '@/components/Button';
import {router, useLocalSearchParams} from 'expo-router';
import GradientContainer from '@/components/GradientContainer';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {useResendOtpMutation, useVerifyOtpMutation} from '@/api/authApi';
import {errorToast} from '@/utils/common/commonFunction';
import {Controller} from 'react-hook-form';
import {useFormValidation} from '@/validation/hooks';
import {VerifyOtpRequest, verifyOtpRequestSchema} from '@/validation/schemas';
import IconComponent from '@/components/IconComponent';
const CELL_COUNT = 6;

const verifyOtp = () => {
  const {email}: any = useLocalSearchParams();
  const [verifyOtp, {isLoading}] = useVerifyOtpMutation();
  const [resendOtp, {isLoading: isResendLoading}] = useResendOtpMutation();

  const {control, handleSubmit, watch, setValue} = useFormValidation({
    schema: verifyOtpRequestSchema,
    defaultValues: {
      email: email,
      otp: '',
    },
  });

  const otpValue = watch('otp');

  const ref = useBlurOnFulfill({value: otpValue, cellCount: CELL_COUNT});

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otpValue,
    setValue: (val: string) => setValue('otp', val),
  });

  const [timer, setTimer] = useState(60);

  const [isResendDisabled, setIsResendDisabled] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResendDisabled) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 60; // Reset timer after expiration
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled]);

  const onSubmit = async (data: VerifyOtpRequest) => {
    try {
      const result = await verifyOtp(data).unwrap();
      if (result) {
        router.push('/resetPassword');
        router.setParams({email: data.email, token: result?.token});
      }
    } catch (error: any) {
      console.log('Login error details:', error);

      // Show error message
      errorToast(error.data?.message || error.message || 'Please try again');
    }
  };

  const onResendOtp = async () => {
    try {
      const result = await resendOtp({
        email,
      }).unwrap();

      if (result) {
        setIsResendDisabled(true);
      }
    } catch (error: any) {
      console.log('Login error details:', error);
      setIsResendDisabled(false);
      // Show error message
      errorToast(error.data?.message || error.message || 'Please try again');
    }
  };

  return (
    <GradientContainer isLoading={isLoading || isResendLoading}>
      <IconComponent
        name="left"
        size={24}
        color={Colors.white}
        onPress={() => router.back()}
      />
      <View style={styles.container}>
        <Text style={styles.heading}>Verify code</Text>
        <Text style={styles.dec}>Please enter the 6 digit code sent to:</Text>
        <Text style={styles.email}>{email}</Text>
        <Controller
          control={control}
          name="otp"
          render={({field: {onChange, onBlur, value}, fieldState: {error}}) => (
            <View>
              <CodeField
                ref={ref}
                {...props}
                value={value}
                onChangeText={onChange} // only onChange
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                onBlur={onBlur}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({index, symbol, isFocused}) => (
                  <View
                    key={index}
                    style={[styles.cell, isFocused && styles.focusedCell]}
                    onLayout={getCellOnLayoutHandler(index)}>
                    <Text style={styles.cellText}>
                      {symbol || (isFocused ? <Cursor /> : null)}
                    </Text>
                  </View>
                )}
              />
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </View>
          )}
        />
        <Button
          title={'Verify'}
          style={{
            marginTop: getFontSize(4),
            width: '100%',
          }}
          onPress={handleSubmit(onSubmit)}
        />
        <TouchableOpacity onPress={onResendOtp} disabled={isResendDisabled}>
          <Text style={styles.resend}>
            {isResendDisabled ? `Resend Code (${timer}s)` : 'Resend code'}
          </Text>
        </TouchableOpacity>
      </View>
    </GradientContainer>
  );
};

export default verifyOtp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: getFontSize(1),
  },
  heading: {
    color: Colors.white,
    fontSize: getFontSize(3.4),
    marginTop: getFontSize(5),
    fontWeight: '500',
  },
  dec: {
    color: Colors.white,
    fontSize: getFontSize(2),
    marginTop: getFontSize(2),
    opacity: 0.6,
  },
  email: {
    color: Colors.white,
    fontSize: getFontSize(2),
    marginBottom: getFontSize(4),
  },
  codeFieldRoot: {
    // marginVertical: getFontSize(3),
    alignSelf: 'center',
    gap: getFontSize(1),
  },
  cell: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: Colors._4b4b4b,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: getFontSize(1.8),
    backgroundColor: Colors._25201a,
  },
  focusedCell: {
    borderColor: Colors.orange,
  },
  cellText: {
    fontSize: getFontSize(3),
    fontWeight: '500',
    color: Colors.white,
  },
  resend: {
    color: Colors.white,
    fontSize: getFontSize(2),
    marginTop: getFontSize(4),
    textDecorationLine: 'underline',
    textAlign: 'center',
    fontWeight: '400',
  },
  errorText: {
    color: 'red',
    fontSize: getFontSize(1.8),
    marginTop: getFontSize(1),
    marginLeft: getFontSize(2.5),
  },
});
