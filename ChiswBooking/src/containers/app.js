import React from 'react'

import {Navigator, View } from 'react-native'

import Holder from '../components/Holder'
import Login from '../components/Authorization/Login'
import Main from '../components/MainPage/Main'
import SignCheck from '../components/Authorization/SignCheck'
import SignPassword from '../components/Authorization/SignPassword'
import SingleRoom from '../components/SingleRoom/CalendarSwipe'
import RoomInfo from '../components/SingleRoom/InfoPage'

import styles from '../styles/'

class App extends React.Component {


  renderScene(route, navigator){

    switch (route.name) {
      case 'Holder':
        return (
            <Holder navigator={navigator} />
        );
      case 'Login':
        return (
          <View style={styles.authContainer}>
            <Login navigator={navigator} />
          </View>
        );
      case 'Main':
        return (
          <Main navigator={navigator}/>
        );
      case 'SignCheck':
        return (
          <View style={styles.authContainer}>
            <SignCheck navigator={navigator} />
          </View>
        );
      case 'SignPassword':
        return (
          <View style={styles.authContainer}>
            <SignPassword navigator={navigator} />
          </View>
        );
      case 'SingleRoom':
        return (
          <SingleRoom navigator={navigator} {...route.passProps} />
        );
      case 'RoomInfo':
        return (
          <RoomInfo navigator={navigator} {...route.passProps}/>
        );
    }
  }

  render() {

    return (
      <Navigator initialRoute={{name: 'Holder'}}
                 renderScene={this.renderScene}
                 configureScene={() => Navigator.SceneConfigs.FadeAndroid}
      />
    )
  }
}

export default App