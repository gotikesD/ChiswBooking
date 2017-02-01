import React from 'react'

import { View, Text ,TextInput , AsyncStorage , TouchableHighlight , Image } from 'react-native'
import Api from '../../api'
import styles from '../../styles/'
import validator from 'validator'

class SignCheck extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email : ''
    }
  }

  async setEmail(user) {
    await AsyncStorage.setItem('user', JSON.stringify(user));
    this.props.navigator.push({name : 'SignPassword'})
  }

  emailCheck() {
    let email = this.state.email;
    const EMAIL_CHECK = validator.isEmail(email);
    if(!EMAIL_CHECK) {
      alert('Please enter valid email')
    } else {
      Api.check(email, (answer) => {
        console.log(answer)
        if(answer.firstName) {
          this.setEmail(answer)
        } else {
          alert(answer.message)
        }
      })
    }
  }

  render() {

    return(
      <View>
        <View style={[styles.logoHolder, {marginBottom : 45}]}>
          <Image source={require('../../img/logo_android_1x.png')}/>
        </View>
        <View style={[styles.container, {marginBottom: 32}]}>
          <Text style={[styles.circeFont, {fontSize : 20}]}>Lets verify your corporate email</Text>
        </View>
        <View style={styles.inputHolder}>
          <TextInput  style={[styles.circeFont , styles.input]}
                      underlineColorAndroid={'#fff'}
                      placeholderTextColor="#E9E8E8" placeholder="Email"
                      placeholderStyle={styles.circeFont} onChangeText={(value) => this.setState({email : value})}/>
        </View>
        <TouchableHighlight style={styles.buttons} onPress={this.emailCheck.bind(this)}>
          <Text style={styles.buttonText}>
            SEND
          </Text>
        </TouchableHighlight>
      </View>
    )
  }
}

export default SignCheck