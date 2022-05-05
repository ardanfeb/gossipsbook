import React from 'react';
import { Image } from 'react-native';

import { icons as Icons } from '../../constants';

import { styler } from '../../helpers';

export default function Icon(props) {
  let { width, height } = props;

  if (props.size) {
    width = props.size;
    height = props.size;
  }

  const customStyle = styler(props);

  return (
    <Image
      source={props.name ? Icons[props.name] : { uri: props.source }}
      style={[
        {
          tintColor: props.color,
          width: width,
          height: height,
          resizeMode: props.resizeMode || 'contain',
        },
        customStyle,
        props.style,
      ]}
      onLoadStart={props.onLoadStart || null}
    />
  );
}
