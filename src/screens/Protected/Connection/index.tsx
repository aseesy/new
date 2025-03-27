import { View, Text, FlatList, TouchableOpacity, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import Wrapper from '../../../components/common/Wrapper'
import { useQuery } from 'react-query'
import { getFromAppStorage } from '../../../utils'
import { getUsersByID } from '../../../networking/auth.service'
import NLoader from '../../../components/ui/NLoader'
import { IMatchUsersResponse } from '../../../models/common'
import NText from '../../../components/ui/NText'
import Icon from '@react-native-vector-icons/fontawesome6'
import { Metrics } from '../../../utils/metrics'
import { AppColor } from '../../../constants/theme'
import NoConnectionMessage from '../../../components/messages/NoConnectionMessage'
import { navigate } from '../../../utils/navigationUtils'

const Connection = () => {

  const { uniqueId } = getFromAppStorage() ?? {};

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['getUsersByID', uniqueId],
    queryFn: ({ queryKey }) => getUsersByID({userMatchId: queryKey[1] ?? ''}),
    select: (data) => data.result,
    enabled: !!uniqueId,
  });

  const handleNavigateToChat = (user: any) => {
      navigate('/messages/chat', { user });
    };

  const renderList = ({ item, index }: {item: IMatchUsersResponse, index: number}) => (
    <Pressable onPress={() => handleNavigateToChat(item)} className={`${(data?.length ?? 0) - 1 === index ? 'border-0' : 'border-b'} border-b-light50 p-4 px-8`}>
      <View>
        <NText variant='h4'>
          {`${item.firstName} ${item.lastName}`}
        </NText>
      </View>
      <View>
        <NText variant='h5' numberOfLines={1} classname='text-medium50' >
          {`${item.email}`}
        </NText>
      </View>
    </Pressable>
  );

  return (
    <>
    <Wrapper noSafeArea onRefresh={refetch} isRefreshLoading={isRefetching}>
      <FlatList
        data={data ?? []}
        keyExtractor={(item)=> item.email}
        renderItem={renderList}
        ListEmptyComponent={() => <NoConnectionMessage />}
      />
      <NLoader isLoading={isLoading} />
    </Wrapper>
    <View className='absolute right-0 bottom-10'>
        <TouchableOpacity onPress={() => navigate('/match')} className='bg-secondary rounded-l-full p-3 pr-6'>
          <Icon
            name='plus'
            size={Metrics.icon.lg}
            color={AppColor.light}
            iconStyle='solid'
          />
        </TouchableOpacity>
    </View>
    </>
  )
}

export default Connection