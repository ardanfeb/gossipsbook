import React, { } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { colors } from '../../constants';
import { shadow } from '../../constants/layout';

const CustomBtn = ({ onPress, label }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginTop: 19,
        width: '90%',
        borderWidth: 0,
        borderColor: colors.gray,
        paddingVertical: 20,
        borderRadius: 20,
        backgroundColor: colors.white,
        ...shadow
      }}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 22,
          color: colors.black,
          opacity: 0.8,
          fontWeight: '700'
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

export default CustomBtn