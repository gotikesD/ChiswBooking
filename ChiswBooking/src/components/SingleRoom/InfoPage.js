import React from 'react'
import NavigationBar from 'react-native-navbar'
import styles from '../../styles'

import { View, Text , AsyncStorage, Image  } from 'react-native'

import NAV_TITLE from '../Navigation/Title'
import NAV_LEFT from '../Navigation/Left'

class InfoPage extends React.Component {

  render() {

    const ROOM = this.props.data;
    const IMAGE  = ROOM.name.split(' ')[1]

   return(
     <View>
       <View style={{height : 40}}>
         <NavigationBar
           title={<NAV_TITLE text="Info"/>}
           style={{'backgroundColor' : 'black',height : 40}}
           leftButton={
            <NAV_LEFT
              style={{ marginLeft: 4 }}
              navigator={this.props.navigator}/>}
         />
       </View>
       <Image source={{ uri: `http://192.168.2.193:3000/static/a${IMAGE}.png`}} style={styles.roomInfoImg}/>
       <View style={styles.infoHolder}>
         <View style={[styles.infoNameHold, styles.infoUnderline]}>
           <Text style={[styles.circeFont, {fontSize : 30}]}>{ROOM.name}</Text>
           <Image style={styles.infoNameStatus} source={ROOM.status ? require('../../img/open_android2x.png') :  require('../../img/busy_android2x.png')}/>
         </View>
         <View style={[{flexDirection : 'row', paddingTop : 10}, styles.infoUnderline]}>
           <Image style={[styles.infoNameStatus , {marginTop : 5, marginRight : 15}]} source={require('../../img/info-icons/location2x.png')}/>
           <Text style={styles.circeFont}>{ROOM.address}</Text>
         </View>
         <View style={[{flexDirection : 'row', paddingTop : 10}, styles.infoUnderline]}>
           <Image style={[styles.infoNameStatus , {marginTop : 5, marginRight : 15}]} source={require('../../img/info-icons/participants2x.png')}/>
           <Text style={styles.circeFont}>{ROOM.capacity}</Text>
         </View>
         <View style={[{flexDirection : 'row', paddingTop : 10}, styles.infoUnderline]}>
           <Image style={[styles.infoNameStatus , {marginTop : 5, marginRight : 15}]} source={ROOM.proector ? require('../../img/info-icons/true2x.png') : require('../../img/info-icons/false2x.png')}/>
           <Text style={styles.circeFont}>Proector</Text>
         </View>
         <View style={[{flexDirection : 'row', paddingTop : 15}, styles.infoUnderline]}>
           <Image style={[styles.infoNameStatus , {marginTop : 5, marginRight : 15}]} source={ROOM.whiteboard ? require('../../img/info-icons/true2x.png') : require('../../img/info-icons/false2x.png')}/>
           <Text style={styles.circeFont}>Whiteboard</Text>
         </View>
         <View style={[{flexDirection : 'row', paddingTop : 10}, styles.infoUnderline]}>
           <Image style={[styles.infoNameStatus , {marginTop : 5, marginRight : 15}]} source={ROOM.pc ? require('../../img/info-icons/true2x.png') : require('../../img/info-icons/false2x.png')}/>
           <Text style={styles.circeFont}>Pc/laptop</Text>
         </View>
       </View>

     </View>
   )
  }
}




export default InfoPage