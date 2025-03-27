import React, { useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import Wrapper from '../../../components/common/Wrapper';
import NText from '../../../components/ui/NText';
import NInput from '../../../components/ui/NInput';
import NPressable from '../../../components/ui/NPressable';
import { Formik, FormikProps, FormikValues } from 'formik';
import * as Yup from 'yup';
import { useUser } from '../../../Providers/UserServiceProvider';
import PhoneInput, { ICountry } from 'react-native-international-phone-number';
import { ICountryCca2 } from 'react-native-international-phone-number/lib/interfaces/countryCca2';
import { useMutation } from 'react-query';
import { updateUserProfile } from '../../../networking/user.service';
import { IUser, IUserUpdatePayload } from '../../../models/user';
import useAlert from '../../../hooks/useAlreat';
import { goBack } from '../../../utils/navigationUtils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('First Name is required'),
    lastName: Yup.string()
      .required('Last Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    phoneNumber: Yup.string(),
    addressLine1: Yup.string(),
    addressLine2: Yup.string(),
    state: Yup.string(),
    country: Yup.string(),
    pinCode: Yup.number(),
  });

const EditProfile = () => {

  const { user, setUser } = useUser();
  const alert = useAlert();

  const formikRef = useRef<FormikProps<IUserUpdatePayload> | null>(null);

  const [countryCode, setCountryCode] = useState<ICountry>();
  const [defaultCountryCode, setDefaultCode] = useState<ICountryCca2>("IN");

  // Validation schema with Yup
  
  const { mutate, isLoading } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data, variables) => {
      alert('Profile updated successfully!', {
        buttons: [{
          text: 'Okay',
          onPress: () => {
            goBack();
            goBack();
          },
        }]
      });
      const userInfo = {...user, ...variables} as IUser;
      setUser(userInfo);
    },
  });

  const initialValues: IUserUpdatePayload = useMemo(() => ({
    id: user?.userId,
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    phoneNumber: user?.phoneNumber ?? '',
    roleId: user?.roleId ?? 1,
    addressLine1: user?.addressLine1?? '',
    addressLine2: user?.addressLine2?? '',
    state: user?.state?? '',
    country: user?.country?? '',
    pinCode: user?.pinCode?? '',
  }), [user]);


  const handleSubmitForm = (values: IUserUpdatePayload) => {
    const payload: IUserUpdatePayload = {
      userName: values.email,
      ...values,
      phoneNumber: `${values.phoneNumber}`,
      ...(user?.password ? {password: user.password} :{}),
    }
    mutate(payload);
  };

  const handleCountryCodeChange = (countryCode: ICountry) => {
    setCountryCode(countryCode);
    formikRef.current?.setFieldValue('country', countryCode.name.en);
  };

  return (
    <>
    <Wrapper noSafeArea>
      <View className="px-6 my-4 pb-8">
        <NText variant="h1" fontFamily="Medium">
          Edit Your Details
        </NText>

        <View className="h-8" />

        {/* Formik Form */}
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmitForm}
          >
            {({ values, handleChange, handleBlur, handleSubmit, touched, errors }) => (
              <View>
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

                  <NText classname='mb-2' variant='h5'>Phone Number</NText>
                  <PhoneInput
                    defaultCountry={defaultCountryCode}
                    placeholder='Phone Number'
                    value={values.phoneNumber}
                    onChangePhoneNumber={() => {}}
                    onChangeText={handleChange('phoneNumber')}
                    selectedCountry={countryCode}
                    onChangeSelectedCountry={handleCountryCodeChange}
                  />

                  <View className='mt-4' />
                  <NInput
                    label="Address Line 1"
                    value={values.addressLine1}
                    placeholder='Eg: Building, Street'
                    onChangeText={handleChange('addressLine1')}
                    onBlur={handleBlur('addressLine')}
                    error={touched.addressLine1 && errors.addressLine1}
                  />
                  
                  <NInput
                    label="Address Line 2"
                    value={values.addressLine2}
                    placeholder='Eg: landmark, city, district'
                    onChangeText={handleChange('addressLine2')}
                    onBlur={handleBlur('addressLine2')}
                    error={touched.addressLine2 && errors.addressLine2}
                  />

                  <NInput
                    label="State"
                    value={values.state}
                    placeholder='Enter your state'
                    onChangeText={handleChange('state')}
                    onBlur={handleBlur('state')}
                    error={touched.state && errors.state}
                  />

                  <NInput
                    label={"Country"}
                    value={values.country}
                    placeholder='Enter your country name'
                    onChangeText={handleChange('country')}
                    onBlur={handleBlur('country')}
                    error={touched.country && errors.country}
                  />

                  <NInput
                    label="Pin/Zip Code"
                    keyboardType='number-pad'
                    value={values.pinCode}
                    maxLength={8}
                    placeholder='Enter your pincode'
                    onChangeText={handleChange('pinCode')}
                    onBlur={handleBlur('pinCode')}
                    required
                    error={touched.pinCode && errors.pinCode}
                  />
                  <View className="h-6" />
                </View>
            )}
          </Formik>
      </View>
    </Wrapper>
    <View className='absolute border-t border-t-light50 w-full bg-light bottom-0' style={{paddingBottom: useSafeAreaInsets().bottom}}>
      <View className='mt-2 mx-4'>
        <NPressable
          loading={isLoading}
          title="Register"
          onPress={formikRef.current?.handleSubmit as any}
          disabled={!formikRef.current?.values.firstName || Object.keys(formikRef.current?.errors ?? {}).length !== 0}
        />
      </View>
    </View>
    </>
  );
};

export default EditProfile;
