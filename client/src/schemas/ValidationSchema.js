import * as Yup from "yup";

const SignUpValidationSchema = Yup.object({
  userName: Yup.string()
    .min(5, 'Name must be at least 5 characters')
    .required('Name is required'),

  userID: Yup.string()
    .email('Invalid userID')
    .required('Enter valid userID'),

  phoneNumber: Yup.string()
    .min(10, "Phone Number must be of 10 digits")
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),

  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'Password must include letters, numbers, and special characters'
    )
    .required('Password is required'),

  confirmPassword: Yup.string()
    .required("Confirm the password")
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const SignInValidation = Yup.object({
  userID: Yup.string()
    .email('Invalid userID')
    .required('Enter valid userID'),

  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),

});

const ProfileUpdateValidation = Yup.object({
  userName: Yup.string()
    .min(5, 'Name must be at least 5 characters')
    .required('Name is required'),

  userID: Yup.string()
    .email('Invalid email')
    .required('Enter valid email address'),

  phoneNumber: Yup.string()
    .min(10, "Phone Number must be of 10 digits")
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required')
});

export {SignUpValidationSchema, SignInValidation, ProfileUpdateValidation};