import React from 'react'

import { View, Text ,TextInput , AsyncStorage , TouchableHighlight, Image } from 'react-native'
import Api from '../../api'
import styles from '../../styles'


class SignCheck extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      password: '',
      password2: '',
      firstName : '',
      secondName : '',
      loading : false,
      user : {}
    }
  }

  componentWillMount() {
    this.getUser()
  }

  async getUser() {
    let item = await AsyncStorage.getItem('user');
    let user = JSON.parse(item)
    this.setState({user: user})
    this.setState({firstName: user.firstName})
    this.setState({secondName: user.secondName})
  }

  async setToken(token) {
    await AsyncStorage.setItem('token', token);
    this.props.navigator.push({name: 'Main'})
  }


  signAttempt() {
    if (!this.state.password || !this.state.password2) {
      alert('Fill all fields')
    } else if (this.state.password !== this.state.password2) {
      alert('Different passwords!, Try Again')
    } else if(this.state.password.length < 6 || this.state.password.length > 10) {
      alert('Password must be from 6 to 10 long...')
    } else {

      let newUser = this.state.user;
      newUser.password = this.state.password;

      Api.sign(newUser, (answer) => {
        if (typeof  answer === 'string') {
          this.setToken(answer)
        } else {
          alert(answer.message)
        }
      })
    }
  }

  render() {
    return (
      <View>
        <View style={styles.logoHolder}>
          <Image source={require('../../img/logo_android_1x.png')}/>
        </View>
        <View style={styles.container}>
          <Text style={[styles.circeFont, {fontSize : 20} , {marginBottom : 20}]}>
            Hi, {this.state.firstName} {this.state.secondName}.
          </Text>
        </View>
        <View style={styles.container}>
          <Text style={[styles.circeFont, {fontSize : 20} , {marginBottom : 30}]}>
            Your account exists.
          </Text>
        </View>
        <View style={styles.inputHolder}>
          <TextInput  style={[styles.circeFont , styles.input]}
                      underlineColorAndroid={'#fff'}
                      placeholderTextColor="#D8D8D8"
                      placeholderStyle={styles.circeFont}
                      secureTextEntry={true}
                      placeholder="Password"
                      onChangeText={(value) => this.setState({password : value})}/>
        </View>
        <View style={styles.inputHolder}>
          <TextInput  style={[styles.circeFont , styles.input]}
                      underlineColorAndroid={'#fff'}
                      placeholderTextColor="#E9E8E8"
                      placeholderStyle={styles.circeFont}
                      secureTextEntry={true}
                      placeholder="Repeat password"
                      onChangeText={(value) => this.setState({password2 : value})}/>
        </View>
        <TouchableHighlight style={styles.buttons} onPress={this.signAttempt.bind(this)}>
          <Text style={styles.buttonText}>
            SEND
          </Text>
        </TouchableHighlight>
      </View>
    )
  }
}


export default SignCheck

