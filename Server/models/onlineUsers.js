'use strict';
const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;

const onlineUsersSchema = new Schema({
  user : {type : String, unique : true}
});

const onlineModel = mongoose.model(`onlineModel`, onlineUsersSchema);

module.exports = onlineModel;