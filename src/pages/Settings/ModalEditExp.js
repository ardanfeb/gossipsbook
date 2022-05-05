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
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';

import { Touchable, Icon } from '../../components';
import { colors, layout } from '../../constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';

const { screenWidth, screenHeight } = layout;
const { width, height } = Dimensions.get('screen');

const ModalEditExp = (props) => {
  const { showModalExp, setShowModalExp } = props;
  const [loading, setLoading] = useState(true);
  const [exp, setExp] = useState([]);
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');

  const getData = async () => {
    try {
      const res = await axios.get(
        `https://www.gossipsbook.com/api/current-user/profile/experiences/`,
      );
      const { results } = res.data;
      console.log(
        results.map((i) => {
          return {
            ...i,
            changeNow: false,
          };
        }),
      );
      setExp(
        results.map((i) => {
          return {
            ...i,
            changeNow: false,
          };
        }),
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const saveChange = async (data) => {
    console.log(data, text1, text2);
    try {
      if (data.id !== 'new') {
        const res = await axios.put(
          `https://www.gossipsbook.com/api/current-user/profile/experiences/${data.id}/`,
          {
            company_name: text1,
            company_post: text1,
            text: text2,
          },
        );
      } else {
        const res = await axios.post(
          'https://www.gossipsbook.com/api/current-user/profile/experiences/',
          {
            company_name: text1,
            company_post: text1,
            text: text2,
          },
        );
      }
      setLoading(true);
      await getData();
    } catch (err) {
      Alert.alert('Gossips', JSON.stringify(err.response.data));
    }
  };

  const deleteRow = async (data) => {
    if (data.id !== 'new') {
      const res = await axios.delete(
        `https://www.gossipsbook.com/api/current-user/profile/experiences/${data.id}/`,
      );
      setLoading(true);
      await getData();
    } else {
      setExp((exp) => exp.filter((i) => i.id !== 'new'));
    }
  };

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
            onPress={async () => {
              setShowModalExp(false);
              props.handleCloseModal && props.handleCloseModal();
            }}>
            <AntDesign
              name="close"
              style={{ fontSize: 30, fontWeight: 'bold' }}
            />
          </TouchableOpacity>
          <Text>Your work experience</Text>
          <Text></Text>
        </View>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}>
          {loading ? (
            <ActivityIndicator size="large" color="black" />
          ) : (
            <View
              style={{
                flexGrow: 1,
                padding: 20,
              }}>
              {exp.length === 0 ? (
                <Text>Nothing to show</Text>
              ) : (
                exp.map((i, ind) => {
                  return (
                    <View
                      style={{
                        justifyContent: 'space-around',
                        marginBottom: 50,
                      }}
                      key={ind}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                          }}>
                          Company name
                        </Text>
                        {i.changeNow !== true ? (
                          <Text>{i.company_name}</Text>
                        ) : (
                          <TextInput
                            value={text1}
                            onChangeText={(e) => setText1(e)}
                            style={{
                              borderWidth: 0.5,
                              borderColor: colors.gray,
                              paddingVertical: 4,
                              paddingLeft: 10,
                              marginVertical: 10,
                              width: '50%',
                            }}
                          />
                        )}
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                          }}>
                          Description
                        </Text>
                        {i.changeNow !== true ? (
                          <Text>{i.text}</Text>
                        ) : (
                          <TextInput
                            value={text2}
                            onChangeText={(e) => setText2(e)}
                            style={{
                              borderWidth: 0.5,
                              borderColor: colors.gray,
                              paddingVertical: 4,
                              paddingLeft: 10,
                              marginVertical: 10,
                              width: '50%',
                            }}
                          />
                        )}
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                          marginTop: 20,
                        }}>
                        {i.changeNow === true ? (
                          <TouchableOpacity
                            onPress={() => saveChange(i)}
                            style={{
                              padding: 10,
                              borderColor: colors.gray,
                              borderWidth: 0.5,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: 20,
                              minWidth: 100,
                            }}>
                            <Text>Save Changes</Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              setText1(i.company_name);
                              setText2(i.text);
                              setExp((exp) =>
                                exp.map((ex) =>
                                  ex.id === i.id
                                    ? { ...ex, changeNow: true }
                                    : { ...ex, changeNow: false },
                                ),
                              );
                            }}
                            style={{
                              padding: 10,
                              borderColor: colors.gray,
                              borderWidth: 0.5,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderRadius: 20,
                              minWidth: 100,
                            }}>
                            <Text>Edit</Text>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          onPress={() => deleteRow(i)}
                          style={{
                            padding: 10,
                            borderColor: colors.gray,
                            borderWidth: 0.5,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 20,
                            width: 100,
                          }}>
                          <Text>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              )}
              <TouchableOpacity
                onPress={() => {
                  if (exp.find((i) => i.id === 'new')) {
                    Alert.alert(
                      'Gossips',
                      'Please complete all before adding new one!',
                    );
                    return;
                  }
                  setText1('');
                  setText2('');
                  setExp((exp) => [
                    ...exp.map((ex) => {
                      return { ...ex, changeNow: false };
                    }),
                    {
                      id: 'new',
                      company_name: '',
                      company_post: '',
                      changeNow: true,
                    },
                  ]);
                }}
                style={{
                  marginHorizontal: 40,
                  borderColor: colors.gray,
                  borderWidth: 0.5,
                  backgroundColor: colors.primary,
                  padding: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 40,
                }}>
                <Text>+ Add </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default ModalEditExp;
