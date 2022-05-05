/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {
  Button,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
  findNodeHandle,
  Image,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from '../../components';
import ZegoExpressEngine, {
  ZegoTextureView,
  ZegoScenario,
  ZegoUpdateType,
} from 'zego-express-engine-reactnative';
import {ZegoExpressManager} from '../../components/ZegoExpressManager';

const now = new Date().getTime();

const styles = StyleSheet.create({
  // ZegoEasyExample
  homePage: {
    width: '100%',
    height: '100%',
  },
  callPage: {
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
  },
  showPage: {
    display: 'flex',
  },
  hidePage: {
    display: 'none',
  },
  showPreviewView: {
    display: 'flex',
    opacity: 1,
  },
  hidePreviewView: {
    display: 'none',
    opacity: 0,
  },
  showPlayView: {
    display: 'flex',
    opacity: 1,
  },
  hidePlayView: {
    display: 'none',
    opacity: 0,
  },
  logo: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    marginTop: '50%',
    marginBottom: 100,
  },
  joinRoomBtn: {
    width: '30%',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  previewView: {
    width: '100%',
    height: '100%',
  },
  play: {
    height: '25%',
    width: '40%',
    position: 'absolute',
    top: 80,
    right: 20,
    zIndex: 2,
  },
  playView: {
    width: '100%',
    height: '100%',
  },
  btnCon: {
    width: '100%',
    position: 'absolute',
    display: 'flex',
    bottom: 40,
    zIndex: 3,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  phoneCon: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: 'red',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10,
  },
  cameraCon: {
    width: 60,
    height: 60,
    borderRadius: 40,
    // backgroundColor: 'gainsboro',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10,
  },
  micCon: {
    width: 60,
    height: 60,
    borderRadius: 40,
    // backgroundColor: 'gainsboro',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  phoneImage: {
    width: 35,
    height: 35,
  },
});

const zegoConfig = {
  appID: 2064961917,
  userID: '',
  userName: '',
  roomID: 'gossipbookroom',
}

generateToken = async () => {
  let username = await AsyncStorage.getItem('username');
  zegoConfig.userID = username;
  zegoConfig.userName = username;
  const data = await fetch(`https://www.gossipsbook.com/api/voicecall/token/gossipbookroom/${username}/`, {
    method: 'GET',
    headers: {
      // 'Authorization': 'Token ' + this.props.route.params.accessToken 
      'Authorization': 'Token ' + (await AsyncStorage.getItem('token')),
    }
  });
  return await data.json();
};

export default class VideoCall extends Component {
  zegoPreviewViewRef;
  zegoPlayViewRef;
  cameraEnable = true;
  micEnable = true;
  state = {
    streamID: this.props.route.params.streamID,
    userID: this.props.route.params.userID,
    showHomePage: true,
    showPreview: false,
    showPlay: false,
  };

  constructor(props) {
    super(props);
    this.zegoPreviewViewRef = React.createRef();
    this.zegoPlayViewRef = React.createRef();
  }

  // Join room
  joinRoom = async () => {
    const token = (await generateToken()).token;
    // console.log('THIS IS TOKEN: ', token)
    ZegoExpressManager.instance()
      .joinRoom(zegoConfig.roomID, token, {
        userID: zegoConfig.userID,
        userName: zegoConfig.userName,
      })
      .then(result => {
        console.log('RESULT: ',result)
        if (result) {
          console.warn('Login successful');
          // console.warn('VIDEO CALL: ', zegoConfig);
          this.setState(
            {
              showHomePage: false,
              showPreview: true,
            },
            () => {
              console.log('SHOW LOCAL')
              ZegoExpressManager.instance().setLocalVideoView(findNodeHandle(this.zegoPreviewViewRef.current),);
              ZegoExpressManager.instance().setRemoteVideoView(this.state.userID, findNodeHandle(this.zegoPlayViewRef.current));
            },
          );
        } else {
          console.error('Login failed');
        }
      })
      .catch(() => {
        console.error('Login failed');
      });
  };

  // Switch camera
  enableCamera = () => {
    ZegoExpressManager.instance()
      .enableCamera(!this.cameraEnable)
      .then(() => {
        this.cameraEnable = !this.cameraEnable;
        this.setState({
          showPreview: this.cameraEnable,
        });
      });
  };

  // Switch microphone
  enableMic = () => {
    ZegoExpressManager.instance()
      .enableMic(!this.micEnable)
      .then(() => {
        this.micEnable = !this.micEnable;
      });
  };

  // Leave room
  leaveRoom = () => {
    this.setState({
      showHomePage: true,
      showPreview: false,
      showPlay: false,
    });
    ZegoExpressManager.instance().leaveRoom().then(() => {
      console.warn('Leave successful');
      this.props.navigation.goBack();
    });
  };

  componentDidMount() {
    console.warn('componentDidMount: ', this.state.streamID);
    console.warn('componentDidMount: ', this.state.userID);
    this.setState({
      showHomePage: false,
      showPreview: true,
    }, () => {
      console.log('SHOW LOCAL')
      this.joinRoom();
      // ZegoExpressManager.instance().setLocalVideoView(findNodeHandle(this.zegoPreviewViewRef.current));
      // ZegoExpressManager.instance().setRemoteVideoView(this.state.userID, findNodeHandle(this.zegoPlayViewRef.current));
    });
  }

  componentWillUnmount() {
    console.warn('componentWillUnmount');
    // if (ZegoExpressEngine.instance()) {
    //   ZegoExpressEngine.destroyEngine();
    // }
  }

  render() {
    return (
      <View>
        <View
          style={[
            styles.callPage,
            this.state.showHomePage ? styles.hidePage : styles.showPage,
          ]}>
          <View
            style={[
              styles.preview,
              this.state.showPreview
                ? styles.showPreviewView
                : styles.hidePreviewView,
            ]}>
            <ZegoTextureView
              ref={this.zegoPreviewViewRef}
              // @ts-ignore
              style={styles.previewView}
            />
          </View>
          <View
            style={[
              styles.play,
              this.state.showPlay ? styles.showPlayView : styles.hidePlayView,
            ]}>
            <ZegoTextureView
              ref={this.zegoPlayViewRef}
              // @ts-ignore
              style={styles.playView}
            />
          </View>
          <View style={styles.btnCon}>
            {/* <TouchableOpacity
              style={styles.micCon}
              onPress={this.enableMic.bind(this)}>
                <Text>Mic</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              // style={styles.phoneCon}
              onPress={this.leaveRoom.bind(this)}>
              <Icon name="endcall" size={60} style={{ marginBottom: 30 }} />
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.cameraCon}
              onPress={this.enableCamera.bind(this)}>
                <Text>Cam</Text>
            </TouchableOpacity> */}
          </View>
        </View>
        <View style={{flex: 1, alignItems: 'center', position: 'absolute', top: 0, left: 0, right: 0}}>
          <Image style={{height: 100, width: 100, marginBottom: 20, marginTop: 50}} source={require('../../assets/images/user.png')} />
          <Text style={{color: 'white', fontSize: 17, marginBottom: 10}}>{this.state.userID}</Text>
        </View>
      </View>
    );
  }
}