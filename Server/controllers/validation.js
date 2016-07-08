const Joi = require(`joi`);

module.exports = {

  login : (req, res, next) => {
    const productJoi = {
      email : Joi.string().required().email(),
      password : Joi.string().required().min(6).max(20)
    };

    Joi.validate({
      email : req.body.email,
      password : req.body.password
    }, productJoi, (error, userInfo) => {
      error ? next(error) : next();
    })
  } ,

  sign : (req, res, next) => {
    const productJoi = {
      email : Joi.string().required().email(),
      password : Joi.string().required().min(6).max(20)
    };

    Joi.validate({
      email : req.body.email,
      password : req.body.password
    }, productJoi, (error, userInfo) => {
      error ? next(error) : next();
    })
  } ,

  checkEmail : (req, res, next) => {
    const productJoi = {
      email : Joi.string().required().email()
    };

    Joi.validate({
      email : req.body.email
    }, productJoi, (error, userInfo) => {
      error ? next(error) : next();
    })
  }

};