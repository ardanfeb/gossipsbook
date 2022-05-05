import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { Icon } from '../../components';
import { layout } from '../../constants';

const { screenWidth } = layout;

const Second = ({ navigation }) => {
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
        name={4}
        size={300}
        style={{ alignSelf: 'center', marginTop: 120 }}
      />

      <View style={{ alignItems: 'center', marginTop: 50 }}>
        <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Questions</Text>
        <Text
          style={{
            marginTop: 20,
            width: screenWidth * 0.7,
            textAlign: 'center',
            fontSize: 16,
          }}>
          Any user can ask any questions and find the answers
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.push('Login')}
        style={{
          width: '90%',
          height: 50,
          position: 'absolute',
          bottom: 30,
          borderRadius: 10,
          backgroundColor: 'rgb(237, 108, 45)',
          alignSelf: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{ textAlign: 'center', color: '#fff', fontSize: 18 }}>
          Let's Start
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Second;
