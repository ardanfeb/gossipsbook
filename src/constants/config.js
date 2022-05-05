import layout from './layout';

export default {
  buttonHeight: layout.screenHeight / 14,

  splashScreenTime: 1000,
  touchOpacity: 0.6,

  initialRouteName: 'AuthFlow',

  apiURL: 'https://www.gossipsbook.com/',
  fcmUrl: 'https://fcm.googleapis.com/fcm/send',
  senderKey:
    'AAAAAo51iIk:APA91bH2_pPNNurO1DgNlDEWVQ5TUQ9SBtIup4OTYeSAnBHCo1apv5weVBd3VIc-gwntld3Av9aeg5neLgJq9DCTmARMCB6ShykKuNXRtstTv-J-6OWI8NJ8_HsNG-HwvfU7gzD2v97t',
};

export const EVENTS = {
  NOTIFICATION_OPENED: 'notification opened',
  MESSAGE_OPENED: 'message opened',
  MESSAGE_RECEVIED_BACKGROUND: 'message opened',
};
