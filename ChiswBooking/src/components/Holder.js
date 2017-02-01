import React from 'react'

import { View, Text , AsyncStorage , InteractionManager  } from 'react-native'

import Login from './Authorization/Login'
import Main from './MainPage/Main'
import styles from '../styles/'
import jwtDecode from  'jwt-decode'

class Holder extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      checkToken : null
    }
  }

  async  tokenCheck() {

    var socket = this.socket;
    try {

      let token = await AsyncStorage.getItem('token');
      if (token) {
        this.setState({checkToken : 'main'})
      } else {
        this.setState({checkToken : 'login'})
      }
    } catch (err) {
      console.warn(err.message);
    }
  }

   componentDidMount() {
     InteractionManager.runAfterInteractions(() => {
       this.tokenCheck()
     });
  }

  render() {

    if(!this.state.checkToken) {
      return (
        null
      )
    } else if(this.state.checkToken === 'main') {
      return(
        <View>
          <Main  navigator={this.props.navigator} />
        </View>

      )
    } else if (this.state.checkToken === 'login') {
      return(
        <View style={styles.authContainer}>
          <Login navigator={this.props.navigator} />
        </View>

      )
    }
  }
}




export default Holder