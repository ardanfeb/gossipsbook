import AsyncStorage from '@react-native-community/async-storage';
import { CommonActions } from '@react-navigation/routers';
import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, ScrollView, Platform, Image } from 'react-native';

import { Touchable, Icon, Modal } from '../../components';
import { config, colors } from '../../constants';

const { buttonHeight } = config;

const Setting = ({ navigation }) => {
  const [visible, setVisible] = useState(false);

  const account = () => {
    navigation.navigate('Account');
  };

  const falseInformation = () => {
    navigation.navigate('FalseInformation');
  };

  const feedBack = () => {
    navigation.navigate('Create Feedback');
  };

  const privacyPolicy = () => {
    navigation.navigate('Privacy');
  };

  const termsOfUse = () => {
    navigation.navigate('Terms');
  };

  const privacy = () => {
    navigation.navigate('PrivacyPolicy');
  };

  const aboutUs = () => {
    navigation.navigate('About');
  };

  const logOut = () => {
    setVisible(true);
  };

  const yes = async () => {
    setVisible(false);
    await AsyncStorage.clear()
    axios.defaults.headers.common['Authorization'] = '';
    delete axios.defaults.headers.common["Authorization"];
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
  };

  const no = () => {
    setVisible(false);
  };

  const modal = () => {
    return (
      <Modal visible={visible} transparent custom>
        <View
          key={'1'}
          style={{
            backgroundColor: colors.white,
            width: '80%',
            height: 150,
            borderRadius: 20,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              color: colors.black,
              textAlign: 'center',
              fontSize: 18,
            }}>
            Are you sure?
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 30,
            }}>
            <Touchable
              onPress={yes}
              bg={colors.primary}
              ph={20}
              pv={10}
              br={10}>
              <Text style={{ color: colors.white, fontSize: 18 }}>Yes</Text>
            </Touchable>
            <Touchable onPress={no} bg={colors.gray} ph={20} pv={10} br={10}>
              <Text style={{ color: colors.white, fontSize: 18 }}>No</Text>
            </Touchable>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.white,
        paddingHorizontal: 20,
      }}
      contentContainerStyle={{ alignItems: 'center', paddingBottom: 100 }}
      bounces={false}
      stickyHeaderIndices={[1]}
      showsVerticalScrollIndicator={false}>
      {modal()}
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: 215,
          width: '100%',
          backgroundColor: 'white',
        }}>
        <View
          style={{
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: 'black',
            }}>
            Settings
          </Text>
        </View>
        <Image
          source={require('../../assets/photos/settings.jpeg')}
          resizeMode="contain"
          style={{
            flex: 1,
          }}
        />
      </View>
      <Touchable
        onPress={account}
        h={buttonHeight + 15}
        brw={0.5}
        brc={colors.black}
        jc
        w="100%"
        br={20}
        mt={50}>
        <Text
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 24,
            color: '#444',
          }}>
          Account
        </Text>
      </Touchable>

      {/* <Touchable
        onPress={() => navigation.navigate('Interest')}
        h={buttonHeight + 15}
        brw={0.5}
        brc={colors.black}
        jc
        w="100%"
        br={20}
        mt={20}>
        <Text
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 24,
            color: '#444',
          }}>
          Friend Requests
        </Text>
      </Touchable> */}

      {/*<Touchable*/}
      {/*  onPress={falseInformation}*/}
      {/*  h={buttonHeight + 15}*/}
      {/*  brw={0.5}*/}
      {/*  brc={colors.black}*/}
      {/*  jc*/}
      {/*  w="100%"*/}
      {/*  br={20}*/}
      {/*  mt={20}>*/}
      {/*  <Text*/}
      {/*    style={{*/}
      {/*      fontWeight: 'bold',*/}
      {/*      textAlign: 'center',*/}
      {/*      fontSize: 24,*/}
      {/*      color: '#444',*/}
      {/*    }}>*/}
      {/*    False Information*/}
      {/*  </Text>*/}
      {/*</Touchable>*/}

      <Touchable
        onPress={feedBack}
        h={buttonHeight + 15}
        brw={0.5}
        brc={colors.black}
        jc
        w="100%"
        br={20}
        mt={20}>
        <Text
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 24,
            color: '#444',
          }}>
          Feed back
        </Text>
      </Touchable>

      {/* <Touchable
        onPress={privacyPolicy}
        h={buttonHeight + 15}
        brw={0.5}
        brc={colors.black}
        jc
        w="100%"
        br={20}
        mt={20}>
        <Text
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 24,
            color: '#444',
          }}>
          Privacy
        </Text>
      </Touchable> */}

      <Touchable
        onPress={termsOfUse}
        h={buttonHeight + 15}
        brw={0.5}
        brc={colors.black}
        jc
        w="100%"
        br={20}
        mt={20}>
        <Text
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 24,
            color: '#444',
          }}>
          Terms of Use
        </Text>
      </Touchable>

      <Touchable
        onPress={privacy}
        h={buttonHeight + 15}
        brw={0.5}
        brc={colors.black}
        jc
        w="100%"
        br={20}
        mt={20}>
        <Text
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 24,
            color: '#444',
          }}>
          Privacy policy
        </Text>
      </Touchable>

      <Touchable
        onPress={aboutUs}
        h={buttonHeight + 15}
        brw={0.5}
        brc={colors.black}
        jc
        w="100%"
        br={20}
        mt={20}>
        <Text
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 24,
            color: '#444',
          }}>
          About Us
        </Text>
      </Touchable>

      <Touchable
        onPress={logOut}
        h={buttonHeight + 15}
        brw={0.5}
        brc={colors.black}
        jc
        w="100%"
        br={20}
        mt={20}>
        <Text
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 24,
            color: '#444',
          }}>
          Log Out
        </Text>
      </Touchable>
    </ScrollView>
  );
};

export default Setting;
