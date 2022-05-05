import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Touchable, Icon } from '../../components';
import { colors } from '../../constants';

const Privacy = ({ navigation }) => {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.white, paddingHorizontal: 20 }}
      contentContainerStyle={{ paddingBottom: 20 }}
      bounces={false}
      showsVerticalScrollIndicator={false}>
      <Touchable
        onPress={() => navigation.goBack()}
        jc
        ac
        size={40}
        br={20}
        absolute
        top={10}
        left={0}
        brc="#555"
        brw={1}>
        <Icon name="back" size={18} />
      </Touchable>

      <Text
        style={{
          alignSelf: 'center',
          marginTop: 15,
          fontSize: 24,
          fontWeight: 'bold',
          color: '#000',
        }}>
        Privacy
      </Text>

      <Text
        style={{
          marginTop: 30,
          fontSize: 20,
          fontWeight: 'bold',
          borderBottomWidth: 2,
          borderColor: colors.black,
        }}>
        Notifications
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <Icon name="radio_active" size={16} />
        <Text style={{ marginLeft: 10, fontSize: 18, paddingRight: 8 }}>
          Receive notifications only from the selected interests
        </Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <Icon name="radio_active" size={16} />
        <Text style={{ marginLeft: 10, fontSize: 18, paddingRight: 8 }}>
          Receive notifications only from the accepted requests
        </Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <Icon name="radio_active" size={16} />
        <Text style={{ marginLeft: 10, fontSize: 18, paddingRight: 8 }}>
          Notifications off
        </Text>
      </View>

      <Text
        style={{
          marginTop: 30,
          fontSize: 20,
          fontWeight: 'bold',
          borderBottomWidth: 2,
          borderColor: colors.black,
        }}>
        Friend Requests
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <Icon name="radio_active" size={16} />
        <Text style={{ marginLeft: 10, fontSize: 18, paddingRight: 8 }}>
          Receive friend requests from all the gossipers
        </Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <Icon name="radio_active" size={16} />
        <Text style={{ marginLeft: 10, fontSize: 18, paddingRight: 8 }}>
          Receive friend requests only from the friends of friends
        </Text>
      </View>

      <Text
        style={{
          marginTop: 30,
          fontSize: 20,
          fontWeight: 'bold',
          borderBottomWidth: 2,
          borderColor: colors.black,
        }}>
        Gossiping Preferences
      </Text>

      <Text style={{ marginTop: 10, fontSize: 20, fontWeight: 'bold' }}>
        Who do gossiping with you?
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <Icon name="radio_active" size={16} />
        <Text style={{ marginLeft: 10, fontSize: 18, paddingRight: 8 }}>
          Anyone on Gossipingsbook
        </Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <Icon name="radio_active" size={16} />
        <Text style={{ marginLeft: 10, fontSize: 18, paddingRight: 8 }}>
          People who I accepted the requested can only do the gossiping
        </Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <Icon name="radio_active" size={16} />
        <Text style={{ marginLeft: 10, fontSize: 18, paddingRight: 8 }}>
          No one
        </Text>
      </View>

      <Text
        style={{
          marginTop: 30,
          fontSize: 20,
          fontWeight: 'bold',
          borderBottomWidth: 2,
          borderColor: colors.black,
        }}>
        Comment Preferences
      </Text>

      <Text style={{ marginTop: 10, fontSize: 20, fontWeight: 'bold' }}>
        Who can do Comments on your gossips?
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <Icon name="radio_active" size={16} />
        <Text style={{ marginLeft: 10, fontSize: 18, paddingRight: 8 }}>
          Anyone on Gossipingsbook
        </Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <Icon name="radio_active" size={16} />
        <Text style={{ marginLeft: 10, fontSize: 18, paddingRight: 8 }}>
          People who I accepted the requested can only do the gossiping
        </Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
        <Icon name="radio_active" size={16} />
        <Text style={{ marginLeft: 10, fontSize: 18, paddingRight: 8 }}>
          No one
        </Text>
      </View>

      <Touchable asc mt={50} bg={colors.darkred} p={20} br={20}>
        <Text style={{ color: colors.white, fontSize: 18, fontWeight: 'bold' }}>
          Delete Account
        </Text>
      </Touchable>
    </ScrollView>
  );
};

export default Privacy;
