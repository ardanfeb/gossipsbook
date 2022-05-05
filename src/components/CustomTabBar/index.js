import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Image,
  Dimensions,
  DeviceEventEmitter,
  Alert,
} from 'react-native';

import changeNavigationBarColor, {
  hideNavigationBar,
  showNavigationBar,
} from 'react-native-navigation-bar-color';

import { layout, colors } from '../../constants';
import { Icon, Modal, Touchable } from '../../components';
import { useRef } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { EVENTS } from '../../constants/config';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import AddPostModal from '../AddPostModal';

const { screenHeight } = layout;
const { width, height } = Dimensions.get('screen');

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const menu1 = useRef(new Animated.Value(0)).current;

  const menu2X = useRef(new Animated.Value(0)).current;
  const menu2Y = useRef(new Animated.Value(0)).current;

  const menu3 = useRef(new Animated.Value(0)).current;

  const menu4X = useRef(new Animated.Value(0)).current;
  const menu4Y = useRef(new Animated.Value(0)).current;

  const menu5 = useRef(new Animated.Value(0)).current;

  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const toggleMenu = () => {
    if (isOpenMenu) {
      setIsOpenMenu(false);
      Animated.parallel([
        Animated.timing(menu1, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(menu2X, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(menu2Y, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(menu3, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(menu4X, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(menu4Y, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(menu5, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      setIsOpenMenu(true);
      Animated.parallel([
        Animated.timing(menu1, {
          toValue: -90,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(menu2X, {
          toValue: -60,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(menu2Y, {
          toValue: -60,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(menu3, {
          toValue: -90,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(menu4X, {
          toValue: 60,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(menu4Y, {
          toValue: -60,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(menu5, {
          toValue: 90,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const [newMessages, setNewMessages] = useState(0)

  const checkNewMessages = async () => {
    const res = await axios.get('https://www.gossipsbook.com/api/room/');
    const results = res.data;
    AsyncStorage.getItem('readChats', (err, readChats) => {
      if (err) return
      readChats = readChats || []
      setNewMessages(results?.map(value => value.id).filter(id => !readChats.includes(id)).length)
    })
  }

  useEffect(() => {
    checkNewMessages()
    const messageOpenListener = DeviceEventEmitter.addListener(EVENTS.MESSAGE_OPENED, checkNewMessages)
    return () => messageOpenListener ? messageOpenListener.remove() : null
  }, []);

  const [addPostModalVisible, setAddPostModalVisibility] = useState(false)

  return (
    <View
      style={{
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 5,
      }}>
      <AddPostModal visible={addPostModalVisible} dismiss={() => setAddPostModalVisibility(false)} />
      <TouchableOpacity
        onPress={() => {
          toggleMenu();
        }}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
          padding: 0,
          borderColor: '#000080',
          borderRadius: 1000,
          borderWidth: 3,
          backgroundColor: '#fff',
        }}>
        <Image
          resizeMode="contain"
          style={{
            width: 50,
            height: 50,
            borderRadius: 1000,
          }}
          source={require('../../assets/defaultLogo.png')}
        />
      </TouchableOpacity>
      <Animated.View
        style={{
          position: 'absolute',
          top: 4,
          bottom: 4,
          right: width / 2 - 25,
          left: width / 2 - 25,
          zIndex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          // padding: 4,
          borderColor: '#000080',
          borderRadius: 1000,
          borderWidth: 1,
          width: 50,
          height: 50,
          backgroundColor: 'white',
          transform: [{ translateX: menu1 }],
        }}>
        <TouchableOpacity
          onPress={() => {
            const event = navigation.emit({
              type: 'tabPress',
              target: state.routes[0].key,
              canPreventDefault: true,
            });
            if (state.index !== 0 && !event.defaultPrevented) {
              navigation.navigate(state.routes[0].name);
            }
            toggleMenu();
          }}
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Ionicons
            name={state.index === 0 ? 'home-sharp' : 'home-outline'}
            size={24}
            color={state.index === 0 ? colors.navyBlue : colors.gray}
          />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          top: 4,
          bottom: 4,
          right: width / 2 - 25,
          left: width / 2 - 25,
          zIndex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 4,
          borderColor: '#000080',
          borderRadius: 1000,
          borderWidth: 1,
          width: 50,
          height: 50,
          backgroundColor: 'white',
          transform: [{ translateX: menu2X }, { translateY: menu2Y }],
        }}>
        <TouchableOpacity
          onPress={() => {
            const event = navigation.emit({
              type: 'tabPress',
              target: state.routes[1].key,
              canPreventDefault: true,
            });
            if (state.index !== 1 && !event.defaultPrevented) {
              navigation.navigate(state.routes[1].name);
            }
            toggleMenu();
          }}
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {isOpenMenu && newMessages > 0 && <Text style={{ backgroundColor: colors.red, color: 'white', paddingHorizontal: 5, elevation: 2, borderRadius: 10, position: 'absolute', top: -7, right: -7 }} >{newMessages}</Text>}
          <Ionicons
            name={state.index === 1 ? 'mail-sharp' : 'mail-outline'}
            size={24}
            color={state.index === 1 ? colors.navyBlue : colors.gray}
          />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          top: 4,
          bottom: 4,
          right: width / 2 - 25,
          left: width / 2 - 25,
          zIndex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 4,
          borderColor: '#000080',
          borderRadius: 10000,
          borderWidth: 1,
          width: 50,
          height: 50,
          backgroundColor: 'white',
          transform: [{ translateY: menu3 }],
        }}>
        <TouchableOpacity
          onPress={() => {
            setAddPostModalVisibility(true)
            // const event = navigation.emit({
            //   type: 'tabPress',
            //   target: state.routes[2].key,
            //   canPreventDefault: true,
            // });
            // if (state.index !== 2 && !event.defaultPrevented) {
            //   navigation.navigate(state.routes[2].name);
            // }
            toggleMenu();
          }}
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MaterialIcons
            name={state.index === 2 ? 'add-circle' : 'add-circle-outline'}
            size={28}
            color={state.index === 2 ? colors.navyBlue : colors.gray}
          />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          top: 4,
          bottom: 4,
          right: width / 2 - 25,
          left: width / 2 - 25,
          zIndex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 4,
          borderColor: '#000080',
          borderRadius: 1000,
          borderWidth: 1,
          width: 50,
          height: 50,
          backgroundColor: 'white',
          transform: [{ translateX: menu4X }, { translateY: menu4Y }],
        }}>
        <TouchableOpacity
          onPress={() => {
            const event = navigation.emit({
              type: 'tabPress',
              target: state.routes[3].key,
              canPreventDefault: true,
            });
            if (state.index !== 3 && !event.defaultPrevented) {
              navigation.navigate(state.routes[3].name);
            }
            toggleMenu();
          }}
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Ionicons
            name={state.index === 3 ? 'person-sharp' : 'person-outline'}
            size={24}
            color={state.index === 3 ? colors.navyBlue : colors.gray}
          />
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          top: 4,
          bottom: 4,
          right: width / 2 - 25,
          left: width / 2 - 25,
          zIndex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 4,
          borderColor: '#000080',
          borderRadius: 1000,
          borderWidth: 1,
          width: 50,
          height: 50,
          backgroundColor: 'white',
          transform: [{ translateX: menu5 }],
        }}>
        <TouchableOpacity
          onPress={() => {
            const event = navigation.emit({
              type: 'tabPress',
              target: state.routes[4].key,
              canPreventDefault: true,
            });
            if (state.index !== 4 && !event.defaultPrevented) {
              navigation.navigate(state.routes[4].name);
            }
            toggleMenu();
          }}
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Ionicons
            name={state.index === 4 ? 'settings' : 'settings-outline'}
            size={24}
            color={state.index === 4 ? colors.navyBlue : colors.gray}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default CustomTabBar;
