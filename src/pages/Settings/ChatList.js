import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  DeviceEventEmitter,
} from 'react-native';

import { Icon, Touchable } from '../../components';
import { colors, layout } from '../../constants';

const { screenWidth } = layout;
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { EVENTS } from '../../constants/config';
import { useIsFocused } from '@react-navigation/native';

const ChatList = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState('');
  const [showAvatar, setShowAvatar] = useState(false);
  const [messages, setMessages] = useState([]);
  const isFocused = useIsFocused();

  const loadRoomData = async () => {
    try {
      const res = await axios.get('https://www.gossipsbook.com/api/room/');
      console.log('ROOOM', JSON.stringify(res.data, null, 2));
      setData(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const loadUserProfile = async () => {
    try {
      const res = await axios.get(
        'https://www.gossipsbook.com/api/current-user/profile/retrieve/',
      );
      setAvatar(res.data.profile.image);
    } catch (err) {
      console.log(err);
    }
  };

  const loadUserMessages = async () => {
    AsyncStorage.getItem('unreadMessagesUsers').then((unreadMessagesUsers) => {
      setMessages(unreadMessagesUsers ? JSON.parse(unreadMessagesUsers) : []);
    });
  };
  useEffect(() => {
    loadRoomData();
    loadUserProfile();
    const messageListener = DeviceEventEmitter.addListener(
      EVENTS.MESSAGE_RECEVIED_BACKGROUND,
      loadUserMessages,
    );
    return () => (messageListener ? messageListener.remove() : null);
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadUserMessages();
    }
  }, [isFocused]);

  const renderItem = ({ item, index }) => {
    const isNewMsg = messages.find(
      (dd) => dd.toLocaleLowerCase() === item.user.toLocaleLowerCase(),
    );
    return (
      <TouchableOpacity
        style={{
          paddingVertical: 10,
          borderRadius: 20,
          marginTop: 10,
          paddingHorizontal: 10,
          borderColor: isNewMsg ? '#000080' : '#bbb',
          borderWidth: isNewMsg ? 3 : StyleSheet.hairlineWidth,
        }}
        onPress={async () => {
          AsyncStorage.getItem('readChats', (err, readChats) => {
            if (err) return;
            readChats = readChats ? JSON.parse(readChats) : [];
            readChats.push(item.id);
            AsyncStorage.setItem('readChats', JSON.stringify(readChats));
            DeviceEventEmitter.emit(EVENTS.MESSAGE_OPENED);
          });
          const access_token = await AsyncStorage.getItem('token');
          navigation.navigate('Chat', {
            username: item.user,
            access_token,
          });
        }}
        key={index}>
        <View style={{ flexDirection: 'row' }}>
          <Image
            style={{
              width: 40,
              height: 40,
              borderRadius: 40,
              marginEnd: 20,
            }}
            source={
              item.profile?.image
                ? {
                    uri: item.profile?.image,
                  }
                : require('../../assets/defaultAvatar.jpeg')
            }
          />
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: 'bold',
                color: colors.gray,
              }}>
              {item.user}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 12,
                color: colors.lightGray,
                paddingEnd: '22%',
              }}>
              {item?.last_message?.message}
            </Text>
          </View>

          {/* <View>
            <Text style={{ alignSelf: 'flex-start' }}>Date</Text>
            <View
              style={{
                backgroundColor: '#1B3850',
                borderRadius: 10,
                width: 18,
                height: 18,
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: colors.white,
                  fontSize: 12,
                }}>
                1
              </Text>
            </View>
          </View> */}
        </View>
      </TouchableOpacity>
    );
  };

  const renderModalAvatar = () => {
    return (
      <Modal visible={showAvatar} animationType="slide">
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            position: 'relative',
            backgroundColor: 'white',
          }}>
          <Image
            style={{
              width: screenWidth,
              height: screenWidth,
            }}
            source={
              avatar?.length > 0
                ? {
                    uri: avatar,
                  }
                : require('../../assets/defaultAvatar.jpeg')
            }
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
            }}
            onPress={() => setShowAvatar(false)}>
            <AntDesign name="close" size={30} />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  if (data?.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: colors.white,
        }}>
        <Text style={{ textAlign: 'center', fontSize: 20 }}>
          You do not have any messages yet!
        </Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        {renderModalAvatar()}
        <View
          style={{
            backgroundColor: '#000080',
            paddingVertical: 30,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            padding: 10,
          }}>
          <View
            style={{
              marginTop: 0,
              justifyContent: 'space-around',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#000',
                color: colors.white,
                marginLeft: 30,
                paddingTop: 2,
              }}>
              Chat List
            </Text>
            <Touchable
              onPress={() => navigation.goBack()}
              jc
              ac
              size={40}
              br={20}
              absolute
              top={0}
              left={20}
              brc="#fff"
              brw={1}>
              <Icon name="left_arrow" size={18} />
            </Touchable>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('SearchUsers', {
                    search: '',
                  });
                }}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 40,
                  marginEnd: 10,
                  height: 40,
                  borderRadius: 40,
                  borderWidth: 1,
                  borderColor: colors.white,
                }}>
                <Icon
                  name="search_white"
                  size={18}
                  style={{ tintColor: colors.white }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowAvatar(true)}
                style={{
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  borderRadius: 40,
                }}>
                <Image
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 40,
                  }}
                  source={
                    avatar?.length > 0
                      ? {
                          uri: avatar,
                        }
                      : require('../../assets/defaultAvatar.jpeg')
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <FlatList
          contentContainerStyle={{ paddingHorizontal: 20, flexGrow: 1 }}
          keyExtractor={(_, i) => i.toString()}
          data={data}
          renderItem={renderItem}
        />
      </View>
    </>
  );
};

export default ChatList;
