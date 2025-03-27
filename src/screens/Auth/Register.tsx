import React, { useState } from 'react';
import { View } from 'react-native';
import Wrapper from '../../components/common/Wrapper';
import NText from '../../components/ui/NText';
import NInput from '../../components/ui/NInput';
import NPressable from '../../components/ui/NPressable';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { push } from '../../utils/navigationUtils';
import { useMutation } from 'react-query';
import { sentOtp } from '../../networking/auth.service';
import { VERIFICATION_TYPE } from '../../models/enums';
import TermsAndConditions from '../../components/auth/TermsAndConditions';

const Register = () => {

  const { mutate, isLoading } = useMutation({
    mutationFn: sentOtp,
    onSuccess: (data, variables) => {
      console.log(data)
      push('/otpVerification', {
        email: variables.value,
        verificationCode: data.result.verificationCode
      })
    },
    onError: (error) => console.log(error),
  });

  // Validation schema with Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    terms: Yup.boolean().required('Terms and Conditions must be provided'),
  });

  const handleSubmitForm = (values: { email:  string }) => {
    const payload = {
      name: 'User',
      value: values.email,
      type: VERIFICATION_TYPE.EMAIL
    }
    mutate(payload);
  }

  return (
    <Wrapper header>
      <View className="px-8 mt-[35%]">
        <NText variant="h1" fontFamily="Medium" classname="text-center">
          Verify your email
        </NText>

        <View className="h-4" />

        <NText classname="text-center">
          Enter your email address.
        </NText>

        <View className="h-4" />

        {/* Formik Form */}
        <Formik
          initialValues={{ email: '', terms: false }}
          validationSchema={validationSchema}
          onSubmit={handleSubmitForm}
        >
          {({ values, handleChange, handleBlur, handleSubmit, setFieldValue, touched, errors }) => (
            <View>
              <NInput
                label="Email"
                keyboardType='email-address'
                autoFocus
                placeholder='Enter your email address'
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                required
                error={touched.email && errors.email}
              />
              <View className='mx-0.5 flex-wrap mr-4'>
                <TermsAndConditions onAgree={(v) => setFieldValue('terms', v)} />
              </View>
              <View className="h-6" />

              <NPressable
                loading={isLoading}
                title="Submit"
                onPress={handleSubmit}
                disabled={!!errors.email || !values.email || !!errors.terms || !values.terms}
              />
            </View>
          )}
        </Formik>
      </View>
    </Wrapper>
  );
};

export default Register;
