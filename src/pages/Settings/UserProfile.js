import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  Share,
  Alert,
  StatusBar,
  Modal,
  useWindowDimensions,
  ActivityIndicator,
  ToastAndroid
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { colors, config, layout } from '../../constants';
import { Touchable, Icon, CircularProgress } from '../../components';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { buildLinkProfileLink } from '../../helpers';
import CustomBtn from '../../components/CustomButton';
import { shadow } from '../../constants/layout';
import { Icon as MaterialIcon } from 'react-native-elements'

const FriendRequest = (props) => {
  const { isFriend, setIsFriends, userInfo } = props;


  if (isFriend === 'Request sent') {
    return (
      <TouchableOpacity
        onPress={async () => {
          setIsFriends(false);
          const res = await axios.delete(
            'https://www.gossipsbook.com/api/current-user/friend-request/list/update/' +
            userInfo?.username ?? '' + '/',
          );
          console.log(res.data);
        }}
        style={{
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          backgroundColor: colors.primary,
          padding: 10,
        }}>
        <Text style={{ color: colors.white }}>Friend request sent</Text>
      </TouchableOpacity>
    );
  }
  if (isFriend === 'Request received') {
    return (
      <View
        style={{
          flexDirection: 'row',
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          backgroundColor: colors.primary
        }}>
        <TouchableOpacity
          onPress={async () => {
            setIsFriends(true);
            const res = await axios.post(
              `https://www.gossipsbook.com/api/current-user/friend-request/list/update/${userInfo?.username ?? ''
              }/?request=accepted`,
            );
            console.log(res.data);
          }}
          style={{
            flexDirection: 'row',
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
            borderRightWidth: 1,
            borderRightColor: colors.white,
            marginEnd: 10,
          }}>
          <Icon color={colors.white} name="friends" size={18} />
          <Text style={{ color: colors.white, paddingLeft: 8 }} >Accept</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            setIsFriends(false);
            const res = await axios.put(
              `https://www.gossipsbook.com/api/current-user/friend-request/list/update/${userInfo?.username ?? ''
              }/?request=rejected`,
            );
            console.log(res.data);
          }}
          style={{
            flexDirection: 'row',
            borderColor: 'black',
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon color={colors.white} name="reject" size={18} />
          <Text style={{ color: colors.white, paddingLeft: 8 }} >Reject</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (isFriend === true) {
    return (
      <TouchableOpacity
        onPress={async () => {
          Alert.alert(
            'Gossips',
            `Are you sure to unfriend ${userInfo?.username ?? ''}?`,
            [
              {
                text: 'YES',
                onPress: async () => {
                  const res = await axios.delete(
                    `https://www.gossipsbook.com/api/current-user/friend-list/unfriend/${userInfo?.username ?? ''
                    }/`,
                  );
                  setIsFriends(false);
                  return;
                },
              },
              {
                text: 'NO',
                onPress: () => { },
              },
            ],
          );
        }}
        style={{
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          backgroundColor: colors.primary,
          padding: 10,
        }}>
        <Text style={{ color: colors.white }}>✓ Friend</Text>
      </TouchableOpacity>
    );
  }
  if (isFriend === false || isFriend === 'False') {
    return (
      <TouchableOpacity
        onPress={async () => {
          setIsFriends('Request sent');
          const res = await axios.post(
            `https://www.gossipsbook.com/api/current-user/friend-request/create/${userInfo?.username ?? ''
            }/`,
          );
        }}
        style={{
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          backgroundColor: colors.primary,
          padding: 10,
        }}>
        <Text style={{ color: colors.white }}>Add Friend</Text>
      </TouchableOpacity>
    );
  }
  return null;
};

const Profile = ({ navigation, route }) => {
  const { username } = route.params;
  const [userInfo, setUserInfo] = useState(null);
  const [isFriends, setIsFriends] = useState(false);

  // useEffect(() => {
  //   AsyncStorage.getItem('blocked_users', (err, result) => {
  //     if (err || !result || !JSON.parse(result) || Object.keys(JSON.parse(result)).length == 0) return
  //     setBlockedUsers(JSON.parse(result))
  //   })
  // }, [])

  const onBlock = async () => {
    const access_token = await AsyncStorage.getItem('token');
    console.log(access_token, userInfo)
    Alert.alert('Block', 'Are you sure you want to block this user?', [
      {
        text: 'Yes', onPress: () => {
          axios.post(
            `https://www.gossipsbook.com/api/user/block/${userInfo?.username ?? ''}/`, {}, { headers: { Authorization: 'Token ' + access_token } }
          ).then(res => {
            getUserDetails()
            console.log('SUCCESS BLOCKING USER')
          });
        }
      },
      { text: 'No' }
    ])
  }

  const onReport = async () => {
    const access_token = await AsyncStorage.getItem('token');
    console.log(access_token, userInfo)
    Alert.alert('Report', 'Are you sure you want to report this user?', [
      {
        text: 'Yes', onPress: () => {
          axios.post(
            `https://www.gossipsbook.com/api/user/report/${userInfo?.username ?? ''}/`, {}, { headers: { Authorization: 'Token ' + access_token } }
          ).then(res => {
            ToastAndroid.show('User has been reported', ToastAndroid.SHORT)
            console.log('SUCCESS REPORTING USER')
          }).finally(() => setMoreModalVisibility(false));
        }
      },
      { text: 'No' }
    ])
  }


  const getUserDetails = async () => {
    try {
      const res = await axios.get(
        `https://www.gossipsbook.com/api/user/retrieve/${username}/`,
      );
      const { data } = res;
      setUserInfo(data);
      console.log(JSON.stringify(data, null, 2));
      setIsFriends(data.is_friend);
    } catch (err) {
      console.log('dddddddddddddddddddddddddddd')
      setUserInfo('BlOCKED')
      console.log(err);
    }
  }

  useEffect(() => {
    getUserDetails()
  }, []);

  React.useEffect(() => {
    navigation.setOptions({
      tabBarVisible: false,
    });
  }, []);

  const onShare = async () => {
    try {
      const shareUrl = await buildLinkProfileLink(
        userInfo?.username,
        userInfo?.profile?.image,
      );
      const result = await Share.share({
        message: shareUrl,
        url: userInfo?.profile?.image,
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

  const [moreModalVisible, setMoreModalVisibility] = useState(false)
  console.log(userInfo)

  if (userInfo == null) return <ActivityIndicator color={colors.primary} size={'large'} style={{ padding: 30 }} />

  if (typeof userInfo == 'string') {
    return (
      <View>
        <MaterialIcon name="block" color={'black'} size={100} containerStyle={{ padding: 35, alignSelf: 'center', opacity: .5, }} />
        <Text style={{ textAlign: 'center', fontSize: 22, fontWeight: 'bold', opacity: 0.5 }}>User has been blocked.</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <MoreModal onReport={onReport} onBlock={onBlock} visible={moreModalVisible} dismiss={() => setMoreModalVisibility(false)} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          backgroundColor: colors.primary,
          paddingTop: 10,
          paddingBottom: 10,
          //borderWidth:1
        }}>
        <Touchable
          onPress={() => navigation.goBack()}
          style={{ alignSelf: 'flex-start', borderColor: colors.white }}
          jc
          ac
          size={40}
          br={50}
          ml={10}
          //absolute
          //top={5}
          //left={20}
          brc="#555"
          brw={1}>
          <Icon color={colors.white} name="back" size={18} />
        </Touchable>
        <Text
          style={{
            alignSelf: 'center',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 20,
            color: colors.white
          }}>
          Profile
        </Text>
        <Touchable
          onPress={onShare}
          // absolute
          //right={30} top={15}
          mr={10}
          style={{ alignSelf: 'center' }}>
          <Icon color={colors.white} name="share" size={22} />
        </Touchable>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={{ flex: 1, backgroundColor: colors.white }}
        contentContainerStyle={{
          alignItems: 'center',
          flexGrow: 1
        }}>

        <View style={{ height: 140, width: '100%', backgroundColor: colors.primary, marginBottom: -80 }} />

        <View style={{ marginLeft: 0, width: '100%', alignItems: 'center' }}>
          <View style={{ ...shadow, borderWidth: 2, borderColor: colors.white, borderRadius: 2000, backgroundColor: colors.white }}>
            {userInfo?.profile?.image !== null ? (
              <FastImage
                source={{
                  uri: userInfo?.profile?.image,
                }}
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: 80,
                }}
              />
            ) : (
              <Image
                source={require('../../assets/defaultAvatar.jpeg')}
                // source={{ uri: "https://media.istockphoto.com/photos/headshot-portrait-of-smiling-ethnic-businessman-in-office-picture-id1300512215?b=1&k=20&m=1300512215&s=170667a&w=0&h=LsZL_-vvAHB2A2sNLHu9Vpoib_3aLLkRamveVW3AGeQ=" }}
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: 80,
                }}
              />
            )}
          </View>
          <Text
            style={{
              fontSize: 18,
              alignSelf: 'center',
              fontWeight: 'bold',
              opacity: .8,
              marginTop: 10,
              textTransform: 'capitalize',
            }}>
            {userInfo?.username ?? ''}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 5 }}>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                marginTop: 4,
                opacity: .6,
                alignItems: 'center'
              }}>
              <Icon name="location" size={20} />
              {userInfo?.profile?.location ? (
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    paddingLeft: 10
                  }}>
                  {userInfo.profile.location}
                </Text>
              ) : (
                <Text style={{ paddingLeft: 10 }}>Unknown</Text>
              )}
            </View>
            <View style={{ width: 2, height: 15, marginHorizontal: 10, backgroundColor: colors.lightGray }} />
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                marginTop: 4,
                opacity: .6,
                alignItems: 'center'
              }}>
              <Icon name="work" size={20} />
              {userInfo?.profile?.designation ? (
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    paddingLeft: 10
                  }}>
                  {userInfo?.profile?.designation}
                </Text>
              ) : (
                <Text style={{ paddingLeft: 10 }}>Unknown</Text>
              )}
            </View>
          </View>
          {userInfo && <Text
            style={{
              fontSize: 14,
              alignSelf: 'center',
              opacity: .5,
              textTransform: 'capitalize',
            }}>
            {userInfo?.truth_speaking !== null ? parseInt(userInfo.truth_speaking) : 0}% gossips proven to be facts
          </Text>}
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            paddingTop: 10,
            paddingHorizontal: 20,
          }}>
          <FriendRequest
            isFriend={isFriends}
            setIsFriends={setIsFriends}
            userInfo={userInfo}
          />
          <View style={{ width: 1 }} />
          <TouchableOpacity
            onPress={async () => {
              const access_token = await AsyncStorage.getItem('token');
              navigation.navigate('Chat', {
                username: userInfo.username,
                access_token,
              });
            }}
            style={{
              padding: 10,
              backgroundColor: colors.primary,
              // borderTopRightRadius: 10,
              // borderBottomRightRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ color: colors.white }}>Gossiping</Text>
          </TouchableOpacity>
          <View style={{ width: 1 }} />
          <MaterialIcon onPress={() => setMoreModalVisibility(true)} name="more-vert" color="white" size={21} containerStyle={{ backgroundColor: colors.primary, padding: 9, borderTopRightRadius: 10, borderBottomRightRadius: 10, }} />
        </View>

        <View style={{ height: 1, backgroundColor: '#dcdcdc', width: '100%', marginVertical: 16, marginBottom: 10 }} />

        {/* <View style={{ justifyContent: 'center' }}>
            <CircularProgress
              progress={
                userInfo?.truth_speaking !== null ? userInfo.truth_speaking : 0
              }
              size={70}
            />

            <View
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
              }}>
              <Text style={{ textAlign: 'center', justifyContent: 'center' }}>
                {userInfo?.truth_speaking
                  ? Math.round(userInfo.truth_speaking)
                  : 0}
                %
              </Text>
            </View>
          </View> */}

        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
          <Touchable
            p={5}
            onPress={() => {
              const url = userInfo?.facebook_link
                ? userInfo.facebook_link
                : 'http://facebook.com';
              Linking.canOpenURL(url).then((supported) => {
                if (supported) {
                  Linking.openURL(url);
                } else {
                  console.log(
                    "Don't know how to open URI: " + this.props.url,
                  );
                }
              });
            }}>
            <Icon name="facebook_social" size={40} />
          </Touchable>

          <Touchable
            p={5}
            onPress={() => {
              const url = userProfile?.twitter_link
                ? userProfile.twitter_link
                : 'http://twitter.com';
              Linking.canOpenURL(url).then((supported) => {
                if (supported) {
                  Linking.openURL(url);
                } else {
                  console.log(
                    "Don't know how to open URI: " + this.props.url,
                  );
                }
              });
            }}>
            <Icon name="linkedin_social" size={40} />
          </Touchable>
        </View>

        <View style={{ height: 1, backgroundColor: '#dcdcdc', width: '100%', marginTop: 12 }} />

        <View
          style={{
            alignItems: 'center',
            paddingVertical: 10,
            width: '100%',
            flex: 1,
            backgroundColor: colors.veryLightGrey,
          }}>
          <CustomBtn onPress={() => navigation.navigate('UserInfor', { username: userInfo.username })} label={"About " + userInfo.username} />
          <CustomBtn onPress={() => navigation.navigate('FriendByUser', { username: userInfo.username })} label={"Friends of " + userInfo.username} />
          <CustomBtn onPress={() => navigation.push('GossipByUser', { username: userInfo.username })} label="Gossips" />
          <CustomBtn onPress={() => navigation.push('Polls', { friend: userInfo.username })} label="Polls" />
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;

const MoreModal = ({ visible, dismiss, onBlock, blocked, onReport }) => {
  const windowDimensions = useWindowDimensions()

  return (
    <Modal
      transparent={true}
      hardwareAccelerated
      visible={visible}
      onRequestClose={dismiss}
      statusBarTranslucent
      animationType="fade">
      <TouchableOpacity activeOpacity={1} onPress={dismiss} style={{ flex: 1, backgroundColor: "#00000080", alignItems: 'center', justifyContent: 'center' }} >
        <TouchableOpacity onPress={onBlock} activeOpacity={.6} style={{ backgroundColor: 'white', borderRadius: 10, width: '85%', maxHeight: windowDimensions.height * .75, overflow: 'hidden' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', padding: 15 }} >{blocked ? 'Blocked' : 'Block'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onReport} activeOpacity={.6} style={{ backgroundColor: 'white', borderRadius: 10, width: '85%', maxHeight: windowDimensions.height * .75, overflow: 'hidden', marginTop: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', padding: 15 }} >Report</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  )
}