import { View, Text } from 'react-native'
import React, { useState } from 'react'
import Wrapper from '../../../components/common/Wrapper'
import NSelect from '../../../components/ui/NSelect'
import { useQuery, useQueryClient } from 'react-query'
import { getUsersByID } from '../../../networking/auth.service'
import { formatNumber, getFromAppStorage, getFromLoggedInUser } from '../../../utils'
import NInput from '../../../components/ui/NInput'
import NText from '../../../components/ui/NText'
import NPressable from '../../../components/ui/NPressable'
import { useWS } from '../../../Providers/SocketProvider'
import { goBack } from '../../../utils/navigationUtils'

const NewChat = () => {

  const { send } = useWS();
  const myId = getFromLoggedInUser('certserialnumber');
  const MAX_LENGTH = 1000;
  const { uniqueId } = getFromAppStorage() ?? {};
  const userId = getFromLoggedInUser('certserialnumber') ?? {};


  const client = useQueryClient();

  const { data } = useQuery({
      queryKey: ['getUsersByID', uniqueId],
      queryFn: ({ queryKey }) => getUsersByID({userMatchId: queryKey[1] ?? ''}),
      select: (data) => data.result.map(r => ({
        label: `${r.firstName} ${r.lastName}`,
        value: r.userId,
      })),
      enabled: !!uniqueId,
  });

  const [selectedUser, setSelectedUser] = useState<any>(undefined);
  const [message, setMessage] = useState<string>();

  const handleSend = () => {
    send({
      "Message": message,
      "ReceiverId": parseInt(selectedUser),
      "SenderId": parseInt(`${myId}`)
    })

    client.invalidateQueries({
      exact: true,
      queryKey: ['getMyConnections', userId],
    })
    
    goBack();
  };

  return (
    <Wrapper>
        <View className='flex-1 mx-4'>
          <NSelect placeholder='Select user' title='To' data={data ?? []} selectedValue={selectedUser} onChange={setSelectedUser} />

          <View className='mt-4' />

          <NInput inputStyle={{
            height: 120,
            textAlignVertical: 'top',
          }} label='Message' maxLength={MAX_LENGTH} placeholder='Type your message here' onChangeText={setMessage} value={message} multiline />

          <View className='mt-[-12]'>
            <NText variant='h8' classname='text-right text-dark90'>Max {formatNumber((MAX_LENGTH - (message?.length ?? 0)), 'Amount', 0)} Characters</NText>
          </View>

          <View className='mt-4' />

          <NPressable title='Send' disabled={!selectedUser || !message} onPress={handleSend} icon='arrow-right' iconPosition='right' />

        </View>
    </Wrapper>
  )
}

export default NewChat