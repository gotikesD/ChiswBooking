import React from 'react'

import { View, Text, TouchableOpacity } from 'react-native'

class NavButton extends React.Component {


  render() {
    return (
      <TouchableOpacity
        style={this.props.style}
        onPress={this.props.onPress}>
        <View>
          <Text style={this.props.textStyle}>
            {this.props.text}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}




export default NavButton
