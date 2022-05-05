import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import moment from 'moment';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Animated,
  FlatList,
  Keyboard,
  Text,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import reactotron from 'reactotron-react-native';
import { useUser } from '../../../App';
import { Input, Touchable, Icon } from '../../components';
import { colors, config } from '../../constants';

const Chat = ({ navigation, route }) => {
  const { username, access_token, data } = route.params;
  const [avatar, setAvatar] = useState('');
  const [state, setState] = useState([]);
  const [userFcmToken, setUserFcmToken] = useState('');
  const messages = useRef([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [message, setMessage] = useState('');
  const [isActive, setActive] = useState(false);
  const { users } = useUser();
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    AsyncStorage.getItem('unreadMessagesUsers').then((unreadMessagesUsers) => {
      unreadMessagesUsers = unreadMessagesUsers
        ? JSON.parse(unreadMessagesUsers)
        : [];
      AsyncStorage.setItem(
        'unreadMessagesUsers',
        JSON.stringify(
          unreadMessagesUsers.filter(
            (dd) => dd.toLocaleLowerCase() !== username.toLocaleLowerCase(),
          ),
        ),
      );
    });
    (async () => {
      try {
        const res = await axios.get(
          `https://www.gossipsbook.com/api/user/retrieve/${username}/`,
        );
        const { data } = res;
        setUserInfo(data);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    setActive(users.includes(username));
  }, [users.length]);

  useEffect(() => {
    let socket = new WebSocket(
      `wss://www.gossipsbook.com/message/${access_token}/`,
    );
    socket.onopen = function (e) {
      console.log('[open] Connection established');
    };

    socket.onmessage = function (event) {
      try {
        const message = JSON.parse(event.data);
        if (message.sent_by_user === username) {
          const e = {
            text: message.message,
            me: false,
            date: message.last_updated,
          };
          const newData = [...messages.current];
          newData.unshift(e);
          setState(newData);
          messages.current = newData;
        }
      } catch (error) {
        console.log(error);
      }
    };
    socket.onclose = function (event) {
      if (event.wasClean) {
        console.log(
          `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`,
        );
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log(event);
      }
    };

    socket.onerror = function (error) {
      alert(`[error] ${error.message}`);
    };
    return () => {
      socket.removeEventListener('message');
      socket.close();
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          'https://www.gossipsbook.com/api/room/' + username + '/',
        );
        reactotron.log(res);
        const messageList = res.data.results.map((i) => {
          return {
            text: i.message,
            me: username !== i.sent_by_user,
            date: i.last_updated,
          };
        });
        setUserFcmToken(res.data?.to_user_token);
        setState(messageList);
        messages.current = messageList;
        reactotron.log(messages);
      } catch (err) {
        console.log(err);
      }

      try {
        const res = await axios.get(
          'https://www.gossipsbook.com/api/current-user/profile/retrieve/',
        );
        setAvatar(res.data.profile.image);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const onKeyboardDidShow = (e) => {
    setKeyboardHeight(e.endCoordinates.height);
  };

  const onKeyboardDidHide = () => {
    setKeyboardHeight(0);
  };

  useEffect(() => {
    state.reverse();
    Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);

    return () => {
      Keyboard.removeListener('keyboardDidShow', onKeyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', onKeyboardDidHide);
    };
  }, []);

  const onChange = (e) => {
    setMessage(e);
  };

  const send = () => {
    const e = { text: message, me: true, date: new Date() };
    const newData = [...state];
    newData.unshift(e);
    setState(newData);
    messages.current = newData;
    setMessage('');
    // const socketMsg = {
    //   from_user: 'chat_user',
    //   to_user: 'meXan1k',
    //   message: message,
    //   token: 'Token 31c05369037efb1213870630d868e3fbc8dbefdc'
    // }
    sendMessage(message);
    sendPush(message);
  };

  const sendMessage = async (message) => {
    // console.log(access_token);
    axios.defaults.headers.common['Authorization'] = `Token ${access_token}`;
    const messageRes = await axios.post(
      `https://www.gossipsbook.com/api/message/${username}/`,
      {
        message: message,
      },
    );
    console.log(messageRes.data);
  };

  const sendPush = async (message) => {
    const me = await AsyncStorage.getItem('username');

    if (userFcmToken) {
      var apiconfig = {
        method: 'post',
        url: config.fcmUrl,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `key=${config.senderKey}`,
        },
        data: {
          to: userFcmToken,
          notification: {
            title: `Message from ${me}`,
            body: message,
            mutable_content: true,
            sound: 'Tri-tone',
          },
          data: {
            url: 'http://placehold.it/120x120&text=image1',
            type: 'message',
            username: me,
          },
          priority: 'high',
        },
      };

      axios(apiconfig)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const onSubmitEditing = () => {
    let newText = message;
    newText += '\n';
    setMessage(newText);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <Animated.View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          backgroundColor: '#000080',
          paddingVertical: 20,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          paddingHorizontal: 10,
        }}>
        <Touchable onPress={() => navigation.goBack()} jc ac size={40} br={20}>
          <Icon name="back" size={18} style={{ tintColor: colors.white }} />
        </Touchable>

        <View style={{ flexDirection: 'row', flex: 1 }}>
          <TouchableOpacity
            // key={id}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: 40,
              height: 40,
              borderRadius: 40,
              borderWidth: 0.5,
              borderColor: colors.white,
              marginHorizontal: 10,
            }}>
            <Image
              style={{
                width: 40,
                height: 40,
                borderRadius: 40,
              }}
              source={
                userInfo?.profile?.image
                  ? { uri: userInfo?.profile?.image }
                  : require('../../assets/defaultAvatar.jpeg')
              }
            />
          </TouchableOpacity>

          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: '#444',
                color: colors.white,
              }}>
              {username}
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontWeight: 'bold',
                color: '#444',
                color: colors.lightGray,
              }}>
              {isActive ? 'Online' : 'Offline'}
            </Text>
          </View>

          <Touchable onPress={() => navigation.navigate('VideoCall', {
            otherUser: username,
            accessToken: access_token
          })} jc ac size={40} br={20}>
            <Icon name="call" size={38} style={{ tintColor: colors.white }} />
          </Touchable>
        </View>
      </Animated.View>

      <FlatList
        bounces={false}
        inverted
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: colors.white }}
        contentContainerStyle={{
          flexGrow: 1,
          width: '100%',
          marginBottom: 20,
          paddingVertical: 20,
        }}
        data={state}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => {
          if (item.me) {
            return (
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  marginEnd: 10,
                  marginBottom: 15,
                }}
                key={index}>
                <View style={{ alignItems: 'flex-end' }}>
                  <View
                    style={{
                      padding: 10,
                      marginLeft: '45%',
                      borderRadius: 5,
                      marginTop: 5,
                      marginRight: 5,
                      maxWidth: '50%',
                      borderRadius: 10,
                      borderWidth: 1,
                      borderRadius: 10,
                      borderColor: 'black',
                    }}>
                    <Text style={{ fontSize: 16, color: 'black' }} key={index}>
                      {' '}
                      {item.text}
                    </Text>
                  </View>
                  <Text
                    style={{
                      marginRight: '5%',
                      fontSize: 12,
                      marginTop: 5,
                    }}
                    key={index}>
                    {moment(item.date).format(`MMM DD, h:mm a`)}
                  </Text>
                </View>
                <Image
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 40,
                  }}
                  source={
                    avatar
                      ? { uri: avatar }
                      : require('../../assets/defaultAvatar.jpeg')
                  }
                />
              </View>
            );
          } else {
            return (
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginStart: 10,
                  justifyContent: 'flex-start',
                }}
                key={index}>
                <Image
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 40,
                  }}
                  source={
                    userInfo?.profile?.image
                      ? { uri: userInfo?.profile?.image }
                      : require('../../assets/defaultAvatar.jpeg')
                  }
                />
                <View style={{ alignItems: 'flex-start' }}>
                  <View
                    style={{
                      padding: 10,
                      marginRight: '45%',
                      borderRadius: 5,
                      marginTop: 5,
                      marginLeft: 5,
                      maxWidth: '50%',
                      // alignSelf: 'flex-start',
                      borderRadius: 10,
                      borderWidth: 1,
                      borderRadius: 10,
                      borderColor: 'black',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#000',
                        justifyContent: 'center',
                      }}>
                      {' '}
                      {item.text}
                    </Text>
                  </View>
                  <Text
                    style={{
                      marginLeft: '5%',
                      fontSize: 12,
                      marginTop: 7,
                      color: colors.chatBg,
                    }}
                    key={index}>
                    {moment(item.date).format(`MMM DD, h:mm a`)}
                  </Text>
                </View>
              </View>
            );
          }
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          marginBottom:
            Platform.OS === 'ios'
              ? keyboardHeight === 0
                ? 10
                : keyboardHeight - 20
              : keyboardHeight === 0
              ? 20
              : 40,
          alignItems: 'center',
        }}>
        <Input
          style={{
            width: '80%',
            height: 50,
            paddingLeft: 10,
            alignSelf: 'flex-start',
            backgroundColor: '#EEF1FE',
            borderRadius: 10,
            marginHorizontal: 10,
          }}
          placeholder="Type something..."
          placeholderTextColor={colors.gray}
          onChangeText={onChange}
          value={message}
          returnKeyType="send"
          multiline
          numberOfLines={3}
          returnKeyLabel="New Label"
        />

        <Touchable
          onPress={send}
          onChangeText={(text) => console.log(text)}
          size={50}
          br={10}
          bg={'#000080'}
          ac
          jc
          absolute
          right={10}>
          <Icon name="send_white" size={24} />
        </Touchable>
      </View>
    </View>
  );
};

// const styles = StyleSheet.create({
//     rightArrow: {
//         position: "absolute",
//         backgroundColor: colors.chatBg, //"#0078fe"
//         //backgroundColor:"red",
//         width: 20,
//         height: 25,
//         bottom: 0,
//         borderBottomLeftRadius: 25,
//         right: -10
//     },

//     rightArrowOverlap: {
//         position: "absolute",
//         backgroundColor: colors.white, //"#eeeeee"
//         width: 20,
//         height: 35,
//         bottom: -6,
//         borderBottomLeftRadius: 18,
//         right: -20

//     },

//     /*Arrow head for recevied messages*/
//     leftArrow: {
//         position: "absolute",
//         backgroundColor: "#EEF1FE",
//         //backgroundColor:"red",
//         width: 20,
//         height: 25,
//         bottom: 0,
//         borderBottomRightRadius: 25,
//         left: -10
//     },

//     leftArrowOverlap: {
//         position: "absolute",
//         backgroundColor: colors.white, //"#eeeeee"
//         width: 20,
//         height: 35,
//         bottom: -6,
//         borderBottomRightRadius: 18,
//         left: -20

//     },
// })

export default Chat;
