import { View, Text, findNodeHandle } from 'react-native'
import React, {Component} from 'react'
import ZegoExpressEngine,{ZegoTextureView} from 'zego-express-engine-reactnative';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from '../../components';
import axios from 'axios';


export default class VideoCall extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: '',
      otherStream: '',
    }
  }

  async getData() {
    const res = await axios.get(
      'https://www.gossipsbook.com/api/current-user/profile/retrieve/',
    );
    const { data } = res;
    this.setState({
      user: data.username
    })
  };

  async componentDidMount() {
    await this.getData();
    this.callEngine();
    let intervalLogin = setInterval(() => {
      this.loginRoom();
      clearInterval(intervalLogin);
    }, 3000);
  }

  callEngine() {
    const profile = {
      appID : 2064961917,
      server : 'wss://webliveroom2064961917-api.zegocloud.com/ws',
      scenario : 0
    };
    
    ZegoExpressEngine.createEngineWithProfile(profile).then((engine) => {
      if(engine != undefined) {
        console.log("init sdk success");
      } else {
        console.log("init sdk failed");
        return false;
        // if(Platform.OS == 'android') {
        //   granted.then((data)=>{
        //     if(!data) {
        //       const permissions = [
        //         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        //         PermissionsAndroid.PERMISSIONS.CAMERA
        //       ]
        //       PermissionsAndroid.requestMultiple(permissions)
        //       }
        //   }).catch((err)=>{
        //     console.log("check err: " + err.toString())
        //   })
        // }
  
        // engine.getVersion().then((ver) => {
        //   console.log("Express SDK Version: " + ver)
        // });
      }
      
    });
  }

  async loginRoom() {
    let generateToken = '';
    await fetch(`https://www.gossipsbook.com/api/voicecall/token/gossipbookroom/${this.state.user}/`, {
      method: 'GET',
      headers: {
        'Authorization' : `Token ${this.props.route.params.accessToken}`
      }
    }).then(response =>{
      if (response.ok) {
        return response.json().then(json => {
          generateToken = json.token;
          this.setState({
            roomToken: json.token
          })
        })
      }
    }).catch(error => {
      console.log('error: ', error)
    })

    // log in to a room
    let roomConfig = { token: generateToken };
    console.log({
      user: this.state.user,
      roomConfig
    })
    await ZegoExpressEngine.instance().loginRoom('gossipbookroom', {'userID': this.state.user, 'userName': this.state.user}, roomConfig);
    
    ZegoExpressEngine.instance().on('roomStateUpdate', (roomID, state, errorCode, extendedData) => {
      console.log("JS onRoomStateUpdate: " + state + " roomID: " + roomID + " err: " + errorCode + " extendData: " + extendedData);
    }); ;
    
    ZegoExpressEngine.instance().on('roomUserUpdate', (roomID, updateType, userList) => {
      console.log({type: 'roomUserUpdate', roomID, updateType, userList})
    });
    
    ZegoExpressEngine.instance().on('roomStreamUpdate', (roomID, updateType, streamList) => {
      console.log({type: 'roomStreamUpdate', roomID, updateType, streamList})
      let streamName = streamList[0].streamID;
      // ZegoExpressEngine.instance().enableCamera(false);
      ZegoExpressEngine.instance().startPublishingStream(this.state.user);
      ZegoExpressEngine.instance().startPreview({"reactTag": findNodeHandle(this.refs.zego_preview_view), "viewMode": 0, "backgroundColor": 0});
      ZegoExpressEngine.instance().startPlayingStream(streamName, {
        "reactTag": findNodeHandle(this.refs.zego_play_view), 
        "viewMode": 0, 
        "backgroundColor": 0
      });
    });

  }

  componentWillUnmount() {
    // ZegoExpressEngine.instance().off('RoomStateUpdate');
    console.log('[LZP] destroyStream')
    ZegoExpressEngine.destroyEngine();
    // if(ZegoExpressEngine.instance()) {
    // }
    // ZegoExpressEngine.destroyStream();
    // ZegoExpressEngine.stopPublishingStream(this.state.user);
    // ZegoExpressEngine.stopPlayingStream(this.state.user);
  }
  
  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#000'}}>
        <ZegoTextureView 
          ref='zego_play_view' 
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
          }}
        />
        <ZegoTextureView 
          ref='zego_preview_view' 
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            height: 150,
            width: 80,
          }}
        />

        <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon name="endcall" size={55} style={{ marginBottom: 35 }} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

// import { View, Text, findNodeHandle } from 'react-native'
// import React, { useEffect, useState, useRef } from 'react'
// import ZegoExpressEngine,{ZegoTextureView} from 'zego-express-engine-reactnative';
// import { TouchableOpacity } from 'react-native-gesture-handler';
// import { navigationRef } from '../../navigation/NavigationContainer';

// const VideoCall = ({ route, navigation }) => {
//   const [user, setUser] = useState(route.params.userInfo);
//   const zego_play_view = useRef(findNodeHandle(zego_play_view));
//   const zego_preview_view = useRef(findNodeHandle(zego_preview_view));
  
//   const callEngine = async () => {
//     const profile = {
//       appID : 2064961917,
//       server : 'wss://webliveroom2064961917-api.zegocloud.com/ws',
//       scenario : 0
//     };
    
//     await ZegoExpressEngine.createEngineWithProfile(profile).then((engine) => {
//       if(engine != undefined) {
//         console.log("init sdk success");
//       } else {
//         console.log("init sdk failed");
//         return false;
//         // if(Platform.OS == 'android') {
//         //   granted.then((data)=>{
//         //     if(!data) {
//         //       const permissions = [
//         //         PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//         //         PermissionsAndroid.PERMISSIONS.CAMERA
//         //       ]
//         //       PermissionsAndroid.requestMultiple(permissions)
//         //       }
//         //   }).catch((err)=>{
//         //     console.log("check err: " + err.toString())
//         //   })
//         // }
  
//         // engine.getVersion().then((ver) => {
//         //   console.log("Express SDK Version: " + ver)
//         // });
//       }
//     });
//   }

//   const loginRoom = () => {
//     let roomConfig = {
//       token: "04AAAAAGJmRkgAEGNwazR0a28yNXU5dGgzYTUAsL6nzWYMC5S9fiKtXkAq3dzxEVBx4CzjeehugvX7sk31/m3vRkJ3stZZJ63pw8/XGQAhkctCh+FTpJBaUbcGRsrPrgwJEIKqZ7AbbYR+a24/Rqn1DwkmrrZQUdgp0Csjrxq9cqUKezw6UooF1ei0wWeAHa5d8Vm44Y2tekYBI+GFsRE6CKIjW5rrLTztdfMSFc1RO5/g0y8l2YnOe39GUzW/rRIrvsJlafexXs7Z5fnZ"
//     };

//     // log in to a room
//     // ZegoExpressEngine.enableCamera(false);
//     // ZegoExpressEngine.muteMicrophone(false);
//     ZegoExpressEngine.instance().loginRoom('testroom', {'userID': 'user_b', 'userName': 'user_b123'}, roomConfig);

//     ZegoExpressEngine.instance().on('roomStateUpdate', (roomID, state, errorCode, extendedData) => {
//       console.log("JS onRoomStateUpdate: " + state + " roomID: " + roomID + " err: " + errorCode + " extendData: " + extendedData);
//       // Callback for updates on the current user's room connection status. 
//       // When the current user's room connection status changes (for example, when the current user is disconnected from the room or login authentication fails), the SDK sends out the event notification through this callback.
//     }); ;
    
//     ZegoExpressEngine.instance().on('roomUserUpdate', (roomID, updateType, userList) => {
//       console.log({
//         type: 'roomUserUpdate',
//         roomID,
//         updateType,
//         userList
//       })
//       // Callback for updates on the status of other users in the room. 
//       // When other users join or leave the room, the SDK sends out the event notification through this callback.
//     });
    
//     ZegoExpressEngine.instance().on('roomStreamUpdate', (roomID, updateType, streamList) => {
//       console.log({
//         type: 'roomStreamUpdate',
//         roomID,
//         updateType,
//         streamList
//       })
//       // Callback for updates on the status of the streams in the room. 
//       // When new streams are published to the room or existing streams in the room stop, the SDK sends out the event notification through this callback.
//     });

//     ZegoExpressEngine.instance().startPublishingStream("stream_b");
//     ZegoExpressEngine.instance().startPreview({"reactTag": zego_preview_view, "viewMode": 0, "backgroundColor": 0});
//     ZegoExpressEngine.instance().startPlayingStream("stream_a", {
//       "reactTag": refs.zego_play_view, 
//       "viewMode": 0, 
//       "backgroundColor": 0
//     });
//   }

//   useEffect(async () => {
//     callEngine();
//     loginRoom();

//     return () => {
//       // ZegoExpressEngine.instance().off('RoomStateUpdate');
//       if(ZegoExpressEngine.instance()) {
//         console.log('[LZP] destroyEngine')
//         ZegoExpressEngine.destroyEngine();
//       }
//     }
//   }, [])
  
//   return (
//     <View>
//       <Text>{JSON.stringify(user.username)}</Text>
//       <ZegoTextureView 
//         ref={zego_preview_view}
//         style={{
//           position: 'absolute',
//           top: 0,
//           right: 0,
//           left: 0,
//           height: 200
//         }}
//       />
//       <ZegoTextureView 
//         ref={zego_play_view}
//         style={{
//           position: 'absolute',
//           top: 0,
//           right: 0,
//           left: 0,
//           height: 200,
//         }}
//       />
//     </View>
//   )
// }

// export default VideoCall