'use strict';
const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

const userSchema = new Schema({

  firstName : {
    type : String,
    validate : {
      validator : function (v) {
        return v.length > 3 && v.length < 10;},
      message : `Invalid first name`
    }
  },
  secondName : {
    type : String,
    validate : {
      validator : function (v) {
        return v.length > 3 && v.length < 20;
      },
      message : `Invalid second name`
    }
  },
  password : {
    type : String
  },
  email : {

    type : String,
    required : true,
    unique : true
  }
});


const userModel = mongoose.model(`userModel`, userSchema);

module.exports = userModel;