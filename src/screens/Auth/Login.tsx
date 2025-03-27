import React, { useRef } from 'react';
import { View } from 'react-native';
import Wrapper from '../../components/common/Wrapper';
import NText from '../../components/ui/NText';
import NInput from '../../components/ui/NInput';
import NPressable from '../../components/ui/NPressable';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { navigate, resetAndNavigate } from '../../utils/navigationUtils';
import { useMutation } from 'react-query';
import { getUsersByID, login } from '../../networking/auth.service';
import { AppStore } from '../../storage/storage';
import { StorageConstant } from '../../storage/constant';
import { useUser } from '../../Providers/UserServiceProvider';
import { getUserInfoById } from '../../networking/user.service';
import { decodeJWT } from '../../utils/jwtUtils';

const Login = () => {

  const formikRef = useRef<FormikProps<any> |null>(null);

  // Validation schema with Yup
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password should be at least 8 characters')
      .required('Password is required'),
  });
  
  const { setUser } = useUser();

  const { mutate, isLoading } = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      if (data) {
        try {
          AppStore.setSotageItem(StorageConstant.userToken, data);
          const userId = decodeJWT(data?.access_token)?.certserialnumber;
          if (userId) {
            const userInfoResponse = await getUserInfoById(userId);
            setUser(userInfoResponse.result);
          }
          const response = await getUsersByID({ userMatchId: data?.uniqueId });
          if (response?.isValid && response.result?.length) {
           return resetAndNavigate('/home');
          }
          return resetAndNavigate('/match')
        } catch (error) {
          AppStore.setSotageItem(StorageConstant.userToken, data);
         return resetAndNavigate('/match') 
        }
      }
    },
  });

  const handleSubmitForm = (values: { email: string, password: string }) => {
    const payload = {
      userName: values.email,
      ...values,
    }
    mutate(payload);
  };

  const handleForgetPassword = () => {
    const email = formikRef.current?.values?.email;
    navigate('/forget-password', {
      action: 'forget-password',
      email: email
    })
  };

  return (
    <Wrapper header>
      <View className="px-8 mt-[35%]">
        <View className='items-center'>
          <NText variant="h1" fontFamily="Medium">
            Login
          </NText>
          <View className='mt-2' />
          <NText variant="h4" classname='text-medium50'>
            Please enter your login details below
          </NText>
        </View>

        <View className="h-8" />

        {/* Formik Form */}
        <Formik
          innerRef={formikRef}
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmitForm}
        >
          {({ values, handleChange, handleBlur, handleSubmit, touched, errors }) => (
            <View>
              <NInput
                rounded
                label="Email"
                placeholder='eg: example@example.com'
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                required
                error={touched.email && errors.email}
              />
              <NInput
                label="Password"
                secureTextEntry
                placeholder='Enter your password'
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                required
                error={touched.password && errors.password}
              />

              <View className='self-start'>
                <NText variant='h6' onPress={handleForgetPassword} classname='text-dark90 underline'>
                  Forgot Password?
                </NText>
              </View>

              <View className="h-7" />
              
              <NPressable
                loading={isLoading}
                title="Login"
                onPress={handleSubmit}
                disabled={!!errors.email || !!errors.password || values.email === ''}
              />
            </View>
          )}
        </Formik>
      </View>
    </Wrapper>
  );
};

export default Login;
