import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from 'react-native';

import Icon from '../Icon';
import { colors, icons } from '../../constants';
import RNUrlPreview from 'react-native-url-preview';
import Swiper from 'react-native-swiper';
import FastImage from 'react-native-fast-image';
import YoutubePlayer from 'react-native-youtube-iframe';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';
import YoutubePlayerScreen from './YoutubePlayerScreen';
// import WebView from 'react-native-webview';

const GossipItem = ({
  id,
  onVote,
  onHand,
  onShare,
  navigate,
  handleVote,
  ...item
}) => {
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [URL, setURL] = useState();
  const navigation = useNavigation();
  const [mediaType, setMediaType] = useState();

  const [playing, setPlaying] = useState(false);

  const renderDoor = (isFriend) => {
    if (isFriend === false)
      return (
        <FastImage
          style={{
            width: 25,
            height: 25,
            resizeMode: 'contain',
          }}
          source={require('../../assets/icons/door.png')}
        />
      );
    if (isFriend === true) return <Icon name="friends" size={25} />;
    if (isFriend === 'Request sent') return <Icon name="open_door" size={25} />;
  };

  const getUrl = async () => {
    if (item.link !== null) {
      await setURL(youtube_parser(item.link));
      await setMediaType(item.link.pathname?.split('.')[1]);
    }
  };
  const typesMedia = ['mp4', 'mp3', 'gif'];
  function youtube_parser(url) {
    var regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return match && match[7].length == 11 ? match[7] : false;
  }
  function validateYouTubeUrl(urlToParse) {
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

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  const renderIcon = (source, size) => {
    return (
      <Image
        source={source}
        style={[
          {
            width: size,
            height: size,
            resizeMode: 'contain',
          },
        ]}
      />
    );
  };

  return (
    <>
      <View
        key={id}
        style={{
          shadowColor: 'black',
          shadowOffset: { width: 1, height: 1 },
          shadowRadius: 2,
          shadowOpacity: 0.26,
          elevation: 3,
          backgroundColor: 'white',
          marginVertical: 5,
          //borderRadius: 20,
          // borderBottomWidth: 2,
        }}>
        <TouchableOpacity
          onPress={() => navigation.push('GossipDetail', { item })}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: colors.lightGray,
            paddingHorizontal: 10,
            padding: 10,
          }}>
          <View style={{ backgroundColor: colors.lightGray, borderRadius: 25 }}>
            {!!item?.author?.profile?.image ? (
              <FastImage
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 1000,
                }}
                source={{ uri: item?.author?.profile?.image }}
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

          <View style={{ marginLeft: 10 }}>
            <Text
              style={{
                textTransform: 'capitalize',
                fontWeight: 'bold',
                fontSize: 16,
                marginBottom: 3,
                fontFamily: 'Clarity City Regular',
              }}>
              {item.author?.username ?? 'Null'}
            </Text>
            {item.author.designation !== null ? (
              <Text
                style={{
                  fontSize: 12,
                  color: colors.gray,
                  fontFamily: 'Clarity City Regular',
                }}>
                {item.author.designation} -{' '}
                {new Date(item.date_published).toDateString().slice(4, 10)}
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 12,
                  color: colors.gray,
                  fontFamily: 'Clarity City Regular',
                }}>
                {new Date(item.date_published).toDateString().slice(4, 10)}
              </Text>
            )}
          </View>

          {item.is_friend !== 'Same User' && (
            <View
              style={{
                position: 'absolute',
                right: 5,
                padding: 5,
              }}>
              {item.is_friend !== 'Request received' ? (
                <View
                  style={{
                    marginRight: 0,
                    backgroundColor: colors.white,
                    borderColor: colors.black,
                    borderWidth: 1,
                    borderRadius: 1000,
                    padding: 10,
                  }}>
                  {renderDoor(item.is_friend)}
                </View>
              ) : (
                <View style={{ flexDirection: 'row' }}>
                  <View
                    style={{
                      marginRight: 10,
                      backgroundColor: colors.white,
                      borderWidth: 1,
                      borderColor: colors.black,
                      borderRadius: 1000,
                      padding: 10,
                    }}>
                    <Icon name="friends" size={25} />
                  </View>
                  <View
                    style={{
                      backgroundColor: colors.white,
                      borderWidth: 1,
                      borderColor: colors.black,
                      borderRadius: 1000,
                      padding: 10,
                    }}>
                    <Icon name="reject" size={25} />
                  </View>
                </View>
              )}
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate('GossipDetail', { item })}
          style={{ paddingHorizontal: 10 }}>
          {item.title && (
            <Text
              // numberOfLines={2}
              style={{
                color: '#444',
                fontSize: 18,
                fontWeight: 'bold',
                lineHeight: 25,
                marginTop: 5,
                fontFamily: 'Clarity City Bold',
              }}>
              {item.title.replace(/\s+/g, ' ').trim()}
            </Text>
          )}
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            //backgroundColor: colors.white,
            // paddingTop: 5,
            bottom: validateYouTubeUrl(item.link) ? -5 : 0,
          }}>
          {!!item.interests && (
            <View
              style={{
                paddingHorizontal: 10,
                alignItems: 'flex-end',
                marginTop: 5,
                marginBottom: item.gossip_images?.length || item.link ? 7 : 0,
              }}>
              <View
                style={{
                  backgroundColor: '#000080',
                  padding: 5,
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    color: colors.white,
                    borderRadius: 5,
                    fontFamily: 'Clarity City Regular',
                  }}>
                  {item?.interests}
                </Text>
              </View>
            </View>
          )}
          {!!item.link && (
            <>
              {typesMedia.includes(mediaType) ? (
                <Video
                  controls
                  paused
                  source={{
                    uri: item.link,
                  }} // Can be a URL or a local file.
                  style={{ height: 200, width: '100%' }}
                />
              ) : (
                <>
                  {validateYouTubeUrl(item.link) ? (
                    <YoutubePlayer
                      height={220}
                      width={'100%'}
                      play={false}
                      videoId={URL}
                      webViewProps={{
                        androidLayerType: 'hardware',
                      }}
                      webViewStyle={{ opacity: 0.99 }}
                    />
                  ) : (
                    // <YoutubePlayerScreen
                    //   videoId={URL}
                    // />
                    // <YoutubePlayer
                    //   height={250}
                    //   width={'100%'}
                    //   play={false}
                    //   videoId={URL}
                    //   webViewProps={{
                    //     androidLayerType: 'hardware',
                    //   }}
                    //   webViewStyle={{ opacity: 0.99 }}
                    // />
                    // <Pressable
                    //   onPress={() => {
                    //     if (!playing) {
                    //       setPlaying(true);
                    //     }
                    //   }}
                    // >
                    //   <View pointerEvents={playing ? undefined : 'none'}>

                    //   </View>
                    // </Pressable>
                    <RNUrlPreview text={item.link} />
                  )}
                </>
              )}
            </>
          )}
          {item?.gossip_images?.length ? (
            <Swiper
              height={Dimensions.get('screen').width / 1.5}
              onMomentumScrollEnd={(e, state, context) =>
                console.log('index:', state.index)
              }
              dot={
                <View
                  style={{
                    backgroundColor: '#999999',
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
                    backgroundColor: colors.chatBg,
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
                bottom: -20,
                justifyContent: 'center',
              }}
              loop>
              {item?.gossip_images?.map((image) => {
                return (
                  <TouchableOpacity
                    key={image}
                    activeOpacity={1}
                    onPress={() => navigate('GossipDetail', { item })}>
                    <FastImage
                      width="100%"
                      resizeMode="cover"
                      style={{
                        height: Dimensions.get('screen').width / 1.5,
                        width: '100%',
                      }}
                      source={{ uri: image?.image }}
                    />
                  </TouchableOpacity>
                );
              })}
            </Swiper>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={() => navigate('GossipDetail', { item })}
          style={{
            paddingHorizontal: 10,
          }}>
          {item?.content !== '' && (
            <Text
              numberOfLines={item?.gossip_images?.length > 0 ? 2 : 11}
              style={{
                fontSize: 16,
                //fontWeight: 'bold',
                width: '100%',
                lineHeight: 22,
                marginVertical: 8,
                fontFamily: 'Clarity City Regular',
              }}>
              {item?.content}
            </Text>
          )}
        </TouchableOpacity>
        <View
          style={{
            marginEnd: 10,
            marginBottom: 10,
            marginTop: !item?.content && validateYouTubeUrl(item.link) ? 10 : 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            fontFamily: 'Clarity City Regular',
            marginHorizontal: 10,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => navigate('GossipDetail', { item })}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {item.user_vote !== null ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 5,
                }}>
                <Text>You have {''}</Text>
                {item.user_vote === true ? (
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
          </TouchableOpacity>

          <Text>{item.views} views</Text>
        </View>

        <TouchableOpacity
          style={{
            borderColor: colors.lightGray,
            borderTopWidth: 1,
            //borderBottomWidth: 2,
            flexDirection: 'row',
            paddingHorizontal: 10,
            paddingVertical: 5,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {item.user_vote ? (
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 5,
                  // marginRight: -6,
                  paddingVertical: 5,
                  opacity: 0.2,
                  alignItems: 'center',
                }}>
                <FastImage
                  style={{
                    width: 20,
                    height: 20,
                    resizeMode: 'contain',
                  }}
                  source={require('../../assets/icons/upvote.png')}
                />
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => onVote(true, item)}
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 5,
                  // marginRight: -6,
                  paddingVertical: 5,
                  opacity: 1,
                  alignItems: 'center',
                }}>
                <FastImage
                  style={{
                    width: 20,
                    height: 20,
                    resizeMode: 'contain',
                  }}
                  source={require('../../assets/icons/upvote.png')}
                />
              </TouchableOpacity>
            )}
            <View
              style={{
                //top: -10,
                flexDirection: 'row',
                // paddingVertical: 10,

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

            {item.user_vote ? (
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 5,
                  paddingVertical: 1,
                  opacity: 0.2,
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../assets/icons/downvote.png')}
                  style={[
                    {
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                    },
                  ]}
                />
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => onVote(false, item)}
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 5,
                  paddingVertical: 1,
                  opacity: 1,
                  alignItems: 'center',
                }}>
                <FastImage
                  style={{
                    width: 20,
                    height: 20,
                    resizeMode: 'contain',
                  }}
                  source={require('../../assets/icons/downvote.png')}
                />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={() => onHand(item)}
            style={{
              // alignSelf: 'center',
              alignItems: 'center',
              paddingHorizontal: 10,
              flexDirection: 'row',
            }}>
            {item?.user_objected === false ? (
              <FastImage
                style={{
                  width: 25,
                  height: 25,
                  resizeMode: 'contain',
                }}
                source={require('../../assets/icons/objection.png')}
              />
            ) : (
              <FastImage
                style={{
                  width: 25,
                  height: 25,
                  resizeMode: 'contain',
                }}
                source={require('../../assets/icons/objection_active.png')}
              />
            )}
            <Text>{!!item?.total_objections ? item.total_objections : 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Comment', {
                slug: item.slug,
                is_friend: item?.is_friend,
              })
            }>
            <View
              style={{
                alignItems: 'center',
                paddingHorizontal: 10,
                flexDirection: 'row',
              }}>
              <FastImage
                style={{
                  width: 20,
                  height: 20,
                  resizeMode: 'contain',
                }}
                source={require('../../assets/icons/comment.png')}
              />
              <Text>{!!item?.total_comments ? item.total_comments : 0}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onShare(item)}
            style={{
              alignItems: 'center',
              paddingHorizontal: 10,
              flexDirection: 'row',
            }}>
            <FastImage
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
              }}
              source={require('../../assets/icons/share.png')}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default GossipItem;
