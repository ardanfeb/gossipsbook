import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Share,
  Image,
  ScrollView,
  Animated,
  Dimensions,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { Touchable, Icon, Modal, Input } from '../../components';
import { colors, config, layout } from '../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';

const Screen = ({ route, navigation }) => {
  const { slug } = route.params;
  if (!slug) navigation.goBack();

  const [listComment, setListComment] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [newReply, setNewReply] = useState('');
  const [gossipAuthorToken, setGossipAuthorToken] = useState('');

  const handleSendReply = async (i) => {
    if (!newReply) {
      return;
    }
    const me = await AsyncStorage.getItem('username');
    try {
      const res = await axios.post(
        `https://www.gossipsbook.com/api/gossips/comments/${i.id}/replies/list-create/`,
        {
          content: newReply,
        },
      );
      var apiconfig = {
        method: 'post',
        url: config.fcmUrl,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `key=${config.senderKey}`,
        },
        data: {
          to: gossipAuthorToken,
          notification: {
            title: `${me} added new comment...`,
            body: newReply,
            mutable_content: true,
            sound: 'Tri-tone',
          },
          data: {
            url: 'http://placehold.it/120x120&text=image1',
            type: 'comment',
            slug: slug,
          },
        },
      };

      axios(apiconfig)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
      setLoading(true);
      handleRefreshAll();
    } catch (e) {
      Alert.alert('Gossip', JSON.stringify(e.response));
    } finally {
      setNewReply('');
    }
  };

  const handleRefreshAll = async () => {
    try {
      const res = await axios.get(
        `https://www.gossipsbook.com/api/gossips/${slug}/comment/list-create/`,
      );
      const { results } = res.data;
      console.log(results);
      setListComment(
        results.map((i) => {
          return {
            ...i,
            showReply: false,
          };
        }),
      );
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
          `https://www.gossipsbook.com/api/gossips/${slug}/comment/list-create/`,
        );
        const { results, gossip_author_token } = res.data;
        console.log(results);
        setGossipAuthorToken(gossip_author_token);
        setListComment(
          results.map((i) => {
            return {
              ...i,
              showReply: false,
            };
          }),
        );
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSendComment = async () => {
    if (!newComment) {
      return;
    }
    const me = await AsyncStorage.getItem('username');
    try {
      const res = await axios.post(
        `https://www.gossipsbook.com/api/gossips/${slug}/comment/list-create/`,
        {
          content: newComment,
        },
      );
      var apiconfig = {
        method: 'post',
        url: config.fcmUrl,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `key=${config.senderKey}`,
        },
        data: {
          to: gossipAuthorToken,
          notification: {
            title: `${me} added new comment...`,
            body: newComment,
            mutable_content: true,
            sound: 'Tri-tone',
          },
          data: {
            url: 'http://placehold.it/120x120&text=image1',
            type: 'comment',
            slug: slug,
          },
        },
      };

      axios(apiconfig)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
      setLoading(true);
      handleRefreshAll();
    } catch (e) {
      Alert.alert('Gossip', JSON.stringify(e.response));
    } finally {
      setNewComment('');
    }
  };

  useEffect(() => console.log(listComment), [listComment]);

  const handleLikeUnlike = async (item) => {
    console.log(
      item,
      `https://www.gossipsbook.com/api/gossips/comment/retrieve/${item.id
      }/?property=${item.like_unlike === 'like' ? 'unlike/' : 'like/'}`,
    );
    try {
      const res = await axios.put(
        `https://www.gossipsbook.com/api/gossips/comment/retrieve/${item.id
        }/?property=${item.like_unlike === 'like' ? 'unlike' : 'like'}`,
      );
      setLoading(true);
      handleRefreshAll();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View
          style={{
            flexDirection: 'row',
            paddingLeft: 10,
            backgroundColor: colors.white,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}>
          <View
            style={{
              position: 'absolute',
              left: 20,
              top: 10,
            }}>
            <TouchableOpacity
              style={{
                width: 40,
                height: 40,
                borderColor: colors.gray,
                borderRadius: 40,
                borderWidth: 0.5,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => navigation.goBack()}>
              <Icon name="back" size={18} />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 24,
            }}>
            Comments
          </Text>
          {/* <View
          style={{
            flex: 1,
          }}>
          <Text></Text>
        </View> */}
        </View>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 20,
            backgroundColor: '#fff',
          }}>
          {!loading ? (
            <View style={{ flex: 1 }}>
              {listComment.length > 0 ? (
                listComment.map((i, idx) => {
                  return (
                    <View
                      key={i.id}
                      style={{
                        marginHorizontal: 20,
                        marginTop: 20,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          paddingHorizontal: 20,
                          paddingVertical: 8,
                          borderColor: '#1B3850',
                          borderRadius: 20,
                          borderWidth: 1,
                          // maxHeight: 100,
                        }}>
                        <View
                          style={{
                            width: 50,
                            alignItems: 'center',
                          }}>
                          {i?.author?.profile?.image ? (
                            <Image
                              style={{
                                width: 50,
                                height: 50,
                                borderRadius: 1000,
                              }}
                              source={{
                                uri: i?.author?.profile?.image,
                              }}
                            />
                          ) : (
                            <Image
                              style={{
                                width: 50,
                                height: 50,
                                borderRadius: 1000,
                              }}
                              source={require('../../assets/defaultAvatar.jpeg')}
                            />
                          )}
                        </View>
                        <View
                          style={{
                            flexGrow: 1,
                            marginHorizontal: 10,
                            maxWidth: Dimensions.get('screen').width - 200,
                          }}>
                          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                            {i.author.username}
                          </Text>
                          <Text>
                            {new Date(i.date_published)
                              .toDateString()
                              .slice(4, 10)}
                          </Text>
                          <Text>{i.content}</Text>
                        </View>
                        <View
                          style={{
                            width: 50,
                            alignItems: 'center',
                          }}>
                          {/* Temporarily hidded */}

                          {/* <TouchableOpacity
                            onPress={() => handleLikeUnlike(i)}
                            style={{
                              flexDirection: 'row',
                              marginBottom: 10,
                            }}>
                            <AntDesign
                              name={
                                i.like_unlike === 'like' ? 'heart' : 'hearto'
                              }
                              style={{
                                fontSize: 20,
                                color: colors.primary,
                              }}
                            />
                            <Text>
                              {'   '}({i.total_likes})
                            </Text>
                          </TouchableOpacity> */}
                          <TouchableOpacity
                            onPress={() => {
                              console.log(i.id);
                              setListComment((comment) =>
                                comment.map((cmt) =>
                                  cmt.id === i.id
                                    ? { ...cmt, showReply: !cmt.showReply }
                                    : cmt,
                                ),
                              );
                            }}
                            style={{
                              flexDirection: 'row',
                            }}>
                            <MaterialIcons
                              name="quickreply"
                              style={{
                                fontSize: 20,
                                color: colors.black,
                              }}
                            />
                            <Text>
                              {'   '}({!!i.replies ? i.replies.length : 0})
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      {i.showReply === true && (
                        <>
                          {i?.replies &&
                            i.replies.map((rep, repId) => {
                              return (
                                <View
                                  key={repId}
                                  style={{
                                    flexDirection: 'row',
                                    marginLeft: 40,
                                    marginTop: 10,
                                    paddingHorizontal: 20,
                                    paddingVertical: 8,
                                    borderColor: '#1B3850',
                                    borderRadius: 20,
                                    borderWidth: 1,
                                  }}>
                                  <Image
                                    style={{
                                      width: 30,
                                      height: 30,
                                      borderRadius: 1000,
                                    }}
                                    source={
                                      rep.user.profile?.image
                                        ? { uri: rep.user.profile?.image }
                                        : require('../../assets/defaultAvatar.jpeg')
                                    }
                                  />
                                  <View
                                    style={{
                                      marginHorizontal: 10,
                                    }}>
                                    <Text
                                      style={{
                                        fontWeight: 'bold',
                                        fontSize: 14,
                                      }}>
                                      {rep.user.username}
                                    </Text>
                                    <Text style={{ fontSize: 12 }}>
                                      {rep.content}
                                    </Text>
                                  </View>
                                </View>
                              );
                            })}
                          <View
                            style={{
                              flexDirection: 'row',
                              marginLeft: 40,
                              marginTop: 10,
                              paddingHorizontal: 20,
                              paddingVertical: 8,
                              borderColor: '#1B3850',
                              borderRadius: 20,
                              borderWidth: 1,
                              alignItems: 'center',
                            }}>
                            <Input
                              style={{
                                width: '80%',
                                minHeight: 30,
                                paddingLeft: 10,
                                alignSelf: 'flex-start',
                                backgroundColor: '#EEF1FE',
                                borderRadius: 10,
                                marginHorizontal: 10,
                              }}
                              multiline
                              placeholder="Reply..."
                              placeholderTextColor={colors.gray}
                              onChangeText={(e) => setNewReply(e)}
                              value={newReply}
                            // multiline
                            />
                            <Touchable
                              onPress={() => handleSendReply(i)}
                              size={30}
                              br={10}
                              bg={'#000080'}
                              ac
                              jc
                              absolute
                              right={10}>
                              <Icon name="send_white" size={24} />
                            </Touchable>
                          </View>
                        </>
                      )}
                    </View>
                  );
                })
              ) : (
                <View
                  style={{
                    paddingLeft: 30,
                    paddingTop: 30,
                  }}>
                  <Text>No comment....</Text>
                </View>
              )}
            </View>
          ) : (
            <ActivityIndicator size="large" color="black" />
          )}
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 10,
            marginBottom: 10,
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
            onChangeText={(e) => setNewComment(e)}
            value={newComment}
            multiline
          />
          <Touchable
            onPress={handleSendComment}
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
    </View>
  );
};

export default Screen;
