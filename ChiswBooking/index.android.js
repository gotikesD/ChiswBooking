import Root from './src/root'

import  {
  AppRegistry
} from 'react-native';

console.disableYellowBox = true;

AppRegistry
  .registerComponent(
    'ChiswBooking'
    , () =>
      Root
  )
;
