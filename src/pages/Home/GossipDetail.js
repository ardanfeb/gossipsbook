import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Share,
  Image,
  ScrollView,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Touchable, Icon, Modal as CustomModal } from '../../components';
import { colors, icons, layout, config } from '../../constants';
import RNUrlPreview from 'react-native-url-preview';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { buildLink } from '../../helpers';
import Swiper from 'react-native-swiper';
import { Icon as MaterialIcon } from 'react-native-elements';
import YoutubePlayer from 'react-native-youtube-iframe';
import Video from 'react-native-video';
const { screenWidth, screenHeight } = layout;

const GossipDetail = ({ route, navigation }) => {
  const initItem = route.params.item;
  const [currentUser, setCurrentUser] = useState('');
  const [item, setItem] = useState(initItem);
  const [reportVisible, setReportVisible] = useState(false);
  const [vote, setVote] = useState('');
  const [visible, setVisible] = useState(false);
  const modalHeight = new Animated.Value(screenHeight);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState('');
  const [isObjected, setIsObjected] = useState(item.has_objected);
  const [showModalChoose, setShowModalChoose] = useState(false);
  const [URL, setURL] = useState();
  const [mediaType, setMediaType] = useState();
  const renderDoor = (item) => {
    const isFriend = item.is_friend;
    if (isFriend === 'Request received') {
      return (
        <View
          style={{
            height: 40,
            width: 90,
            marginLeft: 'auto',
            right: 20,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={async () => {
              console.log(
                'ddddddddddddddddddddddddddddddddddddddd',
                item.author.username,
              );
              const res = await axios.post(
                `https://www.gossipsbook.com/api/current-user/friend-request/list/update/${item.author.username}/?request=accepted`,
                {},
                { headers: { 'Content-Type': 'application/json' } },
              );
              setLoading(true);
              refreshAll();
            }}
            style={{
              marginRight: 10,
              borderRadius: 30,
              backgroundColor: colors.white,
              borderWidth: 1,
              borderColor: colors.black,
              padding: 10,
            }}>
            <Icon name="friends" size={25} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              const res = await axios.post(
                `https://www.gossipsbook.com/api/current-user/friend-request/list/update/${item.author.username}/?request=rejected`,
              );
              setLoading(true);
              refreshAll();
            }}
            style={{
              borderRadius: 30,
              backgroundColor: colors.white,
              borderWidth: 1,
              borderColor: colors.black,
              padding: 10,
            }}>
            <Icon name="reject" size={25} />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <Touchable
        onPress={async () => await pressFollow(item)}
        style={{
          height: 40,
          width: 40,
          marginLeft: 'auto',
          right: 20,
          borderRadius: 30,
          backgroundColor: colors.white,
          borderWidth: 1,
          borderColor: colors.black,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {isFriend === 'Request sent' && <Icon name="open_door" size={25} />}
        {isFriend === true && <Icon name="friends" size={25} />}
        {isFriend === false && <Icon name="door" size={25} />}
      </Touchable>
    );
  };

  const refreshAll = async () => {
    try {
      setLoading(true);
      console.log(
        'https://www.gossipsbook.com/api/gossips/update/' + item.slug + '/',
      );
      const res = await axios.get(
        'https://www.gossipsbook.com/api/gossips/update/' + item.slug + '/',
      );
      const username = await AsyncStorage.getItem('username');
      setCurrentUser(username);
      setItem(res.data);
      setIsObjected(res.data.has_objected);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await refreshAll();
    });
    return unsubscribe;
  }, [navigation]);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const res = await axios.get(
  //         'https://www.gossipsbook.com/api/gossips/update/' + item.slug,
  //       );
  //       const user = await AsyncStorage.getItem('username');
  //       setCurrentUser(user);
  //       setItem(res.data);
  //       setIsObjected(res.data.has_objected);
  //     } catch (err) {
  //       console.log(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   })();
  // }, []);

  const pressFollow = async (_item) => {
    if (_item.is_friend === 'Request sent') {
      const res = await axios.delete(
        `https://www.gossipsbook.com/api/current-user/friend-request/list/update/${
          _item.author.username ?? ''
        }/`,
      );
      setLoading(true);
      refreshAll();
      return;
    }
    if (_item.is_friend === false || _item.is_friend === 'False') {
      console.log(_item.author.username);
      const res = await axios
        .post(
          `https://www.gossipsbook.com/api/current-user/friend-request/create/${_item.author.username}/`,
        )
        .then((resp) => {
          setLoading(true);
          refreshAll();
          return;
        })
        .catch((error) => {
          console.error('There was an error!', error);
          console.log('res', res);
          console.log(
            'res',
            `https://www.gossipsbook.com/api/current-user/friend-request/create/${_item.author.username}/`,
          );
        });
    }
    if (_item.is_friend === true || _item.is_friend === 'True') {
      Alert.alert(
        'Gossips',
        `Are you sure to unfriend ${_item.author.username}?`,
        [
          {
            text: 'YES',
            onPress: async () => {
              const res = await axios.delete(
                `https://www.gossipsbook.com/api/current-user/friend-list/unfriend/${
                  _item.author.username ?? ''
                }/`,
              );
              setLoading(true);
              refreshAll();
              return;
            },
          },
          {
            text: 'NO',
            onPress: () => {},
          },
        ],
      );
    }
  };

  const onShare = async () => {
    try {
      const shareUrl = await buildLink(item);
      const result = await Share.share({
        message: shareUrl,
        url: item?.gossip_images ? item?.gossip_images[0] : item?.image,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('shared with activity type of result.activityType');
        } else {
          console.log('share');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('dismiss');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const onVote = async () => {
    try {
      await axios.post(
        'https://www.gossipsbook.com/api/gossips/' +
          item.slug +
          '/user/vote/?voted=' +
          vote,
      );
      sendNoti();
    } catch (err) {
      Alert.alert('Gossips', JSON.stringify(err.response.data));
    } finally {
      await refreshAll();
      setVisible(false);
    }
  };

  const handleObjective = async () => {
    setIsObjected((isObjected) => !isObjected);
    try {
      await axios.post(
        'https://www.gossipsbook.com/api/gossips/objections/' + item.slug + '/',
      );
      await refreshAll();
    } catch (err) {
      console.log(err);
    }
  };

  const ThreeDotModal = ({ isAuthor }) => {
    return (
      <Modal visible={showModalChoose} transparent={true} animationType="fade">
        <TouchableOpacity
          onPress={() => setShowModalChoose(false)}
          style={{
            flex: 1,
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            onPress={() => console.log('inside')}
            style={{
              height: 200,
              width: '90%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {!isAuthor && (
              <TouchableOpacity
                style={{
                  borderWidth: 0.5,
                  borderColor: colors.gray,
                  paddingVertical: 10,
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}
                onPress={() => {
                  setShowModalChoose(false);
                  setReportVisible(true);
                }}>
                <Text>Request for Remove</Text>
              </TouchableOpacity>
            )}
            {isAuthor && (
              <TouchableOpacity
                style={{
                  marginTop: 20,
                  borderWidth: 0.5,
                  borderColor: colors.gray,
                  paddingVertical: 10,
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}
                onPress={async () => {
                  try {
                    const res = await axios.post(
                      `https://www.gossipsbook.com/api/gossips/delete/${item.slug}/`,
                    );
                    Alert.alert('Gossips', 'Success!', [
                      {
                        text: 'OK',
                        onPress: () =>
                          navigation.navigate('Main', {
                            screen: 'Home',
                            params: { needUpdated: true },
                          }),
                      },
                    ]);
                  } catch (err) {
                    Alert.alert('Gossips', JSON.stringify(err.response));
                  }
                }}>
                <Text>Delete Gossip</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const voteModal = () => (
    <CustomModal custom visible={visible} transparent>
      <Touchable
        onPress={() => {
          // navigation.navigate('GossipDetail');
          setVisible(false);
        }}
        style={{
          width: '90%',
          borderRadius: 10,
          padding: 10,
          backgroundColor: colors.white,
          height: 170,
          marginHorizontal: 20,
        }}>
        <Text style={{ textAlign: 'center', fontSize: 16, marginTop: 10 }}>
          You have{' '}
          <Text style={{ fontWeight: 'bold' }}>
            {vote == 'true' ? 'Up' : 'Down'}voted
          </Text>{' '}
          for this gossip
        </Text>
        <Text
          style={{
            textAlign: 'center',
            marginTop: 10,
            fontSize: 16,
            fontWeight: 'bold',
          }}>
          Note that you CANNOT undo this action...
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 20,
            paddingTop: 20,
            borderTopWidth: 1,
            borderTopColor: colors.gray,
          }}>
          <Touchable
            onPress={() => setVisible(false)}
            p={10}
            br={10}
            brw={1}
            brc={colors.gray}>
            <Text style={{ color: colors.gray }}>No, Go Back</Text>
          </Touchable>

          <Touchable
            onPress={() => onVote()}
            p={10}
            br={10}
            brw={1}
            brc={colors.blue}
            ml={10}>
            <Text style={{ fontWeight: 'bold', color: colors.blue }}>
              Yes, Continue
            </Text>
          </Touchable>
        </View>
      </Touchable>
    </CustomModal>
  );

  const renderReportModal = () => {
    return (
      <Modal animationType="slide" visible={reportVisible}>
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                height: 100,
                padding: 20,
              }}>
              <TouchableOpacity onPress={() => setReportVisible(false)}>
                <AntDesign
                  name="close"
                  style={{ fontSize: 30, fontWeight: 'bold' }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexGrow: 1,
                paddingHorizontal: 20,
              }}>
              <Text
                style={{
                  marginTop: 20,
                  fontSize: 30,
                  fontWeight: 'bold',
                }}>
                Reason
              </Text>
              <TextInput
                multiline={true}
                numberOfLines={10}
                onChangeText={(reason) => setReason(reason)}
                placeholder="Your Reason..."
                textAlignVertical="top"
                style={{
                  marginTop: 20,
                  paddingLeft: 10,
                  borderWidth: 0.5,
                  borderColor: colors.gray,
                  borderRadius: 10,
                }}
              />
              <TouchableOpacity
                onPress={sendReport}
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
                  Send
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  const sendNoti = async () => {
    const me = await AsyncStorage.getItem('username');
    try {
      var apiconfig = {
        method: 'post',
        url: config.fcmUrl,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `key=${config.senderKey}`,
        },
        data: {
          to: item?.user_push_token,
          notification: {
            title: `Gossipsbook`,
            // body: `${me} said this is ${vote === 'true' ? 'up vote' : 'myth'}`,
            body: `${me} ${
              vote === 'true' ? 'upvoted' : 'downvoted'
            } for this gossip`,
            mutable_content: true,
            sound: 'Tri-tone',
          },
          data: {
            url: 'http://placehold.it/120x120&text=image1',
            type: 'gossip',
            slug: item?.slug,
          },
        },
      };

      console.log('item: ', item);
      console.log('apiconfig: ', apiconfig);

      axios(apiconfig)
        .then(function (response) {
          console.log('Succ Notif');
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log('Error Notif');
          console.log(error);
        });
    } catch (e) {}
  };

  const sendReport = async () => {
    if (!reason.length) {
      Alert.alert('Gossips', 'Reason must be provided!');
      return;
    }
    try {
      const res = await axios.post(
        'https://www.gossipsbook.com/api/request-to-remove/user/gossip/' +
          item.slug +
          '/',
        {
          reason,
        },
      );
      Alert.alert('Gossips', 'Report sent!');
      setReportVisible(false);
    } catch (err) {
      Alert.alert('Gossips', JSON.stringify(err.response.data));
      setReportVisible(false);
    } finally {
      setReason('');
    }
  };

  function youtube_parser(url) {
    var regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return match && match[7].length == 11 ? match[7] : false;
  }
  const getUrl = async () => {
    await setURL(youtube_parser(item.link));
    await setMediaType(item.link.pathname?.split('.')[1]);
  };

  const typesMedia = ['mp4', 'mp3', 'gif'];
  function validateYouTubeUrl(urlToParse) {
    console.log('urlYb', urlToParse);
    if (urlToParse) {
      var regExp =
        /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
      if (urlToParse.match(regExp)) {
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    getUrl();
  }, [item]);
  console.log('item', item);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} size="large" color="" />
      ) : (
        <>
          <ThreeDotModal isAuthor={item?.author?.username == currentUser} />
          {voteModal()}
          {renderReportModal()}
          <ScrollView
            stickyHeaderIndices={[0]}
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={{ flex: 1, backgroundColor: colors.white }}
            contentContainerStyle={{ paddingBottom: 50 }}>
            <View
              style={{
                flexDirection: 'row',
                paddingLeft: 10,
                alignItems: 'center',
                backgroundColor: 'white',
                paddingTop: 25,
              }}>
              <Touchable
                onPress={() => navigation.goBack()}
                zi={2}
                jc
                ac
                size={40}
                ml={10}
                br={20}
                brc="#555"
                brw={1}>
                <Icon name="back" size={18} />
              </Touchable>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  width: '100%',
                  position: 'absolute',
                  marginLeft: 5,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: 20,
                  }}>
                  Gossips
                </Text>
                {item?.interests && (
                  <>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 20,
                        color: colors.black,
                      }}>
                      {' '}
                      /{' '}
                    </Text>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#000080',
                        fontWeight: 'bold',
                        fontSize: 20,
                      }}>
                      {item.interests}
                    </Text>
                  </>
                )}
              </View>

              <Touchable
                onPress={() => {
                  setShowModalChoose(true);
                }}
                jc
                ac
                size={40}
                absolute
                right={10}>
                <Icon name="three_dots" size={40} />
              </Touchable>
            </View>

            <View
              style={{
                flexDirection: 'row',
                paddingLeft: 10,
                marginTop: 20,
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: colors.lightGray,
                  borderRadius: 25,
                  marginLeft: 10,
                }}>
                {item?.author?.profile?.image ? (
                  <FastImage
                    source={{
                      uri: item?.author?.profile?.image,
                    }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                    }}
                  />
                ) : (
                  <Image
                    source={require('../../assets/defaultAvatar.jpeg')}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                    }}
                  />
                )}
              </View>

              <Touchable
                onPress={() => {
                  if (currentUser === item.author.username) {
                    navigation.push('Profile');
                  } else {
                    navigation.push('UserProfile', {
                      username: item.author?.username,
                    });
                  }
                }}
                style={{ marginLeft: 10 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
                  {item.author?.username}
                </Text>
                {/* <Text style={{fontSize: 10, color: colors.gray}}>
                Software Engineer
              </Text> */}
                <Text style={{ fontSize: 11, color: colors.gray }}>
                  {item.author?.designation} -{' '}
                  {new Date(item.date_published).toDateString().slice(4, 10)}
                </Text>
              </Touchable>

              {item.is_friend !== 'Same User' && renderDoor(item)}
            </View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              {item.total_votes > 0 ? item.total_votes : 'No votes so far'}
            </Text>
            {item.total_votes > 0 ? (
              <View
                style={{
                  width: '90%',
                  height: 10,
                  borderRadius: 20,
                  alignSelf: 'center',
                  backgroundColor: 'red',
                  marginVertical: 10,
                }}>
                <>
                  <View
                    style={{
                      backgroundColor: 'green',
                      borderRadius: 20,
                      width: `${item.percentage_true}%`,
                      height: '100%',
                    }}
                  />
                </>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: 'center',
                    lineHeight: 10,
                    marginTop: 4,
                    height: 30,
                    ...Platform.select({
                      ios: {
                        height: '100%',
                      },
                    }),
                  }}>
                  {item?.percentage_true >= item?.percentage_false
                    ? `${parseInt(item.percentage_true)}% people Up voted this`
                    : `${parseInt(
                        item.percentage_false,
                      )}% people Down voted this`}
                </Text>
              </View>
            ) : null}
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Clarity City Bold',
                paddingTop: 20,
                paddingBottom: !!item.link ? 10 : 0,
                lineHeight: 23,
                paddingHorizontal: 20,
              }}>
              {item.title.replace(/\s+/g, ' ').trim()}
            </Text>

            <View
              style={{
                paddingHorizontal: 20,
                // marginBottom: 10,
                marginBottom: validateYouTubeUrl(item.link) ? -12 : -2,
              }}>
              {!!item.link && (
                <>
                  {typesMedia.includes(mediaType) ? (
                    <Video
                      controls
                      source={{
                        uri: item.link,
                      }} // Can be a URL or a local file.
                      style={{ height: 200, width: 350 }}
                    />
                  ) : (
                    <>
                      {validateYouTubeUrl(item.link) ? (
                        <YoutubePlayer
                          height={215}
                          webViewStyle={{ opacity: 0.99 }}
                          play={true}
                          videoId={URL}
                        />
                      ) : (
                        <RNUrlPreview text={item.link} />
                      )}
                    </>
                  )}
                </>
              )}
            </View>
            {item?.gossip_images?.length ? (
              <Swiper
                style={{}}
                height={'30%'}
                onMomentumScrollEnd={(e, state, context) =>
                  console.log('index:', state.index)
                }
                dot={
                  <View
                    style={{
                      backgroundColor: 'rgba(0,0,0,.2)',
                      width: 5,
                      height: 5,
                      borderRadius: 4,
                      marginLeft: 3,
                      marginRight: 3,
                      marginTop: 3,
                      marginBottom: 3,
                    }}
                  />
                }
                activeDot={
                  <View
                    style={{
                      backgroundColor: '#000',
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      marginLeft: 3,
                      marginRight: 3,
                      marginTop: 3,
                      marginBottom: 3,
                    }}
                  />
                }
                paginationStyle={{
                  bottom: parseInt(`-${25}`),
                  justifyContent: 'center',
                }}
                loop>
                {item?.gossip_images?.map((item) => {
                  return (
                    <FastImage
                      width="100%"
                      height={Dimensions.get('screen').width / 1.5}
                      resizeMode="contain"
                      style={{
                        height: Dimensions.get('screen').width / 1.5,
                        width: '100%',
                      }}
                      source={{ uri: item?.image }}
                    />
                  );
                })}
              </Swiper>
            ) : null}
            <Text
              style={{
                paddingHorizontal: 20,
                marginTop: 5,
                fontSize: 16,
                lineHeight: 20,
                fontFamily: 'Clarity City Regular',
              }}>
              {item.content}
            </Text>
          </ScrollView>
          <View
            style={{
              paddingBottom: 20,
            }}>
            <Text
              style={{
                height: 4,
                width: '100%',
                backgroundColor: colors.lightGray,
              }}
            />

            {/* Temporarily hidden */}

            {/* {item.author?.username == currentUser &&
              <View style={{ width: '100%', borderBottomColor: colors.lightGray, borderBottomWidth: 1, marginBottom: -10, flexDirection: 'row' }} >
                <TouchableOpacity onPress={() => navigation.navigate('Edit Gossip', { item })} style={{ flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }} >
                  <MaterialIcon size={18} name="edit" />
                  <Text style={{ paddingHorizontal: 10, fontSize: 16 }}>Edit</Text>
                </TouchableOpacity>
              </View>
            } */}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  marginRight: 'auto',
                  marginLeft: 10,
                  marginVertical: 10,
                  paddingBottom: 20,
                  width: screenWidth,
                }}>
                <>
                  {/* {item.} */}
                  {item.current_user_vote !== null ? (
                    <View
                      style={{
                        position: 'absolute',
                        left: 0,

                        // top: -10,
                        flexDirection: 'row',
                        // paddingHorizontal: 6,
                        paddingVertical: 10,
                        opacity: 0.3,
                      }}>
                      <Icon name="true_icon" size={20} />
                    </View>
                  ) : (
                    <Touchable
                      onPress={() => {
                        setVisible(true);
                        setVote('true');
                      }}
                      absolute
                      left={0}
                      //top={-10}
                      row
                      // ph={6}
                      //  pv={10}
                      style={{ alignItems: 'center' }}>
                      {/*<Image*/}
                      {/*  resizeMode="contain"*/}
                      {/*  style={{*/}
                      {/*    height: 32,*/}
                      {/*    width: 32,*/}
                      {/*  }}*/}
                      {/*  source={icons.true_icon}*/}
                      {/*/>*/}
                      <Icon name="true_icon" size={20} />
                    </Touchable>
                  )}
                  <View
                    style={{
                      position: 'absolute',
                      left: 25,
                      //top: -10,
                      flexDirection: 'row',
                      // paddingLeft: 6,
                      paddingVertical: 10,
                      marginLeft: 0,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 16,
                        fontWeight: 'bold',
                      }}>
                      VOTE
                    </Text>
                  </View>
                  {item.current_user_vote !== null ? (
                    <View
                      style={{
                        position: 'absolute',
                        left: 60,
                        //top: -10,
                        flexDirection: 'row',
                        // paddingHorizontal: 6,
                        paddingVertical: 10,
                        marginLeft: 10,
                        opacity: 0.3,
                        alignItems: 'center',
                      }}>
                      {/*<Image*/}
                      {/*  resizeMode="cover"*/}
                      {/*  style={{*/}
                      {/*    //marginStart: 10,*/}
                      {/*    height: 32,*/}
                      {/*    width: 32,*/}
                      {/*  }}*/}
                      {/*  source={icons.false_icon}*/}
                      {/*/>*/}
                      <Icon name="false_icon" size={20} />
                    </View>
                  ) : (
                    <Touchable
                      onPress={() => {
                        setVisible(true);
                        setVote('false');
                      }}
                      absolute
                      left={60}
                      /// top={-10}
                      row
                      // ph={6}
                      ml={10}
                      // pv={10}
                      style={{ alignItems: 'center' }}>
                      {/*<Image*/}
                      {/*  resizeMode="contain"*/}
                      {/*  style={{*/}
                      {/*    //marginStart: 10,*/}
                      {/*    height: 32,*/}
                      {/*    width: 32,*/}
                      {/*  }}*/}
                      {/*  source={icons.false_icon}*/}
                      {/*/>*/}
                      <Icon name="false_icon" size={20} />
                    </Touchable>
                  )}
                </>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '60%',
                }}>
                <TouchableOpacity
                  onPress={handleObjective}
                  style={{
                    marginRight: 20,
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  {isObjected ? (
                    <Icon name="objection_active" size={20} />
                  ) : (
                    <Icon name="objection" size={20} />
                  )}
                  {item.total_objections !== null && (
                    <Text style={{ fontSize: 12, marginLeft: 3 }}>
                      {item.total_objections}
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Comment', {
                      slug: item.slug,
                      is_friend: item?.is_friend,
                    })
                  }
                  style={{
                    marginRight: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icon name="comment" size={20} />
                  {item.total_comments !== null && (
                    <Text style={{ fontSize: 12, marginLeft: 3 }}>
                      {item.total_comments}
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onShare}
                  style={{
                    marginRight: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icon name="share" size={20} />
                  {/*{item.shares !== null && (*/}
                  {/*    <Text style={{fontSize: 12, marginLeft: 3}}>*/}
                  {/*        {item.shares}*/}
                  {/*    </Text>*/}
                  {/*)}*/}
                </TouchableOpacity>
              </View>
            </View>
            {!!item.footer_comments && (
              <Touchable
                onPress={() =>
                  navigation.navigate('Comment', {
                    slug: item.slug,
                    is_friend: item?.is_friend,
                  })
                }
                style={{
                  marginHorizontal: 20,
                  backgroundColor: colors.lightGray,
                  marginTop: 10,
                  borderRadius: 20,
                  paddingVertical: 10,
                }}>
                <Text style={{ textAlign: 'center' }}>
                  {item.footer_comments}
                </Text>
              </Touchable>
            )}
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                marginHorizontal: 25,
                justifyContent: 'space-between',
              }}>
              {item.current_user_vote !== null ? (
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Text>You have {''}</Text>
                  {item.current_user_vote === true ? (
                    <Text
                      style={{
                        color: colors.up,
                        fontWeight: 'bold',
                      }}>
                      Up
                    </Text>
                  ) : (
                    <Text
                      style={{
                        color: colors.down,
                        fontWeight: 'bold',
                      }}>
                      Down
                    </Text>
                  )}
                  <Text> Voted</Text>
                </View>
              ) : (
                <View></View>
              )}
              <View>
                <Text style={{ color: 'black' }}>views {item.views}</Text>
              </View>
            </View>
          </View>
        </>
      )}
    </TouchableWithoutFeedback>
  );
};

export default GossipDetail;
