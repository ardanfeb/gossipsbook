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

const ModalEditQualification = (props) => {
  const { showModalQualification, setShowModalQuanlification } = props;
  const [loading, setLoading] = useState(true);
  const [qualificationItem, setQualificationItem] = useState([]);
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');

  const getData = async () => {
    try {
      const res = await axios.get(
        `https://www.gossipsbook.com/api/current-user/profile/qualifications/`,
      );
      const { results } = res.data;
      setQualificationItem(
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
          `https://www.gossipsbook.com/api/current-user/profile/qualifications/${data.id}/`,
          {
            link: text1,
            text: text2,
          },
        );
      } else {
        const res = await axios.post(
          'https://www.gossipsbook.com/api/current-user/profile/qualifications/',
          {
            link: text1,
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
        `https://www.gossipsbook.com/api/current-user/profile/qualifications/${data.id}/`,
      );
      setLoading(true);
      await getData();
    } else {
      setQualificationItem((exp) => exp.filter((i) => i.id !== 'new'));
    }
  };

  return (
    <Modal animationType="slide" visible={showModalQualification}>
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
              setShowModalQuanlification(false);
              props.handleCloseModal && props.handleCloseModal();
            }}>
            <AntDesign
              name="close"
              style={{ fontSize: 30, fontWeight: 'bold' }}
            />
          </TouchableOpacity>
          <Text>Qualifications</Text>
          <Text></Text>
        </View>
        <View
          style={{
            flexGrow: 1,
          }}>
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
                {qualificationItem.length === 0 ? (
                  <Text>Nothing to show</Text>
                ) : (
                  qualificationItem.map((i, ind) => {
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
                            Link
                          </Text>
                          {i.changeNow !== true ? (
                            <Text>{i.link}</Text>
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
                                setText1(i.link);
                                setText2(i.text);
                                setQualificationItem((exp) =>
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
                    if (qualificationItem.find((i) => i.id === 'new')) {
                      Alert.alert(
                        'Gossips',
                        'Please complete all before adding new one!',
                      );
                      return;
                    }
                    setText1('');
                    setText2('');
                    setQualificationItem((exp) => [
                      ...exp.map((ex) => {
                        return { ...ex, changeNow: false };
                      }),
                      {
                        id: 'new',
                        link: '',
                        text: '',
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
      </View>
    </Modal>
  );
};

export default ModalEditQualification;
