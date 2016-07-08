import React, {Component} from 'react';
import ReactNative from 'react-native'
import styles from '../../styles/'

const {
  Text,
  View
  } = ReactNative;

export default class Title extends Component {
  render() {
    return (
      <View>
        <Text style={[styles.circeFont,{color: '#FFF' }]}>{this.props.text}</Text>
      </View>
    );
  }
}