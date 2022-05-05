import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, DeviceEventEmitter } from 'react-native';
import { AppContext } from './AppProvider';

export const PollContext = React.createContext();

const BASE_URL = 'https://www.gossipsbook.com/api/';

export const LOADING = 1;
export const ERROR = 2;

const PollProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState();
  const [responseTypes, setResponseTypes] = useState();
  const { setLoading } = useContext(AppContext);
  useEffect(() => {
    getResponseTypes();
    AsyncStorage.getItem('token').then((result) => setAccessToken(result));
  }, []);

  const getPhotoPollList = async (setState, params) => {
    setState((cv) => ({ ...cv, loading: true }));
    let url;
    if (params.own) url = 'photo_poll?' + 'page=' + params.page;
    else if (params.friend)
      url = 'photo_poll?' + 'page=' + params.page + '&friend=' + params.friend;
    else url = 'photo_poll?any=yes&' + 'page=' + params.page;
    console.log('full url', BASE_URL + url);
    fetch(BASE_URL + url, {
      method: 'GET',
      headers: {
        Authorization: `Token ${await AsyncStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json?.detail?.includes('Invalid')) {
          console.log('invalid page');
          return setState((cv) => ({
            ...cv,
            loading: false,
            hasLoadedAllItems: true,
          }));
        }
        if (!json?.results) return;
        if (json?.results.length > 0)
          setState((cv) => ({
            ...cv,
            loading: false,
            list:
              params.page == 1 ? json?.results : [...cv.list, ...json?.results],
            page: params.page + 1,
            hasLoadedAllItems: json?.results?.length != 5,
          }));
        else setState((cv) => ({ ...cv, loading: false }));
      })
      .catch((err) => {
        console.log('poll list error', err);
      });
  };

  const getPollDetails = async (pollId, setState) => {
    setState(LOADING);
    fetch(BASE_URL + 'photo_poll/single_poll/' + pollId, {
      method: 'GET',
      headers: {
        Authorization: `Token ${await AsyncStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setState(json.results[0]);
      })
      .catch((err) => {
        console.log(err);
        setState(ERROR);
      });
  };

  const newPollReaction = async (params, onFail) => {
    const formData = new FormData();
    Object.entries(params).forEach(([key, value]) =>
      formData.append(key, value),
    );
    fetch(BASE_URL + 'photo_poll/votes/', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Token ${await AsyncStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log('POLL REACTION SUCCESS', json);
      })
      .catch((err) => {
        console.log(err);
        onFail();
      });
  };

  const getComments = async (photoPollId, setState) => {
    setState(LOADING);
    fetch(BASE_URL + 'photo_poll/comments?pollphoto=' + photoPollId, {
      method: 'GET',
      headers: {
        Authorization: `Token ${await AsyncStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setState(json.results);
      })
      .catch((err) => setState(ERROR));
  };

  const getReplies = async (commentId, setState) => {
    setState(LOADING);
    fetch(BASE_URL + 'photo_poll/replies?comment=' + commentId, {
      method: 'GET',
      headers: {
        Authorization: `Token ${await AsyncStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setState(json.results);
      })
      .catch((err) => setState(ERROR));
  };

  const newComment = async (params, onSuccess) => {
    fetch(BASE_URL + 'photo_poll/comments/', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        Authorization: `Token ${await AsyncStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log('comment success', json);
        onSuccess();
      })
      .catch((err) => {
        Alert.alert('Error', err + '');
      });
  };

  const newReply = async (params, onSuccess) => {
    fetch(BASE_URL + 'photo_poll/replies/', {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        Authorization: `Token ${await AsyncStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log('reply success', json);
        onSuccess();
      })
      .catch((err) => {
        Alert.alert('Error', err + '');
      });
  };

  const newPhotoPoll = async (params, onSuccess) => {
    setLoading(true);
    const formData = new FormData();
    Object.entries(params).forEach(([key, value]) =>
      key.includes('photo')
        ? formData.append(
            key,
            value
              ? { uri: value.uri, name: value.fileName, type: 'image/jpeg' }
              : undefined,
          )
        : formData.append(key, value),
    );
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: `Token ${accessToken}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    };
    fetch(`${BASE_URL}photo_poll/`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        DeviceEventEmitter.emit(POLL_EVENTS.NEW_POLL_ADDED);
        onSuccess();
      })
      .catch((error) => Alert.alert('error', error + ''))
      .finally(() => setLoading(false));
  };

  const getResponseTypes = async () => {
    setResponseTypes(LOADING);
    fetch(BASE_URL + 'photo_poll/response_types/', {
      method: 'GET',
      headers: {
        Authorization: `Token ${await AsyncStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        // Alert.alert('emoji', JSON.stringify(json.results))
        setResponseTypes(json.results);
      })
      .catch((err) => {
        Alert.alert('emoji', err + '');
        setResponseTypes(ERROR);
      });
  };

  const deleteComment = async (commentId, onSuccess) => {
    fetch(BASE_URL + `photo_poll/comment_delete/${commentId}/`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${await AsyncStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log('delete success', json);
        onSuccess();
      })
      .catch((err) => {
        Alert.alert('Error', err + '');
      });
  };

  const deleteReply = async (replyId, onSuccess) => {
    fetch(BASE_URL + `photo_poll/reply_delete/${replyId}/`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${await AsyncStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log('delete success', json);
        onSuccess();
      })
      .catch((err) => {
        Alert.alert('Error', err + '');
      });
  };

  return (
    <PollContext.Provider
      value={{
        getPhotoPollList,
        newPollReaction,
        getComments,
        newPhotoPoll,
        responseTypes,
        newComment,
        newReply,
        getReplies,
        getPollDetails,
        deleteComment,
        deleteReply,
      }}>
      {children}
    </PollContext.Provider>
  );
};

export default PollProvider;

export const POLL_EVENTS = {
  NEW_POLL_ADDED: 'new poll added',
};
