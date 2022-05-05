import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StatusBar } from 'react-native';

import { colors, config } from '../../constants';
import { Touchable, Icon } from '../../components';
import AsyncStorage from '@react-native-community/async-storage';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { CheckBox } from 'react-native-elements';
import { shadow } from '../../constants/layout';

const { buttonHeight } = config;
const baseColor = [
  '#f1f1f1',
  '#202020',
  '#7e909a',
  '#1c4e80',
  '#a5d8dd',
  '#ea6a47',
  '#0091d5',
  '#b3c100',
  '#ced2cc',
  '#23282d',
  '#4cbf5f',
  '#1f3f49',
  '#d32d41',
  '#6ab187',
  '#000000',
  '#ac3e31',
  '#484848',
  '#dbae58',
  '#dadada',
  '#20283e',
  '#488a99',
  '#FFBF00',
  '#FF7E00',
  '#00FFFF',
  '#FDEE00',
  '#f1f1f1',
  '#202020',
  '#7e909a',
  '#1c4e80',
  '#a5d8dd',
  '#ea6a47',
  '#0091d5',
  '#b3c100',
  '#ced2cc',
  '#23282d',
  '#4cbf5f',
  '#1f3f49',
  '#d32d41',
  '#6ab187',
  '#000000',
  '#ac3e31',
  '#484848',
  '#dbae58',
  '#dadada',
  '#20283e',
  '#488a99',
  '#FFBF00',
  '#FF7E00',
  '#00FFFF',
  '#FDEE00',
  '#f1f1f1',
  '#202020',
  '#7e909a',
  '#1c4e80',
  '#a5d8dd',
  '#ea6a47',
  '#0091d5',
  '#b3c100',
  '#ced2cc',
  '#23282d',
  '#4cbf5f',
  '#1f3f49',
  '#d32d41',
  '#6ab187',
  '#000000',
  '#ac3e31',
  '#484848',
  '#dbae58',
  '#dadada',
  '#20283e',
  '#488a99',
  '#FFBF00',
  '#FF7E00',
  '#00FFFF',
  '#FDEE00',
  '#f1f1f1',
  '#202020',
  '#7e909a',
  '#1c4e80',
  '#a5d8dd',
  '#ea6a47',
  '#0091d5',
  '#b3c100',
  '#ced2cc',
  '#23282d',
  '#4cbf5f',
  '#1f3f49',
  '#d32d41',
  '#6ab187',
  '#000000',
  '#ac3e31',
  '#484848',
  '#dbae58',
  '#dadada',
  '#20283e',
  '#488a99',
  '#FFBF00',
  '#FF7E00',
  '#00FFFF',
  '#FDEE00',
];

const Interest = ({ navigation, route }) => {
  const { type } = route.params;
  const [list, setList] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        if (type === 'create') {
          const res = await axios.get(
            'https://www.gossipsbook.com/api/interest/list/',
          );
          console.log('INTERESTS', res.data);
          const { result } = res.data;
          setList(
            result.map((i) => {
              return {
                ...i,
                color: baseColor[i.id],
                isSelected: false,
              };
            }),
          );
        } else {
          const currentList = await AsyncStorage.getItem('interestList');
          const parsedCurrentList = JSON.parse(currentList);
          console.log(parsedCurrentList);
          const res = await axios.get(
            'https://www.gossipsbook.com/api/interest/list/',
          );
          const { result } = res.data;
          setList(
            result.map((i) => {
              return {
                ...i,
                color: baseColor[i.id],
                isSelected: parsedCurrentList.find((cr) => cr.title === i.title)
                  ? true
                  : false,
              };
            }),
          );
        }
      } catch (err) { }
    })();
  }, []);
  const next = async () => {
    try {
      const listSelected = list.filter((i) => i.isSelected).map((i) => i.title);
      const res = await axios.post(
        'https://www.gossipsbook.com/api/current-user/interests/create/',
        {
          body: listSelected,
        },
      );
      await AsyncStorage.setItem(
        'interestList',
        JSON.stringify(list.filter((i) => i.isSelected)),
      );
      navigation.push('Main');
    } catch (err) {
      console.log(err);
    }
  };

  const allChecked = useMemo(() => list.filter(value => !value.isSelected).length == 0, [list])

  const CheckAll = () => (
    <CheckBox
      center
      textStyle={{ color: allChecked ? colors.white : colors.primary }}
      checkedColor={colors.white}
      uncheckedColor={colors.primary}
      containerStyle={{ backgroundColor: allChecked ? colors.primary : colors.veryLightGrey, marginBottom: 10, marginRight: 5, marginLeft: 5, borderRadius: 10, borderColor: colors.primary + '20', ...shadow }}
      title='SELECT ALL'
      checked={allChecked}
      onPress={() => setList(currentList => [...currentList.map(item => ({ ...item, isSelected: !allChecked }))])}
    />
  )
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
      <Touchable
        onPress={() => navigation.goBack()}
        jc
        ac
        size={40}
        br={20}
        absolute
        top={25}
        left={20}
        brc="#555"
        brw={1}>
        <Icon name="back" size={18} />
      </Touchable>

      <Text
        style={{
          alignSelf: 'center',
          marginTop: 25,
          fontSize: 24,
          fontWeight: 'bold',
          color: '#000',
        }}>
        Choose your interest
      </Text>
      <Text
        style={{
          alignSelf: 'center',
          fontSize: 16,
          opacity: 0.7,
          color: '#444',
        }}>
        {list.filter(value => value.isSelected).length} interests chosen.
      </Text>
      <View style={{ height: 1, backgroundColor: '#dcdcdc', width: '100%', marginTop: 16 }} />
      {list.length > 0 && (
        <FlatList
          contentContainerStyle={{
            padding: 5,
            paddingBottom: 10
          }}
          ListHeaderComponent={CheckAll}
          showsVerticalScrollIndicator={false}
          data={list}
          extraData={list}
          keyExtractor={(list) => list.id.toString()}
          numColumns={2}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (item.isSelected) {
                    setList((list) =>
                      list.map((i) =>
                        i.id === item.id ? { ...i, isSelected: false } : i,
                      ),
                    );
                  } else
                    setList((list) =>
                      list.map((i) =>
                        i.id === item.id ? { ...i, isSelected: true } : i,
                      ),
                    );
                }}
                style={{
                  borderRadius: 10,
                  borderWidth: 1,
                  flex: 1,
                  marginHorizontal: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: item.isSelected ? colors.navyBlue : null,
                  minHeight: 50,
                }}>
                <Text
                  style={{
                    color: item.isSelected ? 'white' : item.color,
                    fontSize: 16,
                  }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}

      <View style={{ height: 1, backgroundColor: '#dcdcdc', width: '100%' }} />

      <TouchableOpacity
        onPress={() => next()}
        disabled={list.filter(value => value.isSelected).length < 5}
        style={{
          padding: 10,
          borderRadius: 10,
          backgroundColor: colors.navyBlue,
          justifyContent: 'center',
          paddingHorizontal: 40,
          marginVertical: 15,
          alignSelf: 'center',
          opacity: list.filter(value => value.isSelected).length < 5 ? 0.5 : 1
        }}>
        <Text
          style={{ textAlign: 'center', color: colors.white, fontSize: 18, fontWeight: 'bold' }}>
          {type === 'create' ? 'Next' : 'Save'}
        </Text>
      </TouchableOpacity>
      {list.filter(value => value.isSelected).length < 5 && (
        <Text
          style={{
            borderTopWidth: 1,
            borderTopColor: "#dcdcdc",
            padding: 5,
            alignSelf: 'center',
            fontSize: 16,
            opacity: 0.7,
            color: '#444',
            width: '100%',
            textAlign: 'center'
          }}>
          Please choose at least 5 interests to continue.
        </Text>
      )}

    </View>
  );
};

export default Interest;
