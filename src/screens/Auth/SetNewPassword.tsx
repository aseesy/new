import React from 'react';
import { ScrollView, View } from 'react-native';
import Wrapper from '../../components/common/Wrapper';
import NText from '../../components/ui/NText';
import NInput from '../../components/ui/NInput';
import NPressable from '../../components/ui/NPressable';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useRoute } from '@react-navigation/native';
import { useMutation } from 'react-query';
import useAlert from '../../hooks/useAlreat';
import { resetPassword } from '../../networking/auth.service';
import { resetAndNavigate } from '../../utils/navigationUtils';

const SetNewPassword = () => {

  const { params } = useRoute();
    const { email = '' } = (params || {}) as {
      email?: string;
    };

  const alert = useAlert();

  const { mutate, isLoading } = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      if (data.isValid) {
        alert('Password reset successful!', {
          buttons: [{
            text: 'Login Now',
            onPress: () => resetAndNavigate('/welcome'),
          }],
        });
      }
    },
  });

  // Validation schema with Yup
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'Password should be at least 8 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const handleSubmitForm = (values: { password: string }) => {
    const payload = {
      username: email,
      password: values.password,
    }
    mutate(payload);
  };

  return (
    <Wrapper header>
      <View className="px-8 my-20 mt-[35%]">
        <NText variant="h1" fontFamily="Medium">
          Set new password
        </NText>

        <NText variant="h5" classname='text-light20' >
          Set new password for email ID {email}.
        </NText>

        <View className="h-8" />

        {/* Formik Form */}
        <Formik
          initialValues={{ email, password: '', confirmPassword: '' }}
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
                  loading={isLoading}
                  title="Update"
                  onPress={handleSubmit}
                  disabled={ !!errors.password || !!errors.confirmPassword || !values.email || !values.password || !values.confirmPassword}
                />
              </ScrollView>
          )}
        </Formik>
      </View>
    </Wrapper>
  );
};

export default SetNewPassword;
