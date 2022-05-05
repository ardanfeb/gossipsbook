import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, ScrollView } from 'react-native';

import { colors } from '../../constants';
import { Modal, Touchable, Icon, GossipItem } from '../../components';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const GossipByUser = ({ navigation, route }) => {
  const username = route.params?.username ?? '';
  const [fakeData, setfakeData] = useState([]);

  useEffect(() => {
    (async () => {
      const currentUser = await AsyncStorage.getItem('username');
      let user = username.length > 0 ? username : currentUser;
      try {
        const res = await axios.get(
          `https://www.gossipsbook.com/api/gossips/list-create/?username=${user}`,
        );
        const { results } = res.data;
        setfakeData(results);
      } catch (err) {
        console.log(err.response);
      }
    })();
  }, []);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'https://gossipsbook.com',
        url: 'https://gossipsbook.com',
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
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 0,
      }}>
      <Touchable
        onPress={() => navigation.goBack()}
        jc
        ac
        size={40}
        br={25}
        absolute
        top={10}
        left={20}
        brc="#555"
        brw={1}>
        <Icon name="back" size={18} />
      </Touchable>

      <Text
        style={{
          marginTop: 15,
          fontSize: 22,
          fontWeight: 'bold',
          color: '#000',
          alignSelf: 'center',
          numberOfLines: 2,
          textAlign: 'center',
          paddingLeft: 50,
        }}>
        {username.length > 0 ? 'Gossips by ' + username : 'My gossips'}
      </Text>

      <View
        style={{
          marginTop: 20,
        }}>
        {fakeData.length > 0 ? (
          <ScrollView
            contentContainerStyle={{
              backgroundColor: 'rgba(0,0,0,.05)',
              paddingBottom: 100,
            }}>
            {fakeData.map((item, index) => (
              <GossipItem
                {...item}
                key={index}
                onShare={onShare}
                navigate={navigation.navigate}
              />
            ))}
          </ScrollView>
        ) : (
          <Text>No data</Text>
        )}
      </View>
    </View>
  );
};

export default GossipByUser;
