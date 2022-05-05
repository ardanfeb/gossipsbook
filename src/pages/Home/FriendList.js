import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';

import { colors } from '../../constants';
import { Touchable, Icon } from '../../components';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

const FriendList = ({ navigation }) => {
  const [list, setList] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await axios.get(
        'https://www.gossipsbook.com/api/current-user/friends/list/',
      );
      const { results } = res.data;
      console.log(results);
      setList(results);
    })();
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <Touchable
        onPress={() => navigation.goBack()}
        jc
        ac
        size={40}
        br={20}
        absolute
        top={10}
        left={20}
        brc="#555"
        brw={1}>
        <Icon name="back" size={18} />
      </Touchable>

      <Text
        style={{
          alignSelf: 'center',
          marginTop: 15,
          fontSize: 24,
          fontWeight: 'bold',
          color: '#000',
        }}>
        My friends
      </Text>
      <View>
        {list.length > 0 ? (
          <ScrollView
            contentContainerStyle={{
              paddingTop: 50,
            }}>
            {list.map((item) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('UserProfile', {
                      username: item.username,
                    })
                  }
                  key={item.username}
                  style={{
                    borderRadius: 20,
                    borderColor: colors.gray,
                    borderWidth: 1,
                    margin: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 10,
                  }}>
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      marginHorizontal: 20,
                    }}>
                    {item.profile?.image ? (
                      <Image
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 50,
                        }}
                        source={{
                          uri: item.profile.image,
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
                  <Text
                    style={{
                      fontSize: 20,
                    }}>
                    {item.username}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : (
          <View
            style={{
              marginTop: 50,
              marginLeft: 20,
            }}>
            <Text>You do not have any friends!</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default FriendList;
