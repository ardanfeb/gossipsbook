import React from 'react';
import { Platform, ActivityIndicator } from 'react-native';

// import styled from 'styled-components'

import Typography from '../Typography';
import Touchable from '../Touchable';

import { layout, colors } from '../../constants';
import { styler } from '../../helpers';

const { screenWidth } = layout;
const { SemiBold } = Typography;

const backgrounds = {
  disabled: colors.gray,
  primary: colors.darkGreen,
  error: colors.darkRed,
};

const shadows = {
  disabled: 'rgba(171,180,189,0.15)',
  primary: 'rgba(106,193,172,0.15)',
};

export default function CustomButton(props) {
  // const bg = (props.type in backgrounds) ? backgrounds[props.type] : backgrounds['primary']
  // const shadow = (props.type in shadows) ? shadows[props.type] : shadows['primary']
  const bg = props.loading ? backgrounds.disabled : backgrounds.primary;
  const shadow = props.loading ? shadows.disabled : shadows.primary;

  const platformSpecificStyle =
    Platform.OS === 'ios'
      ? {
          shadowOpacity: 0.9,
          elevation: 20,
          shadowColor: shadow,
          shadowOffset: { width: 0, height: 9 },
        }
      : {};

  const style = styler(props, {
    ...platformSpecificStyle,
    backgroundColor: props.bg || bg,
  });

  return (
    <Touchable
      w={screenWidth - 60}
      br={4}
      p={12}
      onPress={props.loading ? null : props.onPress}
      style={[style, { flexDirection: 'row', justifyContent: 'center' }]}>
      {props.loading && (
        <ActivityIndicator
          size="small"
          color={colors.white}
          style={{ marginRight: 14 }}
        />
      )}
      <SemiBold asc color="#fff" fs={16}>
        {props.label}
      </SemiBold>
    </Touchable>
  );
}
