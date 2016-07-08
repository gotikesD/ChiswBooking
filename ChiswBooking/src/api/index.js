import { AsyncStorage } from 'react-native'
const API_HEADERS = {
  'Accept' : `application/json`,
  'Content-Type' : `application/json`
};


module.exports = {

  login(email, password , callback) {
    const requestBody = {
      email : email,
      password : password
    };
    fetch(`http://192.168.2.193:3000/auth/login`, {
      method : `post`,
      headers : API_HEADERS,
      body : JSON.stringify(requestBody)
    })
      .then((response) => {
        return response.json()
      })
      .then((responseData) => {
        callback(responseData)
      })
      .catch((error) => {
        throw error;
      });
  },

  check(email , callback) {
    const requestBody = {
      email : email
    };
    fetch(`http://192.168.2.193:3000/auth/check`, {
      method : `post`,
      headers : API_HEADERS,
      body : JSON.stringify(requestBody)
    })
      .then((response) => {
        return response.json()
      })
      .then((responseData) => {
        callback(responseData)
      })
      .catch((error) => {
        throw error;
      });
  },


  sign(user, callback) {
    const requestBody = user;

    fetch(`http://192.168.2.193:3000/auth/sign`, {
      method : `post`,
      headers : API_HEADERS,
      body : JSON.stringify(requestBody)
    })
      .then((response) => {
        return response.json()
      })
      .then((responseData) => {
        callback(responseData)
      })
      .catch((error) => {
        throw error;
      });
  },


  allRooms(callback) {
    fetch(`http://192.168.2.193:3000/rooms/`)
      .then((response) => {
        return response.json()
      })
      .then((responseData) => {
        callback(responseData)
      })
      .catch((error) => {
        throw error;
      });
  },

  allMeetings(token, callback) {

    let headers = {
      'x-access-token' : token
    }

    fetch(`http://192.168.2.193:3000/meetings`, {
      headers : headers
    })
      .then((response) => {
        return response.json()
      })
      .then((responseData) => {
        callback(responseData)
      })
      .catch((error) => {
        throw error;
      });
  },

  singleRoomMeetings(roomId, token,date, callback) {


    let headers = {
      'x-access-token' : token,
      'date' : date
    }

    fetch(`http://192.168.2.193:3000/meetings/single/${roomId}`, {
      headers : headers
    })
      .then((response) => {
        return response.json()
      })
      .then((responseData) => {
        callback(responseData)
      })
      .catch((error) => {
        throw error;
      });
  },

  signForRoom(roomId, userId, callback) {

    let requestBody = {
      userId : userId
    };

    fetch(`http://192.168.2.193:3000/rooms/${roomId}`, {
      method : `post`,
      headers : API_HEADERS,
      body : JSON.stringify(requestBody)
    })
      .then((response) => {
        return response.json()
      })
      .then((responseData) => {
        callback(responseData)
      })
      .catch((error) => {
        throw error;
      });
  },

  unFollow(roomId, userId, callback) {

    let requestBody = {
      userId : userId
    };

    fetch(`http://192.168.2.193:3000/rooms/${roomId}`, {
      method : `delete`,
      headers : API_HEADERS,
      body : JSON.stringify(requestBody)
    })
      .then((response) => {
        return response.json()
      })
      .then((responseData) => {
        callback(responseData)
      })
      .catch((error) => {
        throw error;
      });
  },

  addQuickMeeting(roomId, token , callback) {

    API_HEADERS['x-access-token'] = token;

    fetch(`http://192.168.2.193:3000/meetings/quick/${roomId}`, {
      method : `post`,
      headers : API_HEADERS
    })
      .then((response) => {
        return response.json()
      })
      .then((responseData) => {
        callback(responseData)
      })
      .catch((error) => {
        throw error;
      });
  },

  cancelQuickMeeting(roomId, token , callback) {

    API_HEADERS['x-access-token'] = token;

    fetch(`http://192.168.2.193:3000/meetings/quickCancel/${roomId}`, {
      method : `delete`,
      headers : API_HEADERS
    })
      .then((response) => {
        return response.json()
      })
      .then((responseData) => {
        callback(responseData)
      })
      .catch((error) => {
        throw error;
      });
  },

  cancelMeeting(roomId, token, start,end ,callback) {

    API_HEADERS['x-access-token'] = token;

    let requestBody = {
      start : start,
      end : end
    };


    fetch(`http://192.168.2.193:3000/meetings/cancel/${roomId}`, {
      method : `delete`,
      headers : API_HEADERS,
      body : JSON.stringify(requestBody)
    })
      .then((response) => {
        return response.json()
      })
      .then((responseData) => {
        callback(responseData)
      })
      .catch((error) => {
        throw error;
      });
  },

  addMeeting(start,end, roomId, token , callback) {

    API_HEADERS['x-access-token'] = token;
    let requestBody = {
      start : start,
      end : end
    };

    fetch(`http://192.168.2.193:3000/meetings/regular/${roomId}`, {
      method : `post`,
      headers : API_HEADERS,
      body : JSON.stringify(requestBody)
    })
      .then((response) => {
        return response

      })
      .then((responseData) => {
        callback(responseData)
      })
      .catch((error) => {
        alert(error.message);
      });
  },

  restorePassword( user ,callback) {

    let requestBody = user

    fetch(`http://192.168.2.193:3000/auth/restore`, {
      method : `post`,
      headers : API_HEADERS,
      body : JSON.stringify(requestBody)
    })
      .then((response) => {
        return response.json()
      })
      .then((responseData) => {
        callback(responseData)
      })
      .catch((error) => {
        throw error;
      });
  },



};