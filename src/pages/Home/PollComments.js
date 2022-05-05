import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import Error from '../../components/Error';
import { colors } from '../../constants';
import { shadow } from '../../constants/layout';
import { LOADING, PollContext, ERROR } from '../../context/PollProvider';

const PollComments = ({ route }) => {
  const pollId = route.params?.id;
  const [comments, setComments] = useState(LOADING);
  const { getComments, newComment, deleteComment, deleteReply } =
    useContext(PollContext);
  const [input, setInput] = useState('');
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('username').then(setCurrentUser);
    getComments(pollId, setComments);
  }, []);

  const onComment = () => {
    if (!input) return;
    newComment({ pollphoto: pollId, comment: input }, () =>
      getComments(pollId, setComments),
    );
    setInput('');
  };

  const List = useMemo(
    () => () => {
      switch (comments) {
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
              retry={() => getComments(pollId, setComments)}
            />
          );
        default:
          return (
            <FlatList
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ padding: 15 }}
              ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
              renderItem={({ item }) => (
                <CommentItem
                  onDeleteReply={(replyId) =>
                    deleteReply(replyId, () => getComments(pollId, setComments))
                  }
                  onDelete={() =>
                    deleteComment(item.id, () =>
                      getComments(pollId, setComments),
                    )
                  }
                  currentUser={currentUser}
                  item={item}
                />
              )}
              data={comments}
            />
          );
      }
    },
    [comments, currentUser],
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Header />
      <List />
      <View
        style={{
          borderTopWidth: 1,
          borderColor: '#ddd',
          padding: 10,
          flexDirection: 'row',
          marginTop: 'auto',
        }}>
        <TextInput
          placeholder="Type here..."
          style={{
            borderRadius: 10,
            backgroundColor: '#eee',
            paddingHorizontal: 16,
            flex: 1,
            borderWidth: 1,
            borderColor: '#ddd',
          }}
          value={input}
          onChangeText={setInput}
        />
        <Icon
          onPress={onComment}
          color="white"
          iconStyle={{ paddingHorizontal: 13 }}
          name="send"
          containerStyle={{
            backgroundColor: colors.primary,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 10,
          }}
        />
      </View>
    </View>
  );
};

export default PollComments;

const Header = () => {
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
      <Icon
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
        style={{
          fontSize: 22,
          fontWeight: 'bold',
          flex: 1,
          textAlign: 'center',
          position: 'absolute',
          right: 0,
          left: 0,
        }}>
        Comments
      </Text>
    </TouchableOpacity>
  );
};

const CommentItem = ({
  item,
  isReply,
  currentUser,
  onDelete,
  onDeleteReply,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyInput, setReplyInput] = useState('');
  const { newReply, getReplies } = useContext(PollContext);
  const [replies, setReplies] = useState();

  const clearReply = () => {
    setShowReplyInput(false);
    setReplyInput('');
  };

  const onReply = () => {
    if (!replyInput) return;
    newReply({ comment: item.id, reply: replyInput }, showReplies);
    clearReply();
  };

  const showReplies = () => getReplies(item.id, setReplies);
  const hideReplies = () => setReplies(undefined);

  const Replies = () => {
    if (!replies) return null;
    switch (replies) {
      case LOADING:
        return (
          <ActivityIndicator
            color={colors.primary}
            size="large"
            style={{ alignSelf: 'center', padding: 30 }}
          />
        );
      case ERROR:
        return <Error message="Something went wrong" retry={showReplies} />;
      default:
        return (
          <FlatList
            style={{ marginLeft: 50, padding: 10 }}
            ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
            renderItem={({ item }) => (
              <CommentItem
                currentUser={currentUser}
                onDeleteReply={onDeleteReply}
                isReply
                item={item}
              />
            )}
            data={replies}
          />
        );
    }
  };

  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <Image
          style={{
            width: 40,
            height: 40,
            marginRight: 10,
            borderRadius: 75,
            borderWidth: 1,
            borderColor: '#ddd',
          }}
          source={
            !!item?.user?.profile?.image
              ? { uri: item.user.profile.image }
              : require('./../../assets/defaultAvatar.jpeg')
          }
        />
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              paddingBottom: 3,
              alignItems: 'center',
            }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
              {item.user.first_name || item.user.username}
            </Text>
            <View
              style={{
                backgroundColor: '#ddd',
                width: 1,
                height: '70%',
                marginHorizontal: 7,
              }}
            />
            <Text style={{ fontSize: 14, opacity: 0.7 }}>
              {new Date().toLocaleDateString()}
            </Text>
          </View>

          <Text
            style={{
              backgroundColor: '#eee',
              padding: 10,
              borderRadius: 10,
              color: '#333',
            }}>
            {item?.reply || item?.comment}
          </Text>

          {item.user.username == currentUser && (
            <TouchableOpacity
              onPress={() => (isReply ? onDeleteReply(item.id) : onDelete())}
              style={{ position: 'absolute', top: 28, right: 4 }}>
              <Icon
                iconStyle={{ padding: 2 }}
                size={17}
                color={'#555'}
                name="close"
                containerStyle={{
                  borderRadius: 20,
                  backgroundColor: '#f5f5f5',
                  ...shadow,
                  borderWidth: 1,
                  borderColor: 'white',
                }}
              />
            </TouchableOpacity>
          )}

          {!isReply &&
            (showReplyInput ? (
              <View style={{ paddingTop: 7, flexDirection: 'row' }}>
                <Icon
                  onPress={clearReply}
                  size={20}
                  color="#ddd"
                  iconStyle={{ paddingHorizontal: 10 }}
                  name="close"
                  containerStyle={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 7,
                  }}
                />
                <TextInput
                  multiline
                  autoFocus
                  placeholder="Type here..."
                  style={{
                    borderRadius: 10,
                    backgroundColor: '#eee',
                    padding: 10,
                    flex: 1,
                    paddingVertical: 6,
                    borderWidth: 1,
                    borderColor: '#ddd',
                  }}
                  value={replyInput}
                  onChangeText={setReplyInput}
                />
                <Icon
                  onPress={onReply}
                  size={20}
                  color="white"
                  iconStyle={{ paddingHorizontal: 10 }}
                  name="send"
                  containerStyle={{
                    backgroundColor: colors.primary,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 7,
                  }}
                />
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity onPress={() => setShowReplyInput(true)}>
                  <Text
                    style={{ color: colors.blue, fontSize: 13, paddingTop: 3 }}>
                    Reply Comment
                  </Text>
                </TouchableOpacity>
                {item?.total_replies > 0 && (
                  <TouchableOpacity
                    onPress={replies ? hideReplies : showReplies}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingTop: 3,
                    }}>
                    <Icon
                      name={
                        replies ? 'keyboard-arrow-up' : 'keyboard-arrow-down'
                      }
                      color={colors.blue}
                    />
                    <Text style={{ color: colors.blue, fontSize: 13 }}>
                      {replies ? 'Hide' : 'Show'} Replies
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
        </View>
      </View>
      <Replies />
    </View>
  );
};
