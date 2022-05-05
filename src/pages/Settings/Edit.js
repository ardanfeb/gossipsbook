import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Dimensions,
  Image,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import { colors, config, layout } from '../../constants';
import { Touchable, Icon, Input, Loading } from '../../components';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ModalEditExp from './ModalEditExp';
import ModalEditQualification from './ModalEditQualification';
import RNFetchBlob from 'rn-fetch-blob';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomInput from '../../components/CustomInput';
import { useForm } from 'react-hook-form';
import { Icon as MaterialIcon } from 'react-native-elements'
import DateModal from '../../components/DateModal';
import { shadow } from '../../constants/layout';
import moment from 'moment';

const { buttonHeight } = config;
const { screenWidth, screenHeight } = layout;

const { width, height } = Dimensions.get('screen');

let initialDob = new Date();
initialDob.setFullYear(1999);



const Edit = ({ navigation, route }) => {
  const [userInfo, setUserInfo] = useState({});
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);

  const { control, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = data => {
    if (!martial_status) return Alert.alert('Alert', 'Please select your martial status to continue.')
    if (!birthday) return Alert.alert('Alert', 'Please insert your birthday to continue.')
    if (!martial_status) return Alert.alert('Alert', 'Please select your gender to continue.')
    data = { ...data, birthday, gender, martial_status }
    console.log('ON SUBMIT', JSON.stringify(data, null, 2))
    save(data)
  }

  const [gender, setGender] = useState();
  const [martial_status, setMarital] = useState();

  const [birthday, setBirthday] = useState();
  const [datePickerVisible, setDatePickerVisibility] = useState(false);


  const getData = async () => {
    setLoading(true);
    try {
      const _email = (await AsyncStorage.getItem('email')) ?? 'null';
      setEmail(_email);
      const res = await axios.get(
        'https://www.gossipsbook.com/api/current-user/profile/retrieve/',
      );
      const { data } = res;
      const { profile } = data;

      console.log('GET DATA', JSON.stringify(data, null, 2))

      setUserInfo(data);
      setUserProfile(profile);
      setName(data.first_name);
      setLastName(data.last_name);
      setWorkExp(data.work_experiences);
      setQualificationItem(data.qualifications);
      setWork(profile?.designation ?? '');
      setLanguages(profile?.languages ?? '');
      setCurrentLocation(profile?.location ?? '');
      setBio(profile?.bio ?? '');
      setBirthday(profile?.birthday ? moment(profile.birthday, 'MM/DD/YYYY').toDate() : null);  ///
      setMarital(profile?.martial_status ?? '');
      setFbLink(profile?.facebook_link ?? '');
      setKooLink(profile?.koo_link ?? '');
      setGender(profile?.gender ?? '');
      reset({ email: _email, ...data.profile, ...data })
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
    const sub = navigation.addListener('focus', async () => {
      await getData();
    });
    return sub;
  }, [navigation]);

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [work, setWork] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [bio, setBio] = useState('');
  // const [birthday, setBirthday] = useState(new Date(1598051730000));
  const [birthdaySelector, setBirthdaySelector] = useState(
    new Date(1598051730000),
  );
  const [showBirthdaySelector, setShowBirthdaySelector] = useState(false);
  const [languages, setLanguages] = useState('');
  // const [marital, setMarital] = useState('');
  const [fbLink, setFbLink] = useState('');
  const [kooLink, setKooLink] = useState('');
  const [linkedInLink, setLinkedInLink] = useState('');
  const [qualificationItem, setQualificationItem] = useState([]);
  const [workExp, setWorkExp] = useState();
  const [showModalQualification, setShowModalQuanlification] = useState(false);
  const [showModalExp, setShowModalExp] = useState(false);
  const [localImg, setLocalImg] = useState(null);

  const onBirthdayChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date(1598051730000);
    setShowBirthdaySelector(Platform.OS === 'ios');
    setBirthdaySelector(currentDate);
    setBirthday(
      `${currentDate.getMonth() + 1
      }/${currentDate.getDate()}/${currentDate.getFullYear()}`,
    );
  };



  const save = async (data) => {
    const _username = (await AsyncStorage.getItem('username')) ?? 'null';
    const _email = (await AsyncStorage.getItem('email')) ?? 'null';
    let isSuccess = true;
    // -----------------------------------
    console.log('SUBMIT', JSON.stringify({ birthday: moment(birthday).format('MM/DD/YYYY') }, null, 2))
    try {
      const res = await axios
        .post('https://www.gossipsbook.com/api/current-user/profile/update/', { ...data, birthday: moment(birthday).format('MM/DD/YYYY') })
        .then(function (response) {
          const { data } = response;
          console.log(response.status, 'hmm saved?');
        })
        .catch(function (err) {
          isSuccess = false;
          console.log('error', err);
          Alert.alert('Gossips', err?.toString() ?? 'err');
        });
    } catch (err) {
      isSuccess = false;
      console.log('error 1', err);
      Alert.alert('Gossips', err?.toString() ?? 'err');
    }
    // -----------------------------------
    try {
      const res = await axios
        .post(
          'https://www.gossipsbook.com/api/current-user/profile/update/core/',
          {
            username: _username,
            ...data
          },
        )
        .then(function (response) {
          const { data } = response;
        })
        .catch(function (err) {
          Alert.alert('Gossips', err?.toString() ?? 'err');
        });
    } catch (err) {
      isSuccess = false;
      console.log('error', err);
      Alert.alert('Gossips', err?.message ?? 'err');
    }
    // -----------------------------------
    // try {
    //   const res = await axios
    //     .put(
    //       'https://www.gossipsbook.com/api/current-user/profile/update/?property=martial_status',
    //       {
    //         martial_status: data.martial_status,
    //       },
    //     )
    //     .catch(function (err) {
    //       console.log('error 3', err);
    //       Alert.alert('Gossips', err?.response.toString() ?? 'err');
    //     });
    //   const { data } = res;
    //   console.log(data);
    // } catch (err) {
    //   isSuccess = false;
    //   Alert.alert('Gossips', err?.response.toString() ?? 'err');
    // }
    // -----------------------------------
    if (isSuccess) {
      Alert.alert('Gossips', 'Update successfully!!');
      setLoading(true);
      await getData();
    }
  };

  const handleUploadAvatar = async () => {
    ImagePicker.openPicker({
      //width: 300,
      // height: 300,
      //cropping: true,
    })
      .then(async (image) => {
        const access_token = await AsyncStorage.getItem('token');
        await RNFetchBlob.fetch(
          'POST',
          `https://www.gossipsbook.com/api/current-user/profile/update/image/`,
          {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Token ' + access_token,
          },
          [
            {
              name: 'image',
              filename: decodeURIComponent(image.path?.split('/').pop()),
              data: decodeURIComponent(
                RNFetchBlob.wrap(image.path.replace('file://', '')),
              ),
            },
          ],
        ).then((res) => {
          console.log(res);
          setLocalImg(image);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCloseModal = async () => {
    console.log('modal close');
    // await getData();
  };


  const OptionBtn = ({ selected, onPress, label }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: selected ? colors.primary + '90' : colors.veryLightGrey + '50', height: 40, margin: 5, borderRadius: 5, flex: 1, borderWidth: selected ? 0 : 1, borderColor: "#eee", }}>
      <Text style={{ fontSize: 16, fontWeight: selected ? "bold" : "normal", color: selected ? 'white' : colors.gray }}>{label}</Text>
    </TouchableOpacity>
  )

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

      <>
        {showModalQualification && (
          <ModalEditQualification
            showModalQualification={showModalQualification}
            setShowModalQuanlification={setShowModalQuanlification}
            handleCloseModal={handleCloseModal}
          />
        )}
        {showModalExp && (
          <ModalEditExp
            showModalExp={showModalExp}
            setShowModalExp={setShowModalExp}
            handleCloseModal={handleCloseModal}
          />
        )}
        {loading ? (
          <ActivityIndicator style={{ padding: 50 }} size="large" color="black" />
        ) : (
          <View style={{ flex: 1, backgroundColor: colors.white }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              style={{ backgroundColor: colors.white, height: screenHeight }}
              contentContainerStyle={{
                flexGrow: 1,
                padding: 20,
                paddingTop: 10
              }}>

              {datePickerVisible && (
                <DateModal
                  value={birthday}
                  initialDate={initialDob}
                  confirm={setBirthday}
                  dismiss={() => setDatePickerVisibility(false)}
                />
              )}

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

              <Text
                style={{
                  alignSelf: 'center',
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: '#000',
                }}>
                Edit
              </Text>

              <View
                style={{
                  marginVertical: 30,
                  padding: 2,
                  ...shadow,
                  borderRadius: 100,
                  alignSelf: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {localImg?.path ? (
                  <Image
                    //resizeMode="contain"
                    style={{
                      height: 120,
                      width: 120,
                      borderRadius: 1000,
                    }}
                    source={{ uri: localImg?.path }}
                  />
                ) : (
                  <Image
                    // resizeMode="contain"
                    style={{
                      height: 120,
                      width: 120,
                      borderRadius: 1000,
                    }}
                    source={
                      userProfile?.image
                        ? {
                          uri: userProfile?.image,
                        }
                        : require('../../assets/defaultAvatar.jpeg')
                    }
                  />
                )}
                <Touchable
                  absolute
                  right={10}
                  top={10}
                  onPress={handleUploadAvatar}>
                  <Icon name="photo" size={24} />
                </Touchable>
              </View>

              <CustomInput
                textInputProps={{ placeholder: 'Fist name' }}
                iconProps={{ name: 'person' }}
                controllerProps={{ name: 'first_name', control, errors }}
                containerStyle={{ marginBottom: 20 }}
              />

              <CustomInput
                textInputProps={{ placeholder: 'Last name' }}
                iconProps={{ name: 'person' }}
                controllerProps={{ name: 'last_name', control, errors, }}
                containerStyle={{ marginBottom: 20 }}
              />

              <CustomInput
                textInputProps={{ placeholder: 'Email' }}
                iconProps={{ name: 'mail' }}
                controllerProps={{ name: 'email', control, errors, }}
                containerStyle={{ marginBottom: 20 }}
              />

              <CustomInput
                textInputProps={{ placeholder: 'Profession' }}
                iconProps={{ name: 'business-center' }}
                controllerProps={{ name: 'designation', control, errors, rules: { required: true } }}
                containerStyle={{ marginBottom: 20 }}
              />

              <CustomInput
                textInputProps={{ placeholder: 'Language' }}
                iconProps={{ name: 'translate' }}
                controllerProps={{ name: 'languages', control, errors, rules: { required: true } }}
                containerStyle={{ marginBottom: 20 }}
              />

              <CustomInput
                textInputProps={{ placeholder: 'Current Location' }}
                iconProps={{ name: 'gps-fixed' }}
                controllerProps={{ name: 'location', control, errors, rules: { required: true } }}
                containerStyle={{ marginBottom: 20 }}
              />

              <CustomInput
                textInputProps={{ placeholder: 'Bio' }}
                iconProps={{ name: 'article' }}
                controllerProps={{ name: 'bio', control, errors, }}
                containerStyle={{ marginBottom: 20 }}
              />

              <TouchableOpacity
                style={{ backgroundColor: colors.veryLightGrey + '50', height: 50, borderRadius: 10, marginBottom: 20, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, borderColor: colors.lightGray, borderWidth: 2 }}
                onPress={() => setDatePickerVisibility(true)}>
                <Text style={{ fontSize: 16, color: birthday ? 'black' : colors.lightGray }}>
                  {birthday ? birthday.toDateString() : 'Date of birth'}
                </Text>
                <MaterialIcon name="calendar-today" color="#aaa" />
              </TouchableOpacity>

              <View style={{ height: 54, backgroundColor: colors.veryLightGrey + '50', borderColor: colors.lightGray, borderWidth: 2, marginBottom: 20, borderRadius: 10, flexDirection: 'row', alignItems: 'center', }}>
                <OptionBtn label="Male" onPress={() => setGender('Male')} selected={gender == "Male"} />
                <View style={{ margin: -2.5 }} />
                <OptionBtn label="Female" onPress={() => setGender('Female')} selected={gender == "Female"} />
                <View style={{ margin: -2.5 }} />
                <OptionBtn label="Other" onPress={() => setGender('Other')} selected={gender == "Other"} />
              </View>

              <View style={{ height: 54, backgroundColor: colors.veryLightGrey + '50', borderColor: colors.lightGray, borderWidth: 2, marginBottom: 20, borderRadius: 10, flexDirection: 'row', alignItems: 'center', }}>
                <OptionBtn label="Married" onPress={() => setMarital('married')} selected={martial_status == "married"} />
                <View style={{ margin: -2.5 }} />
                <OptionBtn label="Unmarried" onPress={() => setMarital('unmarried')} selected={martial_status == "unmarried"} />
                <View style={{ margin: -2.5 }} />
                <OptionBtn label="Divorced" onPress={() => setMarital('divorced')} selected={martial_status == "divorced"} />
              </View>

              <View style={{ padding: 20, paddingVertical: 10, backgroundColor: "#ddd", marginHorizontal: -20, flexDirection: 'row', alignItems: 'center', marginBottom: 20 }} >
                <MaterialIcon name="link" />
                <Text style={{ fontSize: 16, fontWeight: 'bold', paddingHorizontal: 10 }} >Social Links</Text>
              </View>

              <CustomInput
                textInputProps={{ placeholder: 'Facebook Account' }}
                iconProps={{ name: 'facebook', type: "font-awesome5", color: "#1877f2" }}
                controllerProps={{ name: 'facebook_link', control, errors }}
                containerStyle={{ marginBottom: 20 }}
              />

              <CustomInput
                textInputProps={{ placeholder: 'Linkedin Account' }}
                iconProps={{ name: 'linkedin', type: "font-awesome", color: "#0e76a8" }}
                controllerProps={{ name: 'linkedin_link', control, errors }}
                containerStyle={{ marginBottom: 20 }}
              />


              {/* </KeyboardAwareScrollView> */}

            </ScrollView>
            <View style={{ height: 1, width: '100%', backgroundColor: colors.lightGray }} />
            <TouchableOpacity onPress={handleSubmit(onSubmit)} style={{ alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 8, backgroundColor: colors.primary, margin: 20 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: colors.white }} >Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}
      </>
    </TouchableWithoutFeedback>
  );
};

export default Edit;
