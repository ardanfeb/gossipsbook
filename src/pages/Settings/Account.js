import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { CommonActions } from '@react-navigation/routers';
import { colors } from '../../constants';
import { Touchable, Icon } from '../../components';
import AsyncStorage from '@react-native-community/async-storage';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

const Account = ({ navigation }) => {
  const [email, setEmail] = useState('None');
  const [code, setCode] = useState('');
  const [isCodeSent, setCodeSent] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const email = await AsyncStorage.getItem('email');
        if (email) setEmail(email);
      } catch (err) {
        console.log(err);
      }
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
        Account
      </Text>

      <View style={{ padding: 20, flexDirection: 'row' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Email: {email}</Text>
      </View>
      <View
        style={{
          flexDirection: 'column',
          marginHorizontal: 20,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Interest', { type: 'edit' })}
          style={{
            // width: 150,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'stretch',
            backgroundColor: colors.navyBlue,
            paddingVertical: 20,
            borderRadius: 10,
            marginTop: 10,
          }}>
          <Text style={{ color: colors.white }}>Change interests</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('ChangePassword')}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'stretch',
            backgroundColor: colors.navyBlue,
            paddingVertical: 20,
            borderRadius: 10,
            marginTop: 10,
          }}>
          <Text style={{ color: colors.white }}>Change password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => {
            const sendOtpResponse = await axios.post(
              'https://www.gossipsbook.com/api/current-user/delete/send_otp/',
            );
            if (sendOtpResponse.status === 201) {
              setCodeSent(true);
            }
          }}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'stretch',
            backgroundColor: colors.navyBlue,
            paddingVertical: 20,
            borderRadius: 10,
            marginTop: 10,
          }}>
          <Text style={{ color: colors.white }}>Delete Account</Text>
        </TouchableOpacity>
        {isCodeSent ? (
          <View
            style={{
              width: '100%',
            }}>
            <Text
              style={{
                marginTop: 20,
                fontWeight: 'bold',
              }}>
              We have sent you the code for delete account verification. Please
              check your email
            </Text>
            <TextInput
              onChangeText={(code) => setCode(code)}
              placeholder="Code"
              value={code}
              maxLength={200}
              style={{
                height: 60,
                marginTop: 20,
                paddingLeft: 10,
                borderWidth: 0.5,
                borderColor: colors.gray,
                borderRadius: 10,
              }}
            />
            <Text
              style={{
                marginTop: 20,
                fontWeight: 'bold',
              }}>
              Note: once you delete your account. Your account will immediately got deleted and all the data will be erased, so you cannot access your account again.
              If you need to use the gossipsbook, you need to create the new account. So, please think twice before deleting the account.
            </Text>
            {code ? (
              <TouchableOpacity
                onPress={async () => {
                  try {
                    const res = await axios.post(
                      'https://www.gossipsbook.com/api/current-user/delete/otp/',
                      {
                        otp: code,
                      },
                    );
                    if (res.status === 200) {
                      await AsyncStorage.multiRemove([
                        'currentList',
                        'email',
                        'token',
                        'username',
                      ]);
                      navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [
                            {
                              name: 'Login',
                            },
                          ],
                        }),
                      );
                    }
                  } catch (error) {
                    alert('Wrong Otp');
                  }
                }}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'stretch',
                  backgroundColor: colors.navyBlue,
                  paddingVertical: 20,
                  borderRadius: 10,
                  marginTop: 10,
                }}>
                <Text style={{ color: colors.white }}>Verify Code</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default Account;
