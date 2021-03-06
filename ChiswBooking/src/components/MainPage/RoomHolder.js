import React from 'react'
import { View, Text , AsyncStorage , ListView , TouchableWithoutFeedback, AppState , Image , TouchableOpacity , TouchableNativeFeedback } from 'react-native'
import Api from '../../api'
import jwtDecode from  'jwt-decode'
import moment from 'moment'
import config from '../../config/'
import styles from '../../styles/'

import LinearGradient from 'react-native-linear-gradient'

class RoomHolder extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      room: [],
      freeRooms: [],
      pressedRoom : {},
      pressedAction : false,
      pressedOption : false
    };
    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
  }

  singleRoom(room) {
    this.props.socket.emit('singleRoomPressed', {room});
    this.props.navigator.push({
      name: 'SingleRoom',
      passProps: {
        data: room,
        token: this.props.token
      }
    })
  }

  handleUpdate(callback) {
    Api.allRooms((rooms) => {
      this.getToken((token) => {
        let user = jwtDecode(token);
        let userId = user._doc._id;
        let free = []
        rooms.forEach((r)=> {
          r.users.forEach((u) => {
            if (u === userId) {
              r.own = true;
              r.pressed = false;
              if (r.status) {
                free.push(r.name)
              }
            }
          });

        });
        this.setState({freeRooms: free, room: rooms})

        callback('done')
      })
    });
  }



  signForRoom(roomId, own) {

    this.props.socket.emit('followRoom', {roomId, own})
    let user = jwtDecode(this.props.token);
    let userId = user._doc._id;
    //console.log('signing for room: ', roomId, " ", userId);
    //this.props.socket.emit('signForRoom', { roomId, userId });
    //this.props.socket.on('signForRoomSuccess', data => {
    //  console.log('data from socket: ', data);
    //  this.handleUpdate((info) => {
    //    this.clearPressed();
    //    alert('Now you follow this room');
    //  });
    //});

    if(!own) {
      this.props.socket.emit('signForRoom', {roomId, userId});
      this.props.socket.on('signForRoomSuccess', data => {
        this.handleUpdate((info) => {
          this.clearPressed();
          alert('Now you follow this room');
        });
      });
    }
    else {
      this.props.socket.emit('unsignForRoom', {roomId, userId});
      this.props.socket.on('unsignForRoomSuccess', data => {
        this.handleUpdate((info) => {
          this.clearPressed();
          alert('Now you unfollow this room');
        });
      });
    }
  }

  async getToken(callback) {
    let token = await AsyncStorage.getItem('token');
    callback(token)
  }

  componentWillMount() {
    this.props.socket.emit('roomHolder');

    //this.clearPressed();
    this.handleUpdate((info) => {})
  }

  //componentDidMount() {
  //  let self = this;
  //
  //  let update = setInterval(function() {
  //    Api.allRooms((rooms) => {
  //      self.getToken((token) => {
  //        let user = jwtDecode(token);
  //        let userId = user._doc._id;
  //        let free = []
  //        rooms.forEach((r)=> {
  //          r.users.forEach((u) => {
  //            if (u === userId) {
  //              r.own = true;
  //              r.pressed = false;
  //              if (r.status) {
  //                free.push(r.name)
  //              }
  //            }
  //          });
  //
  //        });
  //        self.setState({freeRooms: free})
  //        self.setState({room: rooms});
  //      })
  //    });
  //  } ,config.UPDATE_TIME);
  //
  //  if(this.props.logout) { clearInterval(update)}
  //}

  addTest(room) {
    let token = this.props.token;
    let roomId = room._id;

    switch (room.status) {
      case true :
        Api.addQuickMeeting(roomId, token, (answer) => {
          if (answer.message) {
            alert(answer.message)
          } else {
            this.handleUpdate((info) => {
              alert('You added new quick')
            })
          }
        });
        break;

      case false :
        Api.cancelQuickMeeting(roomId, token, (answer) => {
          if (answer.room) {
            this.handleUpdate((info) => {
              alert('You canceled your quick meeting')
            });
          } else {
            alert('You cant do this!')
          }
        });
      default :
        break;
    }
  }

  roomPress(rowData) {

    let updateRoom = this.state.room.map((r) => {
      if(rowData._id === r._id) {
        r.pressed = true
      }
      return r;
    });

    this.setState({pressedRoom : rowData, pressedAction : true, room : updateRoom});
  }

  clearPressed() {

    let room = this.state.pressedRoom;
    let updateRoom = this.state.room.map((r) => {
      if(room._id === r._id) {
        r.pressed = false
      }
      return r;
    });
    this.setState({room : updateRoom, pressedAction : false});
  }

  infoPage(room) {
    console.log('info page pressed');
    this.props.socket.emit('infoPagePressed', {room});
    this.props.navigator.push({
      name: 'RoomInfo',
      passProps: {
        data: room
      }
    })
  }

  render() {

    return (
      <View>

        <ListView
          contentContainerStyle={styles.listView}
          dataSource={
          this.ds.cloneWithRows(this.state.room)
      }
          enableEmptySections={true}
          renderRow={(rowData) => {
            return (
            <View>
                <TouchableWithoutFeedback
                  onLongPress={this.addTest.bind(this,rowData)}
                  onPress={this.roomPress.bind(this,rowData)}
                 >
                  <LinearGradient colors={rowData.status ? ['#fff', '#fff'] : ['rgb(249,161,96)', 'rgb(211,83,70)']}  style={rowData.status ?
                    styles.mainListItem : [styles.mainListItem]}>
                  <View>
                    <Image source={require('../../img/followed_android2x.png')} style={rowData.own ? styles.ownRoom : [styles.ownRoom , {height : 0}]}/>
                    <Text style={!rowData.status ?
                             [styles.circeFont , styles.roomWord , styles.chessTextColor] : [styles.circeFont , styles.roomWord ]} >Room</Text>
                    <View style={[styles.roomMainNumberHolder, {marginBottom : 5}]}>
                    <Text style={!rowData.status ?
                             [styles.roomMainNumber , styles.chessTextColor] : styles.roomMainNumber} >{rowData.name.split(' ')[1]}</Text>
                    </View>
                    <View style={[ {flexDirection : 'row', marginLeft : 10 }]}>
                      <Image style={{width : 15, height : 15}} source={rowData.status ? require('../../img/open_android2x.png') :  require('../../img/busy_android2x.png')}/>
                      <Text style={!rowData.status ?
                             [ styles.circeFont,styles.chessTextColor,styles.roomStatus] : [ styles.circeFont, styles.roomStatus] }>
                             {rowData.status ? 'Is open right now' : 'Is busy for now'}
                      </Text>
                    </View>
                 </View>

                  </LinearGradient>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={this.roomPress.bind(this,rowData)} style={{marginLeft : 10}}>
                  <View style={rowData.pressed ? styles.hoverBlock : {height : 0}} >
                    <TouchableWithoutFeedback onLongPress={this.singleRoom.bind(this,rowData)}>
                      <Image source={require('../../img/newLong/calendar.png')} style={rowData.pressed ? styles.hoverImage : {width : 0}}/>
                    </TouchableWithoutFeedback>
                    <TouchableOpacity  onPress={this.signForRoom.bind(this, rowData._id, rowData.own)} >
                      <Image source={rowData.own ? require('../../img/newLong/unfollow.png') : require('../../img/newLong/follow.png')}  style={rowData.pressed ? styles.hoverImage  : {width : 0}}/>
                    </TouchableOpacity>
                    <TouchableWithoutFeedback onPress={this.infoPage.bind(this,rowData)} >
                    <Image  source={require('../../img/newLong/info.png')} style={rowData.pressed ? styles.hoverImage : {width : 0}}/>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
                    <Text onPress={this.clearPressed.bind(this)}  style={this.state.pressedRoom._id != rowData._id && this.state.pressedAction ? styles.Blur : ''}>
                    </Text>
                </View>

            )
            }
          }
        />
        <View style={{position : 'absolute' , top : 0 , left : 0 }}>
        </View>
      </View>
    )
  }
}

export default RoomHolder