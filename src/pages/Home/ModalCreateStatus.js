import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Modal,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import { RNCamera } from 'react-native-camera';
import RNFetchBlob from 'rn-fetch-blob';

const { width, height } = Dimensions.get('screen');

const baseColors = ['#f1f1f1', '#ea6a47', '#7e909a', '#1c4e80', '#a5d8dd'];

const RenderComp = (props) => {
  const { currentRender, imageSrc, cameraRef, nextFunction } = props;
  const [bgColor, setBgColor] = useState('#f1f1f1');
  const [cameraDone, setCameraDone] = useState(false);
  const [cameraData, setCameraData] = useState(null);
  const [title, setTitle] = useState('');
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.front);

  useEffect(() => {
    nextFunction(title, cameraData, bgColor);
  }, [title, cameraData]);

  if (currentRender === 'camera') {
    return (
      <View
        style={{
          flexGrow: 1,
        }}>
        {cameraDone ? (
          <KeyboardAvoidingView
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            enabled
            keyboardVerticalOffset={200}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView>
              <Image
                source={{
                  uri: cameraData.uri,
                }}
                resizeMode="contain"
                style={{
                  width: 300,
                  height: 399,
                }}
              />
              <Text style={{ marginVertical: 20, fontSize: 20 }}>Title: </Text>
              <TextInput
                value={title}
                onChangeText={(e) => setTitle(e)}
                style={{
                  borderColor: 'gray',
                  borderWidth: 0.5,
                  borderRadius: 10,
                  paddingLeft: 10,
                }}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        ) : (
          <>
            <TouchableOpacity
              onPress={async () => {
                if (cameraRef.current) {
                  const options = { quality: 0.5, base64: true };
                  const data = await cameraRef.current.takePictureAsync(
                    options,
                  );
                  setCameraData(data);
                  setCameraDone(true);
                }
              }}
              style={{
                height: 50,
                width: 50,
                position: 'absolute',
                bottom: 25,
                left: width / 2 - 65,
                backgroundColor: 'white',
                zIndex: 2,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2,
              }}>
              <AntDesign
                name="camera"
                style={{ fontSize: 30, fontWeight: 'bold' }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                if (cameraType === RNCamera.Constants.Type.front) {
                  setCameraType(RNCamera.Constants.Type.back);
                } else setCameraType(RNCamera.Constants.Type.front);
              }}
              style={{
                height: 50,
                width: 50,
                position: 'absolute',
                bottom: 25,
                left: width / 2,
                backgroundColor: 'white',
                zIndex: 2,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2,
              }}>
              <MaterialIcons
                name="flip-camera-android"
                style={{ fontSize: 30, fontWeight: 'bold' }}
              />
            </TouchableOpacity>
            <View
              style={{
                flexGrow: 1,
              }}>
              <View
                style={{
                  flex: 1,
                }}>
                <RNCamera
                  style={{
                    flex: 1,
                  }}
                  ref={(ref) => (cameraRef.current = ref)}
                  captureAudio={false}
                  type={cameraType}
                  flashMode={RNCamera.Constants.FlashMode.off}
                  androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                  }}
                  androidRecordAudioPermissionOptions={{
                    title: 'Permission to use audio recording',
                    message: 'We need your permission to use your audio',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                  }}
                />
              </View>
            </View>
          </>
        )}
      </View>
    );
  }
  if (currentRender === 'text') {
    return (
      <View
        style={{
          flexGrow: 1,
        }}>
        {!!bgColor && (
          <View
            style={{
              flexGrow: 6,
              backgroundColor: bgColor,
            }}>
            <TextInput
              onChangeText={(e) => setTitle(e)}
              placeholder="Tap to type.."
              multiline={true}
              numberOfLines={5}
              textAlignVertical="top"
              style={{
                padding: 30,
                fontSize: 30,
                fontFamily: 'sans-serif-condensed',
              }}
            />
          </View>
        )}
        <View
          style={{
            height: 100,
            paddingVertical: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            {baseColors.map((i, ind) => (
              <TouchableOpacity
                onPress={() => setBgColor(i)}
                key={ind}
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: i,
                }}></TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  }
  if (currentRender === 'pick') {
    return (
      <View
        style={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {imageSrc === null ? (
          <Text>You have not choosen any images!</Text>
        ) : (
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            enabled
            keyboardVerticalOffset={200}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView>
              <Image
                source={{
                  uri: imageSrc.path,
                }}
                style={{
                  width: imageSrc.width,
                  height: imageSrc.height,
                }}
              />
              <Text style={{ marginVertical: 20, fontSize: 20 }}>Title: </Text>
              <TextInput
                value={title}
                onChangeText={(e) => setTitle(e)}
                style={{
                  borderColor: 'gray',
                  borderWidth: 0.5,
                  borderRadius: 10,
                  paddingLeft: 10,
                }}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </View>
    );
  }
  return null;
};

export default function ModalCreateStatus(props) {
  const { showModalCreateStatus, setShowModalCreateStatus, cameraRef } = props;
  const [currentRender, setCurrentRender] = useState('camera');
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const statusTitleRef = useRef();
  const cameraDataRef = useRef();
  const bgColorRef = useRef();
  const nextFunction = (title, cameraData, bgColor) => {
    statusTitleRef.current = title;
    cameraDataRef.current = cameraData;
    bgColorRef.current = bgColor;
  };

  const handleSubmitStatus = async () => {
    if (!!!statusTitleRef.current) {
      Alert.alert('Gossips', 'Status title is mandatory!');
      return;
    } else {
      setLoading(true);
      try {
        const res = await axios.post(
          'https://www.gossipsbook.com/api/status/list-create/',
          {
            text: statusTitleRef.current,
            image: null,
            background_color: bgColorRef.current ?? '#f1f1f1',
          },
        );
        if (res.status === 201) {
          const { slug } = res.data;

          console.log(res, 'response sending');
          if (!cameraDataRef.current && !imageSrc) {
            Alert.alert('Gossips', 'Status uploaded!', [
              {
                text: 'OK',
                onPress: () => {
                  setImageSrc(null);
                  cameraDataRef.current = null;
                  statusTitleRef.current = null;
                  setShowModalCreateStatus(false);
                },
              },
            ]);
          }
          if (!!cameraDataRef.current) {
            const access_token = await AsyncStorage.getItem('token');
            const response = await RNFetchBlob.fetch(
              'PUT',
              `https://www.gossipsbook.com/api/status/update/${slug}/?props=image`,
              {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Token ' + access_token,
              },
              [
                {
                  name: 'image',
                  filename: decodeURIComponent(
                    cameraDataRef.current.uri?.split('/').pop(),
                  ),
                  data: RNFetchBlob.wrap(
                    decodeURIComponent(
                      cameraDataRef.current.uri.replace('file://', ''),
                    ),
                  ),
                },
              ],
            )
              .uploadProgress(async (rec, tot) => {
                let progress = ((rec / tot) * 100).toFixed();
                console.log(`uploaded ${progress}%`);
              })
              .then((res) =>
                Alert.alert('Gossips', 'Status uploaded!', [
                  {
                    text: 'OK',
                    onPress: () => setShowModalCreateStatus(false),
                  },
                ]),
              )
              .catch((err) => {
                Alert.alert('Gossips', JSON.stringify(err), [
                  {
                    text: 'OK',
                    onPress: () => setShowModalCreateStatus(false),
                  },
                ]);
              });
          }
          if (!!imageSrc) {
            const access_token = await AsyncStorage.getItem('token');
            await RNFetchBlob.fetch(
              'PUT',
              `https://www.gossipsbook.com/api/status/update/${slug}/?props=image`,
              {
                'Content-Type': 'multipart/form-data',
                Authorization: 'Token ' + access_token,
              },
              [
                {
                  name: 'image',
                  filename: decodeURIComponent(imageSrc.path?.split('/').pop()),
                  data: RNFetchBlob.wrap(
                    decodeURIComponent(imageSrc.path.replace('file://', '')),
                  ),
                },
              ],
            )
              .uploadProgress(async (rec, tot) => {
                let progress = ((rec / tot) * 100).toFixed();
                console.log(`uploaded ${progress}%`);
              })
              .then((res) =>
                Alert.alert('Gossips', 'Status uploaded!', [
                  {
                    text: 'OK',
                    onPress: () => {
                      setImageSrc(null);
                      cameraDataRef.current = null;
                      statusTitleRef.current = null;
                      setShowModalCreateStatus(false);
                    },
                  },
                ]),
              );
          }
        }
      } catch (err) {
        Alert.alert('Gossips', JSON.stringify(err));
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal
      transparent={false}
      animationType="slide"
      visible={showModalCreateStatus}>
      <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
        <View
          style={{
            flexGrow: 1,
            zIndex: 1,
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
                setShowModalCreateStatus(false);
                setImageSrc(null);
                cameraDataRef.current = null;
                statusTitleRef.current = null;
              }}>
              <AntDesign
                name="close"
                style={{ fontSize: 30, fontWeight: 'bold' }}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSubmitStatus}>
              <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Next</Text>
            </TouchableOpacity>
          </View>
          <RenderComp
            currentRender={currentRender}
            setShowModalCreateStatus={setShowModalCreateStatus}
            cameraRef={cameraRef}
            imageSrc={imageSrc}
            nextFunction={nextFunction}
          />
          <View
            style={{
              flexDirection: 'row',
              height: 100,
              backgroundColor: 'white',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{ flex: 1, alignItems: 'center' }}
              onPress={() => setCurrentRender('camera')}>
              <AntDesign
                name="camera"
                style={{
                  fontSize: 30,
                  color: currentRender === 'camera' ? '#000080' : 'black',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, alignItems: 'center' }}
              onPress={() => {
                setCurrentRender('text');
              }}>
              <AntDesign
                name="edit"
                style={{
                  fontSize: 30,
                  color: currentRender === 'text' ? '#000080' : 'black',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flex: 1, alignItems: 'center' }}
              onPress={() => {
                setCurrentRender('pick');
                ImagePicker.openPicker({
                  width: 300,
                  height: 400,
                  // cropping: true,
                })
                  .then((image) => {
                    setImageSrc(image);
                  })
                  .catch((err) => {
                    console.log(err);
                    setImageSrc(null);
                  });
              }}>
              <Entypo
                name="images"
                style={{
                  fontSize: 30,
                  color: currentRender === 'pick' ? '#000080' : 'black',
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
