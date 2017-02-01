import React from 'react'
import { View, Text , TextInput , ListView,TouchableOpacity, TouchableHighlight , AsyncStorage ,DatePickerAndroid ,Image, TimePickerAndroid, ScrollView } from 'react-native'
import Api from '../../api'
import moment from 'moment'
import jwtDecode from  'jwt-decode'
import styles from '../../styles/'
import config from '../../config/'

import NavigationBar from 'react-native-navbar'
import Swiper from 'react-native-swiper'

import NAV_TITLE from '../Navigation/Title'
import NAV_LEFT from '../Navigation/Left'
import NAV_RIGHT from '../Navigation/Right'
import _ from 'lodash'

import Modal from 'react-native-simple-modal';

class SingleRoom extends React.Component {

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.state = {
      currentRoom: this.props.data,
      meetings: [],
      selectedDate: moment().format(),
      endTime: {},
      startTime: {},
      test : [],
      availableDays : [],
      userId : '',
      userName : '',
      open : false
    }
  }

  async getToken(callback) {
    let token = await AsyncStorage.getItem('token');
    let id = jwtDecode(token)._doc._id;
    let userName = jwtDecode(token)._doc.firstName + ' ' + jwtDecode(token)._doc.secondName;
    this.setState({userId : id, userName : userName});
    callback(token);
  }

  async timePickerAndroidStart(start) {

    try {
      const startTime = await TimePickerAndroid.open({
        hour: start,
        minute: 0
      });
      if (startTime.action !== TimePickerAndroid.dismissedAction) {
        let time = {}
        time.hour = start;
        time.minute = moment().minute()
        this.setState({startTime: startTime});
        this.timePickerAndroidEnd(time)
      }
    } catch (err) {
      console.warn('Cannot open time picker', err.message);
    }
  }

  async timePickerAndroidEnd(time) {
    try {
      let start = this.state.startTime

      const endTime = await TimePickerAndroid.open({
        hour: time.minute >= 50 ? + time.hour + 1 : time.hour,
        minute: 0,
        is24Hour: true,
      });
      if (endTime.action !== TimePickerAndroid.dismissedAction) {
        this.setState({endTime: endTime});
        this.viewCollectedDate()
      }
    } catch (err) {
      console.warn('Cannot open time picker', err.message);
    }
  }


  viewCollectedDate() {

    const date = this.state.selectedDate;
    const endTime = this.state.endTime;
    const startTime = this.state.startTime;
    const month = moment(this.state.selectedDate).month()
    const day = moment(this.state.selectedDate).date()
    const starMinuteFormat = startTime.minute < 10 ? '0' + startTime.minute : startTime.minute;
    const endMinuteFormat = endTime.minute < 10 ? '0' + endTime.minute : endTime.minute;
    const startTimeFormat = startTime.hour + '.' + starMinuteFormat;
    const endTimeFormat = endTime.hour + '.' + endMinuteFormat;
    const minReserverTime = Number(endTimeFormat - startTimeFormat).toFixed(2)

    if (!date || !endTime.hour || !startTime.hour) {
      alert('Please,select Date, startTime,endTime')
    } else if (moment().month(month).date(day).hour(startTime.hour).minute(startTime.minute).format() < moment().format()) {
      alert('You cant meet in the past')
    } else if (+startTimeFormat > +endTimeFormat) {
      alert('Your start time less then end time')
    } else if (minReserverTime < 0.1 || startTimeFormat === endTimeFormat ) {
      alert('Min book time - 10 minutes')
    } else if (endTime.hour - startTime.hour > 4) {
      alert('Max meeting time is - 3 hours.')
    } else {
      this.getToken((token) => {
        let selectedYEAR = moment(date).year();
        let selectedMonth = moment(date).month();
        let selectedDAY = moment(date).date();

        let roomId = this.state.currentRoom._id;
        let start = moment().year(selectedYEAR).month(selectedMonth).date(selectedDAY).hour(startTime.hour).minute(startTime.minute).format();
        let end = moment().year(selectedYEAR).month(selectedMonth).date(selectedDAY).hour(endTime.hour).minute(endTime.minute).format();
        Api.addMeeting(start, end, roomId, token, (answer) => {

          if (answer.status == 500 || answer.status == 404) {
            alert('At this time you select another room!')
          } else {
            const CURRENT_TIME = moment().format();
            const RULE = CURRENT_TIME >= moment(answer.start).format() && CURRENT_TIME <= moment(answer.end).format();
            if (RULE) {
              let roomId = this.props.data._id;
              let updatedRoom = this.state.currentRoom;
              updatedRoom.status = false;
              this.setState({currentRoom: updatedRoom});
              this.updateMeetingList(roomId);
              alert('You added meeting')
            } else {
              alert('You added meeting')
            }
          }
        })
      })
    }
  }

  componentWillMount() {
    this.createDates()
    let roomId = this.props.data._id;
    this.updateMeetingList(roomId);
  }

  createDates() {
    const DAYS_LIMIT = config.DAYS_LIMIT;
    let days = []
    let count = 0;
    while(count < DAYS_LIMIT) {
      let day = moment().date()
      let date = moment().date(day + count).format()
      days.push(date)
      count++
    }
    this.setState({availableDays : days})
  }



  updateMeetingList(room) {

    const date = this.state.selectedDate;
    let THUMBS = _.cloneDeep(config.timeLine)

    this.getToken((token) => {
      Api.singleRoomMeetings(room, token, date, (answer) => {

        let MEET = answer;

        let MEETINGS = THUMBS.map((t) => {
          let copyTimeLine = _.cloneDeep(t)
          let month = moment(this.state.selectedDate).month();
          let date = moment(this.state.selectedDate).date();
          let time = moment().month(month).date(date).hour(copyTimeLine.start).minute(0).format();
          let timeEnd = moment().month(month).date(date).hour(copyTimeLine.end).minute(0).format();
          if(MEET.length > 0) {
            MEET.forEach((m) => {
              if (moment(m.start).format() >= time && moment(m.start).format() <= timeEnd) {
                copyTimeLine.meetings.push(m)
                return copyTimeLine
              }
            })
          }
          return copyTimeLine
        })
        this.setState({meetings : MEETINGS})
      })
    })
  }

   updateRequest(e, state, context) {
    let index  = state.index;
    let day = this.state.availableDays[index];
    let room = this.props.data._id;
    this.setState({selectedDate: day});
    this.updateMeetingList(room)
  }

   cancelAttempt(roomId, id, start, end) {
    this.getToken((token) => {
      let userId = jwtDecode(token)._doc._id;
      if (userId === id) {
        Api.cancelMeeting(roomId, token, start, end, (answer) => {
          if (answer) {
            this.updateMeetingList(roomId)
                alert('You delete meeting')
          }
        })
      }
    })
  }

  back() {
    this.props.navigator.push({
      name: 'Main',
    })
  }

  next() {
    let room = this.props.data
    this.props.navigator.push({
      name: 'RoomInfo',
      passProps: {
        data: room
      }
    })
  }



  render() {

    let _scrollView:ScrollView;
    let meetings = this.state.meetings;
    let userId = this.state.userId;
    let userName = this.state.userName;
    let currentTime = moment().format()

    let count = 0;
    var createThumbRow = (rowData) =>
      <View key={count++} style={{flexDirection : 'row'}}>
        <Text
          style={[styles.circeFont,{flex : 1, fontSize : 10, textAlign : 'right', marginRight : 2 ,  marginBottom : 15, marginTop: 15}]} >{Number(rowData.start).toFixed(2)}</Text>
        <Text style={{position : 'absolute', left : 0, top : 0, height : 999, width : 999}} onPress={this.timePickerAndroidStart.bind(this,rowData.start)}></Text>
        <View style={{ flex : 8,  borderWidth: 1, borderStyle : 'dotted', padding: 1 , borderColor : 'rgba(0,0,0,0.4)', marginTop: 2, marginBottom : 2}}>
          <View>
            <Text style={{position : 'absolute', left : 0, top : 0, height : 999, width : 999}} onPress={this.timePickerAndroidStart.bind(this,rowData.start)}></Text>
            <ListView
              enableEmptySections
              dataSource={
              this.ds.cloneWithRows(rowData.meetings)

                  }
              renderRow={(rowInnerData) => {
            return (
              <View>
                <View style={currentTime > rowInnerData.start && currentTime < rowInnerData.end ? styles.Meeting : [styles.Meeting, {backgroundColor : '#feae62'}]}>
                 <View style={styles.MeetingInner}>
                    <Text style={{marginLeft : 5 ,paddingRight : 10}}>{rowInnerData.clientName === userName ? 'You' : rowInnerData.clientName }</Text>
                    <Text style={{paddingRight : 10}}>{'START - '+moment(rowInnerData.start).format('HH mm')}</Text>
                    <Text>{'END - '+moment(rowInnerData.end).format('HH mm')}</Text>
                </View>
                </View>
                <TouchableHighlight style={ userId === rowInnerData.client ? {position : 'absolute' , top : 5 ,right : 5 , borderRadius : 10} : {left : -999}} onPress={this.cancelAttempt.bind(this,rowInnerData.room,rowInnerData.client, rowInnerData.start, rowInnerData.end)}>
                    <Image source={ require('../../img/close-button.png')}  style={ userId === rowInnerData.client ? {width : 15, height : 15} : { height : 0 }} />
                </TouchableHighlight>
              </View>
            )
            }
          }
            />
          </View>
        </View>

      </View>


    let meetingsScroll =
      <View style={styles.scrollView}>
        <ScrollView
          ref={(scrollView) => { _scrollView = scrollView; }}
          automaticallyAdjustContentInsets={false}
          onScroll={() => { console.log('onScroll!'); }}
          scrollEventThrottle={200}>
          {meetings.length > 0 ? meetings.map(createThumbRow) : null}
        </ScrollView>
      </View>


    return (
      <View>


        <View style={{height : 40}}>
          <NavigationBar
            title={<NAV_TITLE text="Calendar"/>}
            style={{'backgroundColor' : 'black',height : 40}}
            leftButton={
<NAV_LEFT
  navigator={this.props.navigator}/>}
          />
        </View>

        <View style={{height : 40, backgroundColor : 'rgba(0,0,0,0.2)'}}>
          <Swiper onMomentumScrollEnd ={this.updateRequest.bind(this)}>
            {this.state.availableDays.map((item, key) => {
              return (
                <View key={key} >
                  <Text style={[styles.circeFont,{top: 5, fontSize : 15, textAlign : 'center', color : 'black'}]}>{moment(item).format('MMMM Do YYYY')}</Text>
                </View>
              )
            })}
          </Swiper>
        </View>
        {meetingsScroll}
      </View>
    )
  }
}



export default SingleRoom


