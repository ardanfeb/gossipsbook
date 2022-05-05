import 'react-native-gesture-handler';
import * as React from 'react';
import {
  SafeAreaView,
  BackHandler,
  LogBox,
  Alert,
  StatusBar,
  UIManager,
  Platform,
  View,
  Modal,
  ActivityIndicator,
  Text,
} from 'react-native';
import {
  goBack,
  navigate,
  navigationRef,
} from './src/navigation/NavigationContainer';
import { Navigation } from './src/navigation/AppNavigator';
import { MainContextProvider } from './src/context';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import Reactotron from 'reactotron-react-native';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import axios from 'axios';
import { UserContext, UserProvider } from './src/context/UserProvider';
import { colors } from './src/constants';
import PollProvider from './src/context/PollProvider';
import AppProvider, { AppContext } from './src/context/AppProvider';
import { DeviceEventEmitter } from 'react-native';
import { EVENTS } from './src/constants/config';

export const useUser = () => React.useContext(UserContext);

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

AsyncStorage.getItem('token').then((v) => console.log('token', v));
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appReady: false,
    };

    this.backHandler();
    this.requestUserPermission();
    LogBox.ignoreAllLogs();
    Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it from
      .configure() // controls connection & communication settings
      .useReactNative() // add all built-in react native plugins
      .connect();
  }

  async requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      messaging().onMessage(async (remoteMessage) => {
        if (navigationRef?.current?.getCurrentRoute()?.name !== 'Chat') {
          if (remoteMessage.data.type === 'message') {
            AsyncStorage.getItem('unreadMessagesUsers').then(
              (unreadMessagesUsers) => {
                unreadMessagesUsers = unreadMessagesUsers
                  ? JSON.parse(unreadMessagesUsers)
                  : [];
                AsyncStorage.setItem(
                  'unreadMessagesUsers',
                  JSON.stringify([
                    ...new Set([
                      ...unreadMessagesUsers,
                      remoteMessage.data.username,
                    ]),
                  ]),
                ).then(() => {
                  DeviceEventEmitter.emit(EVENTS.MESSAGE_RECEVIED_BACKGROUND);
                });
              },
            );
          }
          Alert.alert(
            remoteMessage.notification.title,
            remoteMessage.notification.body,
            [
              {
                text: 'READ',
                onPress: async () => {
                  const access_token = await AsyncStorage.getItem('token');
                  if (remoteMessage.data.type === 'message') {
                    navigate('Chat', {
                      username: remoteMessage.data.username,
                      access_token,
                    });
                  } else if (remoteMessage.data.type === 'comment') {
                    navigate('Comment', {
                      slug: remoteMessage.data.slug,
                      is_friend: false,
                    });
                  }
                },
              },
              {
                text: 'OK',
                onPress: () => {},
              },
            ],
          );
        }
      });
      messaging()
        .getToken()
        .then(async (token) => {
          AsyncStorage.setItem('fcmToken', token);
          console.log(token, 'fcmToken');
          const tokenas = await AsyncStorage.getItem('token');
          console.log(tokenas);
        });
      messaging().onNotificationOpenedApp(async (remoteMessage) => {
        if (remoteMessage) {
          const access_token = await AsyncStorage.getItem('token');
          if (remoteMessage.data.type === 'message') {
            navigate('Chat', {
              username: remoteMessage.data.username,
              access_token,
            });
          } else if (remoteMessage.data.type === 'comment') {
            navigate('Comment', {
              slug: remoteMessage.data.slug,
              is_friend: false,
            });
          } else if (remoteMessage.data.type === 'gossip') {
            const res = await axios.get(
              'https://www.gossipsbook.com/api/gossips/update/' +
                remoteMessage.data.slug +
                '/',
            );
            if (res.status === 200) {
              navigate('GossipDetail', {
                item: res.data,
              });
            }
          }
        }
      });

      // Check whether an initial notification is available
      messaging()
        .getInitialNotification()
        .then(async (remoteMessage) => {
          if (remoteMessage) {
            const access_token = await AsyncStorage.getItem('token');
            if (remoteMessage.data.type === 'message') {
              navigate('Chat', {
                username: remoteMessage.data.username,
                access_token,
              });
            } else if (remoteMessage.data.type === 'comment') {
              navigate('Comment', {
                slug: remoteMessage.data.slug,
                is_friend: false,
              });
            } else if (remoteMessage.data.type === 'gossip') {
              const res = await axios.get(
                'https://www.gossipsbook.com/api/gossips/update/' +
                  remoteMessage.data.slug +
                  '/',
              );
              if (res.status === 200) {
                navigate('GossipDetail', {
                  item: res.data,
                });
              }
            }
            // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
          }
        });
      dynamicLinks().onLink((link) => {
        handleDynamicLink(link);
      });
      dynamicLinks()
        .getInitialLink()
        .then((link) => {
          handleDynamicLink(link);
        });
    }

    const handleDynamicLink = async (link) => {
      if (link) {
        let linkURL = link?.url;
        if (linkURL?.includes('https://www.gossipsbook.com/')) {
          let splittedLink = linkURL?.split('?');
          const type = splittedLink[1];
          if (type === 'post') {
            const slug = splittedLink[2];
            const res = await axios.get(
              'https://www.gossipsbook.com/api/gossips/update/' + slug + '/',
            );
            if (res.status === 200) {
              navigate('GossipDetail', {
                item: res.data,
              });
            }
          } else if (type === 'profile') {
            const username = splittedLink[2];
            navigate('UserProfile', {
              username: username,
            });
          } else if (type === 'photopoll') {
            const id = splittedLink[2];
            navigate('Poll Details', { item: { id } });
          }
        }
      }
    };
  }

  backHandler = async () => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      goBack();
    });
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
        <MainContextProvider>
          <AppProvider>
            <UserProvider>
              <PollProvider>
                <Navigation />
                <LoadingModal />
              </PollProvider>
            </UserProvider>
          </AppProvider>
        </MainContextProvider>
      </SafeAreaView>
    );
  }
}

export default App;

const LoadingModal = () => {
  const { loading } = React.useContext(AppContext);

  return (
    <View>
      <Modal
        visible={loading}
        transparent={true}
        hardwareAccelerated
        statusBarTranslucent
        animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: '#00000080',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 15,
              padding: 20,
            }}>
            <ActivityIndicator
              color={colors.primary}
              size="large"
              style={{ paddingRight: 10 }}
            />
            <Text style={{ fontSize: 16 }}>Loading</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};
