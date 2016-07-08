const Meeting = require(`../models/meeting`);
const User = require(`../models/user`);
const jwt = require(`jsonwebtoken`);

const logger = require('../logs/config/');



module.exports = {

  checkUserStatus: (req, res, next) => {

    if (!req.headers[`x-access-token`]) {
      const error = new Error(`Token not found`);
      error.statusCode = 404;
      next(error);
    } else {
      const token = jwt.verify(req.headers[`x-access-token`], `silverSecret`, (error, decoded) => {
        if (error) {
          const error = new Error(`Invalid token specified`);
          error.statusCode = 404;
          next(error);
        } else {
          const EMAIL = decoded._doc.email;
          const PASSWORD = decoded._doc.password;
          const _ID = decoded._doc._id;

          if (!EMAIL || !PASSWORD || !_ID) {
            const error = new Error(`Invalid token specified`);
            error.statusCode = 404;
            next(error);
          } else {
            logger.info(`User with the ${EMAIL} past token check`)
            next()
          }
        }
      });
    }
  },

  checkOwn: (req, res, next) => {

    const meetingId = req.params.meetingId;

    if (!meetingId) {
      const error = new Error(`Meeting Id required`);
      error.statusCode = 404;
      next(error);
    } else {
      Meeting.findOne({_id: meetingId})
        .then((meeting) => {
          const token = jwt.verify(req.headers[`x-access-token`], `silverSecret`, (error, decoded) => {
            if (error) {
              const error = new Error(`Invalid token specified`);
              error.statusCode = 404;
              next(error);
            } else {
              if (meeting.client == decoded._doc._id) {
                logger.info(`User with the ${decoded._doc._id} past own meeting check. Access to meeting ${meeting._id} is open`);
                next()
              } else {

                const error = new Error(`Permission denied`);
                error.statusCode = 403;
                next(error);
              }
            }
          })
        })
    }
  },

  adminCheck: (req, res, next) => {
    const token = jwt.verify(req.headers[`x-access-token`], `silverSecret`, (error, decoded) => {
      if (decoded._doc.rules == 'Admin') {
        logger.debug(`Admin here. Hello ${decoded._doc.firstName} ${decoded._doc.secondName}`);
        next()
      } else {
        const error = new Error(`Permission denied`);
        error.statusCode = 403;
        next(error);
      }
    })
  },

  checkUserEmail: (req, res, next) => {
    let email = req.body.email;
    User.findOne({email: email})
      .then((user) => {
        if(!user) {
          next(new Error('Current Email Not Found.Contact with Admin'))
        } else if(user.password) {
          next(new Error('Current User already registered'))
        } else {
          logger.debug(`User with email ${email} past emailAvailability check`);
          res.json(user)
        }
      
      })
      .catch((err) => {
        next(err);
      })
  } ,

};