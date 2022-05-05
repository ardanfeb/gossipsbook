import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Platform,
  Alert,
  Modal,
  TextInput,
} from 'react-native';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { Touchable, Input, Icon } from '../../components';
import { config, layout, colors } from '../../constants';
import { ADD_FCM_URL, LOGIN_URL } from '../../constants/api';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { CommonActions } from '@react-navigation/routers';

const { buttonHeight } = config;
const { screenHeight } = layout;

function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [secure, setSecure] = useState(true);
  const [showForgotPassModal, setShowForgotPassModal] = useState(false);
  const [nextStep, setNextStep] = useState(false);

  const [code, setCode] = useState('');
  const [newPass, setNewPass] = useState('');
  const [fEmail, setfEmail] = useState('');

  const sendCode = async () => {
    if (!fEmail.length) {
      Alert.alert('Gossips', 'Email is required!');
      return;
    }
    try {
      await axios
        .post('https://www.gossipsbook.com/api/user/auth/password-reset/', {
          email: fEmail,
        })
        .then((res) => {
          if (res.status === 200) {
            setfEmail('');
            setCode('');
            setNewPass('');
            setPassword('');
            setNextStep(true);
          }
        });
    } catch (err) {
      Alert.alert('Gossips', JSON.stringify(err.response.data));
    }
  };

  const submitForgot = async () => {
    if (!code.length) {
      Alert.alert('Gossips', 'Code is required!');
      return;
    }
    if (!newPass.length) {
      Alert.alert('Gossips', 'New Password is required!');
      return;
    }
    try {
      await axios
        .post(
          'https://www.gossipsbook.com/api/user/auth/password-reset/confirm-token/',
          {
            token: code,
            password: newPass,
            password_confirm: newPass,
          },
        )
        .then((res) => {
          if (res.status === 200) {
            setNextStep(false);
            setShowForgotPassModal(false);
            Alert.alert('Gossips', 'Success!');
          }
        });
    } catch (err) {
      Alert.alert('Gossips', JSON.stringify(err.response.data));
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['http://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
      webClientId: '<FROM DEVELOPER CONSOLE>', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: '', // specifies a hosted domain restriction
      loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](http://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      accountName: '', // [Android] specifies an account name on the device that should be used
      iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
      googleServicePlistPath: '', // [iOS] optional, if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
    });
  }, []);

  const isEmail =
    /^[a-zA-Z0-9.!#$%&' * +/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  const emailOnChangeText = (text) => {
    let e = text.trim();
    setEmail(e);
  };

  const passwordOnChangeText = (text) => {
    let e = text.trim();
    setPassword(e);
  };

  const signIn = async () => {
    if (email && password) {
      const loginData = {
        username: email,
        password,
      };
      try {
        const res = await axios.post(LOGIN_URL, loginData);
        const { data } = res;
        if (res.status === 200) {
          await AsyncStorage.setItem('token', data.token);
          if (data.email !== null)
            await AsyncStorage.setItem('email', data.email);
          await AsyncStorage.setItem('username', email);
          axios.defaults.headers.common[
            'Authorization'
          ] = `Token ${data.token}`;
          console.log(data.token);
          const myHeaders = {
            'Content-Type': 'application/json',
            Authorization: `Token ${data.token}`,
          };
          const fcmToken = await AsyncStorage.getItem('fcmToken');
          if (fcmToken) {
            await axios.post(ADD_FCM_URL, {
              token: fcmToken,
            });
          }
          const status = fetch(
            'https://www.gossipsbook.com/api/current-user/status/feed/',
            {
              method: 'GET',
              headers: myHeaders,
            },
          )
            .then((res) => res.json())
            .then((data) => console.log(data.results));
          const userInfo = await axios.get(
            'https://www.gossipsbook.com/api/current-user/profile/retrieve/',
          );
          if (userInfo.data.profile.user_interests.length > 0) {
            await AsyncStorage.setItem(
              'interestList',
              JSON.stringify(userInfo.data.profile.user_interests),
            );
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: 'Main',
                    params: {
                      needUpdated: true,
                    },
                  },
                ],
              }),
            );
          } else {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: 'Interest',
                    params: {
                      type: 'create',
                    },
                  },
                ],
              }),
            );
          }
        }
      } catch (err) {
        const errorMsg = err.response.data;
        Alert.alert('Gossips', JSON.stringify(errorMsg));
      }
    } else {
      setEmailError(true);
    }
  };

  const register = () => {
    navigation.navigate('Register');
  };

  const renderForgotPass = () => {
    return (
      <Modal visible={showForgotPassModal} animationType="slide">
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                height: 100,
                padding: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setShowForgotPassModal(false);
                  setNextStep(false);
                }}>
                <AntDesign
                  name="close"
                  style={{ fontSize: 30, fontWeight: 'bold' }}
                />
              </TouchableOpacity>
              <Text
                style={{
                  marginLeft: 20,
                  fontSize: 30,
                  alignSelf: 'center',
                }}>
                Forgot Password
              </Text>
            </View>
            <View
              style={{
                flexGrow: 1,
                paddingHorizontal: 20,
              }}>
              {nextStep ? (
                <>
                  <Text
                    style={{
                      marginTop: 20,
                      fontWeight: 'bold',
                    }}>
                    Enter your code
                  </Text>
                  <TextInput
                    onChangeText={(code) => setCode(code)}
                    placeholder="Code"
                    value={code}
                    style={{
                      marginTop: 20,
                      paddingLeft: 10,
                      height: 60,
                      borderWidth: 0.5,
                      borderColor: colors.gray,
                      borderRadius: 10,
                    }}
                  />

                  <TouchableOpacity onPress={sendCode}>
                    <Text
                      style={{
                        marginTop: 20,
                        fontWeight: 'bold',
                        color: 'blue',
                      }}>
                      Did not receive the email? Resend it.
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      marginTop: 20,
                      fontWeight: 'bold',
                    }}>
                    Enter your new password
                  </Text>
                  <TextInput
                    onChangeText={(a) => setNewPass(a)}
                    placeholder="New Password"
                    style={{
                      marginTop: 20,
                      paddingLeft: 10,
                      borderWidth: 0.5,
                      height: 60,
                      borderColor: colors.gray,
                      borderRadius: 10,
                    }}
                  />
                  <TouchableOpacity
                    onPress={async () => {
                      await submitForgot();
                    }}
                    style={{
                      marginTop: 20,
                      padding: 10,
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
                      Submit
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text
                    style={{
                      marginTop: 20,
                      fontWeight: 'bold',
                    }}>
                    Enter your email
                  </Text>
                  <TextInput
                    onChangeText={(email) => setfEmail(email)}
                    placeholder="Your Email..."
                    value={fEmail}
                    style={{
                      marginTop: 20,
                      paddingLeft: 10,
                      borderWidth: 0.5,
                      borderColor: colors.gray,
                      borderRadius: 10,
                      height: 60,
                    }}
                  />
                  <TouchableOpacity
                    onPress={async () => {
                      await sendCode();
                    }}
                    style={{
                      marginTop: 20,
                      padding: 10,
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
                      Next
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <>
        {renderForgotPass()}
        <ScrollView
          style={{ flex: 1, backgroundColor: colors.white }}
          bounces={false}
          showsVerticalScrollIndicator={false}>
          <KeyboardAwareScrollView
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
            enabled
            style={{ flex: 1, paddingTop: 50 }}>
            <Icon
              name={'auth_photo'}
              size={250}
              style={{ alignSelf: 'center' }}
            />

            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: 'bold',
                  marginTop: 10,
                  color: '#666',
                }}>
                Log in
              </Text>
              {/*<Text style={{ marginTop: 5, color: 'gray' }}>*/}
              {/*  Login with social networks*/}
              {/*</Text>*/}

              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  width: 150,
                  marginVertical: 10,
                  justifyContent: 'space-between',
                }}>
                {/*<TouchableOpacity*/}
                {/*  style={{*/}
                {/*    backgroundColor: colors.primary,*/}
                {/*    width: 40,*/}
                {/*    height: 40,*/}
                {/*    borderRadius: 10,*/}
                {/*    justifyContent: 'center',*/}
                {/*    marginLeft: 20,*/}
                {/*  }}>*/}
                {/*  <Icon name="facebook" size={24} asc />*/}
                {/*</TouchableOpacity>*/}
                {/* <TouchableOpacity
                  style={{
                    backgroundColor: colors.primary,
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    justifyContent: 'center',
                  }}>
                  <Icon name="instagram" size={24} asc />
                </TouchableOpacity> */}
                {/*<TouchableOpacity*/}
                {/*  style={{*/}
                {/*    backgroundColor: colors.primary,*/}
                {/*    width: 40,*/}
                {/*    height: 40,*/}
                {/*    borderRadius: 10,*/}
                {/*    justifyContent: 'center',*/}
                {/*    marginRight: 20,*/}
                {/*  }}>*/}
                {/*  <Icon name="google" size={24} asc />*/}
                {/*</TouchableOpacity>*/}
              </View>

              <Input
                style={{
                  borderColor: emailError ? colors.red : colors.gray,
                  borderWidth: emailError ? 1 : 0.5,
                  width: '90%',
                  borderRadius: 10,
                  paddingLeft: 10,
                  zIndex: 99,
                  height: buttonHeight,
                }}
                placeholder="Username"
                autoCapitalize="none"
                value={email}
                onChangeText={(email) => emailOnChangeText(email)}
              />
              <Input
                rightIcon={secure ? 'eye_close' : 'eye'}
                rightIconSize={30}
                rightAction={() => setSecure(!secure)}
                style={{
                  borderColor: passwordError ? colors.red : colors.gray,
                  borderWidth: passwordError ? 1 : 0.5,
                  width: '90%',
                  borderRadius: 10,
                  paddingLeft: 10,
                  zIndex: 99,
                  height: buttonHeight,
                  marginTop: 10,
                }}
                placeholder="Password"
                secureText={secure}
                autoCapitalize="none"
                value={password}
                onChangeText={passwordOnChangeText}
              />
              <TouchableOpacity
                onPress={() => {
                  console.log('press');
                  setShowForgotPassModal(true);
                }}
                style={{
                  width: '90%',
                  height: buttonHeight,
                  borderRadius: 10,
                  backgroundColor: 'transparent',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: colors.black,
                    fontSize: 14,
                  }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={signIn}
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
                  Log In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={register}
                style={{
                  width: '90%',
                  height: buttonHeight,
                  borderRadius: 10,
                  backgroundColor: 'transparent',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: colors.black,
                    fontSize: 18,
                  }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </ScrollView>
      </>
    </TouchableWithoutFeedback>
  );
}

export default Login;
