import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';

import { Touchable, Icon } from '../../components';
import { colors } from '../../constants';

const PrivacyPolicy = ({ navigation }) => {
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
        Privacy Policy
      </Text>

      <CustomerTerms />

    </ScrollView>
  );
};

export default PrivacyPolicy;

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

  headerInline: {
    padding: 10,
    paddingBottom: 0,
    color: "#444",
    textAlign: 'justify',
    fontWeight: 'bold'
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
    <Text style={[styles.header, { fontSize: 24 }]} >Privacy Policy</Text>
    <Text style={styles.text}>
      Gossipsbook India Pvt. Ltd. (Company, We, Our, Us) considers privacy very sincerely. This privacy policy represents how the company uses the data and personal information and describes the rights you would gain with this application.{'\n\n'}
      This Privacy Policy is in accordance with the present rules and regulations about our services.{'\n\n'}
      By using the website or application, you agree with the Privacy Policy of the Gossipsbook application.
    </Text>

    <Text style={styles.header} >1) Scope:</Text>
    <Text style={[styles.text]}>
      1.1 This privacy policy applies to the services on any application related to this Gossipsbook application. So regardless of whether you use it on an online website or download the application on your mobile phone or any computer device for our services, it applies to you.{'\n\n'}
      1.2 Gossipsbook is a social media platform. The users accept the policy that any content they post (including their handles, profiles, pictures, and posts) would be available publicly and searchable globally. It would be advised that the users must not post any sensitive and personal information on the application, which might hinder our policies. You must be careful about what you post, as the updates in the application would be visible to all who use our services.{'\n\n'}
      1.3 You accept and acknowledge that when you provide content to the Gossipsbook application, you are given authority to disclose that information and widely circulate it. If you are using third-party APIs, you must be familiar with their policies, and therefore, you must ensure it.
    </Text>

    <Text style={styles.header} >2) Information We Collect:</Text>
    <Text style={styles.text}>
      2.1 During the registration process, we will certain identity details (as mentioned by law); some of the identity details would be mandatorily collected on your consent and discretion.{'\n\n'}
      2.2 The information which you would provide us mandatorily are:{'\n\n'}
      a. Name: During the process of registration or creation of the profile.{'\n\n'}
      b. Email: It would be required for profile mapping, identification, communication, and authentication through OTP.{'\n\n'}
      c. Date of Birth: It is merely for identification.{'\n\n'}
      d. Location: To create a profile.{'\n\n'}
      e. Profile Picture: To create a profile.{'\n\n'}
      f. Gender: To create a profile.{'\n\n'}
      g. The language you prefer to communicate with the world.
    </Text>

    <Text style={styles.text}>
      <Text style={styles.headerInline} >2.3 During the process of profile verification: </Text>
      For the verification purpose, we collect information about your identity:{'\n\n'}
      a. Mobile Number{'\n\n'}
      b. Any other information or government-issued document.{'\n\n'}
      This information is required only when you desire to become an authenticated member of our application. This policy would not be shared with anyone.
    </Text>

    <Text style={styles.text}>
      <Text style={styles.headerInline} >2.4 Third Party Information: </Text>
      When you link your account to any other social media platform to the Gossipsbook application, we will collect the third-party services information.
    </Text>

    <Text style={styles.text}>
      <Text style={styles.headerInline} >2.5 Information while you use our services: </Text>
      When you use our application, the following are the contents we will collect:{'\n\n'}
      a. Content you post (images, texts, graphics, visuals, audios, etc.){'\n\n'}
      b. Users whom you follow and who follow you.{'\n\n'}
      c. People whom you visited or who visited your account.{'\n\n'}
      d. Information about your IP address, browsing history, cookies and browsers, and server information.{'\n\n'}
      e. Time Stamps, browsing history, and URL information.{'\n\n'}
      f. Your Information about Device.{'\n\n'}
      g. Date on which you install the application and uninstall it.{'\n\n'}
      h. Your chat users and whom you sent a request for chats.{'\n\n'}
      i. Language.
    </Text>

    <Text style={styles.text}>
      <Text style={styles.headerInline} >2.7 Surveys: </Text>
      You can collect other information like the one you reply to any feedback, surveys, or email. With this activity, we collect data like mobile number, email id, name, location, and other information you provide us to share with us.
    </Text>

    <Text style={styles.header} >3) Why do we collect this information:</Text>
    <Text style={styles.text}>
      3.1 It helps us identify the authorized users; when you log in to our account, it signals that you are an authentic user when you provide the required details.{'\n\n'}
      3.2 It helps us to provide quality services to our users.{'\n\n'}
      3.3 With the location information helps us to provide location-based services to the users when required.{'\n\n'}
      3.4 For contractual and legal dealings.{'\n\n'}
      3.5 It also helps us to communicate with you.{'\n\n'}
      3.6 To provide the required services to you.
    </Text>

    <Text style={styles.header} >4) When we share your information:</Text>
    <Text style={styles.text}>
      4.1 The application may share information with the trusted partners or third party only with them who provide us with the infrastructure support or those who meet the obligations. We may also share the details with our aggregators or publishers who provide the services to the application. For this purpose, we will take your consent before sharing it with third-party users.{'\n\n'}
      4.2 The application might also share the information in case of customer research or surveying your interests.{'\n\n'}
      4.3 We may also share your information to market to you as per the law and guidelines when required.
    </Text>

    <Text style={styles.header} >5) Rights of Users on Gossipsbook:</Text>
    <Text style={styles.text}>
      1.Accessibility: You hold the right to accessibility on our services. You can also have access to the third-party information with whom we share your details.{'\n\n'}
      2. Modification: You can modify your details for more accuracy.{'\n\n'}
      3. Cancellation: You can cancel unnecessary personal data. It may lead to further legal processing.{'\n\n'}
      4. Objection: You can withdraw the right to access the information at any time you may seem to.
    </Text>

    <Text style={styles.header} >6) How long we store your data:</Text>
    <Text style={styles.text}>
      6.1 With respect to personal information, we store your data for a pre-determined period as allowed by: a) Statutory and Legal guidelines. And b) industrial policies.{'\n\n'}
      6.2 We will retain the data no longer than it is required by law. If, in any case, we would be supposed to maintain your information, we would take your prior consent.{'\n\n'}
      6.3 Although we may retain or archive your data for legal purposes, we would delete your information when you request you to do so.
    </Text>

    <Text style={styles.header} >7) Opting Out:</Text>
    <Text style={styles.text}>
      7.1 You might always opt out of our services when you think to do so. For example, you may choose not to disclose your information with us. However, by using opt-out information, you may not be able to use our services' complete functionalities or features.{'\n\n'}
      7.2 We have the right to keep a copy of your personal information as allowed by law.
    </Text>

    <Text style={styles.header} >8) Security of Information:</Text>
    <Text style={styles.text}>
      8.1 The data is maintained in an electronic form. However, your data will be public as posted by you.
    </Text>

    <Text style={styles.header} >9) Children:</Text>
    <Text style={styles.text}>
      9.1 You must be of the age of majority to use the application or our services. If you are a minor, your accessibility to our services must be monitored by the adult.{'\n\n'}
      10.2 As a guardian or parent, you must ensure that your minor should not share their details with the application. If, in any case, we get the minor's personal information, you authorize us to use or process the minor data and agree with the privacy policies.
    </Text>

    <Text style={styles.header} >10) Personal Data of others:</Text>
    <Text style={styles.text}>
      11.1 In any case, if you share the personal data of others, you represent and warrant that you have taken their consent to be disclosed with us.
    </Text>

    <Text style={styles.header} >11) Changes to Privacy Policy:</Text>
    <Text style={styles.text}>
      12.1 As per the changing laws, we modify or change the privacy policy. Any changes to the policies will be notified to you. You will be supposed to read and accept the new changes in the policies.
    </Text>

    <Text style={styles.header} >12) Grievance Redressal Mechanism:</Text>
    <Text style={[styles.text, { fontWeight: 'bold' }]}>
      P. Sai Krishna{'\n\n'}
      Grievance Officer{'\n\n'}
      Gossipsbook India Pvt Ltd
    </Text>
    <Text style={styles.text}>
      For any grievance redressal, as per the new IT rules 2021, you can contact us at
    </Text>
    <Text style={[styles.text, { fontWeight: 'bold', textDecorationLine: 'underline' }]}>
      Approach@gossipsbook.com.
    </Text>

    <Text style={styles.header} >13) Contact:</Text>
    <Text style={[styles.text, { fontWeight: 'bold' }]}>
      Gossipsbook{'\n\n'}
      Gossipsbook India Pvt Ltd{'\n\n'}
      H-16/1326-KH  NO-1044  NA NEW DELHI - 110062
    </Text>
  </View>
)

