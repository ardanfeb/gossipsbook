import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';

import { Touchable, Icon, CircularProgress } from '../../components';
import { colors } from '../../constants';

const About = ({ navigation }) => {
  const [currentTab, setCurrentTab] = useState('True Gossipers');
  const [trueGossiper, setTrueGossiper] = useState([]);
  const [objectGossiper, setObjectGossiper] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const resp = await axios.get(
          'https://www.gossipsbook.com/api/user/top-gossipers/',
        );
        setTrueGossiper(resp.data.results);
        const resp1 = await axios.get(
          'https://www.gossipsbook.com/api/user/top-gossipers/?type=objected',
        );
        setObjectGossiper(resp1.data.results);
      } catch (err) {
        Alert.alert('Gossips', JSON.stringify(err.re));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderContent = () => {
    if (currentTab === 'True Gossipers') {
      return trueGossiper.length > 0 ? (
        trueGossiper.map((i, id) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('UserProfile', { username: i.username })
              }
              key={id}
              style={{
                flexDirection: 'row',
                marginTop: 10,
                borderRadius: 20,
                borderWidth: 0.5,
                borderColor: colors.gray,
                paddingVertical: 10,
              }}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  marginHorizontal: 20,
                }}>
                {i.profile?.image ? (
                  <Image
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                    }}
                    source={{
                      uri: i.profile.image,
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
              </View>
              <View
                style={{
                  flexGrow: 2,
                  justifyContent: 'space-around',
                }}>
                <Text
                  style={{
                    textTransform: 'capitalize',
                  }}>
                  {i.username}
                </Text>
                {<Text>{i?.designation ?? ''}</Text>}
              </View>
              <View
                style={{
                  width: 80,
                  marginRight: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <CircularProgress
                  progress={i?.truth_speaking !== null ? i.truth_speaking : 0}
                  size={50}
                />
                <View
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{ textAlign: 'center', justifyContent: 'center' }}>
                    {i?.truth_speaking !== null
                      ? Math.round(i.truth_speaking)
                      : 0}
                    %
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })
      ) : (
        <Text>Nothing to show</Text>
      );
    } else {
      return objectGossiper.length > 0 ? (
        objectGossiper.map((i, id) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('UserProfile', { username: i.username })
              }
              key={id}
              style={{
                flexDirection: 'row',
                marginTop: 10,
                borderRadius: 20,
                borderWidth: 0.5,
                borderColor: colors.gray,
                paddingVertical: 10,
              }}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  marginHorizontal: 20,
                }}>
                {i.profile?.image ? (
                  <Image
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                    }}
                    source={{
                      uri: i.profile.image,
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
              </View>
              <View
                style={{
                  flexGrow: 2,
                  justifyContent: 'space-around',
                }}>
                <Text
                  style={{
                    textTransform: 'capitalize',
                  }}>
                  {i.username}
                </Text>
                <Text>{i?.designation ?? ''}</Text>
              </View>
              <View
                style={{
                  width: 50,
                  marginRight: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../assets/icons/objection_active.png')}
                  style={{
                    width: 35,
                    height: 35,
                  }}
                />
                <Text>{i.total_objections}</Text>
              </View>
            </TouchableOpacity>
          );
        })
      ) : (
        <Text>Nothing to show</Text>
      );
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.white,
        flex: 1,
        paddingTop: 20,
      }}>
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
            color: colors.black,
            backgroundColor: colors.white,
          }}>
          Top Gossipers
        </Text>
        {/* <View
          style={{
            flex: 1,
          }}>
          <Text></Text>
        </View> */}
      </View>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: colors.white,
          marginHorizontal: 20,
          borderWidth: 1,
          borderColor: colors.navyBlue,
          marginTop: 30,
          borderRadius: 30,
        }}>
        <TouchableOpacity
          onPress={() => setCurrentTab('True Gossipers')}
          style={{
            // flex: 1,
            flexGrow: 1,
            paddingVertical: 20,
            alignItems: 'center',
            // borderTopLeftRadius: 30,
            // borderBottomLeftRadius: 30,
            //change when activate the other feature
            borderRadius: 30,
            borderRightWidth: 0.5,
            borderRightColor: colors.navyBlue,
            backgroundColor:
              currentTab === 'True Gossipers' ? colors.primary : colors.white,
          }}>
          <Text
            style={{
              color:
                currentTab === 'True Gossipers' ? colors.white : colors.primary,
            }}>
            Most up votes received
          </Text>
        </TouchableOpacity>
        {/**
           Objection hidden temporary
         **/}
        {/*<TouchableOpacity*/}
        {/*  onPress={() => setCurrentTab('Objected Gossipers')}*/}
        {/*  style={{*/}
        {/*    flex: 1,*/}
        {/*    paddingVertical: 20,*/}
        {/*    alignItems: 'center',*/}
        {/*    borderTopRightRadius: 30,*/}
        {/*    borderBottomRightRadius: 30,*/}
        {/*    backgroundColor:*/}
        {/*      currentTab !== 'True Gossipers' ? colors.primary : null,*/}
        {/*  }}>*/}
        {/*  <Text*/}
        {/*    style={{*/}
        {/*      color:*/}
        {/*        currentTab !== 'True Gossipers' ? colors.white : colors.primary,*/}
        {/*    }}>*/}
        {/*    Objected Gossipers*/}
        {/*  </Text>*/}
        {/*</TouchableOpacity>*/}
      </View>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#000080"
          style={{
            marginTop: 20,
          }}
        />
      ) : (
        <ScrollView
          style={{ backgroundColor: colors.white }}
          contentContainerStyle={{ flexGrow: 1, padding: 20 }}
          bounces={false}
          showsVerticalScrollIndicator={false}>
          {renderContent()}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default About;
