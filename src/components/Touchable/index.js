import React from 'react';

import {TouchableOpacity} from 'react-native';
import {config} from '../../constants';

import {styler} from '../../helpers';

export default function Touchable(props) {
  const style = styler(props);

  return (
    <TouchableOpacity
      disabled={props.disabled || null}
      activeOpacity={props.touchOpacity || config.touchOpacity}
      style={style}
      onPress={props.onPress}>
      {props.children}
    </TouchableOpacity>
  );
}
