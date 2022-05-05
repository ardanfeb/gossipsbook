import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { colors, config, layout } from '../../constants';
import { Touchable, Icon, Input, Loading } from '../../components';
import axios from 'axios';

const { buttonHeight } = config;
const { screenWidth } = layout;

const ChangePassword = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  const [currentPasswordError, setCurrentPasswordError] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const [currentPasswordSecure, setCurrentPasswordSecure] = useState(true);
  const [newPasswordSecure, setNewPasswordSecure] = useState(true);
  const [confirmPasswordSecure, setConfirmPasswordSecure] = useState(true);

  const currentPasswordOnChangeText = (e) => {
    // if (e.replace(' ', '').length == 0) {
    //   setCurrentPasswordError(true);
    //   return;
    // }
    setCurrentPasswordError(!e);
    setCurrentPassword(e);
  };

  const newPasswordOnChangeText = (e) => {
    if (e.replace(' ', '').length == 0) {
      setNewPasswordError(true);
      return;
    }
    setNewPasswordError(!e);
    setNewPassword(e);
    currentPassword === e
      ? setNewPasswordError(true)
      : setNewPasswordError(false);
  };

  const confirmPasswordOnChangeText = (e) => {
    if (e.replace(' ', '').length == 0) {
      setConfirmPasswordError(true);
      return;
    }
    setConfirmPasswordError(!e);
    setConfirmPassword(e);
    newPassword !== confirmPassword
      ? setConfirmPasswordError(true)
      : setConfirmPasswordError(false);
  };

  const save = async () => {
    try {
      const data = {
        prev_password: currentPassword,
        password: newPassword,
        password_confirm: confirmPassword,
      };
      const res = await axios.post(
        'https://www.gossipsbook.com/api/user/auth/password-change/',
        data,
      );
      if (res.data.status === 'ok') {
        Alert.alert('Gossips', 'Password changed sucessfully!!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (err) {
      Alert.alert('Gossips', 'Something went wrong');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          style={{ backgroundColor: colors.white }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingBottom: buttonHeight + 40 + 20,
            marginTop: 20,
          }}>
          <KeyboardAwareScrollView>
            <View
              style={{
                marginTop: 20,
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <Touchable
                onPress={() => navigation.goBack()}
                jc
                ac
                size={40}
                br={20}
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
                  color: '#000',
                }}>
                Change Password
              </Text>

              <Icon name={11} size={200} style={{ marginVertical: 25 }} />

              <Input
                rightIcon={currentPasswordSecure ? 'eye_close' : 'eye'}
                rightIconSize={30}
                rightAction={() =>
                  setCurrentPasswordSecure(!currentPasswordSecure)
                }
                style={{
                  //width: '100%',
                  borderColor: currentPasswordError ? colors.red : colors.gray,
                  borderWidth: currentPasswordError ? 1 : 0.5,
                  borderRadius: 10,
                  paddingLeft: 10,
                  height: buttonHeight,
                  marginTop: 20,
                }}
                placeholder="Current Password"
                autoCapitalize="none"
                value={currentPassword}
                onChangeText={currentPasswordOnChangeText}
                // autoFocus
                secureText={currentPasswordSecure}
              />

              <Input
                rightIcon={newPasswordSecure ? 'eye_close' : 'eye'}
                rightIconSize={30}
                rightAction={() => setNewPasswordSecure(!newPasswordSecure)}
                style={{
                  width: '100%',
                  borderColor: colors.gray,
                  borderWidth: 0.5,
                  borderRadius: 10,
                  paddingLeft: 10,
                  height: buttonHeight,
                  marginTop: 20,
                }}
                placeholder="New Password"
                autoCapitalize="none"
                value={newPassword}
                onChangeText={newPasswordOnChangeText}
                secureText={newPasswordSecure}
              />

              <Input
                rightIcon={confirmPasswordSecure ? 'eye_close' : 'eye'}
                rightIconSize={30}
                rightAction={() =>
                  setConfirmPasswordSecure(!confirmPasswordSecure)
                }
                style={{
                  width: '100%',
                  borderColor: colors.gray,
                  borderWidth: 0.5,
                  borderRadius: 10,
                  paddingLeft: 10,
                  height: buttonHeight,
                  marginTop: 20,
                }}
                placeholder="Confirm Password"
                autoCapitalize="none"
                value={confirmPassword}
                onChangeText={confirmPasswordOnChangeText}
                secureText={confirmPasswordSecure}
              />
            </View>
          </KeyboardAwareScrollView>
        </ScrollView>

        <View
          style={{
            height: buttonHeight + 40,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: colors.white,
          }}>
          <Touchable
            onPress={save}
            style={{
              width: '90%',
              height: buttonHeight,
              borderRadius: 10,
              backgroundColor: colors.primary,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: colors.white,
                fontSize: 18,
              }}>
              Save
            </Text>
          </Touchable>
        </View>
      </>
    </TouchableWithoutFeedback>
  );
};

export default ChangePassword;
