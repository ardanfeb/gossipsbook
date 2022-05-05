import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';

import { Touchable, Icon } from '../../components';
import { colors } from '../../constants';

const About = ({ navigation }) => {
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
          color: '#444',
        }}>
        About us
      </Text>

      <CustomerTerms />

    </ScrollView>
  );
};

export default About;

const styles = StyleSheet.create({
  auth_btn: {
    marginTop: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: colors.primary,
    width: '100%',
    height: 60,
    justifyContent: 'center',
  },

  text: {
    padding: 10,
    paddingBottom: 0,
    color: "#444",
    textAlign: 'justify'
  },

  header: {
    padding: 10,
    paddingBottom: 0,
    color: "#444",
    fontSize: 18,
    fontWeight: 'bold'
  }
});




const CustomerTerms = () => (
  <View>
    <Text style={styles.text}>
      Gossipsbook is a social network that which shares the true information. Any person can sign up with the legitimate credentials and they could Gossip whatever by using selecting the Interest.{'\n\n'}

      Other Users who're following the interests or following the user, they will receive the Gossips and they can reply on that Gossips whether the shared facts is actual or false. And they can also click the objection button for the Gossips that which they suppose the shared Gossip is biased.{'\n'}
      Users can also find the percentage bar in every Gossips submit which the Percentage bar indicates what the general public thinking on that gossip. And in each user profile there could be a percent that suggests approximately the truth information shared through the user.{'\n'}
      You are free to go along with us in this awesome stage and you will see additional intriguing items from Gossipsbook.{'\n\n'}

      Remain with us...
    </Text>
  </View>
)

