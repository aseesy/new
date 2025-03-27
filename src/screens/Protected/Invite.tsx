import { View, Share, TouchableOpacity } from 'react-native';
import React from 'react';
import Wrapper from '../../components/common/Wrapper';
import NText from '../../components/ui/NText';
import NPressable from '../../components/ui/NPressable';
import { AppStore } from '../../storage/storage';
import { StorageConstant } from '../../storage/constant';
import { ILoginResponse } from '../../models/common';

const Invite = () => {
  const userObj = AppStore.getSotageItem<ILoginResponse>(StorageConstant.userToken);
  const uniqueMatchID = userObj?.uniqueId

  const handleShare = () => {
    Share.share(
      {
        message: `Hi! I would like to invite you to join me on LiaiZen. Use my unique Match ID "${uniqueMatchID}" to connect with me. 
You can download the app here: https://example.com`,
        title: 'Invite your co-parent to LiaiZen',
      },
      {
        dialogTitle: 'Share via LiaiZen',
        subject: 'Invite your co-parent to connect',
        tintColor: '#000000', // iOS
      }
    ).catch((error) => console.error('Error sharing:', error));
  };

  return (
    <Wrapper header >
      <View className="px-8 mt-[35%]">
        <NText variant="h1" fontFamily="Medium" classname="text-center">
          Invite your co-parent
        </NText>

        <View className="h-4" />

        <NText variant='h5' classname="text-center">
          Share manually by copying the code, or share the code with your co-parent using the action below.
        </NText>

        <View className="h-4" />

        <NText variant='h4' classname="text-center">Your unique Match ID</NText>
        <View className="border border-gold p-2 rounded-md mt-4">
          <NText
            classname="text-center text-primary"
            variant="h2"
            fontFamily="Bold"
          >
            {uniqueMatchID}
          </NText>
        </View>

        <View className="h-8" />

        <NPressable icon={'share'} onPress={handleShare} title='Share with my co-parent' />
      </View>
    </Wrapper>
  );
};

export default Invite;
