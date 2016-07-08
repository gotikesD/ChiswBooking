const Room = require('../models/room');
const User = require('../models/user');
const jwt = require(`jsonwebtoken`);

module.exports = {

  addRoom : (req, res, next) => {

    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    res.setHeader(`withCredentials`, true);

    const fields = req.body;

    const room = new Room(fields);

    room.save()
      .then((newRoom) => {
        res.json(newRoom)
      })
      .catch((error) => {
        console.log(error)
        error.statusCode = 404;
        next(error)
      });
  },

  updateRoom : (req, res, next) => {
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    res.setHeader(`withCredentials`, true);
    const id = req.params.id;
    const fields = req.body;

    Room.findOneAndUpdate({_id : id}, fields, {new : true})
        .then((updatedRoom) => {
            res.json(updatedRoom)
        })
        .catch((error) => {
          error.statusCode = 404;
          next(error)
        });
  },

  deleteRoom : (req, res, next) => {
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    res.setHeader(`withCredentials`, true);
    const id = req.params.id;

    Room.findOneAndRemove({_id : id})
      .then((deletedRoom) => {
        res.json(deletedRoom)
      })
      .catch((error) => {
        error.statusCode = 404;
        next(error)
      });
  },

  getAllUsers : (req,res,next) => {

    const token = jwt.verify(req.headers[`x-access-token`], `silverSecret`, (error, decoded) => {
      const id = decoded._doc._id;
      console.log(id)
      User.find({ _id : { $ne : id }})
        .then((users) => {
          res.json(users)
        })
        .catch((error) => {
          error.statusCode = 404;
          next(error)
        });
    });

  },

  getSingleUser : (req,res,next) => {

      const userId = req.params.id;

    User.findOne({_id : userId})
        .then((user) => {
          res.json(user)
        })
        .catch((error) => {
          error.statusCode = 404;
          next(error)
        });
  },

  deleteUser : (req,res,next) => {

    const userId = req.params.id;

    User.findOneAndRemove({_id : userId})
      .then((user) => {
        res.json(user)
      })
      .catch((error) => {
        error.statusCode = 404;
        next(error)
      });
  },

};