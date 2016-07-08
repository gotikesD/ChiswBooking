import React, {Component} from 'react';
import ReactNative from 'react-native'
import styles from '../../styles/'
const {
  TouchableHighlight,
  Text,
  } = ReactNative;

export default class Left extends Component {

  next() {
    this.props.navigator.push({
      name : 'RoomInfo',
      passProps: {
        data: this.props.room
      }
    })
  }

  render() {
    return (
      <TouchableHighlight onPress={this.next.bind(this)} style={{paddingTop :5, marginLeft : 3}}>
        <Text style={[styles.circeFont,{color: '#FFF' , marginRight : 3 ,}]}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}