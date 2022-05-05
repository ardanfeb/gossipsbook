/**
 * @format
 */
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  if (remoteMessage.data.type === 'message') {
    AsyncStorage.getItem('unreadMessagesUsers').then((unreadMessagesUsers) => {
      unreadMessagesUsers = unreadMessagesUsers
        ? JSON.parse(unreadMessagesUsers)
        : [];
      AsyncStorage.setItem(
        'unreadMessagesUsers',
        JSON.stringify([
          ...new Set([...unreadMessagesUsers, remoteMessage.data.username]),
        ]),
      );
    });
  }
});

AppRegistry.registerComponent(appName, () => App);
