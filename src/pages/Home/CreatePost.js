import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  TextInput,
  Alert,
  TouchableOpacity,
  StatusBar,
  LogBox,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import MultiSelect from 'react-native-multiple-select';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-community/async-storage';
// import reactotron from 'reactotron-react-native';
import { makeid } from '../../helpers';
import { colors, config, layout } from '../../constants';
import { Icon, Loading, Touchable } from '../../components';
import { launchImageLibrary } from 'react-native-image-picker';

const { buttonHeight } = config;
const { screenWidth } = layout;

const Add = ({ navigation, route }) => {
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);
  const item = route.params?.item;
  const [title, setTitle] = useState(item?.title || '');
  const [content, setContent] = useState(item?.content || '');
  const [link, setLink] = useState(item?.link || '');
  const [path, setPath] = useState(null);
  const [localImgs, setLocalImgs] = useState(
    item?.gossip_images?.map((i) => ({ path: i.image, mime: 'image/jpeg' })) ||
      [],
  );
  const [localVideo, setLocalVideo] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const [interests, setInterests] = useState([
    { id: '1', name: 'Entertainment' },
    { id: '2', name: 'Gaming' },
    { id: '3', name: 'Gossips' },
  ]);
  const [selectedItems, setSelectedItems] = useState([]);

  const onSelectedItemsChange = (selectedItems) => {
    setSelectedItems(selectedItems);
  };

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
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      getIntrest();
    });

    return unsubscribe;
  }, [navigation]);

  const getIntrest = async () => {
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
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(
    () =>
      setSelectedItems(
        interests
          .filter((interest) => item?.interests?.includes(interest.name))
          .map((v) => v.id),
      ),
    [interests],
  );

  useEffect(() => console.log(item?.gossip_images), [localImgs]);

  useEffect(() => {
    if (link && localImgs.length) {
      Alert.alert(
        'Gossips',
        'You can only choose to include link OR image, can not include both of them!',
      );
      setLink('');
      setLocalImgs([]);
    }
  }, [link, localImgs]);

  const handleSubmit = async () => {
    console.log(
      title,
      content,
      selectedItems,
      interests.find((i) => i.id === selectedItems[0]).name,
    );
    if (!title.trim().length) {
      Alert.alert('Gossips', 'Title is required!');
      return;
    }
    // uncomment this to make content required again
    // if (!content.trim().length) {
    //   Alert.alert('Gossips', 'Content is required!');
    //   return;
    // }
    if (!selectedItems.length) {
      Alert.alert('Gossips', 'Interest is required!');
      return;
    }
    if (selectedItems.length > 1) {
      Alert.alert('Gossips', 'Can not include more than 1 interest!');
      return;
    }
    try {
      setLoading(true);
      if (item) {
      }
      const respPost = !item
        ? await axios.post(
            'https://www.gossipsbook.com/api/gossips/list-create/',
            {
              title,
              content,
              link,
              from_question_user: '',
              from_question_answer_provider: '',
            },
          )
        : await axios.post(
            'https://www.gossipsbook.com/api/gossips/update/' + slug + '/',
            {
              title,
              content,
              link,
              from_question_user: '',
              from_question_answer_provider: '',
            },
          );
      const slug = respPost.data.slug;
      const respInterest = await axios.post(
        `https://www.gossipsbook.com/api/gossips/${slug}/gossip_tags/list-create/`,
        {
          body: interests.find((i) => i.id === selectedItems[0]).name,
        },
      );

      console.log(respPost, respInterest);
      if (!localImgs) {
        Alert.alert('Gossips', 'Post created!', [
          {
            text: 'OK',
            onPress: () => {
              setContent('');
              setTitle('');
              setLink('');
              setLocalImgs([]);
              setLocalVideo([]);
              navigation.navigate('Home');
            },
          },
        ]);
      }
      if (!!localImgs) {
        const newPostSlug = respPost.data.slug;
        Promise.all(
          localImgs.map((image, index) => addImages(image, newPostSlug, index)),
        )
          .then((result) => {
            setLoading(false);
            setContent('');
            setTitle('');
            setLink('');
            setLocalImgs([]);
            setLocalVideo([]);
            navigation.navigate('Home');
          })
          .catch((e) => {
            setLoading(false);
          });
      }

      if (localVideo.length > 0) {
        const newPostSlug = respPost.data.slug;
        Promise.all(
          localVideo.map((video, index) => addVideo(video, newPostSlug, index)),
        )
          .then((result) => {
            console.log('Başarılı video');
            setLoading(false);
            setContent('');
            setTitle('');
            setLink('');
            setLocalImgs([]);
            setLocalVideo([]);
            navigation.navigate('Home');
          })
          .catch((e) => {
            console.log('ERROR Video UPLOAD');
            setLoading(false);
          });
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Gossips', JSON.stringify(err.response.data));
    }
  };

  const addImages = async (image, newPostSlug, index) => {
    const access_token = await AsyncStorage.getItem('token');
    return new Promise((resolve, reject) => {
      RNFetchBlob.fetch(
        'POST',
        `https://www.gossipsbook.com/api/gossips/${newPostSlug}/images/list_create/`,
        {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Token ' + access_token,
        },
        [
          {
            name: 'image',
            filename: `${makeid(20)}.png`,
            type: 'image/png',
            data: decodeURIComponent(
              RNFetchBlob.wrap(image.path.replace('file://', '')),
            ),
          },
        ],
      )
        .then((res) => {
          resolve(res.data);
        })
        .catch((e) => reject(e));
    });
  };

  const addVideo = async (video, newPostSlug, index) => {
    const access_token = await AsyncStorage.getItem('token');
    return new Promise((resolve, reject) => {
      RNFetchBlob.fetch(
        'POST',
        `https://www.gossipsbook.com/api/gossips/${newPostSlug}/images/list_create/`,
        {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Token ' + access_token,
        },
        [
          {
            name: 'image',
            filename: `${makeid(20)}.mp4`,
            type: 'video/mp4',
            data: decodeURIComponent(
              RNFetchBlob.wrap(video.path.replace('file://', '')),
            ),
          },
        ],
      )
        .then((res) => {
          console.log('SUCCESS ', res);
          resolve(res.data);
        })
        .catch((e) => reject(e));
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          padding: 10,
        }}>
        <Text
          style={{
            marginTop: 10,
            fontSize: 24,
            fontWeight: 'bold',
            color: '#000',
          }}>
          Add Gossips
        </Text>
        <Touchable
          onPress={() => {
            setContent('');
            setTitle('');
            setLink('');
            setLocalImgs([]);
            setLocalVideo([]);
            navigation.goBack();
          }}
          jc
          ac
          size={40}
          br={20}
          absolute
          top={15}
          left={10}
          brc="#555"
          brw={1}>
          <Icon name="back" size={18} />
        </Touchable>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        nestedScrollEnabled={true}
        style={{ backgroundColor: colors.white, flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}>
        <KeyboardAwareScrollView nestedScrollEnabled={true}>
          <View
            style={{
              marginTop: 20,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
            <TextInput
              style={{
                width: '90%',
                borderColor: colors.lightGray,
                borderWidth: 1,
                borderRadius: 10,
                paddingLeft: 10,
                height: 50,
                marginTop: 40,
              }}
              placeholder="Title"
              autoCapitalize="none"
              value={title}
              maxLength={600}
              onChangeText={setTitle}
            />
            <TextInput
              style={{
                width: '90%',
                borderColor: colors.lightGray,
                borderWidth: 1,
                borderRadius: 10,
                paddingLeft: 10,
                height: 150,
                marginTop: 40,
                textAlignVertical: 'top',
              }}
              placeholder="Content (optional)"
              autoCapitalize="none"
              value={content}
              onChangeText={setContent}
              multiline={true}
              numberOfLines={10}
              maxLength={3000}
            />
            <Text
              style={{
                textAlign: 'right',
                color: colors.lightGray,
                width: '100%',
                paddingHorizontal: 30,
                paddingVertical: 5,
                marginBottom: -25,
              }}>
              {content.length}/3000
            </Text>

            <TextInput
              style={{
                width: '90%',
                borderColor: colors.lightGray,
                borderWidth: 1,
                borderRadius: 10,
                paddingLeft: 10,
                height: 50,
                marginTop: 40,
              }}
              placeholder="Link (optional)"
              autoCapitalize="none"
              value={link}
              maxLength={1000}
              onChangeText={setLink}
            />
          </View>
        </KeyboardAwareScrollView>
        <View
          style={{
            margin: 20,
            marginBottom: 0,
          }}>
          <TouchableOpacity
            onPress={async () => {
              launchImageLibrary({
                maxWidth: 300,
                maxHeight: 400,
                mediaType: 'photo',
                selectionLimit: 5,
              })
                .then((res) => {
                  if (res && res.assets && res.assets.length) {
                    let newImages = [];
                    for (let i = 0; i < res.assets.length; i++) {
                      newImages.push({
                        mime: res.assets[i].type,
                        path: res.assets[i].uri,
                      });
                    }

                    setLocalImgs(newImages);
                  }
                })
                .catch((err) => {});

              // ImagePicker.openPicker({
              //   width: 300,
              //   height: 400,
              //   cropping: true,
              //   multiple: true,
              //   mediaType: 'photo',
              // }).then((image) => {
              //   console.log('image', image);
              //   setLocalImgs(image);
              // });

              // Alert.alert(
              //   "Media Type",
              //   "Please select media type",
              //   [
              //     {
              //       text: "Add Image",
              //       onPress: () => {
              //         ImagePicker.openPicker({
              //           width: 300,
              //           height: 400,
              //           cropping: true,
              //           multiple: true,
              //         }).then((image) => {
              //           console.log(image);
              //           setLocalImgs(image);
              //         });
              //       }
              //     },
              //     {
              //       text: "Add Video",
              //       onPress: () => {
              //         ImagePicker.openPicker({
              //           mediaType: 'video'
              //         }).then((video) => {
              //           console.log(video);
              //           setLocalVideo([video]);
              //         });
              //       },
              //     },
              //   ]
              // );
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <AntDesign
              name="camera"
              style={{
                fontSize: 30,
                paddingRight: 20,
              }}
            />
            <Text>{localVideo.length > 0 ? 'Video Added ✓' : 'Add Media'}</Text>
          </TouchableOpacity>
          <ScrollView horizontal>
            {localImgs.map((localImage, index) => {
              return (
                <View key={localImage?.path}>
                  <Image
                    source={{
                      uri: localImage.path,
                    }}
                    style={{
                      width: 100,
                      height: 100,
                      marginEnd: 10,
                      marginVertical: 10,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setLocalImgs([
                        ...localImgs?.filter(
                          (image) => image.path !== localImage.path,
                        ),
                      ])
                    }
                    style={{
                      position: 'absolute',
                      top: 20,
                      right: 20,
                    }}>
                    <AntDesign
                      name="close"
                      style={{
                        fontSize: 30,
                        color: 'white',
                      }}
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <View
          style={{
            width: '100%',
            marginHorizontal: 20,
            paddingHorizontal: 20,
            alignSelf: 'center',
            marginTop: 20,
            zIndex: 2,
          }}>
          {interests.length > 0 && (
            <MultiSelect
              styleMainWrapper={
                {
                  // borderColor: colors.lightGray,
                  // borderWidth: 1,
                  // borderRadius: 10,
                  // overflow: 'hidden',
                }
              }
              styleListContainer={{
                height: 210,
                backgroundColor: 'white',
              }}
              textInputProps={{
                style: {
                  height: 50,
                  width: '40%',
                },
              }}
              onAddItem={async (items) => {
                const res = await axios.post(
                  'https://www.gossipsbook.com/api/interest/create/',
                  {
                    title: items[items.length - 1]?.name,
                  },
                );
                if (res.status === 201) {
                  getIntrest();
                }
              }}
              styleInputGroup={{ marginHorizontal: 20 }}
              styleTextDropdownSelected={{ marginHorizontal: 10 }}
              canAddItems={false}
              nestedScrollEnabled={true}
              hideTags={true}
              items={interests}
              styleDropdownMenu={{
                paddingTop: 0,
                paddingLeft: 10,
                paddingRight: 10,
                height: 50,
                borderWidth: 1,
                borderRadius: 10,
                borderColor: colors.lightGray,
              }}
              uniqueKey="id"
              onSelectedItemsChange={onSelectedItemsChange}
              selectedItems={selectedItems}
              selectText="Select Interest"
              searchInputPlaceholderText="Search"
              onChangeInput={(text) => console.log(text)}
              tagRemoveIconColor="#CCC"
              tagBorderColor="#CCC"
              tagTextColor="#CCC"
              selectedItemTextColor="#CCC"
              selectedItemIconColor="#CCC"
              itemTextColor="#000"
              fixedHeight={true}
              displayKey="name"
              searchInputStyle={{ color: '#CCC' }}
              submitButtonColor="#000080"
              hideSubmitButton
              submitButtonText="Done"
            />
          )}
        </View>
        {/* comment for now */}
        {/* <View
          style={{
            margin: 20,
            marginBottom: 0,
            flexDirection: 'row',
          }}>
          <Text>Not see your interest? </Text>
          <TouchableOpacity>
            <Text style={{color: 'blue', textDecorationLine: 'underline'}}>
              Create one.
            </Text>
          </TouchableOpacity>
        </View> */}
        <View
          style={{
            marginTop: 20,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            backgroundColor: colors.white,
            zIndex: 1,
          }}>
          {isLoading ? (
            <Loading />
          ) : (
            <Touchable
              onPress={handleSubmit}
              style={{
                width: '86%',
                height: buttonHeight,
                borderRadius: 10,
                backgroundColor: colors.primary,
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
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Add;
