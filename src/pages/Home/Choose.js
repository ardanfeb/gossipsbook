import AsyncStorage from '@react-native-community/async-storage';
import React, {useState} from 'react';
import {View, Text} from 'react-native';

import {Touchable, Icon} from '../../components';
import {colors, config} from '../../constants';

const {buttonHeight} = config;

const Choose = ({navigation}) => {
  const [data, setData] = useState([
    {label: 'programming', choosed: false},
    {label: 'css', choosed: false},
    {label: 'html', choosed: false},
    {label: 'js', choosed: false},
    {label: 'c', choosed: false},
    {label: 'c#', choosed: false},
    {label: 'php', choosed: false},
  ]);

  const press = (label) => {
    const newData = [...data];
    const item = newData.find((x) => x.label == label);
    item.choosed = !item.choosed;
    setData(newData);
  };

  const next = async () => {
    await AsyncStorage.setItem(
      'interest',
      JSON.stringify(data.filter((i) => i.choosed)),
    );
    navigation.push('Main');
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
        padding: 20,
        alignItems: 'center',
      }}>
      <Icon name={5} size={250} style={{alignSelf: 'center'}} />

      <Text
        style={{
          fontSize: 30,
          fontWeight: 'bold',
          marginTop: 10,
          color: '#666',
        }}>
        Interests
      </Text>
      <Text style={{marginTop: 5, color: 'gray'}}>
        Please, choose your interests
      </Text>

      <View
        style={{
          flex: 1,
          flexWrap: 'wrap',
          flexDirection: 'row',
          marginTop: 20,
        }}>
        {data.map((item) => (
          <Touchable
            key={item.label}
            onPress={() => press(item.label)}
            mh={5}
            mv={5}
            bg={item.choosed ? colors.navyBlue : colors.gray}
            ph={10}
            pv={3}
            br={5}>
            <Text style={{color: colors.white}}>{item.label}</Text>
          </Touchable>
        ))}
      </View>

      <Touchable
        onPress={next}
        style={{
          width: '100%',
          height: buttonHeight,
          borderRadius: 10,
          backgroundColor: colors.navyBlue,
          justifyContent: 'center',
        }}>
        <Text style={{textAlign: 'center', color: colors.white, fontSize: 18}}>
          Next
        </Text>
      </Touchable>
    </View>
  );
};

export default Choose;
