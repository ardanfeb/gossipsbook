import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  useWindowDimensions,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Share,
  Alert,
  DeviceEventEmitter,
} from 'react-native';
import { Icon as MaterialIcons } from 'react-native-elements';
import { shadow } from '../../constants/layout';
import * as Progress from 'react-native-progress';
import { colors } from '../../constants';
import {
  ERROR,
  LOADING,
  PollContext,
  POLL_EVENTS,
} from '../../context/PollProvider';
import { LayoutAnimation } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Modal } from 'react-native';
import { Touchable, Icon } from '../../components';
import AsyncStorage from '@react-native-community/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Error from '../../components/Error';
import axios from 'axios';
import { buildLinkPhotoPoll } from '../../helpers';

const PollDetails = ({ navigation, route }) => {
  const [poll, setPoll] = useState(LOADING);
  const [selectedImage, setSelectedImage] = useState();
  const [showModalChoose, setShowModalChoose] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [reportVisible, setReportVisible] = useState(false);
  const { newPollReaction, getPollDetails } = useContext(PollContext);

  useEffect(() => {
    getPollDetails(route.params?.item?.id, setPoll);
    AsyncStorage.getItem('username').then(setCurrentUser);
  }, []);

  const onReact = (isPhoto1) => {
    if (poll.already_voted) return;
    newPollReaction({ isPhoto1, pollphoto: poll.id }, () =>
      setPoll((currentValue) => ({
        ...currentValue,
        photo1_reactions: isPhoto1
          ? currentValue.photo1_reactions - 1
          : currentValue.photo1_reactions,
        photo2_reactions: isPhoto1
          ? currentValue.photo2_reactions
          : currentValue.photo2_reactions - 1,
        already_voted: false,
        total_reactions: currentValue.total_reactions - 1,
      })),
    );
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setPoll((currentValue) => ({
      ...currentValue,
      photo1_reactions: isPhoto1
        ? currentValue.photo1_reactions + 1
        : currentValue.photo1_reactions,
      photo2_reactions: isPhoto1
        ? currentValue.photo2_reactions
        : currentValue.photo2_reactions + 1,
      already_voted: true,
      total_reactions: currentValue.total_reactions + 1,
    }));
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
                    console.log('daksnfaklfs kldfmalk');
                    const res = await axios
                      .post(
                        `https://www.gossipsbook.com/api/photo_poll/delete/${poll.id}/`,
                      )
                      .then((res) => console.log(res.data))
                      .catch((err) => console.log(err));
                    Alert.alert('Photo Poll', 'Success!', [
                      {
                        text: 'OK',
                        onPress: () => {
                          DeviceEventEmitter.emit(POLL_EVENTS.NEW_POLL_ADDED);
                          navigation.goBack();
                        },
                      },
                    ]);
                  } catch (err) {
                    Alert.alert('Gossips', JSON.stringify(err.response));
                  }
                }}>
                <Text>Delete Photo Poll</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const ReportModal = () => {
    const [reason, setReason] = useState('');
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
                onPress={() => sendReport(reason)}
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
                item.user.username,
              );
              const res = await axios.post(
                `https://www.gossipsbook.com/api/current-user/friend-request/list/update/${item.user.username}/?request=accepted`,
                {},
                { headers: { 'Content-Type': 'application/json' } },
              );
              getPollDetails(route.params?.item?.id, setPoll);
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
                `https://www.gossipsbook.com/api/current-user/friend-request/list/update/${item.user.username}/?request=rejected`,
              );
              getPollDetails(route.params?.item?.id, setPoll);
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

  const pressFollow = async (_item) => {
    if (_item.is_friend === 'Request sent') {
      const res = await axios.delete(
        `https://www.gossipsbook.com/api/current-user/friend-request/list/update/${_item.user.username ?? ''
        }/`,
      );
      getPollDetails(route.params?.item?.id, setPoll);
      return;
    }
    if (_item.is_friend === false || _item.is_friend === 'False') {
      console.log(_item.user.username);
      const res = await axios
        .post(
          `https://www.gossipsbook.com/api/current-user/friend-request/create/${_item.user.username}/`,
        )
        .then((resp) => {
          getPollDetails(route.params?.item?.id, setPoll);
          return;
        })
        .catch((error) => {
          console.error('There was an error!', error);
          console.log('res', res);
          console.log(
            'res',
            `https://www.gossipsbook.com/api/current-user/friend-request/create/${_item.user.username}/`,
          );
        });
    }
    if (_item.is_friend === true || _item.is_friend === 'True') {
      Alert.alert(
        'Gossips',
        `Are you sure to unfriend ${_item.user.username}?`,
        [
          {
            text: 'YES',
            onPress: async () => {
              const res = await axios.delete(
                `https://www.gossipsbook.com/api/current-user/friend-list/unfriend/${_item.user.username ?? ''
                }/`,
              );
              getPollDetails(route.params?.item?.id, setPoll);
              return;
            },
          },
          {
            text: 'NO',
            onPress: () => { },
          },
        ],
      );
    }
  };

  const sendReport = async (reason) => {
    if (!reason.length) {
      Alert.alert('Photo Poll', 'Reason must be provided!');
      return;
    }
    try {
      const res = await axios.post(
        'https://www.gossipsbook.com/api/photo_poll/request_removal/',
        { pollphoto: poll.id, reason },
      );
      Alert.alert('Photo Poll', 'Report sent!');
      setReportVisible(false);
    } catch (err) {
      Alert.alert('Photo Poll', JSON.stringify(err.response.data));
      setReportVisible(false);
    } finally {
      setReason('');
    }
  };

  const onShare = async () => {
    console.log('asdasd: ', route.params?.item);
    try {
      const shareUrl = await buildLinkPhotoPoll(
        route.params?.item?.id,
        route.params?.item.photo1,
        ' --- ' + route.params?.item.description,
      );
      const result = await Share.share({
        message: shareUrl,
        url: route.params?.item.photo1,
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

  const Body = () => {
    switch (poll) {
      case LOADING:
        return (
          <ActivityIndicator
            color={colors.primary}
            size="large"
            style={{ alignSelf: 'center', padding: 30 }}
          />
        );
      case ERROR:
        return (
          <Error
            message="Something went wrong"
            retry={() => getPollDetails(route.params?.item?.id, setPoll)}
          />
        );
      default:
        return (
          <View style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView contentContainerStyle={{ padding: 15, flexGrow: 1 }}>
              <TouchableOpacity
                onPress={() => {
                  if (currentUser == poll.user.username) {
                    navigation.navigate('Profile');
                  } else {
                    navigation.navigate('UserProfile', {
                      username: poll.user?.username,
                    });
                  }
                }}
                style={{ flexDirection: 'row', alignItem: 'center' }}>
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    marginRight: 10,
                    borderRadius: 75,
                    borderWidth: 1,
                    borderColor: '#ddd',
                    ...shadow,
                  }}
                  source={
                    poll.user.profile.image
                      ? { uri: poll.user.profile.image }
                      : require('../../assets/defaultAvatar.jpeg')
                  }
                />
                <View style={{ flex: 1 }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      textTransform: 'capitalize',
                      fontWeight: 'bold',
                      fontSize: 16,
                      marginBottom: 3,
                      fontFamily: 'Clarity City Regular',
                    }}>
                    {poll.user.first_name || poll.user.username}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 12,
                      color: colors.gray,
                      fontFamily: 'Clarity City Regular',
                    }}>
                    {poll.user.designation}
                    {poll.user.designation ? ' - ' : ''}
                    {new Date(poll.date_published).toLocaleDateString()}
                  </Text>
                </View>
                {poll.is_friend !== 'Same User' && renderDoor(poll)}
              </TouchableOpacity>
              <View>
                <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                  <PhotoItem
                    onPress={() => setSelectedImage(poll.photo1)}
                    onReactPress={() => onReact(true)}
                    progress={poll.photo1_reactions / poll.total_reactions}
                    votes={poll.photo1_reactions}
                    showStats={poll.already_voted}
                    response={poll.response_type.emoji}
                    imageURL={poll.photo1}
                  />
                  <View style={{ width: 10 }} />
                  <PhotoItem
                    onPress={() => setSelectedImage(poll.photo2)}
                    onReactPress={() => onReact(false)}
                    progress={poll.photo2_reactions / poll.total_reactions}
                    votes={poll.photo2_reactions}
                    showStats={poll.already_voted}
                    response={poll.response_type.emoji}
                    imageURL={poll.photo2}
                  />
                </View>
              </View>

              <Text
                style={{
                  fontSize: 16,
                  color: '#555',
                  paddingTop: 15,
                  textAlign: 'right',
                }}>
                Views : {poll.views}
              </Text>
              {poll.description && (
                <Text
                  style={{
                    fontSize: 16,
                    width: '100%',
                    lineHeight: 22,
                    marginBottom: 7,
                    fontFamily: 'Clarity City Regular',
                  }}>
                  {poll.description}
                </Text>
              )}
            </ScrollView>
            <View
              style={{
                flexDirection: 'row',
                padding: 10,
                borderColor: '#aaa',
                borderTopWidth: 1,
              }}>
              <Btn
                onPress={() =>
                  navigation.navigate('Poll Comments', { id: poll.id })
                }
                iconName={'comment'}
                label={`Comments (${poll.total_comments})`}
              />
              <View style={{ width: 10 }} />
              <Btn onPress={onShare} iconName={'share'} label={'Share'} />
            </View>
          </View>
        );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Header
        onMenuPress={
          poll == LOADING || poll == ERROR
            ? null
            : () => setShowModalChoose(true)
        }
        username={poll?.user?.first_name || poll?.user?.username || 'Loading'}
      />
      <ThreeDotModal isAuthor={poll?.user?.username == currentUser} />
      {ReportModal()}
      <Modal
        onRequestClose={() => setSelectedImage(null)}
        visible={selectedImage != null}
        transparent={true}>
        <ImageViewer imageUrls={[{ url: selectedImage }]} />
        <MaterialIcons
          onPress={() => setSelectedImage(null)}
          size={40}
          name="close"
          color={'white'}
          iconStyle={{ padding: 10 }}
          containerStyle={{ position: 'absolute', top: 10, left: 10 }}
        />
      </Modal>
      <Body />
    </View>
  );
};

const Btn = ({ label, iconName, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      borderRadius: 10,
      backgroundColor: colors.primary,
      padding: 10,
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
    }}>
    <MaterialIcons name={iconName} color={'white'} />
    <Text style={{ color: 'white', paddingHorizontal: 10 }}>{label}</Text>
  </TouchableOpacity>
);

const Header = ({ username, onMenuPress }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPressIn={() => navigation.goBack()}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: '#ccc',
      }}>
      <MaterialIcons
        iconStyle={{ paddingLeft: 14, marginRight: -4 }}
        containerStyle={{
          borderColor: 'black',
          borderWidth: 1,
          borderRadius: 100,
          padding: 10,
          paddingLeft: 0,
        }}
        name="arrow-back-ios"
      />
      <Text
        numberOfLines={2}
        style={{
          fontSize: 22,
          fontWeight: 'bold',
          flex: 1,
          textAlign: 'center',
          position: 'absolute',
          right: 0,
          left: 0,
        }}>
        Photo Poll / <Text style={{ color: colors.primary }}>{username}</Text>
      </Text>
      {onMenuPress && (
        <Touchable onPress={onMenuPress} jc ac size={40} absolute right={10}>
          <Icon name="three_dots" size={40} />
        </Touchable>
      )}
    </TouchableOpacity>
  );
};

export default PollDetails;

const dummyPollItem = {
  id: 6,
  user: {
    username: 'raghav',
    email: 'Rahgav@gmail.com',
    first_name: '',
    last_name: '',
    profile: {
      bio: null,
      image: null,
    },
    designation: null,
    gossips_list_url:
      'https://www.gossipsbook.com/api/gossips/list-create/?username=raghav',
    author_url: 'https://www.gossipsbook.com/api/user/retrieve/raghav/',
    truth_speaking: null,
    is_friend: 'false',
    profession: null,
  },
  photo1:
    'https://storage.googleapis.com/gossipsbook_bucket/gossip/image/panda.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=gossips-book-service-account%40gossipsbook-website-project.iam.gserviceaccount.com%2F20220117%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20220117T215404Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=abc2da5e4a2c0965a6f243e7127f89de91283c2a5f947eb47bf63a150619ca0580edb2d316968c52aa13a8fa9989f97f5838e865ae30bb0dbc94410b166a642381486afce86f6f76fb76feac30a26246280ce98b59872d4300ea6b0a24a41fa18d7b36fa209855a00c5684e62e69ef3fef9dd49a02b9c5b98411526e71fd6f1fb5aaea0404aa0ec72b3ef04f37fcaae418415d28252343bdbffc539f1e08eff8a71b1299d64b7025bbf5efecb9f17babdb3384f40e2955cbc9c0ce766ba26168a2c0664aa970cf4397e4c852cde061d522b4fd9f78ce37db911c588009f1fe8d7d1db2e1fedd34fff8fe1c61b2db25dd3419c7db3d2ab3cedc711e9f11f7e144',
  photo2:
    'https://storage.googleapis.com/gossipsbook_bucket/gossip/image/swallow_bird.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=gossips-book-service-account%40gossipsbook-website-project.iam.gserviceaccount.com%2F20220117%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20220117T215404Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=a4b0419866a9b05733c94aaf9b426f7a2d4f2106393af4f9c36e0975167a7e05eed827546f3da024d0a40dc584e8de85555d1453aae1ee4623662c497bbeaaaefb12c7d6a461b4fb402428ffe201cde44af25c4816918f836f971466bd28dbbddad7abd3b495a78ea2de4a035ff314c8c3112988d02eb94a5be579d4c02d765d0595e6713ac9894e27e6c68a7c360894a143668fb2a20719855fb4ae59b96c1ea4e16258aafe7955be50c8a3e06fc711e68dfe65951de35e03f45dbb1af903a6c9fb58ae2d1d5aff0c14df2559175f0aec9b4c6ddb1f4ee897fab07a786bf614cd26922d5041c78c8563952e4af190e1b3ab0c854750fbde437a647a678af9bb',
  friends_only: false,
  response_type: {
    id: 1,
    emoji: '❤',
  },
  date_published: '2022-01-10T13:05:17.049247Z',
  total_reactions: 0,
  total_comments: 0,
  already_voted: false,
};

const PhotoItem = ({
  imageURL,
  response,
  showStats,
  progress,
  votes,
  onPress,
  onReactPress,
}) => {
  const windowDimensions = useWindowDimensions();
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={{ flex: 1 }}>
      <Image
        style={{
          height: 150,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#ddd',
        }}
        source={{ uri: imageURL }}
      />
      <TouchableOpacity
        disabled={showStats}
        style={{
          marginTop: -22,
          marginLeft: 10,
          marginBottom: 5,
          padding: 5,
          borderRadius: 15,
          borderEndWidth: 1,
          borderColor: '#ccc',
          backgroundColor: 'white',
          marginRight: 'auto',
          ...shadow,
        }}
        onPress={onReactPress}>
        <Text style={{ fontSize: 22 }}>{response}</Text>
      </TouchableOpacity>
      {showStats && (
        <View style={{ alignItems: 'center' }}>
          <Progress.Bar
            color={colors.primary}
            progress={progress}
            width={(windowDimensions.width - 40) / 2}
          />
          <Text style={{ fontSize: 16, color: '#555' }}>
            {(progress * 100).toFixed()}%
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
