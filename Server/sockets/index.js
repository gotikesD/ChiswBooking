const onlineUsers = require('../models/onlineUsers');
const config = require('../config/');

module.exports =  function (email) {
    return new Promise((resolve,reject) => {
      onlineUsers.findOne({user : email})
        .then((user) => {
          if(user) {
            resolve({ message : `User with Email ${email} already connected` , alreadyLogin : true})
          } else {
            let newUser  =  {}
            newUser.user = email
            let onlineUser  = new onlineUsers(newUser)

            onlineUser.save()
              .then(() => {
                resolve({ message : `User with Email ${email} now connected` , alreadyLogin : false})
              })

          }
        })
        .catch(e => reject(e.message))
    })

}