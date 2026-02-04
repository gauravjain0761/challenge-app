export const authErrorMessages = {
    required: 'This field is required',
    
    email: {
      required: 'Email is required',
      invalid: 'Please enter a valid email address',
      notFound: 'No account found with this email',
      alreadyExists: 'An account with this email already exists',
    },
    
    password: {
      required: 'Password is required',
      min: 'Password must be at least 8 characters',
      pattern: 'Password must contain at least one lowercase letter and one number',
      incorrect: 'Incorrect password',
      mismatch: 'Passwords do not match',
    },
    
    name: {
      required: 'Name is required',
      min: 'Name must be at least 2 characters',
      max: 'Name cannot exceed 50 characters',
    },
    
    otp: {
      required: 'Verification code is required',
      length: 'Verification code must be 6 digits',
      format: 'Verification code must contain only digits',
      invalid: 'Invalid verification code',
      expired: 'Verification code has expired',
    },
    
    confirmPassword: {
      required: 'Confirm password is required',
      match: 'Passwords do not match',
    },
  };