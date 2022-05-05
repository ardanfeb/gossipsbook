import React from 'react';
import {ImageBackground} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import RNBootSplash from 'react-native-bootsplash';

const AuthFlow = ({navigation, ...props}) => {
  React.useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Token ${token}`;
        navigation.navigate('Main');
      } else {
        setTimeout(() => {
          navigation.navigate('Intro');
        }, 1000);
      }
      RNBootSplash.hide({fade: true});
    })();
  }, []);

  return (
    <ImageBackground
      resizeMode="cover"
      source={require('../../assets/intro/12.png')}
      style={{
        flex: 1,
      }}></ImageBackground>
  );
};

export default AuthFlow;
