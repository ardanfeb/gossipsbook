import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  StatusBar,
} from 'react-native';

import Textarea from 'react-native-textarea';

import { Touchable, Icon } from '../../components';
import { colors, config, layout } from '../../constants';

const { buttonHeight } = config;
const { screenWidth } = layout;

const CreateFeedBack = ({ navigation }) => {
  const [message, setMessage] = useState('');

  const send = async () => {
    const email = (await AsyncStorage.getItem('email')) ?? 'null';

    if (!email || !message) {
      Alert.alert('Gossips', 'All fields required!');
      return;
    }
    try {
      const res = await axios.post(
        'https://www.gossipsbook.com/api/feedback/list-create/',
        {
          email,
          message,
        },
      );
      console.log(res);
      Alert.alert('Gossips', 'Feedback sent!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (err) {
      Alert.alert('Gossips', JSON.stringify(err));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
        <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
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
            marginTop: 12,
            fontSize: 24,
            fontWeight: 'bold',
            color: '#000',
          }}>
          Create New Feedback
        </Text>
        <View
          style={{
            marginTop: 50,
            marginHorizontal: 20,
            width: Dimensions.get('screen').width - 40,
          }}>
          <Text>Your message:</Text>
          <TextInput
            onChangeText={(message) => setMessage(message)}
            multiline={true}
            numberOfLines={10}
            style={{
              marginTop: 10,
              paddingLeft: 10,
              borderWidth: 0.5,
              borderColor: colors.gray,
              borderRadius: 10,
              textAlignVertical: 'top',
              height: 150,
            }}
          />
        </View>
        <Touchable
          onPress={send}
          style={{
            position: 'absolute',
            bottom: 30,
            width: '100%',
            height: buttonHeight,
            borderRadius: 10,
            backgroundColor: colors.primary,
            justifyContent: 'center',
          }}>
          <Text
            style={{ textAlign: 'center', color: colors.white, fontSize: 18 }}>
            Send
          </Text>
        </Touchable>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreateFeedBack;
