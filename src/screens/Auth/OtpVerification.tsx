import React, { useRef, useState } from 'react';
import { View, Alert } from 'react-native';
import Wrapper from '../../components/common/Wrapper';
import NText from '../../components/ui/NText';
import { OtpInput } from 'react-native-otp-entry';
import { useRoute } from '@react-navigation/native';
import { goBack, push, resetAndNavigate } from '../../utils/navigationUtils';
import { IRegisterPayload } from '../../models/common';
import { useMutation } from 'react-query';
import { register, sendOtpForResetPassword, sentOtp } from '../../networking/auth.service';
import useAlert from '../../hooks/useAlreat';
import NLoader from '../../components/ui/NLoader';
import ResendOTP from '../../components/common/ResendOTP';
import { VERIFICATION_TYPE } from '../../models/enums';

const OtpVerification = () => {
  const { params } = useRoute();
  const alert = useAlert();

  const { email, verificationCode, phoneNumber, payload, flow } = (params || {}) as {
    email?: string;
    flow?: string;
    verificationCode?: string;
    phoneNumber?: string;
    payload?: IRegisterPayload;
  };

  const otpInputRef = useRef<any>(null); // Ref for OTP input
  const [containerStyle, setContainerStyle] = useState({});
  const [otp, setOTP] = useState(verificationCode);

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

  const { mutate: sendRegisterOTP, isLoading: registerLoading } = useMutation({
      mutationFn: sentOtp,
      onSuccess: (data) => {
        if (data.isValid) {
          alert('OTP sent successfully')
          setOTP(`${data.result.verificationCode}`)
        } else {
          alert('Something went wrong, please try again later.', {
            buttons: [{
              text: 'Okay',
              onPress: goBack,
          }]})
        }
      },
      onError: (error) => console.log(error),
  });

  const { mutate: sendForgotOTP, isLoading: forgotLoading } = useMutation({
      mutationFn: sendOtpForResetPassword,
      onSuccess: (data) => {
        console.log(data)
        if (data.isValid) {
          alert('OTP sent successfully')
          setOTP(`${data.result.verificationCode}`)
        } else {
          alert('Something went wrong, please try again later.', {
            buttons: [{
              text: 'Okay',
              onPress: goBack,
          }]})
        }
      },
      onError: (error) => console.log(error),
    });

  const handleOtp = (text: string) => {
    if (`${otp}` === `${text}`) {
      if (flow === 'forget-password') {
        goBack();
        push('/set-new-password', { email });
        return;
      }
      if (phoneNumber && payload) {
        return mutate({...payload, phoneNumber, roleId: 1})
      }
      goBack();
      push(email ? '/registerForm' : '/welcome', { email });
    } else {
      setContainerStyle({ borderColor: 'red' });
      Alert.alert(
        'Invalid OTP',
        'The OTP you entered is incorrect. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => {
              setContainerStyle({});
              otpInputRef.current?.clear(); // Reset OTP input
              otpInputRef.current?.focus();
            },
          },
        ]
      );
    }
  };

  const handleResendOTP = () => {
    if (flow === 'forget-password') {
      sendForgotOTP({ email: email! })
      return;
    }
    sendRegisterOTP({
      name: 'User',
      value: email!,
      type: VERIFICATION_TYPE.EMAIL
    })
  }

  return (
    <Wrapper header>
      <View className="px-8 mt-[35%]">
        <NText variant="h1" fontFamily="Medium" classname="text-center">
          Enter your {email ? 'email' : 'phone'} verification code
        </NText>

        <View className="h-4" />

        <NText variant='h6' classname="text-center text-dark90">
          Enter the 6-digit code we have sent to {email ? email : phoneNumber ?? '(8888-999-0000)'}
        </NText>

        <View className="h-4" />

        <OtpInput
          ref={otpInputRef} // Attach ref to OTP input
          numberOfDigits={6}
          focusColor="green"
          autoFocus
          hideStick={true}
          blurOnFilled={true}
          disabled={isLoading || false}
          type="numeric"
          secureTextEntry={false}
          focusStickBlinkingDuration={500}
          // onTextChange={(text) => console.log(text)}
          onFilled={handleOtp}
          textInputProps={{
            accessibilityLabel: 'One-Time Password',
          }}
          theme={{
            pinCodeContainerStyle: { ...containerStyle },
          }}
        />
      </View>

      <ResendOTP onResend={handleResendOTP} />

      <NLoader isLoading={isLoading || registerLoading || forgotLoading} />
    </Wrapper>
  );
};

export default OtpVerification;
