import React from 'react'
import validator from 'validator'

import { View, Text , TextInput , TouchableHighlight , AsyncStorage, Image } from 'react-native'

import Api from '../../api'
import styles from '../../styles/'

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email : '',
      password : '',
      loading : false
    }
  }

  async setToken(token) {
    await AsyncStorage.setItem('token' ,token);
    this.props.navigator.push({name : 'Main'})
  }

  loginAttempt() {

    let email = this.state.email;
    let password = this.state.password;

    const EMAIL_CHECK = validator.isEmail(email);
    const PASS_CHECK = password.length > 5 && password.length < 10;

    if(!EMAIL_CHECK) {
      alert('Please enter valid a email')
    }
    else if(!PASS_CHECK) {
      alert('Password must be from 6 to 10')
    }
    if(EMAIL_CHECK && PASS_CHECK) {

      Api.login(email,password, (answer) => {
        if(typeof answer === 'string'){
          this.setToken(answer)
        } else {
          alert(answer.message)
        }
      })
    }
  }

  signAttempt() {
    this.props.navigator.push({name : 'SignCheck'})
  }

  render() {
    return (
      <View>
          <View style={styles.logoHolder}>
            <Image source={require('../../img/logo_android_1x.png')}/>
          </View>

        <View style={styles.inputHolder}>
          <TextInput  style={styles.circeFont}
                      underlineColorAndroid={'#fff'}
                      placeholderTextColor="#E9E8E8" placeholder="Email"
                       onChangeText={(value) => this.setState({email : value})}/>
        </View>
        <View style={styles.inputHolder}>
          <TextInput  style={styles.circeFont}
                      underlineColorAndroid={'#fff'}
                      placeholderTextColor="#E9E8E8"
                      placeholderStyle={styles.circeFont}
                      secureTextEntry={true}
                      placeholder="Password"
                      onChangeText={(value) => this.setState({password : value})}/>
        </View>
        <TouchableHighlight style={styles.buttons} onPress={this.loginAttempt.bind(this)}>
          <Text style={styles.buttonText}>
            zzzrt
          </Text>
        </TouchableHighlight>

        <View style={styles.container}>
          <Text style={[styles.circeFont, {fontSize : 22}]}>
            First Time Here ? <Text style={[styles.circeFont, {color : 'rgb(41,39,39)'}]} onPress={this.signAttempt.bind(this)}>Sign Up</Text>
          </Text>
        </View>
      </View>
    )
  }
}

export default Login