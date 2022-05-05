import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  TouchableOpacity,
  Image,
  View,
  Text,
  useWindowDimensions,
} from 'react-native';
import { shadow } from '../constants/layout';

const PollItem = ({ item, narrow }) => {
  const windowDimensions = useWindowDimensions();
  const navigation = useNavigation();

  const onPress = () => {
    navigation.push('Poll Details', { item });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: narrow ? windowDimensions.width * 0.75 : null,
        borderWidth: 1,
        borderColor: '#eee',
        padding: 10,
        backgroundColor: 'white',
      }}>
      <View style={{ flexDirection: 'row', alignItem: 'center' }}>
        <Image
          style={{
            width: 50,
            height: 50,
            marginRight: 10,
            borderRadius: 75,
            borderWidth: 1,
            borderColor: 'white',
            ...shadow,
          }}
          source={
            item.user.profile.image
              ? { uri: item.user.profile.image }
              : require('../assets/defaultAvatar.jpeg')
          }
        />
        <View>
          <Text>{item.user.first_name || item.user.username}</Text>
          <Text>
            {item.user.designation}
            {item.user.designation ? ' - ' : ''}
            {new Date(item.date_published).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <View>
        <View style={{ flexDirection: 'row', paddingTop: 10 }}>
          <PhotoItem
            response={item.response_type.emoji}
            imageURL={item.photo1}
          />
          <View style={{ width: 10 }} />
          <PhotoItem
            response={item.response_type.emoji}
            imageURL={item.photo2}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PollItem;

const dummyPollItem = {
  id: 6,
  user: {
    username: 'raghav',
    email: 'Rahgav@gmail.com',
    first_name: '',
    last_name: '',
    profile: {
      bio: null,
      image: null,
    },
    designation: null,
    gossips_list_url:
      'https://www.gossipsbook.com/api/gossips/list-create/?username=raghav',
    author_url: 'https://www.gossipsbook.com/api/user/retrieve/raghav/',
    truth_speaking: null,
    is_friend: 'false',
    profession: null,
  },
  photo1:
    'https://storage.googleapis.com/gossipsbook_bucket/gossip/image/panda.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=gossips-book-service-account%40gossipsbook-website-project.iam.gserviceaccount.com%2F20220117%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20220117T215404Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=abc2da5e4a2c0965a6f243e7127f89de91283c2a5f947eb47bf63a150619ca0580edb2d316968c52aa13a8fa9989f97f5838e865ae30bb0dbc94410b166a642381486afce86f6f76fb76feac30a26246280ce98b59872d4300ea6b0a24a41fa18d7b36fa209855a00c5684e62e69ef3fef9dd49a02b9c5b98411526e71fd6f1fb5aaea0404aa0ec72b3ef04f37fcaae418415d28252343bdbffc539f1e08eff8a71b1299d64b7025bbf5efecb9f17babdb3384f40e2955cbc9c0ce766ba26168a2c0664aa970cf4397e4c852cde061d522b4fd9f78ce37db911c588009f1fe8d7d1db2e1fedd34fff8fe1c61b2db25dd3419c7db3d2ab3cedc711e9f11f7e144',
  photo2:
    'https://storage.googleapis.com/gossipsbook_bucket/gossip/image/swallow_bird.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=gossips-book-service-account%40gossipsbook-website-project.iam.gserviceaccount.com%2F20220117%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20220117T215404Z&X-Goog-Expires=86400&X-Goog-SignedHeaders=host&X-Goog-Signature=a4b0419866a9b05733c94aaf9b426f7a2d4f2106393af4f9c36e0975167a7e05eed827546f3da024d0a40dc584e8de85555d1453aae1ee4623662c497bbeaaaefb12c7d6a461b4fb402428ffe201cde44af25c4816918f836f971466bd28dbbddad7abd3b495a78ea2de4a035ff314c8c3112988d02eb94a5be579d4c02d765d0595e6713ac9894e27e6c68a7c360894a143668fb2a20719855fb4ae59b96c1ea4e16258aafe7955be50c8a3e06fc711e68dfe65951de35e03f45dbb1af903a6c9fb58ae2d1d5aff0c14df2559175f0aec9b4c6ddb1f4ee897fab07a786bf614cd26922d5041c78c8563952e4af190e1b3ab0c854750fbde437a647a678af9bb',
  friends_only: false,
  response_type: {
    id: 1,
    emoji: '❤',
  },
  date_published: '2022-01-10T13:05:17.049247Z',
  total_reactions: 0,
  total_comments: 0,
  already_voted: false,
};
const PhotoItem = ({ imageURL, response }) => {
  return (
    <View style={{ flex: 1 }}>
      <Image
        style={{
          height: 120,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#eee',
        }}
        source={{ uri: imageURL }}
      />
      <Text style={{ marginTop: -20, marginLeft: 10, fontSize: 22 }}>
        {response}
      </Text>
    </View>
  );
};
