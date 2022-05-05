import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from 'react-native';

import { colors } from '../../constants';
import { Icon } from '../../components';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Search = ({ navigation, route }) => {
  const [listSuggestion, setListSuggestion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextURL, setNextURL] = useState(null);
  const [loadmoreLoading, setLoadmoreLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [showModalEmail, setShowModalEmail] = useState(false);

  const handleRefreshAll = async () => {
    try {
      const res = await axios.get(
        `https://www.gossipsbook.com/api/user/friend-suggestion/`,
      );
      setListSuggestion(res.data.results);
      console.log(res.data.results);
      if (res.data.next !== null) setNextURL(res.data.next);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `https://www.gossipsbook.com/api/user/friend-suggestion/`,
        );
        setListSuggestion(res.data.results);
        console.log(res.data.results);
        if (res.data.next !== null) setNextURL(res.data.next);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 1;
  };

  const isCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return contentOffset.y == 0;
  };

  const loadMore = async () => {
    if (nextURL !== null) {
      try {
        const res = await axios.get(nextURL.replace('http:', 'https:'));
        const { results } = res.data;
        const temp = JSON.parse(JSON.stringify(listSuggestion));
        if (results.length > 0) setListSuggestion([...temp, ...results]);
        setNextURL(res.data.next);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadmoreLoading(false);
      }
    } else {
      setLoadmoreLoading(false);
    }
  };

  const handleSendViaEmail = async () => {
    if (!email) {
      Alert.alert('Gossips', 'Email is required!');
      return;
    }
    try {
      const res = await axios.post(
        'https://www.gossipsbook.com/api/invite-friends/',
        {
          email,
        },
      );
      console.log(res);
      Alert.alert('Gossips', JSON.stringify(res.data.status), [
        {
          text: 'OK',
          onPress: () => setShowModalEmail(false),
        },
      ]);
    } catch (err) {
      Alert.alert('Gossips', JSON.stringify(err.response.body));
    }
  };

  const handleAddFriend = async (i) => {
    console.log(i);
    if (i.is_friend === 'False' || i.is_friend === false) {
      const res = await axios.post(
        `https://www.gossipsbook.com/api/current-user/friend-request/create/${i.username ?? ''
        }/`,
      );
    } else {
      const res = await axios.delete(
        `https://www.gossipsbook.com/api/current-user/friend-request/list/update/${i.username ?? ''
        }/`,
      );
    }
    // console.log(res.data);
    setLoading(true);
    await handleRefreshAll();
  };

  const handleRemoveSuggestion = async (i) => {
    const res = await axios.post(
      `https://www.gossipsbook.com/api/user/friend-suggestion/remove/${i.username}/`,
    );
    console.log(res.data);
    setLoading(true);
    await handleRefreshAll();
  };

  const renderSendEmail = () => {
    return (
      <Modal visible={showModalEmail} animationType="slide">
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                height: 100,
                padding: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setShowModalEmail(false);
                }}>
                <AntDesign
                  name="close"
                  style={{ fontSize: 30, fontWeight: 'bold' }}
                />
              </TouchableOpacity>
              <Text
                style={{
                  marginLeft: 20,
                  fontSize: 30,
                  alignSelf: 'center',
                }}>
                Invite your friend
              </Text>
            </View>
            <View
              style={{
                flexGrow: 1,
                paddingHorizontal: 20,
              }}>
              <Text
                style={{
                  marginTop: 20,
                  fontWeight: 'bold',
                }}>
                Enter your friend email
              </Text>
              <TextInput
                onChangeText={(email) => setEmail(email)}
                style={{
                  marginTop: 20,
                  paddingLeft: 10,
                  borderWidth: 0.5,
                  borderColor: colors.gray,
                  borderRadius: 10,
                }}
              />
              <TouchableOpacity
                onPress={handleSendViaEmail}
                style={{
                  marginTop: 20,
                  padding: 10,
                  borderRadius: 10,
                  backgroundColor: colors.primary,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: colors.white,
                    fontSize: 18,
                  }}>
                  Send invitation
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.white,
        flex: 1,
      }}>
      {renderSendEmail()}
      <View
        style={{
          backgroundColor: colors.white,
          paddingHorizontal: 20,
          height: 60,
        }}>
        <Text
          style={{
            marginTop: 15,
            fontSize: 24,
            fontWeight: 'bold',
            color: '#000',
            alignSelf: 'center',
          }}>
          New Gossipers
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#555',
            position: 'absolute',
            top: 10,
            left: 20,
            borderWidth: 1,
            borderRadius: 25,
            width: 40,
            height: 40,
          }}>
          <Icon name="back" size={18} />
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={async ({ nativeEvent }) => {
          if (isCloseToTop(nativeEvent)) {
            setLoadmoreLoading(false);
          }
          if (isCloseToBottom(nativeEvent)) {
            setLoadmoreLoading(true);
            await loadMore();
          }
        }}
        style={{
          backgroundColor: colors.white,
        }}
        scrollEventThrottle={400}
        bounces={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingBottom: 100,
        }}>
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginVertical: 20,
          }}>
          <TouchableOpacity
            onPress={() => setShowModalEmail(true)}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderColor: '#1B3850',
              borderRadius: 10,
              borderWidth: 1,
              marginHorizontal: 10,
            }}>
            <Text>Invite Friend</Text>
          </TouchableOpacity>
        </View> */}
        {loading ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <>
            {listSuggestion.filter(v => !(v?.is_friend)).map((i, id) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('UserProfile', { username: i.username })
                  }
                  style={{
                    flexDirection: 'row',
                    borderColor: '#1B3850',
                    borderRadius: 20,
                    borderWidth: 1,
                    marginTop: 10,
                    padding: 10,
                    alignItems: 'center',
                  }}
                  key={id}>
                  {i.profile.image !== null ? (
                    <Image
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                      }}
                      source={{
                        uri: i.profile.image,
                      }}
                    />
                  ) : (
                    <Image
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                      }}
                      source={require('../../assets/defaultAvatar.jpeg')}
                    />
                  )}
                  <View
                    style={{
                      marginLeft: 10,
                      //   justifyContent: 'space-between',
                    }}>
                    <Text>{i.username}</Text>
                    {!!i.designation && (
                      <Text style={{ fontStyle: 'italic', marginVertical: 5 }}>
                        {i.designation}
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      flexGrow: 1,
                      alignItems: 'flex-end',
                      paddingRight: 10,
                    }}>
                    <TouchableOpacity
                      onPress={async () => handleAddFriend(i)}
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: colors.white,
                        borderWidth: 1,
                        borderColor: colors.black,
                        borderRadius: 1000,
                        padding: 5,
                        alignItems: 'center',
                      }}>
                      {
                        <Icon
                          name={
                            i.is_friend === 'False' || i.is_friend === false
                              ? 'door'
                              : 'open_door'
                          }
                          size={25}
                        />
                      }
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleRemoveSuggestion(i)}
                    style={{
                      alignSelf: 'flex-start',
                      borderRadius: 100,
                      borderWidth: 1,
                      borderColor: '#1B3850',
                      height: 20,
                      width: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: 'bold',
                      }}>
                      ✕
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
          </>
        )}
        {loadmoreLoading && (
          <ActivityIndicator
            size="large"
            color="black"
            style={{ marginBottom: 20 }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Search;
