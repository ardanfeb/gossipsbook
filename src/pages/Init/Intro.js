import React from 'react';
import {View, Text, ImageBackground, TouchableOpacity} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

import {Icon, layout} from '../../constants';

const {screenWidth, screenHeight} = layout;

const data = [
    {
        text: '1',
        image: require('../../assets/intro/12.png'),
    },
    {
        text: '2',
        image: require('../../assets/intro/13.png'),
    },
    {
        text: '3',
        image: require('../../assets/intro/14.png'),
    },
    {
        text: '4',
        image: require('../../assets/intro/15.png'),
    },
];

const Intro = ({navigation}) => {
    return (
        <View style={{flex: 1, backgroundColor: '#000080', padding: 20}}>
            <AppIntroSlider
                renderDoneButton={() => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                        style={{
                            alignSelf: 'center',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'white',
                            padding: 10,
                            borderRadius: 10,
                        }}>
                        <Text>Start</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.text}
                renderItem={({item}) => {
                    return (
                        <ImageBackground
                            resizeMode="contain"
                            style={{
                                flex: 1,
                            }}
                            source={item.image}></ImageBackground>
                    );
                }}
                data={data}
            />
        </View>
    );
};

export default Intro;
