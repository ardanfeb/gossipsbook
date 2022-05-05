import React from 'react';
import {ActivityIndicator, View} from 'react-native';

// import { View } from '../index'

import {colors} from '../../constants';

export default function Loading(props) {
  return (
    // <View h={props.h || null} ac jc flex={1} bg={colors.bg}>
    <View
      style={{
        height: props.h || '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: colors.bg || null,
      }}>
      <ActivityIndicator size={30} color={colors.black} />
    </View>
  );
}
