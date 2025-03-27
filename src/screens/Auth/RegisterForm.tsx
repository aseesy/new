import React from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import Wrapper from '../../components/common/Wrapper';
import NText from '../../components/ui/NText';
import NInput from '../../components/ui/NInput';
import NPressable from '../../components/ui/NPressable';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { push } from '../../utils/navigationUtils';
import { useRoute } from '@react-navigation/native';
import useAlert from '../../hooks/useAlreat';
import { AppColor } from '../../constants/theme';
import { isIos } from '../../utils';

const RegisterForm = () => {

  const { params } = useRoute();
    const { email = '' } = (params || {}) as {
      email?: string;
    };

  // Validation schema with Yup
  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('First Name is required'),
    lastName: Yup.string()
      .required('Last Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password should be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const handleSubmitForm = (values: { firstName: string, lastName: string, email: string, password: string }) => {
    const payload = {
      userName: values.email,
      ...values,
    }
    push('/registerPhone', { payload });
  };

  return (
    <Wrapper header>
      <View className="px-8 my-20 mt-[35%]">
        <NText variant="h1" fontFamily="Medium">
          Create an account
        </NText>

        <View className="h-8" />

        {/* Formik Form */}
        <Formik
          initialValues={{ firstName: '', lastName: '', email, password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmitForm}
        >
          {({ values, handleChange, handleBlur, handleSubmit, touched, errors }) => (
              <ScrollView keyboardDismissMode='on-drag' automaticallyAdjustKeyboardInsets keyboardShouldPersistTaps={'handled'} >
                <NInput
                  label="Email"
                  readOnly
                  keyboardType='email-address'
                  value={values.email}
                  placeholder='Enter your email address'
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  required
                  error={touched.email && errors.email}
                />
                <NInput
                  label="First Name"
                  value={values.firstName}
                  placeholder='Enter your first name'
                  onChangeText={handleChange('firstName')}
                  onBlur={handleBlur('firstName')}
                  required
                  error={touched.firstName && errors.firstName}
                />
                <NInput
                  label="Last Name"
                  value={values.lastName}
                  placeholder='Enter your last name'
                  onChangeText={handleChange('lastName')}
                  onBlur={handleBlur('lastName')}
                  required
                  error={touched.lastName && errors.lastName}
                />
                <NInput
                  label="Password"
                  secureTextEntry
                  value={values.password}
                  placeholder='Enter new password'
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  required
                  error={touched.password && errors.password}
                />
                <NInput
                  label="Confirm Password"
                  secureTextEntry
                  value={values.confirmPassword}
                  placeholder='Confirm your password'
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  required
                  error={touched.confirmPassword && errors.confirmPassword}
                />
                <View className="h-2" />
                <NPressable
                  title="Register"
                  onPress={handleSubmit}
                  disabled={!!errors.firstName || !!errors.lastName || !!errors.email || !!errors.password || !!errors.confirmPassword || !values.firstName || !values.lastName || !values.email || !values.password || !values.confirmPassword}
                />
              </ScrollView>
          )}
        </Formik>
      </View>
    </Wrapper>
  );
};

export default RegisterForm;
