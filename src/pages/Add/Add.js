import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Dimensions,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Textarea from 'react-native-textarea';
import ImagePicker from 'react-native-image-crop-picker';
import { CheckBox, ListItem, Body, Text as NText } from 'native-base';

import { colors, config, layout } from '../../constants';
import { Icon, Touchable, Input } from '../../components';
import axios from 'axios';
import MultiSelect from 'react-native-multiple-select';

const { buttonHeight } = config;
const { screenWidth } = layout;

const Add = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [bodyError, setBodyError] = useState(false);
  const [interestError, setInterestError] = useState(false);
  const [path, setPath] = useState(null);
  const [interests, setInterests] = useState([
    { id: '1', name: 'Entertainment' },
    { id: '2', name: 'Gaming' },
    { id: '3', name: 'Gossips' },
  ]);
  // Data Source for the SearchableDropdown
  const [selectedItems, setSelectedItems] = useState([]);

  const onSelectedItemsChange = (selectedItems) => {
    // Set Selected Items
    setSelectedItems(selectedItems);
  };

  useEffect(() => console.log(interests), [interests]);

  React.useEffect(() => {
    navigation.setOptions({
      tabBarVisible: false,
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          'https://www.gossipsbook.com/api/interest/list/',
        );
        const { result } = res.data;
        setInterests(
          result.map((i) => {
            return {
              id: i.id.toString(),
              name: i.title,
            };
          }),
        );
      } catch (err) { }
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        const res = await axios.get(
          'https://www.gossipsbook.com/api/interest/list/',
        );
        const { result } = res.data;
        console.log(result);
        setInterests(
          result.map((i) => {
            return {
              id: i.id.toString(),
              name: i.title,
            };
          }),
        );
      } catch (err) { }
    });

    return unsubscribe;
  }, [navigation]);

  const titleOnChangeText = (e) => {
    setTitleError(e.replace(' ', '').length == 0);
    setTitle(e);
  };

  const bodyOnChangeText = (e) => {
    setBodyError(e.replace(' ', '').length == 0);
    setBody(e);
  };

  const openPhoto = () => {
    ImagePicker.openCamera({
      mediaType: 'video',
    })
      .then((image) => {
        // console.log(image);
        setPath(image.path);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const add = () => {
    if (title?.replace(' ', '').length === 0) {
      setTitleError(true);
    }
    if (body?.replace(' ', '').length === 0) {
      setBodyError(true);
    }
    if (interests.every((x) => x.checked === false)) {
      setInterestError(true);
    }
    if (titleError || bodyError || interestError) {
      return;
    }
  };

  const onPress = (id) => {
    let newData = [...interests];
    let item = newData.find((x) => x.id === id);
    item.checked = !item.checked;
    setInterests(newData);
    setInterestError(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          style={{ backgroundColor: colors.white }}
          contentContainerStyle={{
            paddingHorizontal: 20,
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
                Add Post
              </Text>

              <Input
                style={{
                  width: '90%',
                  borderColor: titleError ? colors.darkred : colors.gray,
                  borderWidth: titleError ? 1 : 0.5,
                  borderRadius: 10,
                  paddingLeft: 10,
                  height: buttonHeight,
                  marginTop: 40,
                }}
                placeholder="Title"
                autoCapitalize="none"
                value={title}
                onChangeText={titleOnChangeText}
              />

              <Textarea
                containerStyle={{
                  height: 250,
                  padding: 10,
                  backgroundColor: colors.white,
                  width: screenWidth * 0.87,
                  marginTop: 20,
                  borderColor: bodyError ? colors.darkred : colors.gray,
                  borderWidth: bodyError ? 1 : 0.5,
                  borderRadius: 10,
                }}
                style={{
                  textAlignVertical: 'top', // hack android
                  height: 170,
                  fontSize: 16,
                  color: '#333',
                }}
                onChangeText={bodyOnChangeText}
                defaultValue={body}
                maxLength={1000}
                placeholder="Body"
                placeholderTextColor={colors.lightGray}
                underlineColorAndroid={'transparent'}
              />
            </View>
          </KeyboardAwareScrollView>
        </ScrollView>
        <KeyboardAwareScrollView>
          <View
            style={{
              width: Dimensions.get('screen').width - 40,
              height: 50,
              // backgroundColor: 'black',
              borderColor: 'black',
              borderWidth: 1,
              marginTop: 30,
              position: 'absolute',
              bottom: 150,
              width: '100%',
              zIndex: 2,
            }}>
            {interests.length > 0 && (
              <MultiSelect
                hideTags
                items={interests}
                uniqueKey="id"
                onSelectedItemsChange={onSelectedItemsChange}
                selectedItems={selectedItems}
                selectText="Pick Items"
                searchInputPlaceholderText="Search interests..."
                onChangeInput={(text) => console.log(text)}
                tagRemoveIconColor="#CCC"
                tagBorderColor="#CCC"
                tagTextColor="#CCC"
                selectedItemTextColor="#CCC"
                selectedItemIconColor="#CCC"
                itemTextColor="#000"
                displayKey="name"
                searchInputStyle={{ color: '#CCC' }}
                submitButtonColor="#48d22b"
                submitButtonText="Submit"
              />
            )}
          </View>
        </KeyboardAwareScrollView>
        <View
          style={{
            height: buttonHeight + 40,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: colors.white,
            zIndex: 1,
          }}>
          <Touchable
            onPress={add}
            style={{
              width: '86%',
              height: buttonHeight,
              borderRadius: 10,
              backgroundColor: colors.navyBlue,
              justifyContent: 'center',
              marginBottom: 150,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: colors.white,
                fontSize: 18,
              }}>
              Submit
            </Text>
          </Touchable>
        </View>
      </>
    </TouchableWithoutFeedback>
  );
};

export default Add;
