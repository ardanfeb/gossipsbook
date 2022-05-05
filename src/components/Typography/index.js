import React from 'react';

import {Text as ReactText, Platform} from 'react-native';
import {colors} from '../../constants';

import Touchable from '../Touchable';

import {styler} from '../../helpers';

const iosStyle = Platform.OS === 'ios' ? {position: 'relative', top: 3} : {};

const Text = ({children, ...rest}) => {
  const style = styler(rest);

  return (
    <ReactText
      style={[
        iosStyle,
        {fontSize: 16, fontFamily: 'ProximaNova-Medium'},
        ...style,
      ]}
      {...rest}>
      {children}
    </ReactText>
  );
};

const SemiBold = ({children, ...rest}) => {
  const style = styler(rest);

  return (
    <ReactText
      style={[
        iosStyle,
        {fontSize: 16, fontFamily: 'ProximaNova-SemiBold'},
        ...style,
      ]}
      {...rest}>
      {children}
    </ReactText>
  );
};

const Bold = ({children, ...rest}) => {
  const style = styler(rest);

  return (
    <ReactText
      style={[
        iosStyle,
        {fontSize: 16, fontFamily: 'ProximaNova-Bold'},
        ...style,
      ]}
      {...rest}>
      {children}
    </ReactText>
  );
};

const Link = (props) => {
  const style = styler(props);

  return (
    <Touchable onPress={props.onPress} style={style}>
      <ReactText
        style={[
          iosStyle,
          {
            fontSize: 16,
            fontFamily: 'ProximaNova-SemiBold',
            color: props.color || colors.link,
          },
          props.textStyle,
        ]}>
        {props.children}
      </ReactText>
    </Touchable>
  );
};

export default {
  Text,
  SemiBold,
  Bold,
  Link,
};
