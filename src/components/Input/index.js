import React, {useState} from 'react';

import {TextInput, View} from 'react-native';

import {colors, config} from '../../constants';

import Icon from '../Icon';
import Touchable from '../Touchable';

import {Item, Input as NInput, Label as NLabel} from 'native-base';

const Input = (props) => {
  const [active, setActive] = useState(false);

  const width = props.rightIcon ? '90%' : '100%';

  const touchStart = () => {
    if (!active) {
      setActive(true);
    }
    if (props.onPress) {
      props.onPress();
    }
  };

  const onChangeText = (text) => {
    props.onChangeText(text);
  };

  const color = props.error
    ? colors.red
    : active
    ? props.activeColor || colors.black
    : props.color || colors.gray;

  return (
    <View
      style={[
        props.style,
        {
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 4,
          paddingBottom: 8,
        },
      ]}>
      {/* borderBottomColor: color, borderBottomWidth: .5 */}
      <Item floatingLabel style={{borderBottomWidth: 0, width}}>
        <NLabel style={{color: color}}>{props.label}</NLabel>
        {/* fontFamily: 'ProximaNova-Medium' */}
        <NInput
          autoCorrect={props.autoCorrect || false}
          autoCompleteType={props.autoCompleteType || null}
          spellCheck={props.spellCheck || false}
          autoCapitalize={props.autoCapitalize || null}
          disabled={props.disabled || null}
          multiline={props.multiline || null}
          keyboardType={props.keyboardType || null}
          placeholder={props.placeholder || null}
          placeholderTextColor={props.placeholderTextColor || colors.lightGray}
          onSubmitEditing={props.onSubmitEditing || null}
          returnKeyType={props.returnKeyType || null}
          returnKeyLabel={props.returnKeyLabel || null}
          maxLength={props.maxLength || null}
          ref={(ref) => (props.ref = ref)}
          getRef={(reff) => props.setRef && props.setRef(reff)}
          secureTextEntry={props.secureText || false}
          value={props.value}
          onChangeText={(text) => onChangeText(text)}
          onTouchStart={touchStart}
          onFocus={props.onFocus || null}
          onBlur={() => setActive(active)}
          blurOnSubmit={props.blurOnSubmit || null}
          textAlign={props.textAlign || null}
          style={[props.inputStyle, {left: -6, color: colors.black}]}
          contextMenuHidden={props.contextMenuHidden || null}
          autoFocus={props.autoFocus || null}
          numberOfLines={props.numberOfLines || null}
          textAlignVertical={props.textAlignVertical || null} // only Android
        />
      </Item>
      <Touchable style={{top: 6, right: 10}} onPress={props.rightAction}>
        <Icon name={props.rightIcon} size={props.rightIconSize || 20} />
      </Touchable>
    </View>
  );
};

export default Input;

// const Wrapper = styled.View`
//     flex-direction: row;
//     margin: 4px 0;
//     padding-bottom: 8px;
//     align-items: center;
//     border-bottom-width: 0.5px;
//     border-bottom-color: ${props => props.color};
// `
