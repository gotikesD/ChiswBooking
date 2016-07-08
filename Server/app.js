"use strict";
const express = require(`express`);
const app = express();
const config = require(`./config`);
const mongoose = require(`mongoose`);
const bodyParser = require(`body-parser`);

const room = require(`./routes/rooms`);
const auth = require(`./routes/auth`);
const meeting = require(`./routes/meeting`);
const admin = require(`./routes/admin`);

const logger = require('./logs/config/');
const co = require('co')

const CHECK_ONLINE_USER = require('./sockets/')



var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(config.port);

io.on('connection', function (socket) {
    socket.on('login', function(email)  {
      logger.warn(`Now user ${email} is online!`)
      co(function *() {
        let check = yield CHECK_ONLINE_USER(email)

        if(check.alreadyLogin) {
          socket.emit('alreadyLogin', email)
        } else {
          socket.emit('alreadyLogin', 'sadasdasdasd')
        }
      })

    });
    socket.on('logout', function (email) {
      logger.warn(`Now user ${email} is offline!`)
    });
    socket.on('error', function(e) { console.log(e)})
});

mongoose.connect(config.localDbForTesting);

mongoose.connection.on(`error`, (error) => {
  logger.fatal(error.message);
  process.exit()
});

mongoose.connection.on('connected', function () {
  logger.info(`Connected to ${config.localDbForTesting}`);
});

mongoose.connection.on('disconnected', function () {
  logger.info(`Disconnected from ${config.localDbForTesting}`);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));



//Cross domain requests
app.use((req, res, next) => {
  res.header(`Access-Control-Allow-Methods`, `POST,PUT,DELETE`);
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, x-access-token , Content-Type, Accept`);
  next();
});


app.use('/static', express.static(__dirname + '/public'));
app.use(`/rooms`, room);
app.use(`/auth`, auth);
app.use(`/meetings`, meeting);
app.use(`/admin`, admin);

if (app.get(`env`) === `development`) {
  app.use((error, req, res, next) => {
    res.status(Number(error.statusCode) || 500 ).send({
      message : error.message,
      status : error.status
    });
    logger.error(`${error.message}`);
  });
}




app.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    message : error.message,
    status : error.status
  });
  logger.error(`${error.message}`);
});

logger.info(`App runs on  ${config.port}`);


