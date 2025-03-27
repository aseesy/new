import { View, Text, FlatList } from 'react-native';
import React from 'react';
import Wrapper from '../../components/common/Wrapper';
import NText from '../../components/ui/NText';
import Card from '../../components/common/Card';
import { push, resetAndNavigate } from '../../utils/navigationUtils';
import NPressable from '../../components/ui/NPressable';
import { getFromAppStorage, globalLogout } from '../../utils';
import { useQuery } from 'react-query';
import { getUsersByID } from '../../networking/auth.service';
import NLoader from '../../components/ui/NLoader';

const Data = [
  {
    id: 1,
    title: 'I have a Match ID from my co-parent',
    description:
      "The Match ID is a 6-character code provided to you by your co-parent. We'll use it to match your accounts.",
    icon: 'qrcode',
  },
  {
    id: 2,
    title: "Search for my co-parent's account",
    description: 'We can try to match your account with their email address.',
    icon: 'magnifying-glass',
  },
  {
    id: 3,
    title: 'Invite my co-parent',
    description: 'Select a way to invite your co-parent',
    icon: 'person-circle-plus',
  },
];

const Match = () => {

    const handlePress = (id: number) => {
      if (id === 3) push('/invite');
      if (id === 1) push('/matchId');
      if (id === 2) push('/home');
    };


  return (
    <Wrapper header>
      <View className="flex-1 px-6 mt-[35%]">
        {/* Main Content */}
        <NText variant="h3" fontFamily="Medium" classname="text-center">
          Hi, User
        </NText>

        <View className="h-4" />

        <NText variant='h5' classname="text-center">
          To start using LiaiZen, you need to match with your co-parent.
        </NText>

        <View className="h-6" />

        <FlatList
          data={Data}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => (
            <Card {...item} onPress={() => handlePress(item.id)} />
          )}
        />
      </View>

      {/* Footer with Signout Button */}
      <View className="p-8 flex-1">
        <NPressable variant='outline' borderColor='transparent' textColor='medium50' title="Signout" onPress={globalLogout} />
      </View>
    </Wrapper>
  );
};

export default Match;
