import React from 'react';
import {View, Text} from 'react-native';

import Touchable from '../Touchable';
import Icon from '../Icon';
import {colors} from '../../constants';

const QuestionItem = ({navigate, onVote, ...item}) => {
  return (
    <Touchable
      onPress={() => navigate(item.id)}
      key={item.id}
      w="100%"
      h={100}
      br={10}
      brw={0.5}
      brc={colors.gray}
      mt={20}>
      <Text
        numberOfLines={2}
        style={{
          height: 66,
          backgroundColor: '#eee',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          paddingLeft: 10,
          paddingTop: 10,
          textAlign: 'left',
          fontWeight: 'bold',
          fontSize: 20,
        }}>
        {item.title}
      </Text>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          position: 'absolute',
          bottom: 5,
          paddingLeft: 30,
        }}>
        <Touchable
          onPress={() => navigate('Answer')}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="answer" size={22} />
          <Text style={{marginLeft: 2}}>{item.answer}</Text>
        </Touchable>
        <Touchable
          onPress={() => onVote(item.id, true)}
          style={{flexDirection: 'row', marginLeft: 10, alignItems: 'center'}}>
          <Icon name={`up_${item.true ? '' : 'in'}active`} size={22} />
          <Text style={{marginLeft: 2}}>{item.answer}</Text>
        </Touchable>
        <Touchable
          onPress={() => onVote(item.id, false)}
          style={{flexDirection: 'row', marginLeft: 10, alignItems: 'center'}}>
          <Icon name={`down${item.false ? '_active' : ''}`} size={22} />
          <Text style={{marginLeft: 2}}>{item.answer}</Text>
        </Touchable>

        <View
          style={{
            marginLeft: 10,
            flexDirection: 'row',
            alignItems: 'center',
            position: 'absolute',
            right: 20,
          }}>
          <Icon name="comment" size={22} />
          <Text style={{marginLeft: 2}}>{item.comment}</Text>
        </View>
      </View>
    </Touchable>
  );
};

export default QuestionItem;
