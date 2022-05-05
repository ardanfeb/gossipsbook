import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';

import { Touchable, Icon } from '../../components';
import { colors } from '../../constants';

const Terms = ({ navigation }) => {
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
        Terms of Use
      </Text>

      <CustomerTerms />

    </ScrollView>
  );
};

export default Terms;

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
    <Text style={[styles.header, { fontSize: 24 }]} >Terms and conditions</Text>
    <Text style={styles.text}>
      We Gossipsbook India PVT. LTD. (Company, We, Our, Us) own, manage and operate the Gossipsbook application. The application provides you with the accessibility to but is not limited to the social media platform, sharing content and access to various contents you would like to. These terms and conditions guide your accessibility to our services on the online website, mobile application or in any capable format.{'\n\n'}
      While accessing, downloading or using our services, you abide by our terms and conditions, and you also give your consent to the Privacy Policy of the Gossipsbook application. Therefore, we request you review and familiarise yourself with these terms and conditions for your consent and accessibility of the services.{'\n\n'}
      If, in any case, you are not in sync with these terms and conditions, we would request you not to use or download this application in whatsoever case.{'\n\n'}
      The application would mean the mobile application of Gossipsbook through the downloaded form from the app store of any Android phone, iOS or any computer device.{'\n\n'}
      Content in your account means any text, information, image, data, audio, GIFs, profiles, tags, or any other component accessible to you or by other users or by us.{'\n\n'}
      You or User shall mean any registered user of the application. If you agree to the terms and conditions and use our services on your behalf and any other person's behalf, you agree that you bind by the authority to use the services.
    </Text>

    <Text style={styles.header} >1) Accessibility to our Services:</Text>
    <Text style={[styles.text, { marginBottom: -40 }]}>
      1.1 You must have attained the majority in the jurisdiction to get the accessibility of the services. The application may terminate your account if we find that you are defaulting with this condition.{'\n\n'}
      1.2 You are entirely responsible for using our services and undertake the laws, abide by them with strict adherence to the rules.{'\n\n'}
      1.3 The services provided to you are for personal use only, and they should not be shared for any commercial purposes.{'\n\n'}
      1.4 You are solely responsible for your account, and you adhere that you will not share your password with any third party. You will be solely responsible for the activities with your password and any actions taken under it, even if you authorise someone to do so or not. You will immediately inform the Gossipsbook application of any discrepancies in your password.{'\n\n'}
      1.5 The company has the authority to restrict the circulation of any content if it violates the privacy and terms and conditions of the application. The application has the power of suspend or terminate the account in case of breach of community guidelines.{'\n\n'}
      1.6 The application is committed to maintaining and upgrading its services for your better convenience. For the same reason, we reserve the right to make changes in the application for maintenance. In case any interruption occurs in a similar situation, we shall not bear any liability towards it.{'\n\n'}
      1.7 You must agree that you would not remove, circumvent, degrade or deactivate any of the application's services. You would not use any robot, scraper, spider, or other means to access our services. You would not disassemble our software, reverse engineer, or decompile any process accessible through our application. Upon that, you also agree not to post share any content that would thwart the application's functionality. We may terminate such an account if found in any fraudulent activities.{'\n\n'}
      1.8 You must not use others account or disparage or malign others account on indulging in anything.{'\n\n'}
      1.9 We do not have ownership of any of the content which you post in our application. As you post the content, you provide us with the non-exclusive rights to use, run, modify and share such content. Once you post the content, you might agree and offer us a warrant to do so.{'\n\n'}
      1.10 We are the intermediary platform mainly for social media interaction. Therefore, we are not responsible for user-generated content. If any such case occurs in a violation of intellectual property or copyright infringement, you must try to resolve it to the parties level itself. If you feel that there are copyright infringements to your content, you may contact Approach@gossipsbook.com{'\n\n'}
      1.11 We reserve entirely the right to modify, update, alter and amend these terms and conditions.{'\n\n'}
      1.12 The services of this application is protected by copyright, trademark and other laws. Therefore, you are not supposed to use any logo, trademarks, domain names, or features. These rights are entirely reserved for company usage only.{'\n\n'}
      1.13 Feedback to our services is free for our discretion.
    </Text>

    <Text style={styles.header} >2) Services:</Text>
    <Text style={styles.text}>
      2.1. You can create and maintain your account once the registration process is completed.{'\n\n'}
      2.2. You can share your content, reshare, connect and communicate with others.
    </Text>

    <Text style={styles.header} >3) Registration and integrity of account:</Text>
    <Text style={styles.text}>
      3.1 You can register with us with a free account and avail of the services.{'\n\n'}
      3.2 In the registration process, you need to provide us with the required details like email id, name and other information. Then, you can create your username and activate your account. Your account must be by our guidance. Your username must not be some derogatory content.{'\n\n'}
      3.3 You must undertake that the information which you provide is accurate and should not be misleading. The usernames must not be dealt with commercially to any parties.{'\n\n'}
      3.4 We have the reserved rights to terminate the account with or without notice of any breach of these terms.
    </Text>

    <Text style={styles.header} >4) Third-Party Services:</Text>
    <Text style={styles.text}>
      4.1 During the accessibility of our services, there might be advertisements to your account. We do not hold any rights to any third-party goods and services displayed in those advertisements. We do not review such third-party products, and therefore we request you to make informed choices while accessing these products of any third-party site.
    </Text>

    <Text style={styles.header} >5) Rules and Conduct:</Text>
    <Text style={styles.text}>
      5.1 You cannot access the services of our application without following and adhering to these guidelines.{'\n\n'}
      5.2 You may be prohibited to publish some derogatory contents, which might include:{'\n\n'}
      a. abusive content, sexually motivated or harmful content for minors and/or,{'\n\n'}
      b. the content must not hinder society's unity, integrity, and fraternity. It must adhere to the defence, security and sovereignty of India. It must not be against any public order or any statement that can cause incitement to public rage and/or,{'\n\n'}
      c. the content must not be invasive to anyone's privacy, hateful statement to any race, caste, creed, gender, or religion. It must not be encouraging or motivation any gambling or money laundering events and/or,{'\n\n'}
      d. the content must not infringe anyone's rights, copyrights, intellectual property, trademarks, or publicity rights and/or,{'\n\n'}
      e. may not be insensitive and brutal against any natural disaster, conflict, atrocity, or any tragic event and/or,{'\n\n'}
      f. harasses, threaten any third-party user including the depiction of violence or otherwise of any person, group of person, place or property or must not be inciting violence in any form and/or,{'\n\n'}
      g. sexually explicit content, inciting to violence, abusive and harmful in nature and/or,{'\n\n'}
      h. must abide by the law.{'\n\n'}
      5.2 The application, if brought under the notice about any infringement of the points mentioned above, we might disable such information and maintain it with us for 180 days for government presentation.
    </Text>

    <Text style={styles.header} >6) Support</Text>
    <Text style={styles.text}>
      6.1 The application supports email-based help for its users. You can contact us through Approach@gossipsbook.com and reach to us. We do not promise how must fast we will respond, or we may fix your problem. Any suggestion to the application would not be warranted to fulfil.{'\n\n'}
      6.2 We are the intermediary platform and therefore do not regulate the generated contents. Regulation of such grievance would be related to law and subjected to legal actions.
    </Text>

    <Text style={styles.header} >7) Termination:</Text>
    <Text style={styles.text}>
      7.1 The application have the right to suspend and terminate your accessibility to the application with or without notice as mentioned under the law.{'\n\n'}
      a. If you breach any law or terms.{'\n\n'}
      b. If the company is unable to verify or authenticate your profile.{'\n\n'}
      c. If the application has any ground of suspecting, fraudulent and abusive element.{'\n\n'}
      d. If the application believes that your account needs legal action due to contrast in the interests of company policies.{'\n\n'}
      e. As directed by law.{'\n\n'}
      7.2 Once terminated permanently or temporarily; the User will not use the application under the same account unless approved by the company.{'\n\n'}
      7.3 User has the right to appeal in case of suspension or termination of an account on Approach@gossipsbook.com
    </Text>

    <Text style={styles.header} >8) Indemnity</Text>
    <Text style={styles.text}>
      8.1 You should defend and hold the company and its subsidiaries, partners, and representatives from all liability, losses, or other expenses that emerge from{'\n\n'}
      a. Use or misuse of the services b. Violation of terms and services, contracts or policies. We reserve the right to control the matter, and you must assist and co-operate with us.
    </Text>

    <Text style={styles.header} >9) Limitations of Liabilities</Text>
    <Text style={styles.text}>
      The company (director, employees, agents, suppliers, resellers, licensors, providers) would not be liable to any legal or equitable theory of service:{'\n\n'}
      a. For any loss of profits, goodwill loss, data loss or opportunity or any indirect, special, incidental or punitive damage.{'\n\n'}
      b. For the reliance on our services.{'\n\n'}
      c. For any damages of upto INR 10,000.{'\n\n'}
      d. For any uncontrollable matter.
    </Text>

    <Text style={styles.header} >10) Governing law.</Text>
    <Text style={styles.text}>
      The laws of India shall govern this application agreement. Accordingly, all disputes arising out of these terms and conditions would be under the jurisdiction of India.
    </Text>

    <Text style={styles.header} >11) Miscellaneous</Text>
    <Text style={styles.text}>
      11.1. If any provision of the terms would be terminated, then the relevant term would not be enforceable, and the rest would be applicable as same.{'\n\n'}
      11.2. These terms are enforceable between you and Gossipsbook India PVT. Ltd.
    </Text>

    <Text style={styles.header} >12) Grievance Redressal Mechanism</Text>
    <Text style={styles.text}>
      The Grievance Officer would consider any complaint regarding these terms for any breach or Violation. You can also appeal against your case to the Grievance Officer. There shall be a complete endeavour to resolve the matter.{'\n\n'}
      P. Sai Krishna{'\n\n'}
      Grievance Officer{'\n\n'}
      Gossipsbook India Pvt Ltd.{'\n\n'}
      Mail to Approach@gossipsbook.com
    </Text>

    <Text style={styles.header} >13) Contact</Text>
    <Text style={styles.text}>
      You can contact us at Approach@gossipsbook.com
      Address: H-16/1326-KH  NO-1044  NA NEW DELHI - 110062
    </Text>
  </View>
)

