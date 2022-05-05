import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
  useLayoutEffect
} from 'react';
import {
  View,
  Text,
  Share,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  RefreshControl,
  FlatList,
  Alert,
  AppState,
  DeviceEventEmitter,
  useWindowDimensions,
  PermissionsAndroid,
  Button,
  Platform,
  findNodeHandle
} from 'react-native';

import { colors, config } from '../../constants';
import {
  Input,
  Touchable,
  Icon,
  GossipItem,
  Modal as CustomModal,
} from '../../components';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import ZegoExpressEngine, {
  ZegoTextureView,
  ZegoScenario,
  ZegoUpdateType,
} from 'zego-express-engine-reactnative';
import {ZegoExpressManager} from '../../components/ZegoExpressManager';
import ModalCreateStatus from './ModalCreateStatus';
import Swiper from 'react-native-swiper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { MainContext, useMainApp, withMainContext } from '../../context';
import { useUser } from '../../../App';
import { UserContext } from '../../context/UserProvider';
import { FAB, Icon as SimpleIcon } from 'react-native-elements';
import { EVENTS } from '../../constants/config';
import { TextInput } from 'react-native-gesture-handler';
import { shadow } from '../../constants/layout';
import PollItem from '../../components/PollItem';
import { PollContext, POLL_EVENTS } from '../../context/PollProvider';
import { buildLink } from '../../helpers';

const { width, height } = Dimensions.get('screen');

function useForceUpdate() {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
    setTick((tick) => tick + 1);
  }, []);
  return update;
}

const Home = ({ navigation, route }) => {
  const [currentScreen, setCurrentScreen] = useState('Home')
  const [streamID, setStreamID] = useState('')
  const [userID, setUserID] = useState('')
  const { setUsers, users } = useUser();
  const forceUpdate = useForceUpdate();
  const forceUpdate1 = React.useReducer((bool) => !bool)[1];
  const [search, setSearch] = useState(null);
  const [currentUser, setCurrentUser] = useState('');
  const [fakeData, setfakeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextURL, setNextURL] = useState(null);
  const [statusList, setStatusList] = useState([]);
  const [myStatus, setMyStatus] = useState(null);
  const [suggestionList, setSuggestionList] = useState([]);
  const [nextPageStatusList, setNextPageStatusList] = useState(null);
  const [statusListLoadMore, setStatusListLoadMore] = useState(false);
  const [showModalCreateStatus, setShowModalCreateStatus] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const cameraRef = useRef(null);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [showStatusDetail, setShowStatusDetail] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(null);

  const [visible, setVisible] = useState(false);
  const [vote, setVote] = useState(false);
  const [item, setItem] = useState(null);
  const [isObjected, setIsObjected] = useState(null);

  let grantedAudio, grantedCamera;
  if (Platform.OS === 'android') {
    grantedAudio = PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    );
    grantedCamera = PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
  }
  const now = new Date().getTime();
  const zegoConfig = {
    appID: 2064961917,
    userID: '',
    userName: '',
    roomID: 'gossipbookroom',
  };

  const appState = useRef(AppState.currentState);
  const socketActiveInactive = useRef();

  useEffect(() => {
    initSDK();
    AsyncStorage.getItem('token', (err, access_token) => {
      socketActiveInactive.current = new WebSocket(
        `wss://gossipsbook.com/active/${access_token}/`,
      );
      socketActiveInactive.current.onopen = function (e) {
        console.log('[open] Connection established for Active In-active');
      };

      socketActiveInactive.current.onmessage = async function (event) {
        try {
          const status = JSON.parse(event?.data);
          const onlineUsername = Object.keys(status?.active_status)[0];
          const isActive =
            status?.active_status[`${onlineUsername}`] === 'active';
          //add to list
          const list = (await AsyncStorage.getItem('ActiveUsers')) || '[]';
          let users = JSON.parse(list);
          const isAlreadyInList = users?.includes(onlineUsername);
          if (isActive && !isAlreadyInList) {
            users.push(onlineUsername);
          } else if (!isActive && isAlreadyInList) {
            users = users.filter((user) => user !== onlineUsername);
          }
          AsyncStorage.setItem('ActiveUsers', JSON.stringify(users));
          setUsers(users);
        } catch (error) {
          console.log(error);
        }
      };
      socketActiveInactive.current.onclose = function (event) {
        if (event.wasClean) {
          console.log(
            `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`,
          );
        } else {
          // e.g. server process killed or network down
          // event.code is usually 1006 in this case
        }
      };

      socketActiveInactive.current.onerror = function (error) {
        alert(`[error] ${error.message}`);
        console.log('error from socketactive', error);
      };
    });

    return () => {
      setCurrentScreen('Home');
      socketActiveInactive?.current?.removeEventListener('message');
      socketActiveInactive?.current?.close();
    };
  }, []);

  useEffect(() => {
    const sub = navigation.addListener('focus', () => {
      setSearch(null);
    });
    return () => {
      (sub ? sub() : null);
      setCurrentScreen('Home');
    };
  }, [navigation]);

  const initSDK = () => {
    console.warn('init SDK');
    const profile = {
      appID: zegoConfig.appID,
      scenario: ZegoScenario.General,
    };
    ZegoExpressManager.createEngine(profile).then(async (engine) => {
      // Android: Dynamically obtaining device permissions
      if (Platform.OS === 'android') {
        const permissions = [];
        try {
          const result1 = await grantedAudio;
          const result2 = await grantedCamera;
          if (!result1) {
            permissions.push(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
          }
          if (!result2) {
            permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);
          }
        } catch (error) {
          permissions.push(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.CAMERA,
          );
        }
        PermissionsAndroid.requestMultiple(permissions).then(data => {
          console.warn('requestMultiple', data);
        });
      }
      
      // Register callback
      ZegoExpressManager.instance().onRoomUserUpdate(
        (updateType, userList, roomID) => {
          // console.warn('out roomUserUpdate', updateType, userList, roomID);
          // userList.forEach(userID => {
          //   if (updateType === ZegoUpdateType.Add) {
          //     this.setState({ showPlay: true }, () => {
          //       ZegoExpressManager.instance().setRemoteVideoView(
          //         userID,
          //         findNodeHandle(this.zegoPlayViewRef.current),
          //       );
          //     });
          //     console.log('SHOW REMOTE: ', userID)
          //     console.log('ZegoUpdateType.Add: ', ZegoUpdateType.Add)
          //     console.log('updateType: ', updateType)
          //   } else {
          //     console.log('SHOW PLAY FALSE')
          //     this.setState({ showPlay: false });
          //   }
          // });
        },
      );
      
      ZegoExpressManager.instance().onRoomStreamUpdate(
        (updateType, streamList, roomID) => {
          if (updateType) {
            setCurrentScreen('Home');
          } else {
            console.warn('INDEX onRoomStreamUpdate', updateType, streamList, roomID);
            setCurrentScreen('AnswerCall');
            console.warn('currentScreen: ', currentScreen)
            setStreamID(streamList[0].streamID);
            setUserID(streamList[0].userID);
            // navigation.navigate('VideoCall', { 
              //   streamID: streamList[0].streamID,
              //   userID: streamList[0].userID,
              // })
          }
        },
      );

      ZegoExpressManager.instance().onRoomUserDeviceUpdate(
        (updateType, userID, roomID) => {
          console.warn('out roomUserDeviceUpdate', updateType, userID, roomID);
        },
      );

      ZegoExpressManager.instance().onRoomTokenWillExpire(
        async (roomID, remainTimeInSecond) => {
          console.warn('out roomTokenWillExpire', roomID, remainTimeInSecond);
          const token = (await generateToken()).token;
          ZegoExpressEngine.instance().renewToken(roomID, token);
        },
      );
    });
  };

  const generateToken = async () => {
    const data = await fetch(`https://www.gossipsbook.com/api/voicecall/token/gossipbookroom/${zegoConfig.userName}/`, {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + (await AsyncStorage.getItem('token')),
      }
    });
    return await data.json();
  };

  const joinRoom = async () => {
    const token = (await generateToken()).token;
    ZegoExpressManager.instance()
      .joinRoom(zegoConfig.roomID, token, {
        userID: zegoConfig.userID,
        userName: zegoConfig.userName,
      })
      .then(result => {
        if (result) {
          console.warn('Login successful index');
          console.warn(result);
          console.warn(zegoConfig);
          // this.setState({
          //   showHomePage: false,
          //   showPreview: true,
          // }, () => {
          //   ZegoExpressManager.instance().setLocalVideoView(
          //     findNodeHandle(this.zegoPreviewViewRef.current),
          //   );
          // });
        } else {
          console.error('Login failed');
        }
      })
      .catch(() => {
        console.error('Login failed');
      });
  };

  const getAllData = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const res = await axios.get(
        'https://www.gossipsbook.com/api/current-user/feed/',
      );
      const { data } = res;
      setfakeData(
        data.results.map((i, id) =>
          id === 0 ? { ...i, type: 'suggestion' } : i,
        ),
      );
      if (data.next !== null) setNextURL(data.next);
      await AsyncStorage.setItem('currentList', JSON.stringify(data.results));
      const user = await AsyncStorage.getItem('username');

      // Zego Config
      zegoConfig.userID = user;
      zegoConfig.userName = user;
      joinRoom();

      setCurrentUser(user);
      const res1 = await axios.get(
        'https://www.gossipsbook.com/api/current-user/profile/retrieve/',
      );

      setCurrentAvatar(res1.data.profile.image);

      const res2 = await axios.get(
        'https://www.gossipsbook.com/api/current-user/status/feed/',
      );

      const newStatusList = res2.data.results.filter((i) => i.username);
      if (newStatusList[0]) {
        const myStatus =
          newStatusList[0].status_data && newStatusList[0].status_data[0];
        setMyStatus(myStatus);
        setStatusList(newStatusList, 'status data');
        setNextPageStatusList(res2.data.next);
      }
      const res3 = await axios.get(
        'https://www.gossipsbook.com/api/user/friend-suggestion/',
      );
      setSuggestionList(
        res3.data.results.filter((sugg) => sugg.is_friend === false),
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const [scrollToTopButtonVisible, setScrollToTopButtonVisibility] = useState(false);

  useEffect(() => {
    if (route.params?.needUpdated) {
      getAllData();
    } else {
      console.log('no need update');
    }
  }, [route]);

  const mainFlatList = useRef(null);

  const handleClickMyStatus = async () => {
    console.log('13131');
    try {
      const res = await axios.get(
        'https://www.gossipsbook.com/api/current-user/status/',
      );
      setSelectedStatus(res.data);
      setShowStatusDetail(true);
    } catch (err) {
      Alert.alert('Gossips', JSON.stringify(err.response.data));
    }
  };

  const onRefresh = async () => {
    await getAllData();
  };

  useEffect(() => {
    (async () => {
      await getAllData();
    })();
  }, []);

  const onShare = async (item) => {
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
      alert('onShare', error.message);
    }
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
            {vote ? 'Up' : 'Down'}voted
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
            onPress={() => onVoteApi()}
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

  const sendNoti = async () => {
    const me = await AsyncStorage.getItem('username');

    const res = await axios.get(
      'https://www.gossipsbook.com/api/gossips/update/' + item.slug + '/',
    );

    try {
      var apiconfig = {
        method: 'post',
        url: config.fcmUrl,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `key=${config.senderKey}`,
        },
        data: {
          to: res?.data.user_push_token,
          notification: {
            title: `Gossipsbook`,
            // body: `${me} said this is ${vote ? 'up vote' : 'myth'}`,
            body: `${me} ${vote ? 'upvoted' : 'downvoted'} for this gossip`,
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

      axios(apiconfig)
        .then(function (response) {
          console.log('Succ Notif');
        })
        .catch(function (error) {
          console.log('Error Notif');
          console.log(error);
        });
    } catch (e) {}
  };

  const onVoteApi = async () => {
    try {
      await axios.post(
        'https://www.gossipsbook.com/api/gossips/' +
          item.slug +
          '/user/vote/?voted=' +
          vote,
      );
      console.log('Succc: ');

      const fD = fakeData;
      const newFD = fD.map((m) => {
        if (m.slug == item.slug) {
          m.user_vote = true;
        }
        return m;
      });
      setfakeData(newFD);
      sendNoti();
    } catch (err) {
      console.log('err: ', err);
      Alert.alert('Gossips', JSON.stringify(err.response.data));
    } finally {
      setVisible(false);
    }
  };

  const onVote = (vote, item) => {
    setVote(vote);
    setVisible(true);
    setItem(item);
  };

  const onHand = async (item) => {
    axios
      .post(
        'https://www.gossipsbook.com/api/gossips/objections/' + item.slug + '/',
      )
      .then(() => {
        const fD = fakeData;
        const newFD = fD.map((m) => {
          if (m.slug == item.slug) {
            m.user_objected = !m.user_objected;
            m.total_objections = !m.user_objected
              ? m.total_objections - 1
              : m.total_objections + 1;
          }
          return m;
        });
        setfakeData(newFD);
      })
      .catch(() => {
        console.log('ERRR');
      });
  };

  const onSearch = () => {
    navigation.navigate('Search', {
      search,
    });
  };

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

  const isCloseToLeft = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return contentOffset.x == 0;
  };

  const isCloseToRight = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    return layoutMeasurement.width + contentOffset.x >= contentSize.width - 1;
  };

  const loadMore = async () => {
    setLoading(true);
    if (nextURL !== null) {
      setTimeout(async () => {
        try {
          const res = await axios.get(nextURL.replace('http:', 'https:'), {
            headers: {
              Authorization: 'Token ' + (await AsyncStorage.getItem('token')),
              'Content-Type': 'application.json',
            },
          });
          const { results } = res.data;
          const temp = JSON.parse(JSON.stringify(fakeData));
          if (results.length > 0) setfakeData([...temp, ...results]);
          setNextURL(res.data.next);
          await AsyncStorage.setItem(
            'currentList',
            JSON.stringify([...temp, ...results]),
          );
          setLoading(false);
        } catch (err) {
          setLoading(false);
          console.log('load more error:', err);
        }
      }, 1000);
    } else {
      setLoading(false);
    }
  };

  const loadMoreStatus = async () => {
    if (nextPageStatusList !== null) {
      try {
        const res = await axios.get(nextPageStatusList);
        const { results, next } = res.data;
        const temp = JSON.parse(JSON.stringify(statusList));
        if (results.length > 0) setStatusList([...temp, ...results]);
        setStatusListLoadMore(false);
        setNextPageStatusList(next);
      } catch (err) {
        console.log(err);
        setStatusListLoadMore(false);
      }
    } else {
      setStatusListLoadMore(false);
    }
  };

  const handleCreateStatus = () => {
    setShowModalCreateStatus(true);
  };

  const handleClickStatusDetail = (item) => {
    setShowStatusDetail(true);
    setSelectedStatus(item);
  };

  const [newNotifications, setNewNotifications] = useState(0);

  useEffect(() => console.log('LOADING', loading), [loading]);

  const checkNewNotifications = async () => {
    const res = await axios.get(
      'https://www.gossipsbook.com/api/notifications/',
    );
    const { results } = res.data;
    AsyncStorage.getItem('readNotifications', (err, readNotifications) => {
      if (err) return;
      readNotifications = readNotifications || [];
      setNewNotifications(
        results
          .map((value) => value.id)
          .filter((id) => !readNotifications.includes(id)).length,
      );
    });
  };

  useEffect(() => {
    checkNewNotifications();
    const notificationOpenListener = DeviceEventEmitter.addListener(
      EVENTS.NOTIFICATION_OPENED,
      checkNewNotifications,
    );
    return () =>
      notificationOpenListener ? notificationOpenListener.remove() : null;
  }, []);

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

  const [showModalEmail, setShowModalEmail] = useState(false);
  const [email, setEmail] = useState('');

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

  const { getPhotoPollList } = useContext(PollContext);
  const [polls, setPolls] = useState({ page: 1, list: [], loading: true });

  useEffect(() => {
    getPhotoPollList(setPolls, { page: polls.page });
    const newPollListener = DeviceEventEmitter.addListener(
      POLL_EVENTS.NEW_POLL_ADDED,
      () => getPhotoPollList(setPolls, { page: polls.page }),
    );
    return () => newPollListener.remove();
  }, []);

  const windowDimensions = useWindowDimensions();

  const PhotoPolls = () =>
    polls?.list.length > 0 && (
      <FlatList
        data={polls.list}
        horizontal
        ListEmptyComponent={() =>
          !polls.loading && <Error message="No Photo Polls Found" />
        }
        contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white' }}
        ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
        ListFooterComponent={() =>
          polls.loading && (
            <ActivityIndicator
              color={colors.primary}
              size={'large'}
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                width: windowDimensions.width - 30,
                padding: 20,
              }}
            />
          )
        }
        renderItem={({ item, index }) => <PollItem narrow item={item} />}
      />
    );

  if (currentScreen === 'Home') {
    return (
      <>
        <ModalCreateStatus
          showModalCreateStatus={showModalCreateStatus}
          setShowModalCreateStatus={setShowModalCreateStatus}
          cameraRef={cameraRef}
        />
        {renderSendEmail()}
        <Modal visible={showStatusDetail} animationType="slide">
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
            }}>
            <View
              style={{
                flexDirection: 'row',
                height: 100,
                backgroundColor: 'white',
                paddingHorizontal: 20,
                alignItems: 'center',
              }}>
              <TouchableOpacity onPress={() => setShowStatusDetail(false)}>
                <AntDesign
                  name="close"
                  style={{ fontSize: 30, fontWeight: 'bold' }}
                />
              </TouchableOpacity>
              <Text style={{ marginLeft: '30%' }}>
                {selectedStatus?.username ?? ''}
              </Text>
            </View>
            <View
              style={{
                flexGrow: 1,
              }}>
              {!!selectedStatus.status_data ? (
                <Swiper
                  showsPagination={false}
                  showsButtons={selectedStatus.status_data.length > 1}
                  prevButton={
                    <View
                      style={{
                        height: 40,
                        width: 40,
                        borderRadius: 20,
                        backgroundColor: '#FFFFFF',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 25,
                        }}>
                        ‹
                      </Text>
                    </View>
                  }
                  nextButton={
                    <View
                      style={{
                        height: 40,
                        width: 40,
                        borderRadius: 20,
                        backgroundColor: '#FFFFFF',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 25,
                        }}>
                        ›
                      </Text>
                    </View>
                  }>
                  {selectedStatus.status_data.map((stt, id) => {
                    return (
                      <View
                        key={id}
                        style={{
                          flex: 1,
                        }}>
                        {stt.image === null ? (
                          <View
                            style={{
                              flex: 1,
                              backgroundColor: stt.background_color,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text style={{}}>{stt.text}</Text>
                          </View>
                        ) : (
                          <>
                            {!!stt.text && (
                              <View
                                style={{
                                  flex: 1,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Text
                                  style={{ fontSize: 20, fontWeight: 'bold' }}>
                                  {stt.text}
                                </Text>
                              </View>
                            )}
                            {!!stt.image && (
                              <Image
                                resizeMode="contain"
                                style={{
                                  flex: 2,
                                }}
                                source={{
                                  uri: stt.image,
                                }}
                              />
                            )}
                          </>
                        )}
                        {selectedStatus.username !== currentUser && (
                          <View
                            style={{
                              flexDirection: 'row',
                              height: 100,
                              backgroundColor: 'white',
                              paddingHorizontal: 20,
                              alignItems: 'center',
                            }}>
                            <Input
                              style={{
                                width: '80%',
                                height: 50,
                                paddingLeft: 10,
                                backgroundColor: '#EEF1FE',
                                borderRadius: 10,
                                marginHorizontal: 10,
                              }}
                              placeholder={`Reply to ${selectedStatus.username}`}
                            />
  
                            <Touchable
                              onPress={() => {
                                console.log(stt);
                              }}
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
                        )}
                      </View>
                    );
                  })}
                </Swiper>
              ) : (
                <Text>You have not created any statuses!</Text>
              )}
            </View>
          </View>
        </Modal>
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> */}
        <>
          <View
            style={{
              paddingTop: 10,
              paddingBottom: 8,
              paddingHorizontal: 10,
              flexDirection: 'row',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#fefefe',
              zIndex: -1,
            }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>Hello</Text>
              {currentUser !== null && currentUser.length > 0 && (
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 25,
                    fontWeight: 'bold',
                    color: '#000080',
                    textTransform: 'capitalize',
                  }}>
                  {currentUser ?? ' '}
                </Text>
              )}
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Touchable
                onPress={() => navigation.navigate('TopGossipers')}
                style={{
                  marginLeft: 10,
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  borderWidth: 0.5,
                  borderColor: '#000080',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Feather name="trending-up" size={25} />
              </Touchable>
              <Touchable
                onPress={() => navigation.navigate('Notification')}
                style={{
                  marginLeft: 10,
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  borderWidth: 0.5,
                  borderColor: '#000080',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {newNotifications > 0 && (
                  <Text
                    style={{
                      backgroundColor: colors.red,
                      color: 'white',
                      paddingHorizontal: 5,
                      elevation: 2,
                      borderRadius: 10,
                      position: 'absolute',
                      top: -7,
                      right: -7,
                    }}>
                    {newNotifications}
                  </Text>
                )}
                <Icon name="notification" size={24} />
              </Touchable>
            </View>
          </View>
          <ScrollView
            onMomentumScrollEnd={(e) => {
              let offset = e.nativeEvent.contentOffset.y;
              setScrollToTopButtonVisibility(offset == 0 ? false : true);
            }}
            ref={mainFlatList}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            stickyHeaderIndices={[]}
            style={{
              flex: 1,
              backgroundColor: colors.white,
            }}
            contentContainerStyle={{
              paddingHorizontal: 0,
              paddingBottom: 40,
            }}
            showsVerticalScrollIndicator={false}
            onScroll={async ({ nativeEvent }) => {
              // if (isCloseToTop(nativeEvent)) {
              //   setLoading(false);
              // }
              if (isCloseToBottom(nativeEvent)) {
                await loadMore();
              }
            }}
            nestedScrollEnabled
            scrollEventThrottle={400}
            bounces={false}>
            <Input
              rightIcon="search"
              rightIconSize={28}
              rightAction={onSearch}
              style={{
                marginVertical: 5,
                marginHorizontal: 10,
                borderColor: 'gray',
                color: 'gray',
                borderWidth: 0.5,
                borderRadius: 10,
                paddingLeft: 10,
                height: 60,
              }}
              value={search}
              onChangeText={(text) => setSearch(text)}
              placeholder="Search gossip..."
              onSubmitEditing={onSearch}
              onPress={onSearch}
              returnKeyType="search"
              autoCapitalize="none"
            />
  
            <View
              style={{
                zIndex: 2,
                backgroundColor: colors.white,
                flexDirection: 'row',
                marginTop: 10,
              }}>
              <ScrollView
                onScroll={async ({ nativeEvent }) => {
                  if (isCloseToLeft(nativeEvent)) {
                    console.log('left');
                    setStatusListLoadMore(false);
                  }
                  if (isCloseToRight(nativeEvent)) {
                    console.log('right');
                    setStatusListLoadMore(true);
                    loadMoreStatus();
                  }
                }}
                showsHorizontalScrollIndicator={false}
                horizontal={true}>
                {myStatus && (
                  <View>
                    <TouchableOpacity
                      onPress={handleClickMyStatus}
                      style={{
                        padding: 4,
                        borderColor: '#000080',
                        borderRadius: 1000,
                        borderWidth: 2,
                        marginRight: 10,
                        width: 62,
                        height: 62,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 1000,
                          backgroundColor:
                            !myStatus.image && myStatus.background_color,
                        }}
                        source={{ uri: myStatus.image }}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        position: 'absolute',
                        top: 20,
                        left: 15,
                        maxWidth: 50,
                        alignSelf: 'center',
                      }}
                      ellipsizeMode="tail"
                      numberOfLines={1}>
                      {myStatus.text}
                    </Text>
                    <Text>My Status</Text>
                  </View>
                )}
                {myStatus &&
                  statusList
                    .filter((i) => i.status_data)
                    .map((i, ind) => {
                      return (
                        <View
                          key={i.username}
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <TouchableOpacity
                            onPress={() => handleClickStatusDetail(i)}
                            style={{
                              padding: 4,
                              borderColor: '#000080',
                              borderRadius: 1000,
                              borderWidth: 2,
                              marginRight: 10,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Image
                              style={{
                                width: 50,
                                height: 50,
                                borderRadius: 1000,
                                backgroundColor: i.status_data
                                  ? i?.status_data[ind + 1]?.background_color
                                  : 'lightblue',
                              }}
                              source={{
                                uri:
                                  i.status_data && i?.status_data[ind + 1]?.image,
                              }}
                            />
                          </TouchableOpacity>
                          <Text
                            style={{
                              position: 'absolute',
                              top: 20,
                              left: 15,
                              maxWidth: 50,
                              alignSelf: 'center',
                            }}
                            ellipsizeMode="tail"
                            numberOfLines={1}>
                            {i.status_data && i?.status_data[ind + 1]?.text}
                          </Text>
                          <Text
                            style={{
                              maxWidth: 50,
                              alignSelf: 'center',
                            }}
                            ellipsizeMode="tail"
                            numberOfLines={1}>
                            {i?.username}
                          </Text>
                        </View>
                      );
                    })}
                {statusListLoadMore && (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <ActivityIndicator size="large" color="#000080" />
                  </View>
                )}
              </ScrollView>
            </View>
  
            <FlatList
              // ref={mainFlatList}
              style={{ backgroundColor: 'rgba(0,0,0,.05)' }}
              data={fakeData.filter((item) => !item.blocked)}
              extraData={fakeData.filter((item) => !item.blocked)}
              keyExtractor={(item) => item.id.toString()}
              removeClippedSubviews={true}
              initialNumToRender={3}
              renderItem={({ item, index }) => (
                <View key={item.id} style={index === 0 && { marginTop: -10 }}>
                  <GossipItem
                    {...item}
                    onShare={onShare}
                    onVote={onVote}
                    onHand={onHand}
                    navigate={navigation.navigate}
                  />
                  {index == 0 && (
                    <View>
                      <View
                        style={{
                          paddingHorizontal: 10,
                          paddingTop: 20,
                          paddingBottom: 10,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: colors.white,
                        }}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            fontSize: 18,
                            color: '#000080',
                            //marginLeft: 10,
                          }}>
                          Photo Polls
                        </Text>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('Polls')}>
                          <Text
                            style={{
                              fontSize: 16,
                              color: '#000080',
                            }}>
                            View all
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <PhotoPolls />
                    </View>
                  )}
                  {index == 9 && (
                    <View>
                      <View
                        style={{
                          paddingHorizontal: 10,
                          paddingTop: 20,
                          paddingBottom: 10,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: colors.white,
                        }}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            fontSize: 18,
                            color: '#000080',
                            //marginLeft: 10,
                          }}>
                          New gossipers
                        </Text>
                        <TouchableOpacity
                          onPress={() => navigation.navigate('SuggestionList')}>
                          <Text
                            style={{
                              fontSize: 16,
                              color: '#000080',
                            }}>
                            View all
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <ScrollView
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}>
                        {suggestionList.map((suggestion, id) => (
                          <View
                            style={{
                              padding: 10,
                              marginRight: 0,
                              height: width * 0.8,
                              width: width / 2,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: colors.white,
                              margin: 5,
                              shadowColor: 'black',
                              shadowOffset: { width: 1, height: 1 },
                              shadowRadius: 2,
                              shadowOpacity: 0.26,
                              elevation: 3,
                              marginEnd: 10,
                            }}
                            key={suggestion.username}>
                            <View
                              style={{
                                backgroundColor: '#fff',
                                ...shadow,
                                borderRadius: 400 / 2 - 20,
                                width: 330 / 2 - 17.5,
                                height: 330 / 2 - 17.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <Image
                                resizeMode="cover"
                                style={{
                                  height: 320 / 2 - 20,
                                  width: 320 / 2 - 20,
                                  borderRadius: 170,
                                }}
                                source={
                                  suggestion.profile?.image !== null
                                    ? {
                                        uri: suggestion?.profile.image,
                                      }
                                    : require('../../assets/defaultAvatar.jpeg')
                                }
                              />
                            </View>
                            <Text>{suggestion.username}</Text>
                            {suggestion.designation ? (
                              <Text style={{ fontStyle: 'italic' }}>
                                {suggestion.designation}
                              </Text>
                            ) : (
                              <Text> </Text>
                            )}
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate('SuggestionList')
                              }
                              style={{
                                backgroundColor:
                                  suggestion.is_friend === 'False' ||
                                  suggestion.is_friend === false
                                    ? '#000080'
                                    : colors.white,
                                padding: 10,
                                borderRadius: 20,
                                ...shadow,
                                marginTop: 10,
                              }}>
                              <Text
                                style={{
                                  color:
                                    suggestion.is_friend === 'False' ||
                                    suggestion.is_friend === false
                                      ? colors.white
                                      : colors.black,
                                }}>
                                {suggestion.is_friend === 'False' ||
                                suggestion.is_friend === false
                                  ? 'Add Friend'
                                  : 'Request Sent'}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ))}
                        <TouchableOpacity
                          onPress={() => setShowModalEmail(true)}
                          style={{
                            padding: 10,
                            marginRight: 0,
                            height: width * 0.8,
                            width: width / 2,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: colors.white,
                            margin: 5,
                            shadowColor: 'black',
                            shadowOffset: { width: 1, height: 1 },
                            shadowRadius: 2,
                            shadowOpacity: 0.26,
                            elevation: 3,
                            marginEnd: 10,
                          }}>
                          <SimpleIcon
                            style={{ opacity: 0.5 }}
                            size={80}
                            name="add"
                            color={colors.primary}
                          />
                          <Text
                            style={{
                              fontWeight: 'bold',
                              color: colors.primary,
                              fontSize: 16,
                            }}>
                            Invite Friend
                          </Text>
                        </TouchableOpacity>
                      </ScrollView>
                    </View>
                  )}
                </View>
              )}
            />
            <View style={{ height: 50 }}></View>
            {loading && (
              <ActivityIndicator
                size="large"
                color="#000080"
                style={{ marginBottom: 20 }}
              />
            )}
          </ScrollView>
        </>
        {/* </TouchableWithoutFeedback> */}
        {currentScreen === 'Home' ?
          <TouchableOpacity
            style={{ position: 'absolute', bottom: 20, right: 20, elevation: 20 }}
            onPress={() => console.log('some')}>
            <FAB
              color={colors.primary}
              visible={scrollToTopButtonVisible}
              onPress={() => {
                mainFlatList.current?.scrollTo();
                setScrollToTopButtonVisibility(false);
              }}
              containerStyle={{}}
              icon={<SimpleIcon name="expand-less" color={colors.white} />}
            />
          </TouchableOpacity>
        : null}
        {voteModal()}
      </>
    );
  } else {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Image style={{height: 100, width: 100, marginBottom: 20, marginTop: 50}} source={require('../../assets/images/user.png')} />
          <Text style={{color: 'white', fontSize: 17, marginBottom: 10}}>{userID}</Text>
          <Text style={{color: 'white'}}>Calling...</Text>
        </View>
        <View style={{position: 'absolute', flexDirection: 'row', bottom: 0, left: 0, right: 0, padding: 20}}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
            <TouchableOpacity onPress={() => setCurrentScreen('Home')}>            
              <Icon name="endcall" size={55} style={{ marginBottom: 35 }} />
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
            <TouchableOpacity onPress={() => {
              navigation.navigate('VideoCall', { 
                streamID: streamID,
                userID: userID,
              });
              setCurrentScreen('Home')
            }}>
              <Icon name="startcall" size={55} style={{ marginBottom: 35 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
   
};

export default Home;
