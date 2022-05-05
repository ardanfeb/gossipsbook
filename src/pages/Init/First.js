import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { Icon } from '../../components';
import { layout } from '../../constants';

const { screenWidth } = layout;

const First = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <TouchableOpacity
        onPress={() => navigation.push('Login')}
        style={{
          height: 50,
          position: 'absolute',
          top: 30,
          right: 15,
          alignSelf: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: 'rgb(119, 116, 110)',
            fontSize: 16,
          }}>
          Skip
        </Text>
      </TouchableOpacity>

      <Icon
        name={3}
        size={350}
        style={{ alignSelf: 'center', marginTop: 100 }}
      />

      <View style={{ alignItems: 'center', marginTop: -20 }}>
        <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Gossips</Text>
        <Text
          style={{
            marginTop: 20,
            width: screenWidth * 0.7,
            textAlign: 'center',
            fontSize: 16,
          }}>
          Any user can write anything and share to your friends
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('Second')}
        style={{
          width: '90%',
          height: 50,
          position: 'absolute',
          bottom: 50,
          borderRadius: 10,
          backgroundColor: 'rgb(237, 108, 45)',
          alignSelf: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{ textAlign: 'center', color: '#fff', fontSize: 18 }}>
          Next
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default First;
