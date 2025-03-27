import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import Wrapper from '../../components/common/Wrapper';
import NText from '../../components/ui/NText';
import { OtpInput } from 'react-native-otp-entry';
import { resetAndNavigate } from '../../utils/navigationUtils';
import { useMutation } from 'react-query';
import { matchUserByID, register } from '../../networking/auth.service';
import useAlert from '../../hooks/useAlreat';
import { AppStore } from '../../storage/storage';
import { ILoginResponse, IMatchIdPayload } from '../../models/common';
import { StorageConstant } from '../../storage/constant';
import NLoader from '../../components/ui/NLoader';

const MatchId = () => {
  const alert = useAlert();

  const otpInputRef = useRef<any>(null); // Ref for OTP input
  const [containerStyle, setContainerStyle] = useState({});

  const userObj = AppStore.getSotageItem<ILoginResponse>(StorageConstant.userToken);
  const uniqueMatchID = userObj?.uniqueId

  const { mutate, isLoading } = useMutation({
      mutationFn: matchUserByID,
      onSuccess: (data) => {
        alert(data?.message as any, {
          buttons: [{
            text: 'OK',
            onPress: () => resetAndNavigate('/home'),
          }],
        });
      }
    });

  const handleOtp = (text: string) => {
   const payload: IMatchIdPayload = {
    userMatchId: uniqueMatchID ?? '',
    connectionMatchID: text?.toUpperCase(),
   }
   mutate(payload)
  };

  return (
    <Wrapper header>
      <View className="px-8 mt-[35%]">
        <NText variant="h1" fontFamily="Medium" classname="text-center">
          Enter your co-partner match&nbsp;ID
        </NText>

        <View className="h-4" />

        <NText variant='h4' classname="text-center text-dark90">
          Enter the 6-digit characters you have received from your co-partner.
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
          type="alphanumeric"
          secureTextEntry={false}
          focusStickBlinkingDuration={500}
          onFilled={handleOtp}
          textInputProps={{
            accessibilityLabel: 'Match ID',
          }}
          theme={{
            pinCodeContainerStyle: { ...containerStyle },
            pinCodeTextStyle: {
              textTransform: 'uppercase',
            }
          }}
        />
      </View>
      <NLoader isLoading={isLoading} />
    </Wrapper>
  );
};

export default MatchId;
