import React, { useEffect, useRef } from 'react';

import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { config as constants } from './constants';
import reactotron from 'reactotron-react-native';

export async function login(
  token,
  firstName = null,
  lastName = null,
  userName = null,
  profileImage = null,
  callback = null,
) {
  await setItemStorage('@lotto/authToken', token);
  firstName && (await setItemStorage('@lotto/firstName', firstName));
  lastName && (await setItemStorage('@lotto/lastName', lastName));
  userName && (await setItemStorage('@lotto/userName', userName));
  profileImage && (await setItemStorage('@lotto/profileImage', profileImage));

  if (callback) {
    callback();
  }
}

export async function logout(callback = null) {
  await AsyncStorage.removeItem('@lotto/authToken');
  await AsyncStorage.removeItem('@lotto/firstName');
  await AsyncStorage.removeItem('@lotto/lastName');
  await AsyncStorage.removeItem('@lotto/userName');
  await AsyncStorage.removeItem('@lotto/profileImage');

  if (callback) {
    callback();
  }
}

export const makeid = (length) => {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const moreText = (text) => {
  // Slice is JS function
  if (text?.length >= 70) {
    reactotron.log(text.slice(0, 70) + ' more...');
    return text.slice(0, 70) + ' more...';
  } else {
    reactotron.log(text);
    return text;
  }
};

export async function setStorage(
  firstName = null,
  lastName = null,
  profileImage = null,
  callback = null,
) {
  firstName && (await setItemStorage('@lotto/firstName', firstName));
  lastName && (await setItemStorage('@lotto/lastName', lastName));
  profileImage && (await setItemStorage('@lotto/profileImage', profileImage));

  if (callback) {
    callback();
  }
}

export async function clearStorage(callback = null) {
  await AsyncStorage.removeItem('@lotto/firstName');
  await AsyncStorage.removeItem('@lotto/lastName');
  await AsyncStorage.removeItem('@lotto/profileImage');

  if (callback) {
    callback();
  }
}

export const getItemStorage = async (key) => {
  var val = await AsyncStorage.getItem(key);
  try {
    return JSON.parse(val);
  } catch (error) {
    return JSON.stringify(val);
  }
};

export const setItemStorage = async (key, item) => {
  await AsyncStorage.setItem(key, JSON.stringify(item));
};

export const removeItemStorage = async (key) => {
  await AsyncStorage.removeItem(key);
};

export async function isNumeric(n) {
  return await (!isNaN(parseFloat(n)) && isFinite(n));
}

// export async function uploadPhoto(body, url, token, successCallback = null, errorCallback = null) {

//    const firstBlobImage = convertBase64ToBlob('data:image/jpeg;base64,' + String(body[0].data));
//    const secondBlobImage = convertBase64ToBlob('data:image/jpeg;base64,' + String(body[1].data));

//    const formData = new FormData();
//    formData.append("file", firstBlobImage, "firstImage.jpeg");
//    formData.append("file", secondBlobImage, "secondImage.jpeg");

// }

export async function request(
  type,
  url,
  data,
  token = null,
  successCallback = null,
  errorCallback = null,
) {
  if (token) {
    axios.defaults.headers.common.Authorization = 'Token ' + token;
  }
  axios.defaults.headers.post.Accept = 'application/json';
  // axios.defaults.headers.post['Content-Type'] = 'application/json' // 'application/x-www-form-urlencoded';

  await axios[type](constants.apiURL + url, data)
    .then((res) => {
      if (successCallback) {
        successCallback(res);
      }
    })
    .catch((err) => {
      if (errorCallback) {
        errorCallback(err);
      }
    });
}

export const buildLink = async (data) => {
  const image = data?.gossip_images[0]?.image;
  reactotron.log(`https://www.gossipsbook.com/gossips/${data?.slug}/detail`);
  const link = await dynamicLinks().buildShortLink(
    {
      link: `https://www.gossipsbook.com/?post?${data?.slug}`,
      domainUriPrefix: 'https://gossips.page.link',
      android: {
        packageName: 'com.gossips',
        fallbackUrl:
          'https://play.google.com/store/apps/details?id=com.gossips',
      },
      ios: {
        bundleId: 'com.gossips',
        appStoreId: '',
        fallbackUrl: 'https://www.gossipsbook.com/',
      },
      social: {
        title: 'Gossips Book',
        descriptionText: data?.title,
        imageUrl: image,
      },
      navigation: {
        forcedRedirectEnabled: false,
      },
    },
    dynamicLinks.ShortLinkType.SHORT,
  );
  return `${data?.title}\n${link}`;
};

export const buildLinkProfileLink = async (username, image) => {
  console.log('buildLinkProfileLink:', username, image);
  const link = await dynamicLinks().buildShortLink(
    {
      link: `https://www.gossipsbook.com/?profile?${username}`,
      domainUriPrefix: 'https://gossips.page.link',
      android: {
        packageName: 'com.gossips',
        fallbackUrl:
          'https://play.google.com/store/apps/details?id=com.gossips',
      },
      ios: {
        bundleId: 'com.gossips',
        appStoreId: '',
        fallbackUrl: 'https://www.gossipsbook.com/',
      },
      social: {
        title: 'Gossips Book',
        descriptionText: username,
        imageUrl: image,
      },
      navigation: {
        forcedRedirectEnabled: false,
      },
    },
    dynamicLinks.ShortLinkType.SHORT,
  );
  return `Gossipsbook user ${username}\n${link}`;
};

export const buildLinkPhotoPoll = async (id, image, username) => {
  console.log('asd: ', id, image, username);
  const link = await dynamicLinks().buildShortLink(
    {
      link: `https://www.gossipsbook.com/?photopoll?${id}`,
      domainUriPrefix: 'https://gossips.page.link',
      android: {
        packageName: 'com.gossips',
        fallbackUrl:
          'https://play.google.com/store/apps/details?id=com.gossips',
      },
      ios: {
        bundleId: 'com.gossips',
        appStoreId: '',
        fallbackUrl: 'https://www.gossipsbook.com/',
      },
      social: {
        title: 'Gossips Book',
        descriptionText: username,
        imageUrl: image,
      },
      navigation: {
        forcedRedirectEnabled: false,
      },
    },
    dynamicLinks.ShortLinkType.SHORT,
  );
  return `Gossipsbook photo poll ${username}\n${link}`;
};

export function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export const isInt = (n) => {
  return Number(n) === n && n % 1 === 0;
};

export const isFloat = (n) => {
  return Number(n) === n && n % 1 !== 0;
};

export const calculateAge = (dob) => {
  var diff_ms = Date.now() - dob.getTime();
  var age_dt = new Date(diff_ms);

  return Math.abs(age_dt.getUTCFullYear() - 1970);
};

export function styler(props, additional = null) {
  const style = {};

  if (props.zi !== undefined) {
    style.zIndex = props.zi;
  }
  if (props.el !== undefined) {
    (style.shadowRadius = 5),
      (style.shadowOpacity = 0.2),
      (style.shadowOffset = {
        width: 0,
        height: 1,
      }),
      (style.shadowColor = '#000'),
      (style.zIndex = 2),
      (style.elevation = props.el);
  }

  // POSITION
  if (props.absolute !== undefined) {
    style.position = 'absolute';
  }
  if (props.relative !== undefined) {
    style.position = 'relative';
  }

  if (props.top !== undefined) {
    style.top = props.top;
  }
  if (props.left !== undefined) {
    style.left = props.left;
  }
  if (props.bottom !== undefined) {
    style.bottom = props.bottom;
  }
  if (props.right !== undefined) {
    style.right = props.right;
  }

  // COLOR
  if (props.bg !== undefined) {
    style.backgroundColor = props.bg;
  }
  if (props.color !== undefined) {
    style.color = props.color;
  }

  // FONT
  if (props.fm !== undefined) {
    style.fontFamily = props.fm;
  }
  if (props.fs !== undefined) {
    style.fontSize = props.fs;
  }

  // TEXT
  if (props.ta !== undefined) {
    style.textAlign = props.ta;
  }
  if (props.lh !== undefined) {
    style.lineHeight = props.lh;
  }
  if (props.tac !== undefined) {
    style.textAlign = 'center';
  }

  // BORDER
  if (props.br !== undefined) {
    style.borderRadius = props.br;
  }
  if (props.brc !== undefined) {
    style.borderColor = props.brc;
  }
  if (props.brw !== undefined) {
    style.borderWidth = props.brw;
  }
  if (props.brbw !== undefined) {
    style.borderBottomWidth = props.brbw;
  }
  if (props.bbrr !== undefined) {
    style.borderBottomRightRadius = props.bbrr;
  }
  if (props.bblr !== undefined) {
    style.borderBottomLeftRadius = props.bblr;
  }
  if (props.btrr !== undefined) {
    style.borderTopRightRadius = props.btrr;
  }
  if (props.btlr !== undefined) {
    style.borderTopLeftRadius = props.btlr;
  }

  // WIDTH, HEIGHT
  if (props.size !== undefined || props.w !== undefined) {
    style.width = (props.size && props.size) || props.w;
  }
  if (props.size !== undefined || props.h !== undefined) {
    style.height = (props.size && props.size) || props.h;
  }
  if (props.minH !== undefined) {
    style.minHeight = props.minH;
  }
  if (props.minW !== undefined) {
    style.minWidth = props.minW;
  }

  // MARGIN
  if (props.m !== undefined) {
    style.margin = props.m;
  }
  if (props.mt !== undefined) {
    style.marginTop = props.mt;
  }
  if (props.mb !== undefined) {
    style.marginBottom = props.mb;
  }
  if (props.ml !== undefined) {
    style.marginLeft = props.ml;
  }
  if (props.mr !== undefined) {
    style.marginRight = props.mr;
  }
  if (props.mh !== undefined) {
    style.marginHorizontal = props.mh;
  }
  if (props.mv !== undefined) {
    style.marginVertical = props.mv;
  }

  // PADDING
  if (props.p !== undefined) {
    style.padding = props.p;
  }
  if (props.pt !== undefined) {
    style.paddingTop = props.pt;
  }
  if (props.pb !== undefined) {
    style.paddingBottom = props.pb;
  }
  if (props.pl !== undefined) {
    style.paddingLeft = props.pl;
  }
  if (props.pr !== undefined) {
    style.paddingRight = props.pr;
  }
  if (props.ph !== undefined) {
    style.paddingHorizontal = props.ph;
  }
  if (props.pv !== undefined) {
    style.paddingVertical = props.pv;
  }

  // FLEX
  if (props.flex !== undefined) {
    style.flex = props.flex;
  }

  if (props.row !== undefined) {
    style.flexDirection = 'row';
  }
  if (props.ac !== undefined) {
    style.alignItems = 'center';
  }

  if (props.asc !== undefined) {
    style.alignSelf = 'center';
  }
  if (props.ass !== undefined) {
    style.alignSelf = 'flex-start';
  }
  if (props.ase !== undefined) {
    style.alignSelf = 'flex-end';
  }

  if (props.jc !== undefined) {
    style.justifyContent = 'center';
  }
  if (props.jsa !== undefined) {
    style.justifyContent = 'space-around';
  }
  if (props.jsb !== undefined) {
    style.justifyContent = 'space-between';
  }
  if (props.js !== undefined) {
    style.justifyContent = 'flex-start';
  }
  if (props.je !== undefined) {
    style.justifyContent = 'flex-end';
  }

  if (props.wrap !== undefined) {
    style.flexWrap = 'wrap';
  }

  //OVERFLOW
  if (props.ofh !== undefined) {
    style.overflow = 'hidden';
  }

  //OPACITY
  if (props.op !== undefined) {
    style.opacity = props.op;
  }

  return [style, additional, props.style];
}

export const getHttpsUrl = (url) => {
  let newHTTPSUrl;
  if (url && url.charAt(4) !== 's') {
    const urlWithoutProtocol = url.substring(4);
    newHTTPSUrl = 'https'.concat(urlWithoutProtocol);
  } else {
    newHTTPSUrl = url;
  }
  return newHTTPSUrl;
};
