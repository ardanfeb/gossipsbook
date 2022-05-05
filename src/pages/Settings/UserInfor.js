import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';

import { Touchable, Icon } from '../../components';
import { colors } from '../../constants';
import { shadow } from '../../constants/layout';

const { width } = Dimensions.get('screen');

const About = ({ navigation, route }) => {
  const username = route.params?.username ?? '';
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [userProfile, setUserProfile] = useState({});

  const getData = async () => {
    try {
      if (username.length > 0) {
        const res = await axios.get(
          'https://www.gossipsbook.com/api/user/retrieve/' + username + '/',
        );
        console.log(res.data);
        setUserInfo(res.data);
        setUserProfile(res.data.profile);
      } else {
        const res = await axios.get(
          'https://www.gossipsbook.com/api/current-user/profile/retrieve/',
        );
        console.log(res.data);
        setUserInfo(res.data);
        setUserProfile(res.data.profile);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.white,
        flex: 1,
      }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <View
        style={{
          flexDirection: 'row',
          paddingLeft: 10,
          backgroundColor: colors.white,
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}>
        <View
          style={{
            position: 'absolute',
            left: 10,
            top: 10,
            width: 40,
            height: 40,
            zIndex: 2,
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
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: 60,
            // paddingLeft: 50,
          }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              numberOfLines: 2,
              textAlign: 'center',
            }}>
            {userInfo.username?.length > 0
              ? userInfo.username + "'s information"
              : 'My information'}
          </Text>
        </View>
      </View>

      <ScrollView
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}
        contentContainerStyle={{
          paddingBottom: 50,
          paddingTop: 30,
          paddingHorizontal: 20,
        }}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <>
            <Image
              resizeMode="cover"
              source={
                userProfile?.image
                  ? {
                    uri: userProfile?.image,
                  }
                  : require('../../assets/defaultAvatar.jpeg')
              }
              style={{
                //aspectRatio:1,
                width: width * 0.5,
                height: width * 0.5,
                borderWidth: 3,
                borderColor: colors.white,
                borderRadius: 1000,
                alignSelf: 'center',
                padding: 5,
                borderRadius: 1000,
                borderWidth: 3,
                ...shadow,
                overflow: 'hidden',
                aspectRatio: 1,
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <Text style={{ fontWeight: 'bold' }}>Username</Text>
              <Text>{userInfo.username}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <Text style={{ fontWeight: 'bold' }}>First Name</Text>
              <Text>{userInfo?.first_name ?? ''}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <Text style={{ fontWeight: 'bold' }}>Last Name</Text>
              <Text>{userInfo?.last_name ?? ''}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <Text style={{ fontWeight: 'bold' }}>Bio</Text>
              <Text>{userProfile?.bio ?? ''}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <Text style={{ fontWeight: 'bold' }}>Profession</Text>
              <Text>{userProfile?.designation ?? ''}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <Text style={{ fontWeight: 'bold' }}>Location</Text>
              <Text>{userProfile?.location ?? ''}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <Text style={{ fontWeight: 'bold' }}>Languages</Text>
              <Text>{userProfile?.languages ?? ''}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <Text style={{ fontWeight: 'bold' }}>Birthday</Text>
              <Text>{userProfile?.birthday ?? ''}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <Text style={{ fontWeight: 'bold' }}>Marital Status</Text>
              <Text>{userProfile?.marital_status ?? ''}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <Text style={{ fontWeight: 'bold' }}>Gender</Text>
              <Text>{userProfile?.gender ?? ''}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <Icon name="facebook_social" size={40} />
              <Text>
                {userProfile?.facebook_link ?? 'https://facebook.com'}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <Icon name="linkedin_social" size={40} />
              <Text>
                {userProfile?.linkedin_link?.length ?? 'https://linkedin.com'}
              </Text>
            </View>
            {/* <View
              style={{
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                }}>
                Work Experiences:
              </Text>
              {userInfo.work_experiences.length === 0 ? (
                <View>
                  <Text>Nothing to show</Text>
                </View>
              ) : (
                userInfo.work_experiences.map((i, ind) => {
                  return (
                    <View
                      style={{
                        justifyContent: 'space-around',
                        borderColor: colors.gray,
                        borderBottomWidth: 0.5,
                      }}
                      key={ind}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                          }}>
                          Company name
                        </Text>
                        <Text>{i.company_name}</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                          }}>
                          Description
                        </Text>
                        <Text>{i.text}</Text>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
            <View
              style={{
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                }}>
                Qualifications:
              </Text>
              {userInfo.qualifications.length === 0 ? (
                <View>
                  <Text>Nothing to show</Text>
                </View>
              ) : (
                userInfo.qualifications.map((i, ind) => {
                  return (
                    <View
                      style={{
                        justifyContent: 'space-around',
                        borderColor: colors.gray,
                        borderBottomWidth: 0.5,
                      }}
                      key={ind}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                          }}>
                          Link
                        </Text>
                        <Text>{i.link}</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                          }}>
                          Description
                        </Text>
                        <Text>{i.text}</Text>
                      </View>
                    </View>
                  );
                })
              )}
            </View> */}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default About;
