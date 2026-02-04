import React, {forwardRef, Ref, RefCallback} from 'react';
import {
  View,
  Text,
  TextInputProps,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextInput,
} from 'react-native';
import {Control, Controller, FieldValues, Path} from 'react-hook-form';
import CustomInput from './CustomInput'; // Your existing custom input
import {Colors} from '@/constants/Colors';
import {getFontSize} from '@/utils/responsiveFn';

interface ValidatedInputProps<T extends FieldValues>
  extends Omit<TextInputProps, 'onBlur'> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  defaultValue?: string;
  eyeIcon?: string;
  onPressEyeIcon?: () => void;
  onSubmitEditing?: () => void;
  nextField?: Path<T>;
  focusNextInput?: (current: Path<T>, next: Path<T>) => void;
  registerRef?: (name: Path<T>) => (ref: any) => void;
}

function ValidatedInput<T extends FieldValues>(
  {
    name,
    control,
    label,
    defaultValue = '',
    eyeIcon,
    onPressEyeIcon,
    onSubmitEditing,
    nextField,
    focusNextInput,
    registerRef,
    ...rest
  }: ValidatedInputProps<T>,
  ref: Ref<TextInput>,
) {
  const handleRef: RefCallback<TextInput> = (inputRef: TextInput | null) => {
    if (registerRef && inputRef) {
      registerRef(name)(inputRef);
    }

    if (typeof ref === 'function') {
      ref(inputRef);
    } else if (ref) {
      (ref as React.MutableRefObject<TextInput | null>).current = inputRef;
    }
  };
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue as any}
      render={({field: {onChange, onBlur, value}, fieldState: {error}}) => (
        <View style={styles.inputContainer}>
          {label && <Text style={styles.label}>{label}</Text>}
          <CustomInput
            ref={handleRef}
            value={value}
            onChangeText={onChange}
            onFormBlur={onBlur}
            eyeIcon={eyeIcon}
            onPressEyeIcon={onPressEyeIcon}
            error={error?.message}
            onSubmitEditing={() => {
              if (onSubmitEditing) {
                onSubmitEditing();
              } else if (nextField && focusNextInput) {
                focusNextInput(name, nextField);
              }
            }}
            {...rest}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 0,
  },
  label: {
    fontSize: getFontSize(1.8),
    color: Colors.white,
    marginBottom: 4,
  },
});

export default forwardRef(ValidatedInput) as <T extends FieldValues>(
  props: ValidatedInputProps<T> & {
    ref?: React.Ref<any>;
    onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  },
) => React.ReactElement;
