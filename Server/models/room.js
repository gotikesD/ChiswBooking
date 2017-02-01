'use strict';
const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

const eventEmitter = require(`../events`);

const roomSchema = new Schema({

  name : {
    type : String,
    validate : {
      validator : function (room) {
        const roomNameReg = /Room [0-9]{1,3}/;
        return roomNameReg.test(room);
      },
      message : `Invalid Meeting Room`
    },
    required : true
  },
  capacity : {
    type : Number,
    min : 2,
    max : 20,
    required : true
  },
  users : [{
    type: String,
  }],
  status : {
    type : Boolean,
    default : true
  },
  bookingStatus: {
    type: String,
    enum: [`free`, `booked`],
    default: `free`
  },
  address : {
    type : String,
    validate : {
      validator : function (adr) {
        return adr.length > 10 && adr.length < 100
      },
      message : `Invalid adress`
    },
    required : true
  },
  proector : {
    type : Boolean,
    default : false
  },
  whiteboard : {
    type : Boolean,
    default : false
  },
  pc : {
    type : Boolean,
    default : false
  },

}, { timestamps: true } );

roomSchema.post('findOneAndUpdate', function(response) {
  console.log('room update event fired');
  eventEmitter.emit('roomUpdate', response);
});

const roomModel = mongoose.model(`room`, roomSchema);

module.exports = roomModel;