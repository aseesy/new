import { View, FlatList, TouchableOpacity, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import Wrapper from '../../../components/common/Wrapper';
import { useQuery } from 'react-query';
import { dateFromNow, getFromAppStorage, getFromLoggedInUser } from '../../../utils';
import { getMyConnections, getUsersByID } from '../../../networking/auth.service';
import NLoader from '../../../components/ui/NLoader';
import { IRecentResponse } from '../../../models/common';
import NText from '../../../components/ui/NText';
import NoActivityMessage from '../../../components/messages/NoActivityMessage';
import Icon from '@react-native-vector-icons/fontawesome6';
import { Metrics } from '../../../utils/metrics';
import { AppColor } from '../../../constants/theme';
import { navigate } from '../../../utils/navigationUtils';
import { useWS } from '../../../Providers/SocketProvider';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import Avatar from '../../../components/common/Avatar';
import { BLOB_PATH } from '../../../constants/config';

const Messages = () => {
  const userId = getFromLoggedInUser('certserialnumber') ?? {};
  const { uniqueId } = getFromAppStorage() ?? {};
  
  const { onMessage, getStatus } = useWS();

  const isFocused = useIsFocused(); // Hook to detect if the screen is active
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['getMyConnections', userId],
    queryFn: ({ queryKey }) => getMyConnections(+queryKey[1]),
    select: (data) => data.result,
    refetchInterval: getStatus() !== 'OPEN' ? 7000 : 7000,
    enabled: !!userId,
  });

  const { data: users } = useQuery({
    queryKey: ['getUsersByID', uniqueId],
    queryFn: ({ queryKey }) => getUsersByID({ userMatchId: queryKey[1] ?? '' }),
    select: (data) => data.result,
    enabled: !!uniqueId && isFocused,
  });
  

  const [messages, setMessages] = useState<IRecentResponse[]>(data ?? []);
  const [newMessages, setNewMessages] = useState<Record<number, number>>({});
  const [activeChatUserId, setActiveChatUserId] = useState<number | null>(null);

  const userInfo = (id: number) => {
    return users?.find(user => Number(user?.userId) === Number(id));
  };

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  useEffect(() => {
    const unsubscribe = onMessage((newMessage: { ReceiverId: number, SenderId: number, Message: string }) => {
      if (newMessage.SenderId == 0) return;
      setMessages(prevMessages => {
        const newMessageWithTimestamp = {
          receiverId: newMessage?.ReceiverId,
          senderId: newMessage?.SenderId,
          content: newMessage?.Message,
          timeStamp: moment().toISOString(),
        };

        const messageIndex = prevMessages.findIndex(msg =>
          (msg.receiverId == newMessageWithTimestamp.receiverId && msg.senderId == newMessageWithTimestamp.senderId) ||
          (msg.senderId == newMessageWithTimestamp.receiverId && msg.receiverId == newMessageWithTimestamp.senderId)
        );

        const updatedMessages = [...prevMessages];
        if (messageIndex !== -1) {
          updatedMessages[messageIndex] = newMessageWithTimestamp;
        } else {
          updatedMessages.unshift(newMessageWithTimestamp);
        }

        const targetId =
          newMessage.SenderId == userId ? newMessage.ReceiverId : newMessage.SenderId;

        if (activeChatUserId !== targetId) {
          setNewMessages(prevNewMessages => ({
            ...prevNewMessages,
            [targetId]: (prevNewMessages[Number(targetId)] || 0) + 1,
          }));
        }

        return updatedMessages;
      });
    });

    return () => {
      unsubscribe();
    };
  }, [onMessage, activeChatUserId]);

  // Reset activeChatUserId and refetch messages when the screen is focused
  useEffect(() => {
    if (isFocused) {
      setActiveChatUserId(null); // Reset active user
      refetch(); // Refresh messages
    }
  }, [isFocused, refetch]);

  const handleNavigateToChat = (user: any) => {
    setActiveChatUserId(user.userId); // Set active user
    navigate('/messages/chat', { user });

    // Clear the newMessages count for the active user
    setNewMessages(prevNewMessages => {
      const updatedMessages = { ...prevNewMessages };
      delete updatedMessages[user.userId];
      return updatedMessages;
    });
  };

  const renderList = ({ item, index }: { item: IRecentResponse; index: number }) => {
    const targetUserId = item.receiverId != userId ? item.receiverId : item.senderId;
    const user = userInfo(targetUserId) || {
      userId: targetUserId,
      email: '',
      firstName: 'Unknown',
      lastName: '',
      phoneNumber: '',
    };

    return (
      <Pressable
        onPress={() => handleNavigateToChat(user)}
        className={`${
          (messages.length ?? 0) - 1 === index ? 'border-0' : 'border-b'
        } border-b-light50 p-4 px-4`}>
          <View className='flex-row'>
            <Avatar source={`${BLOB_PATH}${user?.userId}.jpeg`} name={`${user?.firstName} ${user?.lastName ?? ''}`} />
            <View className='ml-2 flex-1'>
              <View className="flex-row justify-between items-center">
                <View>
                  <NText variant="h4">
                    {`${user?.firstName} ${user?.lastName ?? ''}`}
                  </NText>
                </View>
                <View>
                  <NText variant="h6" classname="text-light20">
                    {dateFromNow(item.timeStamp)}
                  </NText>
                </View>
              </View>
              <View className="flex-row justify-between items-center">
              <View className='flex-1'>
                <NText variant="h6" numberOfLines={1} classname="text-medium50">
                  {`${item.content}`}
                </NText>
              </View>
              {newMessages[targetUserId] > 0 && (
                <View className="bg-primary rounded-full w-5 h-5 items-center justify-center ml-2">
                  <NText style={{ fontSize: 10, lineHeight: 11 }} classname="text-light text-center p-1">
                    {newMessages[targetUserId]}
                  </NText>
                </View>
              )}
              </View>
            </View>
          </View>
      </Pressable>
    );
  };

  return (
    <>
      <Wrapper noSafeArea onRefresh={refetch} isRefreshLoading={isLoading}>
        <FlatList
          data={messages}
          keyExtractor={(_, index) => index?.toString()}
          renderItem={renderList}
          ListEmptyComponent={() => <NoActivityMessage />}
        />
        <NLoader isLoading={isLoading} />
      </Wrapper>
      <View className="absolute right-0 bottom-10">
        <TouchableOpacity
          onPress={() => navigate('/messages/newChat')}
          className="bg-primary rounded-l-full p-3 pr-6">
          <Icon
            name="plus"
            size={Metrics.icon.lg}
            color={AppColor.light}
            iconStyle="solid"
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Messages;
