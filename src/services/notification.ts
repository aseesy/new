import notifee, { AndroidImportance, AuthorizationStatus, Notification } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { AppStore } from '../storage/storage';
import { StorageConstant } from '../storage/constant';
import { Platform } from 'react-native';
import { isIos } from '../utils';

export async function requestUserPermission() {
    if (Platform.OS === 'android' && !messaging().isDeviceRegisteredForRemoteMessages) await messaging().registerDeviceForRemoteMessages();

    if (Platform.OS === 'android' && Platform.Version >= 33 || Platform.OS === 'ios') {
      const settings = await notifee.requestPermission();
      if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
        console.log('Permission settings:', settings);
        getDeviceToken();
      } else {
        console.log('User declined permissions');
      }
    } else {
      getDeviceToken();
    }
  
}

export async function subscribeToTopic(){
  try {
    await messaging().subscribeToTopic('all_users');
    console.log('Subscribed to default channel');
  } catch (error) {
    console.log('Error subscribing to channel:', error);
  }
}

export async function unSubscribeToTopic(){
  try {
    await messaging().unsubscribeFromTopic('all_users');
    console.log('Unsubscribed from default channel');
  } catch (error) {
    console.log('Error unsubscribing from channel:', error);
  }
}

export async function createNotificationChannel(){
  if (isIos) return;
  try {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      vibrationPattern: [2, 250, 250, 250],
      sound: 'default',
    });
  } catch (error) {
    console.error('Error creating channel:', error);
  }
}

export async function displayNotification(notification: Notification){
  const data: Notification = {
    ...notification,
    android: {
      channelId: 'default',
      ...notification.android,
    },
  };

  try {
    await notifee.displayNotification(data);
  } catch (error) {
    console.error('Error displaying notification:', error);
  }
}

export async function getDeviceToken(){
  try {
    const token = AppStore.getSotageItem(StorageConstant.fcmToken);
    console.log('Device token:', token);
    if (AppStore.getSotageItem(StorageConstant.fcmToken)) return token;
    const fcmToken = await messaging().getToken();
    AppStore.setSotageItem(StorageConstant.fcmToken, fcmToken);
    return fcmToken;
  } catch (error) {
    console.log('Error getting FCM Token:', error);
  }
}
