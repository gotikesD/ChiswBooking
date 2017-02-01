import React from 'react'
import Api from '../../api'
import jwtDecode from  'jwt-decode'
import Style from '../../styles'
import RoomHolder from './RoomHolder'
import styles from '../../styles/'
import Modal from 'react-native-simple-modal';

import {
  AppState,
  View,
  Text,
  AsyncStorage,
  ListView,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native'

import socket from '../../sockets';

class Main extends React.Component {

  constructor(props) {
    super(props);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
    this.state = {
      firstName : '',
      secondName : '',
      token : '',
      logout : false,
      currentUser : ''
    };
  }

  componentDidMount() {
    this.getToken();
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange)
  }

  handleAppStateChange(appState) {
    if (appState === 'background') {

      console.log('app is in background');
    }
  }

  async getToken() {
    let token = await AsyncStorage.getItem('token');
    if(token) {
      let { email, firstName, secondName } = jwtDecode(token)._doc;
      this.setState({
        currentUser : email,
        firstName : firstName,
        secondName : secondName,
        token : token
      });
    }
  }

   logout() {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiRemove(keys, (err) => {
        if(err) {
          console.log(err)
        } else {
          let loggedUser = this.state.currentUser;
          this.setState({currentUser : '', logout : true});
          this.props.navigator.push({name : 'Login'})
        }
      })
    });
  }

  openDialog() {
    Alert.alert(
      'Logout',
      'Logout modal window. Are you sure want logout ?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
        {text: 'OK', onPress: () => this.logout()},
      ]
    )
  }

  render() {
    socket.on('signForRoomFeedback', () => {
      alert('Sign for room feedback');
    })

    return (
      <View>
        <View style={{marginTop : 10, marginLeft : 25 , flexDirection : 'row'}}>
          <Image source={require('../../img/user_android2x.png')} style={{width : 29 , height : 29, marginRight: 10}}/>
          <Text style={[styles.circeFont, {fontSize : 20}]} onPress={this.openDialog.bind(this)}>
            Hi, {this.state.firstName} {this.state.secondName}
          </Text>
        </View>
        <View>
          <RoomHolder
            logout={this.state.logout}
            navigator={this.props.navigator}
            token={this.state.token}
            socket={socket} />
        </View>
      </View>
    )
  }
}

export default Main