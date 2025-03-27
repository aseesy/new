import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Wrapper from '../../components/common/Wrapper';
import NText from '../../components/ui/NText';
import NInput from '../../components/ui/NInput';
import NPressable from '../../components/ui/NPressable';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { push, resetAndNavigate } from '../../utils/navigationUtils';
import { useMutation } from 'react-query';
import { register } from '../../networking/auth.service';
import useAlert from '../../hooks/useAlreat';
import { useRoute } from '@react-navigation/native';
import { IRegisterPayload } from '../../models/common';
import DeviceCountry, { TYPE_TELEPHONY } from 'react-native-device-country';
import PhoneInput, { ICountry } from 'react-native-international-phone-number';
import { isAndroid } from '../../utils';
import { ICountryCca2 } from 'react-native-international-phone-number/lib/interfaces/countryCca2';

const RegisterPhone = () => {

  const { params } = useRoute();
      const { payload = '' } = (params || {}) as {
        payload?: IRegisterPayload;
      };

  const [countryCode, setCountryCode] = useState<ICountry>();
  const [defaultCountryCode, setDefaultCode] = useState<ICountryCca2>("US");

  const alert = useAlert();

  useEffect(() => {
    DeviceCountry.getCountryCode(isAndroid ? TYPE_TELEPHONY : undefined)
    .then((result) => {
      console.log('result', result);
      if (result.code) {
        setDefaultCode(result.code as ICountryCca2);
      }
    })
    .catch((e) => {
      console.log(e);
    });
  }, []);

  // Validation schema with Yup
  const validationSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .required('Phone number is required'),
  });

  const handleSubmitForm = (values: { phoneNumber:  string }) => {
    push('/otpVerification', {
      verificationCode: '123123',
      phoneNumber: `${countryCode?.callingCode}-${values.phoneNumber}`,
      payload: payload
    });
  }

  const { mutate, isLoading } = useMutation({
    mutationFn: register,
    onSuccess: () => {
      alert('Registration successful!', {
        buttons: [{
          text: 'Login Now',
          onPress: () => resetAndNavigate('/welcome'),
        }]
      })
    }
  });

  const handleRegistration = () => {
    if (payload) {
     return mutate({...payload, roleId: 1, phoneNumber: ''});
    }
    return alert('Something went wrong, please try again');
  }

  return (
    <Wrapper header>
      <View className="px-8 mt-[35%]">
        <NText variant="h1" fontFamily="Medium" classname="text-center">
          Keep your account secure
        </NText>

        <View className="h-4" />

        <NText variant='h5' classname="text-center">
          Add security by setting up multi-factor authentication.
        </NText>

        <View className="h-4" />

        {/* Formik Form */}
        <Formik
          initialValues={{ phoneNumber: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmitForm}
        >
          {({ values, handleChange, handleBlur, handleSubmit, touched, errors }) => (
            <View>
              {/* <NInput
                label="Phone"
                autoFocus
                maxLength={10}
                keyboardType='number-pad'
                value={values.phoneNumber}
                onChangeText={handleChange('phoneNumber')}
                onBlur={handleBlur('phoneNumber')}
                required
                error={touched.phoneNumber && errors.phoneNumber}
              /> */}
              <View className='mt-2' />
              <PhoneInput
                  defaultCountry={defaultCountryCode}
                  placeholder='Phone Number'
                  value={values.phoneNumber}
                  onChangeText={handleChange('phoneNumber')}
                  onChangePhoneNumber={() => {}}
                  selectedCountry={countryCode}
                  onChangeSelectedCountry={setCountryCode}
                />
              <View className='mt-2' />
              <NText variant='h6' classname='text-medium50' >We'll send a 6-digit code to your phone via text message.</NText>
              <View className='h-12' />
              <NPressable
                title="Submit"
                onPress={handleSubmit}
                disabled={isLoading || !!errors.phoneNumber || !values.phoneNumber}
              />
              <View className='h-2' />
              <NPressable
                loading={isLoading}
                title="Skip for now"
                variant='outline'
                borderColor='dark90'
                textColor='dark90'
                onPress={handleRegistration}
              />
            </View>
          )}
        </Formik>
      </View>
    </Wrapper>
  );
};

export default RegisterPhone;
