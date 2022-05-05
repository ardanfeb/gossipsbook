import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { Touchable, Icon } from '../../components';
import { colors, config, layout } from '../../constants';

const { buttonHeight } = config;
const { screenWidth } = layout;

const FeedBack = ({ navigation }) => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const res = await axios.get(
        'https://www.gossipsbook.com/api/feedback/list-create/',
      );
      const { results } = res.data;
      setFeedbackList(results);
      console.log(results);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const sub = navigation.addListener('focus', async () => await getData());
    return sub;
  }, [navigation]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <View
        style={{
          backgroundColor: colors.white,
          alignItems: 'center',
          paddingHorizontal: 20,
        }}>
        <Text
          style={{
            marginTop: 15,
            fontSize: 24,
            fontWeight: 'bold',
            color: '#000',
          }}>
          Feedback
        </Text>
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
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="black" />
      ) : (
        <View>
          {feedbackList.length > 0 ? (
            <ScrollView>
              {feedbackList.map((item) => {
                return (
                  <View
                    key={item.id}
                    style={{
                      borderRadius: 5,
                      borderColor: 'black',
                      borderWidth: 1,
                      margin: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 20,
                        marginTop: 20,
                        paddingHorizontal: 20,
                      }}>
                      {item.email}
                    </Text>
                    <Text
                      style={{
                        paddingHorizontal: 20,
                        fontSize: 11,
                        color: colors.gray,
                        marginTop: 10,
                      }}>
                      {new Date(item.date_submitted).toDateString()}
                    </Text>
                    <Text style={{ padding: 20 }}>{item.message}</Text>
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <View
              style={{
                marginTop: 50,
                marginLeft: 20,
              }}>
              <Text>No feedback yet.</Text>
            </View>
          )}
        </View>
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate('Create Feedback')}
        style={{
          position: 'absolute',
          bottom: 30,
          left: 30,
          width: Dimensions.get('screen').width - 60,
          height: buttonHeight,
          borderRadius: 10,
          backgroundColor: colors.navyBlue,
          justifyContent: 'center',
        }}>
        <Text
          style={{ textAlign: 'center', color: colors.white, fontSize: 18 }}>
          Create new feedback
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default FeedBack;
