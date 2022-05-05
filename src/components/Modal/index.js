import React, { useState } from 'react';

import { Modal, View, ImageBackground, Text } from 'react-native';

// import styled from 'styled-components'
// import Typography from '../Typography'
import { colors, layout } from '../../constants';
import { Button, Icon } from '../index';

const { screenWidth } = layout;
// const { Text, Bold } = Typography

function CustomModal(props) {
  return (
    <>
      <Modal
        transparent={props.transparent}
        animationType={props.animationType || 'fade'}
        visible={props.visible}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.65)',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {/* {props.children} */}

          {props.custom ? (
            props.children
          ) : (
            <>
              <ModalContent>
                {props.icon && (
                  <ImageBackground
                    // source={props.success ? require('../../assets/Icons/circle_green.png') : require('../../assets/Icons/circle_red.png')}
                    style={{
                      width: 140,
                      height: 140,
                      alignSelf: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Icon name={props.icon} size={50} top={-5} />
                  </ImageBackground>
                )}

                {props.title && <Title>{props.title}</Title>}

                {props.description && (
                  <Description>{props.description}</Description>
                )}

                <Button
                  w="60%"
                  asc
                  mt={40}
                  label={props.label}
                  type={props.success ? 'primary' : 'error'}
                  // style={{ width: '60%', alignSelf: 'center', marginTop: 40 }}
                  onPress={props.onPress}
                />
              </ModalContent>
            </>
          )}
        </View>
      </Modal>
    </>
  );
}

const ContentWrapper = (props) => (
  <View
    style={{
      position: 'relative',
      flex: 1,
      opacity: props.modalActive ? 0.4 : 1,
    }}
  />
);
const Title = (props) => (
  <Text
    style={{
      alignSelf: 'center',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 24,
      marginTop: 20,
      color: colors.black,
    }}>
    {props.children}
  </Text>
);
const Description = (props) => (
  <Text
    style={{
      fontSize: 16,
      width: screenWidth - 100,
      color: '#ABB4BD',
      lineHeight: 23,
      alignSelf: 'center',
      justifyContent: 'center',
      marginTop: 20,
      textAlign: 'center',
    }}>
    {props.children}
  </Text>
);
const Circle = () => (
  <View
    style={{
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      width: 100,
      height: 100,
      borderRadius: 5,
      padding: 10,
    }}
  />
);
const ModalContent = (props) => (
  <View
    style={{
      backgroundColor: colors.white,
      width: screenWidth - 40,
      paddingVertical: 20,
      paddingHorizontal: 20,
      borderRadius: 5,
      alignSelf: 'center',
    }}>
    {props.children}
  </View>
);

CustomModal.ContentWrapper = ContentWrapper;
CustomModal.Title = Title;
CustomModal.Description = Description;
CustomModal.Circle = Circle;
CustomModal.Content = ModalContent;

export default CustomModal;
