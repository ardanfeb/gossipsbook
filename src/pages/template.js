import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  Share,
  Image,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
  Modal,
} from 'react-native';

import { Touchable, Icon } from '../../components';
import { colors, layout } from '../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';

const { screenWidth, screenHeight } = layout;
const { width, height } = Dimensions.get('screen');

const Screen = (props) => {
  const { slug } = route.params;
  if (!slug) navigation.goBack();

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `https://www.gossipsbook.com/api/gossips/${slug}/comment/list-create/`,
        );
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <Modal animationType="slide" visible={showModalExp}>
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            flexDirection: 'row',
            height: 100,
            backgroundColor: 'white',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              setShowModalExp(false);
            }}>
            <AntDesign
              name="close"
              style={{ fontSize: 30, fontWeight: 'bold' }}
            />
          </TouchableOpacity>
          <Text>Exp</Text>
          <Text></Text>
        </View>
        <View
          style={{
            flexGrow: 1,
          }}>
          <Text>Exp</Text>
        </View>
      </View>
    </Modal>
  );
};

export default Screen;
