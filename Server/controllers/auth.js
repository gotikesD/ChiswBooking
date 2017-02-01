const User = require(`../models/user`);
const jwt = require(`jsonwebtoken`);
const sha256 = require('sha256');

const logger = require('../logs/config/');

module.exports = {

  sign : (req, res, next) => {

    const newUser = Object.assign({}, req.body);
    newUser.password = sha256(req.body.password);
    newUser.status = true;
    User.findOne({email : newUser.email})
        .then((searchedUser) => {
          if(!searchedUser) {
            const error = new Error(`User with mail ${newUser.email}`);
            error.statusCode = 404;
            next(error)
          } else if(searchedUser.password) {
            const error = new Error(`User with email ${searchedUser.email} already signed up!`);
            next(error)
          } else {
            User.findOneAndUpdate({email : newUser.email }, newUser , {new : true})
                .then((signedUser) => {
                  const token = jwt.sign(signedUser, `silverSecret`);
                  logger.info(`${newUser.email} signed up`);
                  res.json(token)

                })
          }
        })
        .catch(err => next(err))
  },

  login : (req,res,next) => {
    const email = req.body.email.toString();
    const password = req.body.password.toString();
    console.log(email, password);
    User.findOne({email : email})
        .then((user) => {
          console.log('user: ', user);
          if (!user) {
            const error = new Error(`User with current email not Found or bad password`);
            error.statusCode = 404;
            next(error)
          } else {
            if ( req.body.password === user.password) {
              const token = jwt.sign(user, `silverSecret`);
              logger.info(`User with ${email} login`);
              res.json(token)
            } else {
              const error = new Error(`User with current email not Found or bad password`);
              error.statusCode = 404;
              next(error)
            }

          }
        })
        .catch((error) => {
          error.statusCode = 404;
          next(error)
        });
  }
};