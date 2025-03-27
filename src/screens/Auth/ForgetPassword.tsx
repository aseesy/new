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
import { sendOtpForResetPassword, sentOtp } from '../../networking/auth.service';
import { VERIFICATION_TYPE } from '../../models/enums';
import { useRoute } from '@react-navigation/native';

const ForgetPassword = () => {

  const { params } = useRoute();
      const { email = '' } = (params || {}) as {
        email?: string;
      };

  const { mutate, isLoading } = useMutation({
    mutationFn: sendOtpForResetPassword,
    onSuccess: (data, variables) => {
      console.log(data)
      push('/otpVerification', {
        flow: 'forget-password',
        email: variables.email,
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
  });

  const handleSubmitForm = (values: { email:  string }) => {
    const payload = {
      email: values.email,
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
          Enter your registered email address.
        </NText>

        <View className="h-4" />

        {/* Formik Form */}
        <Formik
          initialValues={{ email }}
          validationSchema={validationSchema}
          onSubmit={handleSubmitForm}
        >
          {({ values, handleChange, handleBlur, handleSubmit, touched, errors }) => (
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
                <NText classname='text-medium50'>
                  To verify your identity we'll send an OTP to this email ID.
                  </NText>
              </View>
              <View className="h-4" />

              <NPressable
                loading={isLoading}
                title="Send OTP"
                onPress={handleSubmit}
                disabled={!!errors.email || !values.email}
              />
            </View>
          )}
        </Formik>
      </View>
    </Wrapper>
  );
};

export default ForgetPassword;
