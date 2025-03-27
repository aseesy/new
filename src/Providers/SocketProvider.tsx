import React, { createContext, useEffect, useRef, useContext, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { AppStore } from '../storage/storage';
import { ILoginResponse } from '../models/common';
import { StorageConstant } from '../storage/constant';
import { getFromLoggedInUser } from '../utils';
import SoundPlayer from 'react-native-sound-player';

// Define the types for the socket service
interface SocketService {
  send: (data: any) => void;
  onMessage: (cb: (data: any) => void) => () => void;
  onError: (cb: (error: any) => void) => () => void;
  onClose: (cb: () => void) => () => void;
  close: () => void;
  getStatus: () => WebSocketState;
  retryConnect: () => void;
}

type WebSocketState = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED';

const WSContext = createContext<SocketService | undefined>(undefined);

export const WSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const messageQueue = useRef<any[]>([]);
  const socket = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<WebSocketState>('CLOSED');
  const reconnectAttempts = useRef(0);
  const reconnectInterval = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const maxReconnectAttempts = 5;

  const connect = () => {
    const userObj = AppStore.getSotageItem<ILoginResponse>(StorageConstant.userToken);
    const myId = getFromLoggedInUser('certserialnumber');
    if (status === 'OPEN' && socket.current!== null) {
      closeSocket();
    }
    if (!userObj?.access_token || !myId) return;

    socket.current = new WebSocket(`wss://liaizenapi.azurewebsites.net/api/chat/connectNew?userId=${myId}`, '', {
      headers: {
        'Authorization': `Bearer ${userObj?.access_token}`,
      }
    });
    setStatus('CONNECTING');

    socket.current.onopen = () => {
      console.log('WebSocket connected');
      setStatus('OPEN');
      reconnectAttempts.current = 0; // Reset reconnection attempts
      if (reconnectInterval.current) {
        clearTimeout(reconnectInterval.current);
      }
    };

    socket.current.onclose = () => {
      console.log('WebSocket disconnected');
      setStatus('CLOSED');
      attemptReconnect();
    };

    socket.current.onerror = (error) => {
      console.log('WebSocket error:', error);
      setStatus('CLOSED');
      attemptReconnect();
    };

    socket.current.onmessage = (event) => {
      SoundPlayer.playSoundFile('ding', 'mp3');
      console.log('Received message:', event.data);
    };
  };

  const attemptReconnect = () => {
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      console.log('Max reconnection attempts reached. Giving up.');
      return;
    }
  
    reconnectAttempts.current += 1;
  
    const baseDelay = 2000; // Base delay in milliseconds (2 seconds)
    const delay = Math.min(reconnectAttempts.current * baseDelay, 30000); // Cap at 30 seconds
  
    console.log(
      `Attempting to reconnect... (Attempt ${reconnectAttempts.current}/${maxReconnectAttempts}) in ${delay / 1000}s`
    );
  
    reconnectInterval.current = setTimeout(() => {
      connect();
    }, delay);
  };

  const closeSocket = () => {
    if (socket.current) {
      socket.current.close();
      socket.current = null;
    }
    if (reconnectInterval.current) {
      clearTimeout(reconnectInterval.current);
    }
    setStatus('CLOSED');
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground');
        connect();
      } else if (nextAppState.match(/inactive|background/)) {
        console.log('App has gone to the background');
        closeSocket();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
      closeSocket();
    };
  }, []);

  useEffect(() => {
    const userObj = AppStore.getSotageItem<ILoginResponse>(StorageConstant.userToken);
    if (userObj?.access_token) {
      connect();
    }

    return closeSocket;
  }, []);

  const send = (data: any) => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      try {
        socket.current.send(JSON.stringify(data));
        console.log('Message sent:', data);
      } catch (error) {
        console.error('Failed to send message. Queuing message:', data);
        messageQueue.current.push(data); // Queue the message if sending fails
      }
    } else {
      console.warn('WebSocket is not open. Queuing message:', data);
      messageQueue.current.push(data); // Queue the message if WebSocket is not open
      reconnectAndSend(); // Attempt to reconnect and send
    }
  };

  const reconnectAndSend = () => {
    if (status !== 'OPEN') {
      console.log('Reconnecting WebSocket to send queued messages...');
      connect(); // Reconnect WebSocket
    }
  
    // Listen for WebSocket open event to flush the queue
    const flushQueue = () => {
      if (socket.current?.readyState === WebSocket.OPEN && messageQueue.current.length > 0) {
        console.log('WebSocket connected. Sending queued messages...');
        while (messageQueue.current.length > 0) {
          const message = messageQueue.current.shift();
          socket.current?.send(JSON.stringify(message));
          console.log('Queued message sent:', message);
        }
      }
  
      // Remove this listener after the queue is flushed
      if (socket.current) {
        socket.current.removeEventListener('open', flushQueue);
      }
    };
  
    if (socket.current) {
      socket.current.addEventListener('open', flushQueue); // Listen for open event
    }
  };
  

  const onMessage = (cb: (data: any) => void): () => void => {
    const handleMessage = (event: WebSocketMessageEvent) => {
      cb(JSON.parse(event.data));
    };
    if (socket.current) {
      socket.current.addEventListener('message', handleMessage);
      return () => socket.current?.removeEventListener('message', handleMessage);
    }
    return () => {};
  };

  const onError = (cb: (error: any) => void): () => void => {
    const handleError = (event: Event) => cb(event);
    if (socket.current) {
      socket.current.addEventListener('error', handleError);
      return () => socket.current?.removeEventListener('error', handleError);
    }
    return () => {};
  };

  const onClose = (cb: () => void): () => void => {
    const handleClose = () => cb();
    if (socket.current) {
      socket.current.addEventListener('close', handleClose);
      return () => socket.current?.removeEventListener('close', handleClose);
    }
    return () => {};
  };

  const getStatus = () => status;

  const retryConnect = () => {
    if (reconnectAttempts.current >= (maxReconnectAttempts * 2)) {
      console.log('Max reconnection attempts reached. Cannot retry manually.');
      return;
    }
  
    if (status === 'CONNECTING' || status === 'OPEN') {
      return;
    }
  
    console.log('Manually attempting to reconnect...');
    reconnectAttempts.current += 1;
    connect();
  };
  

  const socketService: SocketService = {
    send,
    onMessage,
    onError,
    onClose,
    close: closeSocket,
    getStatus,
    retryConnect,
  };

  return <WSContext.Provider value={socketService}>{children}</WSContext.Provider>;
};

export const useWS = (): SocketService => {
  const context = useContext(WSContext);
  if (!context) {
    throw new Error('useWS must be used within a WSProvider');
  }
  return context;
};
