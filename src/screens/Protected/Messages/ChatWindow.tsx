import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { Bubble, BubbleProps, Composer, GiftedChat, IMessage, Send, SystemMessage, SystemMessageProps } from 'react-native-gifted-chat';
import moment from 'moment';
import { AppColor } from '../../../constants/theme';
import { getFromLoggedInUser, openExternalLink } from '../../../utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useInfiniteQuery } from 'react-query';
import { useWS } from '../../../Providers/SocketProvider';
import { getChats } from '../../../networking/auth.service';
import { IMatchUsersResponse, IMessageResponse } from '../../../models/common';
import Icon from '@react-native-vector-icons/fontawesome6';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import NText from '../../../components/ui/NText';
import { View } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

const mapMessages = (messagesA: IMessageResponse[] = [], user: IMatchUsersResponse) => {
  const myId = getFromLoggedInUser('certserialnumber') ?? {};
 if (!messagesA) return undefined;
  return messagesA?.map((message, index) => {
    if (message.senderId == 0) {
      return ({
        _id: message.timeStamp + index,
        text: message.message,
        system: true,
        createdAt: moment.utc(message.timeStamp).local().toDate(),
      })
    }
    return ({
      _id: message.timeStamp + index,
      text: message.message,
      createdAt: moment.utc(message.timeStamp).local().toDate(),
      user: {
        _id: message.senderId,
        name: message.senderId !== myId ? user.firstName : 'You',
      },
    })
  });
};

const ChatWindow = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { user } = (params || {}) as { user: IMatchUsersResponse };

  const myId = getFromLoggedInUser('certserialnumber') ?? {};

  const { onMessage, send } = useWS();
  const [messages, setMessages] = useState<IMessage[]>([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${user?.firstName} ${user?.lastName}`,
    });
  }, [navigation, user]);

  const { refetch, fetchNextPage, isFetching, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['userchat', user?.userId, myId],
    queryFn: getChats,
    // refetchInterval: getStatus() !== 'OPEN' ? 7000 : false,
    
    // Calculate the next page based on the number of loaded results
    getNextPageParam: (lastPage, pages) => {
      const totalResults = lastPage.result.total; // Total number of results from the API
      const messagesLoaded = pages.flatMap((page) => page.result.result).length; // Number of messages already loaded
      
      // If the number of loaded messages is less than the total results, continue fetching
      if (messagesLoaded < totalResults) {
        return messagesLoaded / 100; // Divide by page size (50 messages per page) to determine the "page" to fetch next
      }
      return undefined; // If all messages are loaded, return undefined to stop fetching
    },
  
    // Flatten the result arrays from each page
    select: (data) => data.pages?.map((p) => p.result.result).flat(),
  
    // After data is fetched, update the messages state
    onSettled: (data) => {
      // @ts-ignore
      setMessages(mapMessages(data, user));
    },
  });
  

  const onSend = useCallback((messages = []) => {
    send({
      Message: messages[0]?.text ?? '',
      ReceiverId: user.userId,
      SenderId: parseInt(`${myId}`),
    });
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  useEffect(() => {
    const unsubscribe = onMessage((newMessage: { ReceiverId: number; SenderId: number; Message: string }) => {
      const newMessageWithTimestamp = {
        receiverId: newMessage?.ReceiverId,
        senderId: newMessage?.SenderId,
        message: newMessage?.Message,
        timeStamp: moment().toISOString(),
      };
      const arr = mapMessages([newMessageWithTimestamp], user);

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, arr)
      );
    });

    return () => {
      unsubscribe();
    };
  }, [onMessage, refetch]);

  const renderSend = (props) => (
      <Send
          {...props}
          disabled={!props.text}
          containerStyle={{
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 4,
          }}
        >
          <Icon name="paper-plane" size={24} color={AppColor.primary} />
      </Send>
  );

  const renderBubble = (props: BubbleProps<IMessage>) => {
    const { nextMessage } = props;
    const color = nextMessage?.user?._id == 0 ? AppColor.magenta : AppColor.secondary;
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: color,
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
            fontFamily: 'roboto-Medium',
          },
        }}
      />
    );
  };

  const parsePatterns = useCallback(() => {
    return [
      {
        pattern: /#(\w+)/, // Regex to match hashtags like #example
        style: { textDecorationLine: 'underline', color: AppColor.light },
        onPress: (url: string) => openExternalLink(url), // Action on press
      },
    ];
  }, []);

  const handleLongPress = useCallback((context: unknown, currentMessage: object) => {
    if (!currentMessage?.text)
      return

    const options = [
      'Copy text',
      'Cancel',
    ]

    const cancelButtonIndex = options.length - 1

    ;(context as any).actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex: number) => {
        switch (buttonIndex) {
          case 0:
            Clipboard.setString(currentMessage?.text)
            break
          default:
            break
        }
      }
    )
  }, [])

  const renderSystemMessage = useCallback((props: SystemMessageProps<IMessage>) => {
    const { currentMessage } = props;
    const texts = currentMessage?.text?.split(',') ?? [''];
    return (
      <View className='flex-1 mt-[-8] mb-2 px-3 bg-magenta/80 rounded-2xl mr-2.5 p-2 ml-12 rounded-br-none'>
          {texts.map(text => (
            <View key={text} className='my-0.5' >
              <NText classname='text-light' fontFamily='Regular' variant='h6' >
                {text}
              </NText>
            </View>
            ))}
      </View>
    )
  }, [])


  return (
    <SafeAreaProvider style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        {isLoading ? <View /> : 
        <GiftedChat
          messages={messages}
          // alwaysShowSend
          parsePatterns={parsePatterns}
          renderAvatar={null}
          onLongPress={handleLongPress}
          infiniteScroll
          loadEarlier={hasNextPage}
          onLoadEarlier={fetchNextPage}
          isLoadingEarlier={isFetching}
          renderSystemMessage={renderSystemMessage}
          messagesContainerStyle={{
            backgroundColor: AppColor.light,
            paddingHorizontal: 5,
            overflow: 'hidden',
          }}
          onSend={(messages: any) => onSend(messages)}
          user={{
            _id: parseInt(myId),
          }}
          renderSend={renderSend}
          renderBubble={renderBubble}
        />
        }
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ChatWindow;
