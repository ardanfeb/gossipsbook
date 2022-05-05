import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import RNUrlPreview from 'react-native-url-preview';

import { colors, config, layout } from '../../constants';
import { Icon, Touchable, Input } from '../../components';

const { buttonHeight } = config;
const { screenWidth } = layout;

const AddLink = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [urlError, setUrlError] = useState(false);
  const [interestError, setInterestError] = useState(false);
  const [path, setPath] = useState(null);
  const [url, setUrl] = useState('');
  const [interests, setInterests] = useState([
    {
      id: 1,
      title: 'Css',
      checked: false,
    },
    {
      id: 2,
      title: 'Programming',
      checked: false,
    },
    {
      id: 3,
      title: 'Hardware',
      checked: false,
    },
    {
      id: 4,
      title: 'Software',
      checked: false,
    },
    {
      id: 5,
      title: 'IT',
      checked: false,
    },
    {
      id: 6,
      title: 'Hacking',
      checked: false,
    },
  ]);

  React.useEffect(() => {
    navigation.setOptions({
      tabBarVisible: false,
    });
  }, []);

  const titleOnChangeText = (e) => {
    setTitleError(e.replace(' ', '').length == 0);
    setTitle(e);
  };

  const urlOnChangeText = (e) => {
    setUrlError(e.replace(' ', '').length == 0);
    setUrl(e);
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
    if (url?.replace(' ', '').length === 0) {
      setUrlError(true);
    }
    if (interests.every((x) => x.checked === false)) {
      setInterestError(true);
    }
    if (titleError || urlError || interestError) {
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
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingBottom: buttonHeight + 100,
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
                placeholder="Add Title"
                autoCapitalize="none"
                value={title}
                onChangeText={titleOnChangeText}
              />

              <Input
                style={{
                  width: '90%',
                  borderColor: urlError ? colors.darkred : colors.gray,
                  borderWidth: urlError ? 1 : 0.5,
                  borderRadius: 10,
                  paddingLeft: 10,
                  height: buttonHeight,
                  marginTop: 40,
                }}
                placeholder="Add Link"
                autoCapitalize="none"
                value={url}
                onChangeText={urlOnChangeText}
              />

              <RNUrlPreview text={url} />

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  marginVertical: 20,
                  marginHorizontal: 5,
                  paddingVertical: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: interestError ? colors.darkred : 'transparent',
                }}>
                {interests.map((x) => {
                  return (
                    <Touchable
                      key={x.id}
                      onPress={() => onPress(x.id)}
                      row
                      ml={20}
                      mt={10}>
                      <View
                        style={{
                          height: 20,
                          width: 20,
                          borderRadius: 20,
                          borderColor: x.checked ? colors.navyBlue : colors.gray,
                          borderWidth: 1,
                          backgroundColor: x.checked
                            ? colors.navyBlue
                            : 'transparent',
                        }}
                      />
                      <Text style={{ color: colors.black, marginLeft: 5 }}>
                        {x.title}
                      </Text>
                    </Touchable>
                  );
                })}
              </View>
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
            onPress={add}
            style={{
              width: '86%',
              height: buttonHeight,
              borderRadius: 10,
              backgroundColor: colors.navyBlue,
              justifyContent: 'center',
            }}>
            <Text
              style={{ textAlign: 'center', color: colors.white, fontSize: 18 }}>
              Submit
            </Text>
          </Touchable>
        </View>
      </>
    </TouchableWithoutFeedback>
  );
};

export default AddLink;
