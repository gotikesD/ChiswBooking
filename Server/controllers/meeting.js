const Meeting = require('../models/meeting');
const User = require('../models/user');
const jwt = require(`jsonwebtoken`);
const moment = require(`moment`);

const logger = require('../logs/config/');

module.exports = {

  addQuickMeeting: (req, res, next) => {

    const ROOM = req.params.roomId;
    const USER_ID = jwt.verify(req.headers[`x-access-token`], `silverSecret`)._doc._id;
    const QUICK_TITLE = 'QUICK TITLE';
    User.findOne({_id : USER_ID})
      .then((user) => {

        let email = user.email;
        let endMinutes = moment().minutes() + 10;

        let newMeeting = {};
        newMeeting.room = ROOM;
        newMeeting.start = moment().format();
        newMeeting.end = moment().minutes(endMinutes).format();
        newMeeting.client = USER_ID;
        newMeeting.title = QUICK_TITLE;
        newMeeting.email = email;
        newMeeting.clientName = `${user.firstName} ${user.secondName}`

        Meeting.find({room : ROOM})
          .then((meetings) => {
                let meeting = new Meeting(newMeeting);
                meeting.save()
                  .then((answer) => {
                    logger.info(`User ${email} add new meeting from ${newMeeting.start} to ${newMeeting.end}`);
                    res.json(answer)
                  })
          })
      })
      .catch((e) => {
        next(new Error(e.message))
      })


  },

  cancelQuickMeeting : (req,res,next) => {
    let currentTime = moment().format();
    const ROOM = req.params.roomId;
    const USER_ID = jwt.verify(req.headers[`x-access-token`], `silverSecret`)._doc._id;


    Meeting.findOne({room : ROOM ,client : USER_ID, start : { $lte : currentTime} , end : {$gte : currentTime}})
           .then((meeting) => {
             if(!meeting){
               next(new Error('Meeting already taken'))
             } else {
               meeting.remove()
                      .then(() => {
                        logger.info(`User with ID ${USER_ID} delete his current meeting from main screen`);
                        res.json({
                          status : 'success',
                          room : ROOM
                        })
                      })

             }
           })
           .catch((e) => {
            next(new Error(e.message))
           })

  },

  checkCurrentQuick: (req, res, next) => {

    const CURRENT_TIME = moment().format();
    const USER_ID = jwt.verify(req.headers[`x-access-token`], `silverSecret`)._doc._id;


    Meeting.find({client: USER_ID})
      .then((meetings) => {
        if (!meetings) {
          logger.warn(`There are no meetings to user ${USER_ID} to check a the time ${CURRENT_TIME}`);
          next();
        } else {
          if (meetings.length === 0) {
            logger.warn(`There are no meetings to user ${USER_ID} to check a the time ${CURRENT_TIME}`);
            next();
          } else {
            let capture;
            meetings.forEach((m) => {
              const RULE = CURRENT_TIME >= moment(m.start).format() && CURRENT_TIME <= moment(m.end).format();
              if(RULE) {
                capture = m;
              }
            });

            if(capture) {
              next(new Error(`You already take meeting at this time`))
            } else {
              logger.info(`User ${USER_ID} past quick-meeting check`);
              next()
            }
          }
        }
      })
      .catch((error) => {
        error.statusCode = 404;
        next(error)
      })
  } ,

  addMeeting : (req,res,next) => {

    const ROOM = req.params.roomId;
    const USER_ID = jwt.verify(req.headers[`x-access-token`], `silverSecret`)._doc._id;

    User.findOne({_id : USER_ID})
        .then((user) => {
          let email = user.email;
          let start = req.body.start;
          let end = req.body.end;
          let newMeeting = {};
          newMeeting.start = start;
          newMeeting.end = end;
          newMeeting.room = ROOM;
          newMeeting.client = USER_ID;
          newMeeting.email = email;
          newMeeting.clientName = `${user.firstName} ${user.secondName}`

          let meeting = new Meeting(newMeeting);

          Meeting.find({room : ROOM})
            .then((meetings) => {
                meeting.save()
                  .then((answer) => {
                    logger.info(`User with email ${email} add new meeting in room ${ROOM} from ${start} to ${end}`);
                    res.json(answer)
                  })
            })
        })
        .catch((e) => {
          next(new Error(e.message))
        });
  },

  cancelMeeting : (req,res,next) => {
    const ROOM = req.params.roomId;
    const USER_ID = jwt.verify(req.headers[`x-access-token`], `silverSecret`)._doc._id;
    let start = req.body.start;
    let end = req.body.end;

    Meeting.findOne({room : ROOM ,client : USER_ID, start : start , end : end })
      .then((meeting) => {
        if(!meeting){
          next(new Error('Meetings already taken by another user!Please, check calendar page'))
        } else {
          meeting.remove()
            .then(() => {
              logger.info(`Meeting with ID ${meeting._id} removed by owner ${meeting.email}`);
              res.json({
                status : 'success',
                room : ROOM
              })
            })
            .catch((e) => {
              next(new Error(e.message))
            })
        }

      })

  },

  checkCurrent: (req, res, next) => {

    let start = moment(req.body.start).format();
    let end = moment(req.body.end).format();
    const USER_ID = jwt.verify(req.headers[`x-access-token`], `silverSecret`)._doc._id;

    const ROOM = req.params.roomId;

    Meeting.find({_id : ROOM})
      .then((meetings) => {
        if (!meetings) {
          next();
        } else {
          if (meetings.length === 0) {
            next();
          } else {
            let cap;
            meetings.forEach((m) => {
              const MONTH_DAY_RULE = moment(m.start).date() == moment(start).date() && moment(start).month() == moment(m).month()
              const START_RULE = start >= m.start && start <=m.end;
              const END_RULE = end >= m.start && end <= m.end;
              const START_WITH_END_RULE = start >= m.start && end <=m.end;
              const EXTRA_RULE = start <= m.start && end >= m.end;

                if(MONTH_DAY_RULE) {
                  if (START_RULE || END_RULE || START_WITH_END_RULE || EXTRA_RULE) {
                    cap = m;
                  }
                }

            })

            if(cap) {
              next(new Error('This time is already busy!Please, check calendar page'))
            } else {
              logger.info(`User ${USER_ID} past meeting check`);
              next()
            }
          }
        }
      })
      .catch((error) => {
        error.statusCode = 404;
        next(error)
      })
  } ,


  getSingleRoomMeetings: (req, res, next) => {

    const queryId = req.params.roomId;
    const date = req.headers.date;
    Meeting.find({room: queryId})
      .then((meeting) => {
        if (!meeting ||meeting.length === 0) {
          res.json({message: 'There are no meetings'})
        } else {
          let perDay = [];
          meeting.forEach((m) => {
            let rule = moment(m.start).month() == moment(date).month() && moment(date).date() == moment(m.start).date()
            if(rule) {
              perDay.push(m)
            }
          });

          logger.info(`Request for all meetings of ${queryId}`);
          res.json(perDay)
        }
      })
      .catch((error) => {
        error.statusCode = 404;
        next(error)
      })
  } ,


};