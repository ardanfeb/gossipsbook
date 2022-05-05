import React from 'react';
import {Image, Platform, View as RNView, Text} from 'react-native';

// import styled from 'styled-components'

import {Typography} from '../index';
import {layout, config, colors} from '../../constants';
// import { styler } from '../../helpers'

// const { Text } = Typography

export function Item(props) {
  const style = {
    marginHorizontal: 6,
    backgroundColor: props.bg || colors.navyBlue,
  };

  return <View style={style}>{props.children}</View>;
}

export function Left(props) {
  let style = {
    position: 'absolute',
    left: 10,
    backgroundColor: props.bg || colors.navyBlue,
  };

  if (props.children.length > 1) {
    style.flexDirection = 'row';
    style.justifyContent = 'space-between';
    style.alignItems = 'center';
  }

  return <RNView style={style}>{props.children}</RNView>;
}

export function Title(props) {
  const style = {
    fontFamily: 'ProximaNova-Medium',
    fontSize: 18,
    backgroundColor: props.bg || colors.navyBlue,
  };

  return <Text style={style}>{props.children}</Text>;
}

export function SubTitle(props) {
  const style = {
    backgroundColor: props.bg || colors.navyBlue,
  };

  return <Text style={style}>{props.children}</Text>;
}

export function Center(props) {
  const style = {
    position: 'absolute',
    left: layout.screenWidth / 2 - 75,
    alignItems: 'center',
    width: 150,
    backgroundColor: props.bg || colors.navyBlue,
  };

  return <RNView style={style}>{props.children}</RNView>;
}

export function Right(props) {
  let style = {
    position: 'absolute',
    right: 10,
    backgroundColor: props.bg || colors.navyBlue,
  };

  if (props.children.length > 1) {
    style.flexDirection = 'row';
    style.justifyContent = 'space-between';
    style.alignItems = 'center';
  }

  return <RNView style={style}>{props.children}</RNView>;
}

export default function Component(props) {
  return (
    <RNView
      style={[
        {
          backgroundColor: props.bg || colors.navyBlue,
          elevation: props.el ?? 0,
          position: 'relative',
          height: layout.screenHeight / 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          marginTop: props.mt,
          paddingTop: props.pt,
          width: '100%',
        },
        props.style,
      ]}>
      {props.children}
    </RNView>
  );
}
Component.Left = Left;
Component.Right = Right;
Component.Center = Center;

Component.Item = Item;

Component.Title = Title;
Component.SubTitle = SubTitle;
