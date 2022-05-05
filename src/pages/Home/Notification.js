import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  DeviceEventEmitter,
} from 'react-native';
import { getHttpsUrl } from '../../helpers';
import { colors, config, icons } from '../../constants';
import { Touchable, Icon, Modal } from '../../components';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { EVENTS } from '../../constants/config';

const { buttonHeight } = config;

const Notification = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [nextURL, setNextURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    onRefresh();
  }, []);

  const itemPress = async (id, notification) => {
    const newData = [...data];
    let item = newData.find((x) => x.id == id);
    item.isRead = true;
    item.isShow = !item.isShow;
    setData(newData);

    console.log('asd: ', notification);

    AsyncStorage.getItem('readNotifications', (err, readNotifications) => {
      if (err) return;
      readNotifications = readNotifications
        ? JSON.parse(readNotifications)
        : [];
      readNotifications.push(id);
      AsyncStorage.setItem(
        'readNotifications',
        JSON.stringify(readNotifications),
      );
      DeviceEventEmitter.emit(EVENTS.NOTIFICATION_OPENED);
    });

    if (
      notification.notification_type == 'NP' ||
      notification.notification_type == 'PC'
    ) {
      let itemId;
      let api_url = notification.api_url + '';
      api_url = api_url.substring(0, api_url.length - 1);
      itemId = api_url.substring(api_url.lastIndexOf('/') + 1);
      console.log('item id>', itemId);
      if (notification.notification_type == 'NP')
        return navigation.navigate('Poll Details', { item: { id: itemId } });
      if (notification.notification_type == 'PC')
        return navigation.navigate('Poll Comments', { id: itemId });
    }

    // MODIFIED

    const res = await axios.get(
      'https://www.gossipsbook.com/api/notifications/',
    );
    const { results } = res.data;
    console.log('NEW', results);

    for (let i = 0; i < results.length; i++) {
      if (results[i].id === id) {
        console.log(results[i].notification_type, results[i].api_url);
        if (
          results[i].notification_type === 'VT' ||
          results[i].notification_type === 'VF'
        ) {
          const res2 = await axios.get(
            'https://www.gossipsbook.com' + results[i].api_url,
          );
          navigation.navigate('GossipDetail', { item: res2.data });
        } else if (results[i].notification_type === 'NG') {
          const res2 = await axios.get(
            'https://www.gossipsbook.com' + results[i].api_url,
          );
          const results2 = res2.data;
          navigation.navigate('GossipDetail', { item: results2 });
        } else if (results[i].notification_type === 'GC') {
          const res = await axios.get(
            'https://www.gossipsbook.com' + results[i].api_url,
          );
          const result = res.data;
          navigation.navigate('Comment', { slug: result.slug });
        } else if (results[i].notification_type === 'FR') {
          navigation.navigate('UserProfile', {
            username: results[i].from_user?.username,
          });
        }
      }
    }

    // MODIFIED
  };

  const Item = ({
    id,
    title,
    desc,
    isRead,
    isShow,
    index,
    image,
    datePublished,
    item,
  }) => {
    return (
      <Touchable
        key={index}
        bg={colors.white}
        onPress={() => itemPress(id, item)}
        style={{
          paddingHorizontal: 10,
          paddingVertical: 15,
          marginBottom: 15,
          borderWidth: isRead ? 1 : 3,
          borderColor: colors.gray,
          borderRadius: 20,
          flexDirection: 'row',
          borderColor: isRead ? 'black ' : '#000080',
        }}>
        <Image
          style={{
            width: 50,
            height: 50,
            borderRadius: 1000,
            // backgroundColor: 'lightgreen',
          }}
          resizeMode="cover"
          source={image ? { uri: image } : icons.defaultAvatar}
        />
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={2}
            style={{ fontSize: 16, marginLeft: 20, marginBottom: 7 }}>
            {desc}
          </Text>
          <Text style={{ paddingHorizontal: 20, color: 'grey' }}>
            {new Date(datePublished).toDateString()}
          </Text>
        </View>
      </Touchable>
    );
  };

  const showModal = () => {
    setVisible(true);
  };

  const yes = () => {
    let newData = [...data];
    newData.forEach((x) => (x.isRead = true));
    setData(newData);
    setVisible(false);
  };

  const no = () => {
    setVisible(false);
  };

  const modal = () => {
    return (
      <Modal visible={visible} transparent custom>
        <View
          key={'1'}
          style={{
            backgroundColor: colors.white,
            width: '80%',
            height: 150,
            borderRadius: 20,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              color: colors.black,
              textAlign: 'center',
              fontSize: 18,
            }}>
            All messages marked read?
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 30,
            }}>
            <Touchable
              onPress={yes}
              bg={colors.navyBlue}
              ph={20}
              pv={10}
              br={10}>
              <Text style={{ color: colors.white, fontSize: 18 }}>Yes</Text>
            </Touchable>
            <Touchable onPress={no} bg={colors.gray} ph={20} pv={10} br={10}>
              <Text style={{ color: colors.white, fontSize: 18 }}>No</Text>
            </Touchable>
          </View>
        </View>
      </Modal>
    );
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 1;
  };

  const isCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return contentOffset.y == 0;
  };

  const loadmoreNoti = async () => {
    if (nextURL !== null) {
      try {
        onRefresh(nextURL);
        // console.log('nextURL :', nextURL);
        // const res = await axios.get(nextURL);
        // console.log('asdasd: ', res);
        // const { results } = res.data;
        // const newData = results.map((i) => {
        //   return {
        //     id: i.id,
        //     desc: i.message,
        //     isRead: false,
        //     isShow: false,
        //   };
        // });
        // const temp = JSON.parse(JSON.stringify(data));
        // if (results.length > 0) setData([...temp, ...newData]);
        // setNextURL(res.data.next);
        // setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    } else {
      setLoading(false);
    }
  };

  const onRefresh = async (url) => {
    // const res = await axios.get(
    //   'https://www.gossipsbook.com/api/notifications/'
    // );
    // console.log('resresresres: ', res);
    // const { results } = res.data;
    // setNextURL(res.data.next);
    // setData(
    //   results.map((i) => {
    //     return {
    //       id: i.id,
    //       desc: i.message,
    //       isRead: false,
    //       isShow: false,
    //       image: i?.from_user?.profile?.image,
    //       datePublished: i?.date_created,
    //     };
    //   }),
    // );
    const uri = url || 'https://www.gossipsbook.com/api/notifications/';
    const res = await axios.get(uri);
    const { results } = res.data;
    AsyncStorage.getItem('readNotifications', (err, readNotifications) => {
      if (err) return;
      const dt = JSON.parse(readNotifications);
      console.log({ results, dt });

      const aa = [];
      results.forEach((i) => {
        const ff = dt?.filter((f) => f == i.id)[0];
        const obj = {
          notification_type: i.notification_type,
          api_url: i.api_url,
          id: i.id,
          desc: i.message,
          isRead: ff ? true : false,
          isShow: false,
          image: i?.from_user?.profile?.image,
          datePublished: i?.date_created,
        };
        aa.push(obj);
      });
      const formattedUrl = getHttpsUrl(res.data.next);
      setNextURL(formattedUrl);
      setData(aa);
    });
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      stickyHeaderIndices={[0]}
      showsVerticalScrollIndicator={false}
      onScroll={async ({ nativeEvent }) => {
        if (isCloseToTop(nativeEvent)) {
          setLoading(false);
        }
        if (isCloseToBottom(nativeEvent)) {
          setLoading(true);
          await loadmoreNoti();
        }
      }}
      scrollEventThrottle={400}
      bounces={false}
      style={{ flex: 1, backgroundColor: colors.white }}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingBottom: 40,
        // marginTop: 20,
      }}>
      <View
        style={{
          backgroundColor: 'white',
          paddingVertical: 20,
        }}>
        <Text
          style={{
            marginTop: 15,
            fontSize: 24,
            fontWeight: 'bold',
            color: '#000',
            alignSelf: 'center',
          }}>
          Notifications
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#555',
            position: 'absolute',
            top: 10,
            left: 10,
            borderWidth: 1,
            borderRadius: 25,
            width: 40,
            height: 40,
          }}>
          <Icon name="back" size={18} />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, marginTop: 20 }}>
        {data.map((item, index) => {
          return <Item {...item} item={item} index={index} key={index} />;
        })}
      </View>
      {loading && (
        <ActivityIndicator
          size="large"
          color="black"
          style={{ marginBottom: 20 }}
        />
      )}
    </ScrollView>
  );
};

export default Notification;
