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

const FriendRequests = ({ navigation, route }) => {
  const [listSuggestion, setListSuggestion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextURL, setNextURL] = useState(null);
  const [loadmoreLoading, setLoadmoreLoading] = useState(false);

  const handleRefreshAll = async () => {
    try {
      const res = await axios.get(
        `https://www.gossipsbook.com/api/current-user/friend-request/list/`,
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
    handleRefreshAll();
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
        const res = await axios.get(nextURL);
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

  const handleAccept = async (username) => {
    setLoading(true);
    try {
      const res = await axios.post(
        'https://www.gossipsbook.com/api/current-user/friend-request/list/update/' +
        username +
        '/?request=accepted',
      );
      handleRefreshAll();
    } catch (error) {
      Alert.alert('Gossips', JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (username) => {
    setLoading(true);
    try {
      const res = await axios.post(
        'https://www.gossipsbook.com/api/current-user/friend-request/list/update/' +
        username +
        '/?request=rejected',
      );
      handleRefreshAll();
    } catch (error) {
      Alert.alert('Gossips', JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        marginTop: 20,
      }}>
      <View
        style={{
          //   backgroundColor: colors.white,
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
          Friend Requests
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
        scrollEventThrottle={400}
        bounces={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 100,
        }}>
        {loading ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <>
            {listSuggestion.length > 0 ? (
              listSuggestion.map((i, id) => {
                if (Object.keys(i).length === 0) return null;
                return (
                  <View
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
                    {i?.sent_by_user?.profile?.image ? (
                      <Image
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 50,
                        }}
                        source={{
                          uri: i?.sent_by_user?.profile.image,
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
                        flexGrow: 1,
                        //   justifyContent: 'space-between',
                      }}>
                      <Text>{i.sent_by_user.username}</Text>
                      {!!i.sent_by_user?.designation && (
                        <Text
                          style={{ fontStyle: 'italic', marginVertical: 5 }}>
                          {i.sent_by_user?.designation}
                        </Text>
                      )}
                    </View>
                    <View
                      style={{
                        width: '50%',
                        alignItems: 'flex-end',
                        paddingRight: 10,
                        flexDirection: 'row',
                      }}>
                      <TouchableOpacity
                        onPress={() => handleAccept(i.sent_by_user.username)}
                        style={{
                          backgroundColor: colors.primary,
                          borderRadius: 20,
                          padding: 10,
                          alignItems: 'center',
                          marginRight: 10,
                        }}>
                        <Text style={{ color: colors.white }}>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleReject(i.sent_by_user.username)}
                        style={{
                          borderColor: colors.primary,
                          borderWidth: 0.5,
                          borderRadius: 20,
                          padding: 10,
                          alignItems: 'center',
                        }}>
                        <Text style={{ color: colors.black }}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            ) : (
              <Text>You have no friend requests!</Text>
            )}
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

export default FriendRequests;
