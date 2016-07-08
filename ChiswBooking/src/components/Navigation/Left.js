import React, {Component} from 'react';
import ReactNative from 'react-native'
const {
  TouchableHighlight,
  Image,
  } = ReactNative;

export default class Left extends Component {

  back() {
    this.props.navigator.push({
      name: 'Main',
    })
  }

  render() {
    return (
      <TouchableHighlight onPress={this.back.bind(this)} style={{paddingTop : 8, marginLeft : 3}}>
        <Image source={require('../../img/1x/info-icons/arrow.png')}/>
      </TouchableHighlight>
    );
  }
}