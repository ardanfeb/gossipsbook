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
  ToastAndroid,
} from 'react-native';
import { shadow } from '../../constants/layout';
import { colors, config, layout } from '../../constants';
import { Touchable, Icon, CircularProgress } from '../../components';
import axios from 'axios';
import CustomBtn from '../../components/CustomButton';
import { buildLinkProfileLink } from '../../helpers';

const { buttonHeight } = config;
const { screenWidth } = layout;

const Profile = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({});
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const getData = async () => {
    const res = await axios.get(
      'https://www.gossipsbook.com/api/current-user/profile/retrieve/',
    );
    const { data } = res;
    return data;
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getData();
        setUserInfo(data);
        console.log(data);
        if (data.profile !== null) setUserProfile(data.profile);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const sub = navigation.addListener('focus', async () => {
      try {
        const data = await getData();
        setUserInfo(data);
        if (data.profile !== null) setUserProfile(data.profile);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    });
    return sub;
  }, [navigation]);

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

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          backgroundColor: '#fff',
          paddingTop: 10,
          paddingBottom: 10,
          paddingHorizontal: 10,
          alignItems: 'center',
          //borderWidth:1
        }}>
        <Touchable
          onPress={() => navigation.goBack()}
          jc
          ac
          size={40}
          br={20}
          //absolute
          //top={10}
          brc="#555"
          brw={1}>
          <Icon name="back" size={18} />
        </Touchable>
        <Text
          style={{
            alignSelf: 'center',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 20,
          }}>
          Profile
        </Text>
        <Touchable
          onPress={onShare}
          //           absolute  top={25}
        >
          <Icon name="share" size={22} />
        </Touchable>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={{ flex: 1, backgroundColor: colors.white }}
        contentContainerStyle={{
          alignItems: 'center',
          marginTop: 20,
        }}>
        {loading ? (
          <ActivityIndicator size="large" color="black" />
        ) : (
          <>
            <View
              style={{
                paddingHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                //marginTop: 80,
              }}>
              <View
                style={{ marginLeft: 0, width: '100%', alignItems: 'center' }}>
                <View
                  style={{
                    ...shadow,
                    borderWidth: 2,
                    borderColor: colors.white,
                    borderRadius: 2000,
                    backgroundColor: colors.white,
                  }}>
                  {userProfile.image !== null ? (
                    <Image
                      source={{ uri: userProfile.image }}
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: 60,
                      }}
                    />
                  ) : (
                    <Image
                      source={require('../../assets/defaultAvatar.jpeg')}
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: 60,
                      }}
                    />
                  )}
                </View>

                {userInfo !== null && (
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: 'bold',
                      alignSelf: 'center',
                      marginTop: 7,
                      textTransform: 'capitalize',
                    }}>
                    {userInfo.username}
                  </Text>
                )}
                {/* {userProfile?.designation !== null && (
                  <Text
                    style={{
                      fontSize: 18,
                      opacity: .6,
                      alignSelf: 'center',
                    }}>
                    {userProfile.designation}
                  </Text>
                )} */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingBottom: 5,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      marginTop: 4,
                      opacity: 0.6,
                      alignItems: 'center',
                    }}>
                    <Icon name="location" size={20} />
                    {userProfile?.location ? (
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          paddingLeft: 10,
                        }}>
                        {userProfile.location}
                      </Text>
                    ) : (
                      <Text style={{ paddingLeft: 10 }}>Unknown</Text>
                    )}
                  </View>
                  <View
                    style={{
                      width: 2,
                      height: 15,
                      marginHorizontal: 10,
                      backgroundColor: colors.lightGray,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignSelf: 'center',
                      marginTop: 4,
                      opacity: 0.6,
                      alignItems: 'center',
                    }}>
                    <Icon name="work" size={20} />
                    {userProfile?.designation ? (
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 'bold',
                          paddingLeft: 10,
                        }}>
                        {userProfile.designation}
                      </Text>
                    ) : (
                      <Text style={{ paddingLeft: 10 }}>Unknown</Text>
                    )}
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    alignSelf: 'center',
                    opacity: 0.5,
                    textTransform: 'capitalize',
                  }}>
                  {userInfo.truth_speaking === null
                    ? 0
                    : Math.round(parseFloat(userInfo.truth_speaking))}
                  % of your gossips are up voted.
                </Text>
              </View>

              {/*<View style={{width: 80}}></View>*/}
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                paddingHorizontal: 20,
                marginTop: 20,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 15,
                  paddingVertical: 8,
                  borderRadius: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() =>
                  navigation.navigate('Edit', { userInfo, userProfile })
                }>
                <Text
                  style={{
                    color: colors.white,
                    fontSize: 14,
                    fontWeight: 'bold',
                  }}>
                  EDIT PROFILE
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: '#dcdcdc',
                width: '100%',
                marginVertical: 16,
              }}
            />
            <View
              style={{
                padding: 20,
                paddingVertical: 5,
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.lightGray,
                  borderRadius: 100,
                  marginRight: 10,
                }}
                onPress={() => {
                  const url = userProfile?.facebook_link
                    ? userProfile.facebook_link
                    : 'https://facebook.com';
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
                <Icon name="facebook_social" size={45} />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: colors.lightGray,
                  borderRadius: 100,
                  marginRight: 10,
                }}
                onPress={() => {
                  const url = userProfile?.twitter_link
                    ? userProfile.twitter_link
                    : 'https://twitter.com';
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
                <Icon name="linkedin_social" size={45} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: '#dcdcdc',
                width: '100%',
                marginTop: 16,
              }}
            />
            <View
              style={{
                alignItems: 'center',
                width: '100%',
                backgroundColor: colors.veryLightGrey,
                paddingBottom: 100,
              }}>
              <CustomBtn
                onPress={() => navigation.push('Polls', { own: true })}
                label="Polls"
              />
              <CustomBtn
                onPress={() => navigation.push('GossipByUser')}
                label="Gossips"
              />
              <CustomBtn
                onPress={() => navigation.navigate('Friend List')}
                label="Friends"
              />
              <CustomBtn
                onPress={() => navigation.navigate('UserInfor')}
                label="About me"
              />
              <CustomBtn
                onPress={() => navigation.navigate('Friend Requests')}
                label="Friend Requests"
              />
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
};

export default Profile;

//const shadow = { elevation: 5, shadowColor: "#aaaaaa", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 5 }
