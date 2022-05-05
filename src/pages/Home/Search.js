import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  Image,
  ScrollView,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { colors } from '../../constants';
import { Modal, Touchable, Icon, GossipItem, Input } from '../../components';
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Center } from '../../components/Header';
import AsyncStorage from '@react-native-community/async-storage';

const Search = ({ navigation, route }) => {
  const { search: searchText } = route.params;
  const [cardData, setCardData] = useState([]);
  const [postData, setPostData] = useState([]);
  const [search, setSearch] = useState(null);
  const [isSearchTabs, setSearchTabs] = useState(false);
  const [tabSelected, setAnotherTab] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const [recentSearch, setRecentSearch] = useState([]);

  const handlePostSearch = () => {
    setPostLoading(true);
    setPostData([]);
    addItemToRecentSearch(search);
    (async () => {
      try {
        console.log('1');
        const res = await axios.get(
          `https://www.gossipsbook.com/api/gossips/list-create/?title_contains=${search}`,
        );
        const { results } = res.data;
        setPostData(results);
      } catch (err) {}
      setPostLoading(false);
    })();
    setAnotherTab(true);
  };

  useEffect(() => {
    AsyncStorage.getItem('RecentSearch').then((res) => {
      let searchData = JSON.parse(res);
      setRecentSearch(searchData);
    });
  }, []);

  const addItemToRecentSearch = async (search) => {
    if (!search) return;
    let RecentSearch = await AsyncStorage.getItem('RecentSearch');
    if (RecentSearch) {
      RecentSearch = JSON.parse(RecentSearch);
      if (!RecentSearch.includes(search)) {
        RecentSearch?.push(search);
        AsyncStorage.setItem('RecentSearch', JSON.stringify(RecentSearch));
      }
    } else {
      RecentSearch = [];
      RecentSearch?.push(search);
      AsyncStorage.setItem('RecentSearch', JSON.stringify(RecentSearch));
    }
  };

  const handleUserSearch = (fromRecentSearch) => {
    setUserLoading(true);
    setCardData([]);
    addItemToRecentSearch(fromRecentSearch ? fromRecentSearch : search);
    (async () => {
      try {
        console.log(searchText);
        const res = await axios.get(
          `https://www.gossipsbook.com/api/users/?search=${
            fromRecentSearch ? fromRecentSearch : search
          }`,
        );
        const { results } = res.data;
        setCardData(results);
      } catch (err) {
        console.log(err);
      }
      setUserLoading(false);
    })();
    setSearchTabs(true);
    setAnotherTab(false);
  };

  const handleAddFriend = async (i) => {
    if (i.is_friend === 'Request sent') {
      const res = await axios
        .delete(
          `https://www.gossipsbook.com/api/current-user/friend-request/list/update/${
            i.username ?? ''
          }/`,
        )
        .then((res) => {
          handleUserSearch();
          console.log('create', res);
        })
        .catch((err) => {
          console.log(
            'create err',
            err,
            `https://www.gossipsbook.com/api/current-user/friend-request/list/update/${
              i.username ?? ''
            }/`,
          );
        });
    }
    if (i.is_friend === 'False' || i.is_friend === false) {
      const res = await axios
        .post(
          `https://www.gossipsbook.com/api/current-user/friend-request/create/${
            i.username ?? ''
          }/`,
        )
        .then((res) => {
          handleUserSearch();
          console.log('create', res);
        })
        .catch((err) => {
          console.log(
            'create err',
            err,
            `https://www.gossipsbook.com/api/current-user/friend-request/create/${
              i.username ?? ''
            }/`,
          );
        });
    }
    if (i.is_friend === true || i.is_friend === 'True') {
      const res = await axios
        .delete(
          `https://www.gossipsbook.com/api/current-user/friend-request/list/update/${
            i.username ?? ''
          }/`,
        )
        .then((res) => {
          handleUserSearch();
          console.log('delete', res);
        })
        .catch((err) => {
          console.log(
            'delete err',
            err,
            `https://www.gossipsbook.com/api/current-user/friend-request/list/update/${
              i.username ?? ''
            }/`,
          );
        });
    }
    // console.log(res.data);
    //setLoading(true);
    //await handleUserSearch();
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'https://gossipsbook.com',
        // url: 'https://gossips.com',
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

  // const onShare = async () => {
  //   try {
  //     const result = await Share.share({
  //       message: 'https://gossipsbook.com',
  //       url: 'https://gossipsbook.com',
  //     });
  //     if (result.action === Share.sharedAction) {
  //       if (result.activityType) {
  //         console.log('shared with activity type of result.activityType');
  //       } else {
  //         console.log('share');
  //       }
  //     } else if (result.action === Share.dismissedAction) {
  //       console.log('dismiss');
  //     }
  //   } catch (error) {
  //     alert(error.message);
  //   }
  // };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
        // paddingHorizontal: 10,
        paddingTop: 10,
      }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          maxHeight: 20,
          paddingTop: 20,
          paddingHorizontal: 10,
          marginBottom: 30,
        }}>
        <Touchable
          onPress={() => navigation.goBack()}
          jc
          ac
          size={40}
          br={25}
          style={{
            backgroundColor: colors.white,
          }}
          brc="#555"
          brw={1}>
          <Icon name="back" size={18} />
        </Touchable>

        <TextInput
          style={[styles.input, { backgroundColor: colors.white }]}
          onChangeText={(text) => setSearch(text)}
          value={search}
          placeholder="search"
          onSubmitEditing={() => {
            handleUserSearch();
          }}
        />
      </View>
      {!isSearchTabs && (
        <View style={{ paddingHorizontal: 10 }}>
          <View style={styles.text}>
            <Text>Recent search</Text>
            <TouchableOpacity
              onPress={() => {
                setRecentSearch([]);
                AsyncStorage.setItem('RecentSearch', JSON.stringify([]));
              }}>
              <Text style={styles.redText}>Clear All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recentSearch}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSearch(item);
                  handleUserSearch(item);
                }}
                style={{
                  padding: 7,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                }}>
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      {isSearchTabs && (
        <View style={{ backgroundColor: 'white' }}>
          <View style={styles.tabs}>
            <View
              style={{
                width: '50%',
                borderBottomColor: !tabSelected ? 'red' : '#cfcfcf',
                borderBottomWidth: 2,
              }}>
              <TouchableOpacity onPress={() => handleUserSearch()}>
                <Text style={styles.tab}>Gossipers</Text>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                width: 1,
                backgroundColor: 'lightgrey',
                height: 20,
              }}></Text>
            <View
              style={{
                width: '50%',
                borderBottomColor: tabSelected ? 'red' : '#cfcfcf',
                borderBottomWidth: 2,
              }}>
              <TouchableOpacity onPress={() => handlePostSearch()}>
                <Text style={styles.tab}>Gossips</Text>
              </TouchableOpacity>
            </View>
          </View>
          {!tabSelected && (
            <ScrollView style={{ paddingHorizontal: 10 }}>
              {userLoading ? (
                <ActivityIndicator size="large" color="#000080" />
              ) : null}

              {cardData?.map((i, index) => (
                <View
                  style={{
                    flexDirection: 'row',
                    borderColor: '#1B3850',
                    borderRadius: 20,
                    borderWidth: 1,
                    marginTop: 10,
                    padding: 10,
                    alignItems: 'center',
                  }}
                  key={index}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('UserProfile', {
                        username: i.username,
                      })
                    }
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    {i.profile.image !== null ? (
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
                    <View
                      style={{
                        marginLeft: 10,
                        //   justifyContent: 'space-between',
                      }}>
                      <Text>{i.username}</Text>
                      {!!i.designation && (
                        <Text
                          style={{ fontStyle: 'italic', marginVertical: 5 }}>
                          {i.designation}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                  <View
                    style={{
                      flexGrow: 1,
                      alignItems: 'flex-end',
                      paddingRight: 10,
                    }}>
                    <TouchableOpacity
                      onPress={async () => handleAddFriend(i)}
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: colors.white,
                        borderWidth: 1,
                        borderColor: colors.black,
                        borderRadius: 1000,
                        padding: 5,
                        alignItems: 'center',
                      }}>
                      {i.is_friend === 'Request sent' && (
                        <Icon name="open_door" size={25} />
                      )}
                      {i.is_friend === true || i.is_friend === 'True' ? (
                        <Icon name="friends" size={25} />
                      ) : null}
                      {i.is_friend === false || i.is_friend === 'False' ? (
                        <Icon name="door" size={25} />
                      ) : null}
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
          {tabSelected && (
            <ScrollView
              style={{
                backgroundColor: postLoading ? '#fff' : '#eee',
                padding: 0,
              }}>
              {postLoading ? (
                <ActivityIndicator size="large" color="#000080" />
              ) : null}

              {postData?.map((item, i) => (
                <GossipItem
                  key={i}
                  {...item}
                  onShare={onShare}
                  navigate={navigation.navigate}
                />
              ))}
              {postData?.length > 0 && <View style={{ height: 200 }}></View>}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 10,
    margin: 10,
    width: '84%',
    height: 40,
    borderRadius: 15,
    backgroundColor: 'lightgrey',
  },
  text: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  redText: {
    color: 'red',
  },
  tabs: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0.5,
  },
  tab: {
    height: 50,
    textAlign: 'center',
    textAlignVertical: 'center',
    width: '100%',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 1000,
    backgroundColor: 'lightblue',
    marginRight: 15,
    marginBottom: 10,
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingTop: 5,
  },
  subtext: {
    fontSize: 12,
    lineHeight: 30,
    color: 'lightgrey',
  },
  cardText: {
    display: 'flex',
    justifyContent: 'space-between',
    height: 45,
  },
  postCard: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 15,
  },
  postCardBtn: {
    display: 'flex',
    flexDirection: 'row',
  },
  cardImage: {
    height: 300,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hashTag: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
});

export default Search;
