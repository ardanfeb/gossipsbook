import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { CustomTabBar, Icon } from '../components';
import { config } from '../constants';

const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();
const SettingStack = createStackNavigator();
Stack.Navigator.defaultProps = {
  headerMode: 'none',
  mode: 'modal',
  initialRouteName: config.initialRouteName,
  gestureEnabled: false,
};

// Auth
import AuthFlow from '../pages/Auth/AuthFlow';
import Intro from '../pages/Init/Intro';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

// Home
import Home from '../pages/Home';
import Setting from '../pages/Home/Setting';
import Choose from '../pages/Home/Choose';
import GossipDetail from '../pages/Home/GossipDetail';
import Notification from '../pages/Home/Notification';
import Search from '../pages/Home/Search';
import SearchUsers from '../pages/Home/SearchUsers';
import FriendList from '../pages/Home/FriendList';
import SuggestionList from '../pages/Home/SuggestionList';
import Comment from '../pages/Home/Comment';
import CreatePost from '../pages/Home/CreatePost';
import FriendRequests from '../pages/Home/FriendRequests';
import TopGossipers from '../pages/Home/TopGossipers';
import GossipByUser from '../pages/Home/GossipByUser';
import FriendByUser from '../pages/Home/FriendByUser';

//Settings
import About from '../pages/Settings/About';
import Terms from '../pages/Settings/Terms';
import PrivacyPolicy from '../pages/Settings/PrivacyPolicy';
import Privacy from '../pages/Settings/Privacy';
import FeedBack from '../pages/Settings/FeedBack';
import Profile from '../pages/Settings/Profile';
import UserProfile from '../pages/Settings/UserProfile';
import Edit from '../pages/Settings/Edit';
import ChangePassword from '../pages/Settings/ChangePassword';
import FalseInformation from '../pages/Settings/FalseInformation';
import Chat from '../pages/Settings/Chat';
import VideoCall from '../pages/Settings/VideoCall';
import ChatList from '../pages/Settings/ChatList';
import Account from '../pages/Settings/Account';
import Interest from '../pages/Settings/Interest';
import CreateFeedBack from '../pages/Settings/CreateFeedBack';
import UserInfor from '../pages/Settings/UserInfor';
import { navigationRef } from './NavigationContainer';
import CreatePoll from '../pages/Home/CreatePoll';
import PollList from '../pages/Home/PollList';
import PollDetails from '../pages/Home/PollDetails';
import PollComments from '../pages/Home/PollComments';

// routes
class routes extends React.Component {
  render() {
    const BottomTabs = () => (
      <BottomTab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        initialRouteName="Home">
        <BottomTab.Screen name="Home" component={Home} />
        <BottomTab.Screen name="ChatList" component={ChatList} />
        <BottomTab.Screen name="Add" component={CreatePost} />
        <BottomTab.Screen name="Profile" component={Profile} />
        <BottomTab.Screen name="Setting" component={Setting} />
      </BottomTab.Navigator>
    );

    return (
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator>
          <Stack.Screen name="AuthFlow" component={AuthFlow} />
          <Stack.Screen name="Intro" component={Intro} />

          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />

          <Stack.Screen name="Main" component={BottomTabs} />
          <Stack.Screen name="Edit" component={Edit} />
          <Stack.Screen name="Choose" component={Choose} />
          <Stack.Screen name="GossipDetail" component={GossipDetail} />
          <BottomTab.Screen name="Edit Gossip" component={CreatePost} />
          <Stack.Screen name="Notification" component={Notification} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="SearchUsers" component={SearchUsers} />
          <Stack.Screen name="Add" component={CreatePost} />
          <Stack.Screen name="Create Poll" component={CreatePoll} />
          <Stack.Screen name="Polls" component={PollList} />
          <Stack.Screen name="Poll Details" component={PollDetails} />
          <Stack.Screen name="Poll Comments" component={PollComments} />

          <Stack.Screen name="About" component={About} />
          <Stack.Screen name="Terms" component={Terms} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
          <Stack.Screen name="Privacy" component={Privacy} />
          <Stack.Screen name="FeedBack" component={FeedBack} />
          <Stack.Screen name="UserProfile" component={UserProfile} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
          <Stack.Screen name="FalseInformation" component={FalseInformation} />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen name="VideoCall" component={VideoCall} />
          <Stack.Screen name="ChatList" component={ChatList} />
          <Stack.Screen name="Settings" component={Setting} />
          <Stack.Screen name="Account" component={Account} />
          <Stack.Screen name="Create Feedback" component={CreateFeedBack} />
          <Stack.Screen name="Friend List" component={FriendList} />
          <Stack.Screen name="SuggestionList" component={SuggestionList} />
          <Stack.Screen name="Comment" component={Comment} />
          <Stack.Screen name="Interest" component={Interest} />
          <Stack.Screen name="Friend Requests" component={FriendRequests} />
          <Stack.Screen name="UserInfor" component={UserInfor} />
          <Stack.Screen name="TopGossipers" component={TopGossipers} />
          <Stack.Screen name="GossipByUser" component={GossipByUser} />
          <Stack.Screen name="FriendByUser" component={FriendByUser} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export const Navigation = routes;
