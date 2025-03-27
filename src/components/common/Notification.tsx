import {View} from 'react-native';
import React, {useEffect} from 'react';
import messaging, { getToken } from '@react-native-firebase/messaging';
import {
  createNotificationChannel,
  displayNotification,
  getDeviceToken,
  requestUserPermission,
  subscribeToTopic,
} from '../../services/notification';
import { AppStore } from '../../storage/storage';
import { StorageConstant } from '../../storage/constant';

const Notification = () => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const data = {
        title: remoteMessage?.notification?.title,
        body: remoteMessage?.notification?.body,
      };
      if (
        remoteMessage?.notification?.title &&
        remoteMessage?.notification?.body
      )
        displayNotification(data);
    });

    requestUserPermission();
    createNotificationChannel();
    subscribeToTopic();

    return unsubscribe;
  }, []);

  useEffect(() => {
    messaging().onTokenRefresh(token => {
      console.log('Refreshed token:', token);
      AppStore.setSotageItem(StorageConstant.fcmToken, token);
      // Send your refreshed token to your server here
    })
  }, [])

  return <View />;
};

export default Notification;
