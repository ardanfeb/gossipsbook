import AsyncStorage from '@react-native-community/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';

import { Touchable, Icon, GossipItem } from '../../components';
import { config, colors } from '../../constants';

const FalseInformation = ({ navigation }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      const currentList = await AsyncStorage.getItem('currentList');
      const list = JSON.parse(currentList);
      setData(
        list.filter((i) => i.total_votes > 999 || i.percentage_false > 51),
      );
    })();
  }, []);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 20,
      }}
      contentContainerStyle={{ paddingBottom: 20 }}
      bounces={false}
      showsVerticalScrollIndicator={false}>
      <Touchable
        onPress={() => navigation.goBack()}
        jc
        ac
        size={40}
        br={25}
        absolute
        top={10}
        left={0}
        brc="#555"
        brw={1}>
        <Icon name="back" size={18} />
      </Touchable>

      <Text
        style={{
          marginTop: 15,
          fontSize: 24,
          fontWeight: 'bold',
          color: '#444',
          marginLeft: '30%',
        }}>
        False Information
      </Text>

      {data.length > 0 ? (
        data.map((item, index) => (
          <GossipItem {...item} key={index} navigate={navigation.navigate} />
        ))
      ) : (
        <Text
          style={{
            marginTop: 20,
            fontSize: 20,
            fontWeight: '500',
            fontStyle: 'italic',
          }}>
          No False Information
        </Text>
      )}
    </ScrollView>
  );
};

export default FalseInformation;
