import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRef } from 'react';
import { TextInput } from 'react-native';

type FormValidationProps<T extends z.ZodType<any, any>> = {
  schema: T;
  defaultValues?: z.infer<T>;
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
};

export function useFormValidation<T extends z.ZodType<any, any>>({
  schema,
  defaultValues = {} as z.infer<T>,
  mode = 'onChange',
}: FormValidationProps<T>) {

  const inputRefs = useRef<{ [key: string]: TextInput | null }>({});

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode,
  });

  const registerRef = (fieldName: keyof z.infer<T>) => (ref: TextInput | null) => {
    if (ref) {
      inputRefs.current[fieldName as string] = ref;
    }
  };

  const focusNextInput = (currentField: keyof z.infer<T>, nextField: keyof z.infer<T>) => {
    const nextInput = inputRefs.current[nextField as string];
    if (nextInput) {
      nextInput.focus();
    }
  };

  return {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    reset,
    watch,
    setValue,
    registerRef,
    focusNextInput,
    inputRefs,
  };
}