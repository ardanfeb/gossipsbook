import { Dimensions } from 'react-native';

const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

export default {
  screenWidth,
  screenHeight,
};

export const shadow = { elevation: 5, shadowColor: "#aaaaaa", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 5 }