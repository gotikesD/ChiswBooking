import { StyleSheet } from 'react-native'

import	Dimensions	from	'Dimensions';

let	{width , height }	=	Dimensions.get('window');

var styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop : 80,
    marginLeft : 35,
    marginRight : 35
  },
  container : {
    flex : 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoHolder : {
    marginBottom : 55,
    flex : 1,
    alignItems: 'center',
    backgroundColor : 'rgb(252,252,252)'
  },
  loadingSpinner : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circeFont : {
    fontFamily : 'Circe-Light',
    fontSize : 24,
    color : 'rgb(133,128,142)'
  },
  inputHolder : {

    borderWidth : 1,
    borderColor : 'rgb(41,39,39)',
    marginBottom : 20,
    paddingLeft : 10,
    paddingRight : 10
  },
  buttonText : {
    color : 'rgb(252,252,252)',
    fontFamily : 'Circe-Light',
    fontSize : 24
  },
  buttons : {
    flex: 1,
    alignItems: 'center',
    backgroundColor : 'rgb(41,39,39)',
    paddingTop: 5,
    paddingBottom : 5,
    marginBottom : 50
  },
  listView : {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingTop: 10
  },
  mainListItem : {
    marginBottom : 10 ,
    width : width/2 - 20,
    height : height/4 - 25,
    marginLeft : 10,
    marginRight : 10,
    borderWidth : 1,
    borderColor : 'rgb(41,39,39)',
  },
  chessBackground : {
  },
  chessTextColor : {
    color : 'rgb(252,252,252)'
  },
  roomMainNumber : {
    fontSize : 40,
    fontFamily : 'arial',
  },
  roomMainNumberHolder : {
    justifyContent: 'center',
    alignItems : 'center'
  },
  roomStatus : {
    fontSize : 14, position : 'absolute',left : 24 , bottom : -2
  },
  roomWord : {marginLeft : 10} ,
  hoverBlock : {
    flexDirection : 'row',
    width : width/2 - 20,
    height : height/4 - 25,
    position: 'absolute',
    top: 0,
    left : 10,
    backgroundColor : 'rgba(255,255,255,0.7)',
    alignItems : 'center',

    flex : 1,
  },
  ownRoom : {position : 'absolute', right : 10 , top : 10, width : 15, height : 15},
  containerCalendar : {
    flex : 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomInfoImg : {
    height : height/3 ,
    marginBottom : 15
  },
  infoHolder : {
    marginLeft : 15,
    marginRight : 15
  },
  infoNameHold : {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection : 'row'
  },
  infoNameStatus : {
    marginLeft : 10,
    marginBottom : 15
  },
  infoUnderline : {
    paddingBottom : 15,
    borderBottomWidth : 1,
    borderBottomColor :  'rgba(41,39,39, 0.1)'
  },
  navBar : {
    backgroundColor : 'black'
  },
  scrollView : {
    paddingTop : 10,
    backgroundColor : 'rgba(222,222,222,0.6)',
    height : height-80
  },
  Blur  : {position : 'absolute', backgroundColor : 'rgba(255,255,255,0.9)', top : 0, bottom : 0 ,left : 0, right : 0},

  Meeting : { borderWidth : 1, borderColor : 'black', backgroundColor : '#e77718'},
  MeetingInner : { flexDirection : 'row',paddingTop : 5, paddingBottom : 5}

  })

module.exports = styles;