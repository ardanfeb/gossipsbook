import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Touchable, Input, Icon, Button } from '../../components';
import { colors, config, layout, apiURL } from '../../constants';
import { request } from '../../helpers';

const { buttonHeight } = config;
const { screenHeight } = layout;

const Register = ({ navigation }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [password, setPassword] = useState(null);

  const [emailError, setEmailError] = useState(false);
  const [userNameError, setUserNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [secure, setSecure] = useState(true);
  const [termURL, setTermURL] = useState('http://www.gossipbook.com/');

  const isEmail =
    /^[a-zA-Z0-9.!#$%&' * +/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          'https://www.gossipsbook.com/api/terms_and_conditions/',
        );
        if (res.data) {
          setTermURL(res.data.terms_and_condition_url);
          await AsyncStorage.setItem(
            'termURL',
            res.data.terms_and_condition_url,
          );
          await AsyncStorage.setItem('aboutUsURL', res.data.about_us_url);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const register = async () => {
    if (isChecked === false) {
      Alert.alert('Gossips', 'You must agree with our Terms & Conditions');
      return;
    }
    if (email && userName && password) {
      let data = {
        email: email,
        username: userName,
        password1: password,
        password2: password,
      };
      try {
        const res = await axios.post(
          'https://www.gossipsbook.com/api/user/auth/registration/',
          data,
        );
        Alert.alert('Gossips', 'Success!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]);
      } catch (err) {
        Alert.alert('Gossips', JSON.stringify(err.response.data));
      }
    } else {
      setUserNameError(!userName);
      setEmailError(!email || isEmail);
      setPasswordError(!password);
    }
  };

  const login = () => {
    navigation.navigate('Login');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: colors.white }}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <Touchable
          onPress={() => navigation.goBack()}
          jc
          ac
          size={40}
          br={20}
          absolute
          top={30}
          left={20}
          brc="#555"
          brw={1}>
          <Icon name="back" size={18} />
        </Touchable>

        <KeyboardAwareScrollView
          behavior={Platform.OS === 'ios' ? 'height' : 'padding'}
          style={{
            marginTop: screenHeight / 10,
            flex: 1,
            alignSelf: 'center',
          }}>
          <Icon
            name={6}
            size={250}
            style={{ alignSelf: 'center', marginTop: 10 }}
          />

          <Text
            style={{
              fontSize: 30,
              fontWeight: 'bold',
              alignSelf: 'center',
              marginTop: screenHeight / 35,
              color: '#666',
            }}>
            Sign up
          </Text>
          <Text
            style={{
              marginTop: 5,
              marginBottom: 20,
              color: 'gray',
              alignSelf: 'center',
            }}>
            Create your account
          </Text>

          <View style={{ flex: 1, alignItems: 'center', width: '100%' }}>
            <Input
              style={{
                marginBottom: 15,
                borderColor: emailError ? colors.darkred : colors.gray,
                borderWidth: emailError ? 1 : 0.5,
                width: '90%',
                borderRadius: 10,
                paddingLeft: 10,
                height: buttonHeight,
              }}
              placeholder="Email"
              autoCapitalize="none"
              value={email}
              onChangeText={(e) => setEmail(e)}
            />
            <Input
              style={{
                marginBottom: 15,
                borderColor: userNameError ? colors.darkred : colors.gray,
                borderWidth: userNameError ? 1 : 0.5,
                width: '90%',
                borderRadius: 10,
                paddingLeft: 10,
                height: buttonHeight,
              }}
              placeholder="Username"
              autoCapitalize="none"
              value={userName}
              onChangeText={(e) => setUserName(e)}
            />
            <Input
              rightIcon={secure ? 'eye_close' : 'eye'}
              rightIconSize={30}
              rightAction={() => setSecure(!secure)}
              style={{
                marginBottom: 15,
                borderColor: passwordError ? colors.darkred : colors.gray,
                borderWidth: passwordError ? 1 : 0.5,
                width: '90%',
                borderRadius: 10,
                paddingLeft: 10,
                height: buttonHeight,
                marginTop: 10,
              }}
              placeholder="Password"
              secureText={secure}
              autoCapitalize="none"
              value={password}
              onChangeText={(e) => setPassword(e)}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 20,
              }}>
              <TouchableOpacity
                onPress={() => setIsChecked(!isChecked)}
                style={{
                  borderColor: colors.gray,
                  borderWidth: 0.5,
                  width: 30,
                  height: 30,
                  backgroundColor: isChecked ? colors.primary : null,
                  marginRight: 10,
                }}></TouchableOpacity>
              <Text>Accept </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Terms')
                }}>
                <Text
                  style={{
                    textDecorationLine: 'underline',
                    color: 'blue',
                  }}>
                  Terms
                </Text>

              </TouchableOpacity>
              <Text>{' & '}</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('PrivacyPolicy')
                }}>
                <Text
                  style={{
                    textDecorationLine: 'underline',
                    color: 'blue',
                  }}>
                  Privacy Policy
                </Text>
              </TouchableOpacity>
            </View>
            <Touchable
              onPress={register}
              style={{
                width: '90%',
                height: buttonHeight,
                borderRadius: 10,
                backgroundColor: colors.primary,
                justifyContent: 'center',
              }}>
              <Text
                style={{ textAlign: 'center', color: '#fff', fontSize: 18 }}>
                Sign up
              </Text>
            </Touchable>
            <Touchable
              onPress={login}
              style={{
                width: '90%',
                height: buttonHeight,
                borderRadius: 10,
                backgroundColor: 'transparent',
                justifyContent: 'center',
              }}>
              <Text
                style={{ textAlign: 'center', color: '#000', fontSize: 18 }}>
                Log in
              </Text>
            </Touchable>
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default Register;
