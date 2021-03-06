const Room = require(`../models/room`);
const Meeting = require(`../models/meeting`);
const moment = require('moment');

const logger = require('../logs/config/');

module.exports = {

  getAll: (req, res, next) => {
    Room.find()
        .then((rooms) => {
          Meeting.find({})
          .then((meetings) => {
            let currentTime = moment().format();
              rooms.forEach((r)=> {
                meetings.forEach((m) => {
                  if(''+r._id === ''+m.room) {
                    const TIME_RULE = currentTime >= moment(m.start).format() && currentTime <= moment(m.end).format();
                    if(TIME_RULE) {
                      r.status = false
                    }
                  }
                })
              });

              logger.info(`Request for all rooms`);
              res.json(rooms);
          })
      })
      .catch((error) => {
        next(error)
      })
  },

  signForRoom: (roomId, userId, socket) => {

    //let roomId = req.params.roomId;
    //let userId = req.body.userId;

    Room.findOneAndUpdate({_id: roomId}, {$addToSet: {users: userId}}, {new: true})
      .then((newRoom) => {

        logger.info(`User ${userId} now follow room ${roomId}`);

        socket.emit('signForRoomSuccess', newRoom);
      })
      .catch((error) => {
        logger.error(error.message);
        socket.emit('error', error.message);
      })
  } ,


  unFollow: (roomId, userId, socket) => {

    //let roomId = req.params.roomId;
    //let userId = req.body.userId;

    Room.findOneAndUpdate({_id: roomId}, {$pull: {users: userId}}, {new: true})
      .then((newRoom) => {
        logger.info(`User ${userId} stop follow room ${roomId}`);
        socket.emit('unsignForRoomSuccess', newRoom);
      })
      .catch((error) => {
        logger.error(error.message);
        socket.emit('error', error.message);
      })
  }
};

