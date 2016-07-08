'use strict';
const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

const meetingSchema = new Schema({

  start : {
    type : String
  },
  end : {
    type : String
  },
  client : {
    type : Schema.Types.ObjectId,
    required : true
  },
  email : {
    type : String
  },
  room : {
    type : Schema.Types.ObjectId,
    required : true
  },
  clientName : {
    type : String ,
    validate : {
      validator : function (name) {
        return name.length > 10 && name.length < 100
      },
      message : `Invalid name`
    },
  }
});


const meetingModel = mongoose.model(`meetingModel`, meetingSchema);

module.exports = meetingModel;